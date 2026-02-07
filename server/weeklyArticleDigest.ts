/**
 * Weekly Article Digest
 * 
 * Sends a weekly email to registered users with a summary
 * of the most engaging articles from the past week.
 * 
 * Sources emails from:
 * - users table (registered users with email)
 * - ebookDownloads table (lead captures)
 * - horoscopeSubscriptions table (active subscribers)
 */

import { sendBrevoEmail } from "./brevo";
import { getDb } from "./db";
import { users, ebookDownloads, horoscopeSubscriptions, articleViews, articleRatings, articleComments } from "../drizzle/schema";
import { eq, sql, gte, desc, and, isNotNull } from "drizzle-orm";
import { sendTelegramMessage } from "./telegram";

interface TopArticle {
  articleSlug: string;
  articleType: string;
  views: number;
  avgScrollDepth: number;
  avgReadTime: number;
  avgRating: number;
  commentCount: number;
  engagementScore: number;
}

/**
 * Get top articles from the past week based on engagement
 */
async function getTopWeeklyArticles(limit: number = 5): Promise<TopArticle[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get article views with engagement metrics
    const viewStats = await db.select({
      articleSlug: articleViews.articleSlug,
      articleType: articleViews.articleType,
      views: sql<number>`COUNT(*)`.as('views'),
      avgScrollDepth: sql<number>`AVG(${articleViews.scrollDepthPercent})`.as('avgScrollDepth'),
      avgReadTime: sql<number>`AVG(${articleViews.readTimeSeconds})`.as('avgReadTime'),
    })
      .from(articleViews)
      .where(gte(articleViews.createdAt, oneWeekAgo))
      .groupBy(articleViews.articleSlug, articleViews.articleType)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(limit * 2); // Get more to filter later

    // Get ratings for these articles
    const ratingStats = await db.select({
      articleSlug: articleRatings.articleSlug,
      avgRating: sql<number>`AVG(${articleRatings.rating})`.as('avgRating'),
    })
      .from(articleRatings)
      .where(gte(articleRatings.createdAt, oneWeekAgo))
      .groupBy(articleRatings.articleSlug);

    // Get comment counts
    const commentStats = await db.select({
      articleSlug: articleComments.articleSlug,
      commentCount: sql<number>`COUNT(*)`.as('commentCount'),
    })
      .from(articleComments)
      .where(and(
        gte(articleComments.createdAt, oneWeekAgo),
        eq(articleComments.status, 'approved')
      ))
      .groupBy(articleComments.articleSlug);

    // Merge data and calculate engagement score
    const ratingMap = new Map(ratingStats.map(r => [r.articleSlug, Number(r.avgRating)]));
    const commentMap = new Map(commentStats.map(c => [c.articleSlug, Number(c.commentCount)]));

    const articles: TopArticle[] = viewStats.map(v => {
      const avgRating = ratingMap.get(v.articleSlug) || 0;
      const commentCount = commentMap.get(v.articleSlug) || 0;
      const views = Number(v.views);
      const avgScrollDepth = Number(v.avgScrollDepth) || 0;
      const avgReadTime = Number(v.avgReadTime) || 0;

      // Engagement score: weighted combination
      const engagementScore = 
        views * 1 + 
        avgScrollDepth * 0.5 + 
        avgReadTime * 0.3 + 
        avgRating * 10 + 
        commentCount * 5;

      return {
        articleSlug: v.articleSlug,
        articleType: v.articleType || 'magazine',
        views,
        avgScrollDepth,
        avgReadTime,
        avgRating,
        commentCount,
        engagementScore,
      };
    });

    // Sort by engagement score and return top N
    return articles
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit);
  } catch (error) {
    console.error('[Weekly Digest] Error getting top articles:', error);
    return [];
  }
}

/**
 * Get all unique subscriber emails from multiple sources
 */
