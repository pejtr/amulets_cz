/**
 * Admin Weekly Email Digest
 * 
 * Sends a comprehensive weekly report to the admin every Monday at 7:00 AM CET.
 * Includes:
 * - Top performing articles (views, engagement, completion rate)
 * - A/B test results summary (headline + meta description + widget)
 * - Reading behavior insights (avg read time, scroll depth, referrer sources)
 * - AI-generated content strategy recommendations
 * - Chatbot performance summary
 */

import { sendBrevoEmail } from "./brevo";
import { getDb } from "./db";
import { 
  articleViews, articleRatings, articleComments,
  articleHeadlineTests, articleMetaDescTests,
  readingHistory, chatbotSessions, chatbotConversions,
  widgetAbTests, widgetAbVariants
} from "../drizzle/schema";
import { sql, gte, desc, eq, and, count } from "drizzle-orm";
import { sendTelegramMessage } from "./telegram";
import { invokeLLM } from "./_core/llm";

// ============================================
// DATA COLLECTION
// ============================================

interface WeeklyStats {
  // Reading stats
  totalPageViews: number;
  uniqueReaders: number;
  avgReadTimeSeconds: number;
  avgScrollDepth: number;
  completionRate: number;
  // Top articles
  topArticles: Array<{
    slug: string;
    type: string;
    views: number;
    avgReadTime: number;
    avgScrollDepth: number;
    avgRating: number;
    commentCount: number;
  }>;
  // A/B test results
  headlineTests: {
    active: number;
    evaluated: number;
    significantResults: Array<{
      articleSlug: string;
      winner: string;
      ctr: number;
      confidence: number;
    }>;
  };
  metaDescTests: {
    active: number;
    evaluated: number;
    significantResults: Array<{
      articleSlug: string;
      winner: string;
      ctr: number;
      confidence: number;
    }>;
  };
  widgetTests: {
    active: number;
    results: Array<{
      widgetName: string;
      variants: Array<{ name: string; ctr: number; impressions: number }>;
    }>;
  };
  // Chatbot stats
  chatbot: {
    totalSessions: number;
    totalConversions: number;
    conversionRate: number;
    avgDuration: number;
  };
  // Behavior insights
  referrerBreakdown: Array<{ source: string; count: number; percentage: number }>;
  peakHours: Array<{ hour: number; count: number }>;
  // New vs returning
  newReaders: number;
  returningReaders: number;
}

