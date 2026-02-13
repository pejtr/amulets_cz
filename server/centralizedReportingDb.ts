/**
 * Centralized Reporting Database Functions
 * Ukládání a agregace dat ze všech projektů
 */

import { getDb } from './db';
import { projectStats, projectStatsAggregated } from '../drizzle/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import type { ProjectStats, CentralizedReport } from '@shared/centralizedReporting';

/**
 * Save project stats to database
 */
export async function saveProjectStats(stats: ProjectStats): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.insert(projectStats).values({
    projectId: stats.projectId,
    projectName: stats.projectName,
    date: new Date(stats.date),
    pageViews: stats.pageViews,
    uniqueVisitors: stats.uniqueVisitors,
    sessions: stats.sessions,
    avgSessionDuration: stats.avgSessionDuration,
    bounceRate: stats.bounceRate,
    chatSessions: stats.chatSessions || 0,
    chatMessages: stats.chatMessages || 0,
    chatConversions: stats.chatConversions || 0,
    emailCaptures: stats.emailCaptures || 0,
    affiliateClicks: stats.affiliateClicks || 0,
    purchases: stats.purchases || 0,
    revenue: stats.revenue || 0,
    topPages: JSON.stringify(stats.topPages || []),
    topCountries: JSON.stringify(stats.topCountries || []),
    customEvents: JSON.stringify(stats.customEvents || {}),
    createdAt: new Date(),
  });
}

/**
 * Get project stats for a specific date
 */
export async function getProjectStatsByDate(
  projectId: string,
  date: Date
): Promise<ProjectStats | null> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(projectStats)
    .where(
      and(
        eq(projectStats.projectId, projectId),
        gte(projectStats.date, startOfDay),
        lte(projectStats.date, endOfDay)
      )
    )
    .limit(1);

  if (results.length === 0) return null;

  const row = results[0];
  return {
    projectId: row.projectId,
    projectName: row.projectName,
    date: row.date.toISOString(),
    pageViews: row.pageViews,
    uniqueVisitors: row.uniqueVisitors,
    sessions: row.sessions,
    avgSessionDuration: row.avgSessionDuration,
    bounceRate: row.bounceRate,
    chatSessions: row.chatSessions || undefined,
    chatMessages: row.chatMessages || undefined,
    chatConversions: row.chatConversions || undefined,
    emailCaptures: row.emailCaptures || undefined,
    affiliateClicks: row.affiliateClicks || undefined,
    purchases: row.purchases || undefined,
    revenue: row.revenue || undefined,
    topPages: row.topPages ? JSON.parse(row.topPages as string) : undefined,
    topCountries: row.topCountries ? JSON.parse(row.topCountries as string) : undefined,
    customEvents: row.customEvents ? JSON.parse(row.customEvents as string) : undefined,
  };
}

/**
 * Get all projects stats for a specific date
 */
export async function getAllProjectsStatsByDate(date: Date): Promise<ProjectStats[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select()
    .from(projectStats)
    .where(
      and(
        gte(projectStats.date, startOfDay),
        lte(projectStats.date, endOfDay)
      )
    )
    .orderBy(desc(projectStats.pageViews));

  return results.map(row => ({
    projectId: row.projectId,
    projectName: row.projectName,
    date: row.date.toISOString(),
    pageViews: row.pageViews,
    uniqueVisitors: row.uniqueVisitors,
    sessions: row.sessions,
    avgSessionDuration: row.avgSessionDuration,
    bounceRate: row.bounceRate,
    chatSessions: row.chatSessions || undefined,
    chatMessages: row.chatMessages || undefined,
    chatConversions: row.chatConversions || undefined,
    emailCaptures: row.emailCaptures || undefined,
    affiliateClicks: row.affiliateClicks || undefined,
    purchases: row.purchases || undefined,
    revenue: row.revenue || undefined,
    topPages: row.topPages ? JSON.parse(row.topPages as string) : undefined,
    topCountries: row.topCountries ? JSON.parse(row.topCountries as string) : undefined,
    customEvents: row.customEvents ? JSON.parse(row.customEvents as string) : undefined,
  }));
}

/**
 * Generate centralized report for a specific date
 */
export async function generateCentralizedReport(date: Date): Promise<CentralizedReport> {
  const projects = await getAllProjectsStatsByDate(date);

  // Calculate totals
  const totals = projects.reduce(
    (acc, project) => ({
      pageViews: acc.pageViews + project.pageViews,
      uniqueVisitors: acc.uniqueVisitors + project.uniqueVisitors,
      sessions: acc.sessions + project.sessions,
      chatSessions: acc.chatSessions + (project.chatSessions || 0),
      chatMessages: acc.chatMessages + (project.chatMessages || 0),
      conversions: acc.conversions + (project.emailCaptures || 0) + (project.affiliateClicks || 0) + (project.purchases || 0),
      revenue: acc.revenue + (project.revenue || 0),
    }),
    {
      pageViews: 0,
      uniqueVisitors: 0,
      sessions: 0,
      chatSessions: 0,
      chatMessages: 0,
      conversions: 0,
      revenue: 0,
    }
  );

  return {
    reportDate: date.toISOString().split('T')[0],
    generatedAt: new Date().toISOString(),
    projects,
    totals,
  };
}

/**
 * Save aggregated stats (for caching)
 */
export async function saveAggregatedStats(report: CentralizedReport): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.insert(projectStatsAggregated).values({
    date: new Date(report.reportDate),
    totalPageViews: report.totals.pageViews,
    totalUniqueVisitors: report.totals.uniqueVisitors,
    totalSessions: report.totals.sessions,
    totalChatSessions: report.totals.chatSessions,
    totalChatMessages: report.totals.chatMessages,
    totalConversions: report.totals.conversions,
    totalRevenue: report.totals.revenue,
    projectsData: JSON.stringify(report.projects),
    createdAt: new Date(),
  });
}

/**
 * Get cached aggregated stats
 */
export async function getCachedAggregatedStats(date: Date): Promise<CentralizedReport | null> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(projectStatsAggregated)
    .where(
      and(
        gte(projectStatsAggregated.date, startOfDay),
        lte(projectStatsAggregated.date, endOfDay)
      )
    )
    .limit(1);

  if (results.length === 0) return null;

  const row = results[0];
  return {
    reportDate: row.date.toISOString().split('T')[0],
    generatedAt: row.createdAt.toISOString(),
    projects: JSON.parse(row.projectsData as string),
    totals: {
      pageViews: row.totalPageViews,
      uniqueVisitors: row.totalUniqueVisitors,
      sessions: row.totalSessions,
      chatSessions: row.totalChatSessions,
      chatMessages: row.totalChatMessages,
      conversions: row.totalConversions,
      revenue: row.totalRevenue,
    },
  };
}