async function getSubscriberEmails(): Promise<Array<{ email: string; name: string }>> {
  const db = await getDb();
  if (!db) return [];

  try {
    const emailMap = new Map<string, string>();

    // 1. Registered users with email
    const registeredUsers = await db.select({
      email: users.email,
      name: users.name,
    })
      .from(users)
      .where(isNotNull(users.email));

    for (const u of registeredUsers) {
      if (u.email) {
        emailMap.set(u.email.toLowerCase(), u.name || 'Milá duše');
      }
    }

    // 2. Ebook downloads (lead captures)
    const ebookLeads = await db.select({
      email: ebookDownloads.email,
      name: ebookDownloads.name,
    })
      .from(ebookDownloads);

    for (const lead of ebookLeads) {
      if (lead.email && !emailMap.has(lead.email.toLowerCase())) {
        emailMap.set(lead.email.toLowerCase(), lead.name || 'Milá duše');
      }
    }

    // 3. Active horoscope subscribers
    const horoscopeSubs = await db.select({
      email: horoscopeSubscriptions.email,
      name: horoscopeSubscriptions.name,
    })
      .from(horoscopeSubscriptions)
      .where(eq(horoscopeSubscriptions.isActive, true));

    for (const sub of horoscopeSubs) {
      if (sub.email && !emailMap.has(sub.email.toLowerCase())) {
        emailMap.set(sub.email.toLowerCase(), sub.name || 'Milá duše');
      }
    }

    return Array.from(emailMap.entries()).map(([email, name]) => ({ email, name }));
  } catch (error) {
    console.error('[Weekly Digest] Error getting subscriber emails:', error);
    return [];
  }
}

/**
 * Format article slug to readable title
 */
function formatSlugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Get article URL based on type and slug
 */
function getArticleUrl(slug: string, type: string): string {
  const base = 'https://amulets.cz';
  switch (type) {
    case 'guide': return `${base}/symbol/${slug}`;
    case 'tantra': return `${base}/ucel/${slug}`;
    case 'magazine':
    default: return `${base}/magazin/${slug}`;
  }
}

/**
 * Generate HTML email template for weekly digest
 */