async function collectWeeklyStats(): Promise<WeeklyStats> {
  const db = await getDb();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const defaultStats: WeeklyStats = {
    totalPageViews: 0, uniqueReaders: 0, avgReadTimeSeconds: 0,
    avgScrollDepth: 0, completionRate: 0, topArticles: [],
    headlineTests: { active: 0, evaluated: 0, significantResults: [] },
    metaDescTests: { active: 0, evaluated: 0, significantResults: [] },
    widgetTests: { active: 0, results: [] },
    chatbot: { totalSessions: 0, totalConversions: 0, conversionRate: 0, avgDuration: 0 },
    referrerBreakdown: [], peakHours: [],
    newReaders: 0, returningReaders: 0,
  };

  if (!db) return defaultStats;

  try {
    // === READING STATS ===
    const [pageViewStats] = await db.select({
      total: sql<number>`COUNT(*)`,
      unique: sql<number>`COUNT(DISTINCT ${articleViews.visitorId})`,
      avgReadTime: sql<number>`AVG(${articleViews.readTimeSeconds})`,
      avgScroll: sql<number>`AVG(${articleViews.scrollDepthPercent})`,
    }).from(articleViews).where(gte(articleViews.createdAt, oneWeekAgo));

    // === TOP ARTICLES ===
    const topArticlesRaw = await db.select({
      slug: articleViews.articleSlug,
      type: articleViews.articleType,
      views: sql<number>`COUNT(*)`,
      avgReadTime: sql<number>`AVG(${articleViews.readTimeSeconds})`,
      avgScroll: sql<number>`AVG(${articleViews.scrollDepthPercent})`,
    })
      .from(articleViews)
      .where(gte(articleViews.createdAt, oneWeekAgo))
      .groupBy(articleViews.articleSlug, articleViews.articleType)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(10);

    // Get ratings for top articles
    const ratingStats = await db.select({
      slug: articleRatings.articleSlug,
      avg: sql<number>`AVG(${articleRatings.rating})`,
    }).from(articleRatings).where(gte(articleRatings.createdAt, oneWeekAgo)).groupBy(articleRatings.articleSlug);
    const ratingMap = new Map(ratingStats.map(r => [r.slug, Number(r.avg)]));

    // Get comment counts
    const commentStats = await db.select({
      slug: articleComments.articleSlug,
      count: sql<number>`COUNT(*)`,
    }).from(articleComments).where(and(
      gte(articleComments.createdAt, oneWeekAgo),
      eq(articleComments.status, 'approved')
    )).groupBy(articleComments.articleSlug);
    const commentMap = new Map(commentStats.map(c => [c.slug, Number(c.count)]));

    const topArticles = topArticlesRaw.map(a => ({
      slug: a.slug,
      type: a.type || 'magazine',
      views: Number(a.views),
      avgReadTime: Math.round(Number(a.avgReadTime) || 0),
      avgScrollDepth: Math.round(Number(a.avgScroll) || 0),
      avgRating: ratingMap.get(a.slug) || 0,
      commentCount: commentMap.get(a.slug) || 0,
    }));

    // === HEADLINE A/B TESTS ===
    const activeHeadlineTests = await db.select({ slug: articleHeadlineTests.articleSlug })
      .from(articleHeadlineTests)
      .where(eq(articleHeadlineTests.isActive, true))
      .groupBy(articleHeadlineTests.articleSlug);

    const allHeadlineResults = await db.select()
      .from(articleHeadlineTests)
      .where(eq(articleHeadlineTests.isActive, true));

    // Group by article and find significant results
    const headlineByArticle = new Map<string, typeof allHeadlineResults>();
    for (const r of allHeadlineResults) {
      const existing = headlineByArticle.get(r.articleSlug) || [];
      existing.push(r);
      headlineByArticle.set(r.articleSlug, existing);
    }

    const headlineSignificant: WeeklyStats['headlineTests']['significantResults'] = [];
    for (const [slug, variants] of Array.from(headlineByArticle.entries())) {
      if (variants.length < 2) continue;
      const sorted = [...variants].sort((a, b) => {
        const ctrA = a.impressions > 0 ? a.clicks / a.impressions : 0;
        const ctrB = b.impressions > 0 ? b.clicks / b.impressions : 0;
        return ctrB - ctrA;
      });
      const best = sorted[0];
      const second = sorted[1];
      if (best.impressions >= 50 && second.impressions >= 50) {
        const p1 = best.clicks / best.impressions;
        const p2 = second.clicks / second.impressions;
        const pPooled = (best.clicks + second.clicks) / (best.impressions + second.impressions);
        const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / best.impressions + 1 / second.impressions));
        const zScore = se > 0 ? (p1 - p2) / se : 0;
        if (Math.abs(zScore) >= 1.96) {
          headlineSignificant.push({
            articleSlug: slug,
            winner: best.variantKey,
            ctr: Math.round(p1 * 10000) / 100,
            confidence: Math.min(99.9, Math.round(Math.abs(zScore) * 30 * 10) / 10),
          });
        }
      }
    }

    // === META DESC A/B TESTS ===
    const activeMetaTests = await db.select({ slug: articleMetaDescTests.articleSlug })
      .from(articleMetaDescTests)
      .where(eq(articleMetaDescTests.isActive, true))
      .groupBy(articleMetaDescTests.articleSlug);

    const allMetaResults = await db.select()
      .from(articleMetaDescTests)
      .where(eq(articleMetaDescTests.isActive, true));

    const metaByArticle = new Map<string, typeof allMetaResults>();
    for (const r of allMetaResults) {
      const existing = metaByArticle.get(r.articleSlug) || [];
      existing.push(r);
      metaByArticle.set(r.articleSlug, existing);
    }

    const metaSignificant: WeeklyStats['metaDescTests']['significantResults'] = [];
    for (const [slug, variants] of Array.from(metaByArticle.entries())) {
      if (variants.length < 2) continue;
      const sorted = [...variants].sort((a, b) => {
        const ctrA = a.impressions > 0 ? a.clicks / a.impressions : 0;
        const ctrB = b.impressions > 0 ? b.clicks / b.impressions : 0;
        return ctrB - ctrA;
      });
      const best = sorted[0];
      const second = sorted[1];
      if (best.impressions >= 50 && second.impressions >= 50) {
        const p1 = best.clicks / best.impressions;
        const p2 = second.clicks / second.impressions;
        const pPooled = (best.clicks + second.clicks) / (best.impressions + second.impressions);
        const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / best.impressions + 1 / second.impressions));
        const zScore = se > 0 ? (p1 - p2) / se : 0;
        if (Math.abs(zScore) >= 1.96) {
          metaSignificant.push({
            articleSlug: slug,
            winner: best.variantKey,
            ctr: Math.round(p1 * 10000) / 100,
            confidence: Math.min(99.9, Math.round(Math.abs(zScore) * 30 * 10) / 10),
          });
        }
      }
    }

    // === WIDGET A/B TESTS ===
    const activeWidgetTests = await db.select().from(widgetAbTests).where(eq(widgetAbTests.isActive, true));
    const widgetResults: WeeklyStats['widgetTests']['results'] = [];
    for (const test of activeWidgetTests) {
      const variants = await db.select().from(widgetAbVariants).where(eq(widgetAbVariants.testId, test.id));
      widgetResults.push({
        widgetName: test.widgetName,
        variants: variants.map(v => ({
          name: v.variantName,
          ctr: v.impressions > 0 ? Math.round((v.clicks / v.impressions) * 10000) / 100 : 0,
          impressions: v.impressions,
        })),
      });
    }

    // === CHATBOT STATS ===
    const [chatbotStats] = await db.select({
      total: sql<number>`COUNT(*)`,
      conversions: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END)`,
      avgDuration: sql<number>`AVG(${chatbotSessions.duration})`,
    }).from(chatbotSessions).where(gte(chatbotSessions.startedAt, oneWeekAgo));

    const totalSessions = Number(chatbotStats?.total) || 0;
    const totalConversions = Number(chatbotStats?.conversions) || 0;

    // === REFERRER BREAKDOWN ===
    const referrerStats = await db.select({
      source: readingHistory.referrerSource,
      count: sql<number>`COUNT(*)`,
    })
      .from(readingHistory)
      .where(gte(readingHistory.createdAt, oneWeekAgo))
      .groupBy(readingHistory.referrerSource)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(8);

    const totalReferrers = referrerStats.reduce((s, r) => s + Number(r.count), 0);
    const referrerBreakdown = referrerStats.map(r => ({
      source: r.source || 'Direct',
      count: Number(r.count),
      percentage: totalReferrers > 0 ? Math.round((Number(r.count) / totalReferrers) * 1000) / 10 : 0,
    }));

    // === PEAK HOURS ===
    const hourStats = await db.select({
      hour: sql<number>`HOUR(${articleViews.createdAt})`,
      count: sql<number>`COUNT(*)`,
    })
      .from(articleViews)
      .where(gte(articleViews.createdAt, oneWeekAgo))
      .groupBy(sql`HOUR(${articleViews.createdAt})`)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(5);

    // === NEW vs RETURNING ===
    const [newReadersResult] = await db.select({
      count: sql<number>`COUNT(DISTINCT v.visitorId)`,
    }).from(
      sql`(SELECT DISTINCT ${readingHistory.visitorId} as visitorId FROM ${readingHistory} WHERE ${readingHistory.createdAt} >= ${oneWeekAgo} AND ${readingHistory.visitorId} NOT IN (SELECT DISTINCT ${readingHistory.visitorId} FROM ${readingHistory} WHERE ${readingHistory.createdAt} < ${oneWeekAgo})) as v`
    );

    const uniqueReadersThisWeek = Number(pageViewStats?.unique) || 0;
    const newReaders = Number(newReadersResult?.count) || 0;

    // === COMPLETION RATE ===
    const [completionStats] = await db.select({
      rate: sql<number>`AVG(CASE WHEN ${readingHistory.completed} = 1 THEN 100 ELSE ${readingHistory.scrollDepthPercent} END)`,
    }).from(readingHistory).where(gte(readingHistory.createdAt, oneWeekAgo));

    return {
      totalPageViews: Number(pageViewStats?.total) || 0,
      uniqueReaders: uniqueReadersThisWeek,
      avgReadTimeSeconds: Math.round(Number(pageViewStats?.avgReadTime) || 0),
      avgScrollDepth: Math.round(Number(pageViewStats?.avgScroll) || 0),
      completionRate: Math.round((Number(completionStats?.rate) || 0) * 10) / 10,
      topArticles,
      headlineTests: {
        active: activeHeadlineTests.length,
        evaluated: headlineSignificant.length,
        significantResults: headlineSignificant,
      },
      metaDescTests: {
        active: activeMetaTests.length,
        evaluated: metaSignificant.length,
        significantResults: metaSignificant,
      },
      widgetTests: {
        active: activeWidgetTests.length,
        results: widgetResults,
      },
      chatbot: {
        totalSessions,
        totalConversions,
        conversionRate: totalSessions > 0 ? Math.round((totalConversions / totalSessions) * 1000) / 10 : 0,
        avgDuration: Math.round(Number(chatbotStats?.avgDuration) || 0),
      },
      referrerBreakdown,
      peakHours: hourStats.map(h => ({ hour: Number(h.hour), count: Number(h.count) })),
      newReaders,
      returningReaders: Math.max(0, uniqueReadersThisWeek - newReaders),
    };
  } catch (error) {
    console.error('[Admin Digest] Error collecting stats:', error);
    return defaultStats;
  }
}

// ============================================
// AI STRATEGY RECOMMENDATIONS
// ============================================

async function generateAIRecommendations(stats: WeeklyStats): Promise<string> {
  try {
    const prompt = `You are a content strategy advisor for a Czech spiritual e-commerce website (amulets, crystals, aromatherapy). Based on the following weekly performance data, provide 3-5 actionable recommendations in Czech language. Be specific and data-driven.

Weekly Performance Data:
- Total page views: ${stats.totalPageViews}
- Unique readers: ${stats.uniqueReaders}
- Avg read time: ${stats.avgReadTimeSeconds}s
- Avg scroll depth: ${stats.avgScrollDepth}%
- Completion rate: ${stats.completionRate}%
- New readers: ${stats.newReaders} (${stats.uniqueReaders > 0 ? Math.round((stats.newReaders / stats.uniqueReaders) * 100) : 0}%)
- Returning readers: ${stats.returningReaders}

Top articles: ${stats.topArticles.map(a => `${a.slug} (${a.views} views, ${a.avgReadTime}s read, ${a.avgRating.toFixed(1)}★)`).join(', ')}

Active A/B tests: ${stats.headlineTests.active} headline, ${stats.metaDescTests.active} meta desc, ${stats.widgetTests.active} widget
Significant results: ${stats.headlineTests.significantResults.length + stats.metaDescTests.significantResults.length}

Chatbot: ${stats.chatbot.totalSessions} sessions, ${stats.chatbot.conversionRate}% conversion rate

Top referrers: ${stats.referrerBreakdown.map(r => `${r.source}: ${r.percentage}%`).join(', ')}
Peak hours: ${stats.peakHours.map(h => `${h.hour}:00 (${h.count})`).join(', ')}

Provide recommendations in this format:
1. [Category] Recommendation title
   Detail explanation with specific numbers and actions.

Categories: Content, SEO, Engagement, Conversion, Traffic`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are an expert performance marketing consultant specializing in content strategy and conversion optimization. Respond in Czech." },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    return (typeof content === 'string' ? content : null) || "AI doporučení nejsou momentálně k dispozici.";
  } catch (error) {
    console.error('[Admin Digest] AI recommendations failed:', error);
    return "AI doporučení nejsou momentálně k dispozici (chyba při generování).";
  }
}

// ============================================
// EMAIL TEMPLATE
// ============================================

function formatSlugToTitle(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function generateAdminDigestEmail(stats: WeeklyStats, aiRecommendations: string): string {
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date();
  const dateRange = `${weekStart.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  // Top articles HTML
  const topArticlesHtml = stats.topArticles.slice(0, 7).map((article, i) => {
    const stars = article.avgRating > 0 
      ? `<span style="color:#D4AF37;">${'★'.repeat(Math.round(article.avgRating))}${'☆'.repeat(5 - Math.round(article.avgRating))}</span>` 
      : '<span style="color:#ccc;">—</span>';
    const readMin = Math.round(article.avgReadTime / 60);
    return `
      <tr style="border-bottom: 1px solid #f0e6f6;">
        <td style="padding: 10px 8px; font-size: 13px;">
          <strong style="color: #333;">${i + 1}. ${formatSlugToTitle(article.slug)}</strong>
          <br><span style="color: #888; font-size: 11px;">${article.type}</span>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #555;">${article.views}</td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #555;">${readMin}m</td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #555;">${article.avgScrollDepth}%</td>
        <td style="padding: 10px 8px; text-align: center; font-size: 12px;">${stars}</td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #555;">${article.commentCount}</td>
      </tr>`;
  }).join('');

  // A/B test results HTML
  const abTestHtml = (() => {
    const sections: string[] = [];
    
    if (stats.headlineTests.active > 0) {
      sections.push(`
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;">📝 Headline A/B testy</div>
          <div style="font-size: 13px; color: #666;">Aktivní: ${stats.headlineTests.active} | Signifikantní: ${stats.headlineTests.evaluated}</div>
          ${stats.headlineTests.significantResults.map(r => `
            <div style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 8px 12px; margin-top: 8px; font-size: 12px;">
              <strong>${formatSlugToTitle(r.articleSlug)}</strong>: Vítěz "${r.winner}" (CTR ${r.ctr}%, confidence ${r.confidence}%)
            </div>
          `).join('')}
        </div>
      `);
    }

    if (stats.metaDescTests.active > 0) {
      sections.push(`
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;">🔍 Meta Description A/B testy</div>
          <div style="font-size: 13px; color: #666;">Aktivní: ${stats.metaDescTests.active} | Signifikantní: ${stats.metaDescTests.evaluated}</div>
          ${stats.metaDescTests.significantResults.map(r => `
            <div style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 8px 12px; margin-top: 8px; font-size: 12px;">
              <strong>${formatSlugToTitle(r.articleSlug)}</strong>: Vítěz "${r.winner}" (CTR ${r.ctr}%, confidence ${r.confidence}%)
            </div>
          `).join('')}
        </div>
      `);
    }

    if (stats.widgetTests.active > 0) {
      sections.push(`
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;">🧩 Widget A/B testy</div>
          ${stats.widgetTests.results.map(t => `
            <div style="font-size: 13px; color: #666; margin-bottom: 4px;">${t.widgetName}:</div>
            ${t.variants.map(v => `
              <div style="font-size: 12px; color: #555; padding-left: 12px;">• ${v.name}: CTR ${v.ctr}% (${v.impressions} impressions)</div>
            `).join('')}
          `).join('')}
        </div>
      `);
    }

    if (sections.length === 0) {
      return '<div style="font-size: 13px; color: #888; padding: 12px;">Žádné aktivní A/B testy tento týden.</div>';
    }

    return sections.join('');
  })();

  // Referrer breakdown
  const referrerHtml = stats.referrerBreakdown.slice(0, 5).map(r => `
    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; border-bottom: 1px solid #f5f5f5;">
      <span style="color: #555;">${r.source}</span>
      <span style="color: #333; font-weight: 600;">${r.count} (${r.percentage}%)</span>
    </div>
  `).join('');

  // Peak hours
  const peakHoursHtml = stats.peakHours.slice(0, 3).map(h => 
    `<span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 12px; font-size: 12px; margin-right: 6px;">${h.hour}:00 (${h.count}×)</span>`
  ).join('');

  // AI recommendations - convert markdown to simple HTML
  const aiHtml = aiRecommendations
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin: 8px 0; font-size: 13px; color: #555; line-height: 1.6;">')
    .replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f1f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f1f8;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #8B4789 100%); padding: 32px 28px; border-radius: 16px 16px 0 0; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
              <h1 style="color: white; font-size: 22px; margin: 0; font-weight: 700;">Admin Weekly Digest</h1>
              <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 8px 0 0;">${dateRange}</p>
            </td>
          </tr>

          <!-- KPI Overview -->
          <tr>
            <td style="background: white; padding: 24px 28px; border-left: 1px solid #e8e0f0; border-right: 1px solid #e8e0f0;">
              <h2 style="font-size: 16px; color: #1e1b4b; margin: 0 0 16px; border-bottom: 2px solid #8B4789; padding-bottom: 8px;">📈 Přehled KPI</h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width: 25%; text-align: center; padding: 12px 4px;">
                    <div style="font-size: 28px; font-weight: 700; color: #4c1d95;">${stats.totalPageViews}</div>
                    <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Zobrazení</div>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 12px 4px;">
                    <div style="font-size: 28px; font-weight: 700; color: #4c1d95;">${stats.uniqueReaders}</div>
                    <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Čtenáři</div>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 12px 4px;">
                    <div style="font-size: 28px; font-weight: 700; color: #4c1d95;">${Math.round(stats.avgReadTimeSeconds / 60)}m</div>
                    <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Prům. čtení</div>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 12px 4px;">
                    <div style="font-size: 28px; font-weight: 700; color: #4c1d95;">${stats.completionRate}%</div>
                    <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Dokončení</div>
                  </td>
                </tr>
              </table>
              
              <!-- New vs Returning -->
              <div style="margin-top: 12px; padding: 12px; background: #faf7fb; border-radius: 8px;">
                <div style="font-size: 12px; color: #666;">
                  👤 Noví čtenáři: <strong style="color: #22c55e;">${stats.newReaders}</strong> 
                  &nbsp;|&nbsp; 
                  🔄 Vracející se: <strong style="color: #4c1d95;">${stats.returningReaders}</strong>
                  &nbsp;|&nbsp;
                  📊 Prům. scroll: <strong>${stats.avgScrollDepth}%</strong>
                </div>
              </div>
            </td>
          </tr>

          <!-- Top Articles -->
          <tr>
            <td style="background: white; padding: 0 28px 24px; border-left: 1px solid #e8e0f0; border-right: 1px solid #e8e0f0;">
              <h2 style="font-size: 16px; color: #1e1b4b; margin: 0 0 12px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">🏆 Top články týdne</h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr style="background: #faf7fb;">
                  <th style="padding: 8px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase;">Článek</th>
                  <th style="padding: 8px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase;">Views</th>
                  <th style="padding: 8px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase;">Čtení</th>
                  <th style="padding: 8px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase;">Scroll</th>
                  <th style="padding: 8px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase;">Rating</th>
                  <th style="padding: 8px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase;">💬</th>
                </tr>
                ${topArticlesHtml || '<tr><td colspan="6" style="padding: 16px; text-align: center; color: #888; font-size: 13px;">Žádná data tento týden</td></tr>'}
              </table>
            </td>
          </tr>

          <!-- A/B Test Results -->
          <tr>
            <td style="background: white; padding: 0 28px 24px; border-left: 1px solid #e8e0f0; border-right: 1px solid #e8e0f0;">
              <h2 style="font-size: 16px; color: #1e1b4b; margin: 0 0 12px; border-bottom: 2px solid #22c55e; padding-bottom: 8px;">🧪 A/B Test výsledky</h2>
              ${abTestHtml}
            </td>
          </tr>

          <!-- Chatbot Performance -->
          <tr>
            <td style="background: white; padding: 0 28px 24px; border-left: 1px solid #e8e0f0; border-right: 1px solid #e8e0f0;">
              <h2 style="font-size: 16px; color: #1e1b4b; margin: 0 0 12px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">🤖 Chatbot výkon</h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width: 25%; text-align: center; padding: 12px 4px;">
                    <div style="font-size: 22px; font-weight: 700; color: #3b82f6;">${stats.chatbot.totalSessions}</div>
                    <div style="font-size: 11px; color: #888;">Sessions</div>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 12px 4px;">
                    <div style="font-size: 22px; font-weight: 700; color: #22c55e;">${stats.chatbot.totalConversions}</div>
                    <div style="font-size: 11px; color: #888;">Konverze</div>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 12px 4px;">
                    <div style="font-size: 22px; font-weight: 700; color: #f59e0b;">${stats.chatbot.conversionRate}%</div>
                    <div style="font-size: 11px; color: #888;">Conv. Rate</div>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 12px 4px;">
                    <div style="font-size: 22px; font-weight: 700; color: #8B4789;">${Math.round(stats.chatbot.avgDuration / 60)}m</div>
                    <div style="font-size: 11px; color: #888;">Prům. délka</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Behavior Insights -->
          <tr>
            <td style="background: white; padding: 0 28px 24px; border-left: 1px solid #e8e0f0; border-right: 1px solid #e8e0f0;">
              <h2 style="font-size: 16px; color: #1e1b4b; margin: 0 0 12px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">🔍 Behavior Insights</h2>
              
              <div style="display: flex; gap: 20px;">
                <!-- Referrer Sources -->
                <div style="flex: 1; margin-bottom: 16px;">
                  <div style="font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px;">Zdroje návštěvnosti:</div>
                  ${referrerHtml || '<div style="font-size: 13px; color: #888;">Žádná data</div>'}
                </div>
              </div>

              <!-- Peak Hours -->
              <div style="margin-top: 8px;">
                <div style="font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px;">Špičkové hodiny:</div>
                ${peakHoursHtml || '<span style="font-size: 13px; color: #888;">Žádná data</span>'}
              </div>
            </td>
          </tr>

          <!-- AI Recommendations -->
          <tr>
            <td style="background: linear-gradient(135deg, #faf7fb, #f0e6f6); padding: 24px 28px; border-left: 1px solid #e8e0f0; border-right: 1px solid #e8e0f0;">
              <h2 style="font-size: 16px; color: #1e1b4b; margin: 0 0 12px; border-bottom: 2px solid #8B4789; padding-bottom: 8px;">🤖 AI Strategická doporučení</h2>
              <p style="margin: 8px 0; font-size: 13px; color: #555; line-height: 1.6;">
                ${aiHtml}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1e1b4b; padding: 20px 28px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0 0 4px;">
                Automatický týdenní report z Amulets.cz
              </p>
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
                Vygenerováno ${new Date().toLocaleString('cs-CZ')} · Další report příští pondělí 7:00
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================
// MAIN FUNCTION
// ============================================

export async function sendAdminWeeklyDigest(): Promise<{
  success: boolean;
  message: string;
  stats?: WeeklyStats;
}> {
  console.log('[Admin Digest] Starting weekly admin digest...');

  try {
    // 1. Collect all stats
    const stats = await collectWeeklyStats();
    console.log(`[Admin Digest] Stats collected: ${stats.totalPageViews} views, ${stats.topArticles.length} top articles`);

    // 2. Generate AI recommendations
    const aiRecommendations = await generateAIRecommendations(stats);
    console.log('[Admin Digest] AI recommendations generated');

    // 3. Generate email HTML
    const htmlContent = generateAdminDigestEmail(stats, aiRecommendations);

    // 4. Send email to admin
    const ownerEmail = process.env.OWNER_EMAIL || 'petr.vavra@gmail.com';
    const emailSent = await sendBrevoEmail({
      to: [{ email: ownerEmail, name: 'Admin' }],
      subject: `📊 Admin Weekly Digest: ${stats.totalPageViews} views, ${stats.uniqueReaders} čtenářů`,
      htmlContent,
      sender: { name: 'Amulets.cz Analytics', email: 'info@amulets.cz' },
    });

    // 5. Send Telegram summary
    const telegramMsg = [
      `📊 <b>Admin Weekly Digest odeslán</b>`,
      ``,
      `📈 Views: ${stats.totalPageViews} | Čtenáři: ${stats.uniqueReaders}`,
      `⏱ Prům. čtení: ${Math.round(stats.avgReadTimeSeconds / 60)}m | Scroll: ${stats.avgScrollDepth}%`,
      `🧪 A/B testy: ${stats.headlineTests.active + stats.metaDescTests.active + stats.widgetTests.active} aktivních`,
      `🤖 Chatbot: ${stats.chatbot.totalSessions} sessions, ${stats.chatbot.conversionRate}% conv.`,
      ``,
      `🏆 Top článek: ${stats.topArticles[0] ? formatSlugToTitle(stats.topArticles[0].slug) + ` (${stats.topArticles[0].views}×)` : 'N/A'}`,
      ``,
      `📧 Email odeslán na: ${ownerEmail}`,
    ].join('\n');

    sendTelegramMessage(telegramMsg, 'HTML').catch(err =>
      console.error('[Admin Digest] Telegram notification failed:', err)
    );

    const message = emailSent
      ? `Admin digest odeslán na ${ownerEmail}`
      : `Admin digest vygenerován, ale email se nepodařilo odeslat`;

    console.log(`[Admin Digest] ${emailSent ? '✅' : '⚠️'} ${message}`);

    return { success: emailSent, message, stats };
  } catch (error) {
    console.error('[Admin Digest] Error:', error);
    return {
      success: false,
      message: `Chyba při generování admin digestu: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// ============================================
// SCHEDULER
// ============================================

let adminDigestScheduled = false;

export function scheduleAdminWeeklyDigest(): void {
  if (adminDigestScheduled) return;
  adminDigestScheduled = true;

  const checkAndSend = async () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday

    // Send every Monday at 7:00 AM (with 5 minute window)
    if (dayOfWeek === 1 && hours === 7 && minutes >= 0 && minutes < 5) {
      console.log('[Admin Digest] Sending scheduled admin weekly digest...');
      try {
        await sendAdminWeeklyDigest();
      } catch (error) {
        console.error('[Admin Digest] Scheduled send failed:', error);
      }
    }
  };

  // Check every 5 minutes
  setInterval(checkAndSend, 5 * 60 * 1000);

  console.log('[Admin Digest] Scheduled for every Monday at 7:00 AM');
}

// Auto-start scheduler when module loads
scheduleAdminWeeklyDigest();
