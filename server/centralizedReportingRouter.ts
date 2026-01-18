/**
 * Centralized Reporting Router
 * API endpoints pro příjem dat z ostatních projektů
 */

import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { 
  saveProjectStats, 
  generateCentralizedReport,
  saveAggregatedStats,
  getCachedAggregatedStats 
} from './centralizedReportingDb';
import type { ProjectStats } from '@shared/centralizedReporting';

// API Key pro autentizaci (v produkci by měl být v ENV)
const REPORTING_API_KEY = process.env.CENTRALIZED_REPORTING_API_KEY || 'dev-reporting-key-12345';

/**
 * Validation schema pro project stats
 */
const projectStatsSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  date: z.string(), // ISO date
  pageViews: z.number(),
  uniqueVisitors: z.number(),
  sessions: z.number(),
  avgSessionDuration: z.number(),
  bounceRate: z.number(),
  chatSessions: z.number().optional(),
  chatMessages: z.number().optional(),
  chatConversions: z.number().optional(),
  emailCaptures: z.number().optional(),
  affiliateClicks: z.number().optional(),
  purchases: z.number().optional(),
  revenue: z.number().optional(),
  topPages: z.array(z.object({
    path: z.string(),
    views: z.number(),
  })).optional(),
  topCountries: z.array(z.object({
    country: z.string(),
    visitors: z.number(),
  })).optional(),
  customEvents: z.record(z.string(), z.number()).optional(),
});

export const centralizedReportingRouter = router({
  /**
   * Submit project stats
   * Endpoint pro ostatní projekty k odeslání denních statistik
   */
  submitStats: publicProcedure
    .input(z.object({
      apiKey: z.string(),
      stats: projectStatsSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify API key
      if (input.apiKey !== REPORTING_API_KEY) {
        throw new Error('Invalid API key');
      }

      // Save stats to database
      await saveProjectStats(input.stats as ProjectStats);

      return {
        success: true,
        message: 'Stats saved successfully',
      };
    }),

  /**
   * Get centralized report for a specific date
   */
  getReport: publicProcedure
    .input(z.object({
      apiKey: z.string(),
      date: z.string(), // ISO date string
    }))
    .query(async ({ input, ctx }) => {
      // Verify API key
      if (input.apiKey !== REPORTING_API_KEY) {
        throw new Error('Invalid API key');
      }

      const date = new Date(input.date);

      // Try to get cached report first
      let report = await getCachedAggregatedStats(date);

      // If not cached, generate new report and cache it
      if (!report) {
        report = await generateCentralizedReport(date);
        await saveAggregatedStats(report);
      }

      return {
        success: true,
        data: report,
      };
    }),

  /**
   * Webhook endpoint for real-time updates
   */
  webhook: publicProcedure
    .input(z.object({
      apiKey: z.string(),
      projectId: z.string(),
      eventType: z.enum(['page_view', 'chat_session', 'conversion', 'purchase', 'custom']),
      timestamp: z.string(),
      data: z.record(z.string(), z.any()),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify API key
      if (input.apiKey !== REPORTING_API_KEY) {
        throw new Error('Invalid API key');
      }

      // Log the event (můžeme později přidat real-time processing)
      console.log('[Centralized Reporting Webhook]', {
        projectId: input.projectId,
        eventType: input.eventType,
        timestamp: input.timestamp,
      });

      // TODO: Implement real-time event processing
      // For now, just acknowledge the webhook
      return {
        success: true,
        message: 'Webhook received',
      };
    }),
});