function generateDigestEmail(articles: TopArticle[], recipientName: string): string {
  const articleCards = articles.map((article, index) => {
    const url = getArticleUrl(article.articleSlug, article.articleType);
    const title = formatSlugToTitle(article.articleSlug);
    const stars = '★'.repeat(Math.round(article.avgRating)) + '☆'.repeat(5 - Math.round(article.avgRating));
    const readTime = Math.round(article.avgReadTime / 60);
    const typeLabel = article.articleType === 'guide' ? 'Průvodce' : article.articleType === 'tantra' ? 'Účel' : 'Magazín';

    return `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #f0e6f6;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width: 40px; vertical-align: top; padding-right: 16px;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #8B4789, #E85A9F); color: white; font-size: 16px; font-weight: bold; text-align: center; line-height: 36px;">
                  ${index + 1}
                </div>
              </td>
              <td style="vertical-align: top;">
                <a href="${url}" style="color: #8B4789; text-decoration: none; font-size: 16px; font-weight: 600; line-height: 1.4;">
                  ${title}
                </a>
                <div style="margin-top: 6px; font-size: 13px; color: #666;">
                  <span style="background: #f0e6f6; padding: 2px 8px; border-radius: 12px; color: #8B4789; font-size: 11px;">${typeLabel}</span>
                  &nbsp;&nbsp;
                  <span style="color: #D4AF37;">${stars}</span>
                  &nbsp;&nbsp;
                  👁 ${article.views}×
                  &nbsp;&nbsp;
                  ⏱ ~${readTime} min
                  ${article.commentCount > 0 ? `&nbsp;&nbsp; 💬 ${article.commentCount}` : ''}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f4f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f4f9;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B4789 0%, #E85A9F 100%); padding: 30px 24px; border-radius: 16px 16px 0 0; text-align: center;">
              <div style="font-size: 28px; margin-bottom: 8px;">✨🔮</div>
              <h1 style="color: white; font-size: 22px; margin: 0; font-weight: 700;">Týdenní přehled Amulets.cz</h1>
              <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 8px 0 0;">Nejčtenější články tohoto týdne</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="background: white; padding: 24px; border-left: 1px solid #f0e6f6; border-right: 1px solid #f0e6f6;">
              <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                Ahoj ${recipientName},
              </p>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                Připravili jsme pro tebe přehled nejoblíbenějších článků z minulého týdne. Podívej se, co ostatní čtenáře nejvíce zaujalo:
              </p>
              
              <!-- Articles -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${articleCards}
              </table>
              
              <!-- CTA -->
              <div style="text-align: center; margin-top: 28px;">
                <a href="https://amulets.cz/magazin" style="display: inline-block; background: linear-gradient(135deg, #8B4789, #E85A9F); color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 15px;">
                  Prozkoumat všechny články →
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #faf7fb; padding: 20px 24px; border-radius: 0 0 16px 16px; border: 1px solid #f0e6f6; border-top: none; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0 0 8px;">
                Tento email jste obdrželi, protože jste registrováni na Amulets.cz
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                <a href="https://amulets.cz" style="color: #8B4789; text-decoration: none;">Amulets.cz</a> · Spirituální průvodce a amulety
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

/**
 * Send weekly article digest to all subscribers
 */
export async function sendWeeklyArticleDigest(): Promise<{
  sent: number;
  failed: number;
  articlesIncluded: number;
}> {
  console.log('[Weekly Digest] Starting weekly article digest...');

  const articles = await getTopWeeklyArticles(5);
  
  if (articles.length === 0) {
    console.log('[Weekly Digest] No articles with engagement this week, skipping.');
    return { sent: 0, failed: 0, articlesIncluded: 0 };
  }

  const subscribers = await getSubscriberEmails();
  console.log(`[Weekly Digest] Found ${subscribers.length} subscribers, ${articles.length} top articles`);

  if (subscribers.length === 0) {
    console.log('[Weekly Digest] No subscribers found, skipping.');
    return { sent: 0, failed: 0, articlesIncluded: articles.length };
  }

  let sent = 0;
  let failed = 0;

  // Send in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    
    const promises = batch.map(async (sub) => {
      const htmlContent = generateDigestEmail(articles, sub.name);
      const success = await sendBrevoEmail({
        to: [{ email: sub.email, name: sub.name }],
        subject: `✨ Týdenní přehled: ${articles.length} nejčtenějších článků na Amulets.cz`,
        htmlContent,
      });
      
      if (success) {
        sent++;
      } else {
        failed++;
      }
    });

    await Promise.all(promises);
    
    // Small delay between batches
    if (i + batchSize < subscribers.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const summary = `📧 Týdenní digest odeslán: ${sent}/${subscribers.length} úspěšně, ${failed} selhalo, ${articles.length} článků`;
  console.log(`[Weekly Digest] ${summary}`);

  // Notify owner via Telegram
  const telegramMsg = [
    `📧 <b>Týdenní Article Digest</b>`,
    ``,
    `✅ Odesláno: ${sent}/${subscribers.length}`,
    `❌ Selhalo: ${failed}`,
    `📝 Článků: ${articles.length}`,
    ``,
    `<b>Top články:</b>`,
    ...articles.map((a, i) => `${i + 1}. ${formatSlugToTitle(a.articleSlug)} (${a.views}× zobrazení)`),
  ].join('\n');

  sendTelegramMessage(telegramMsg, 'HTML').catch(err => 
    console.error('[Weekly Digest] Telegram notification failed:', err)
  );

  return { sent, failed, articlesIncluded: articles.length };
}

// ============================================
// SCHEDULER
// ============================================

let weeklyDigestScheduled = false;

/**
 * Schedule weekly article digest for Sunday at 10:00 AM CET
 */
export function scheduleWeeklyArticleDigest(): void {
  if (weeklyDigestScheduled) return;
  weeklyDigestScheduled = true;

  const checkAndSend = async () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const dayOfWeek = now.getDay(); // 0 = Sunday

    // Send every Sunday at 10:00 AM (with 5 minute window)
    if (dayOfWeek === 0 && hours === 10 && minutes >= 0 && minutes < 5) {
      console.log('[Weekly Digest] Sending scheduled weekly article digest...');
      try {
        await sendWeeklyArticleDigest();
      } catch (error) {
        console.error('[Weekly Digest] Scheduled send failed:', error);
      }
    }
  };

  // Check every 5 minutes
  setInterval(checkAndSend, 5 * 60 * 1000);

  console.log('[Weekly Digest] Scheduled for every Sunday at 10:00 AM');
}

// Auto-start scheduler when module loads
scheduleWeeklyArticleDigest();
