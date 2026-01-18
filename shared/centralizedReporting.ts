/**
 * Centralized Reporting System Types
 * Unified format pro reporting ze všech projektů
 */

export interface ProjectStats {
  projectId: string;
  projectName: string;
  date: string; // ISO date string
  
  // Traffic metrics
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  avgSessionDuration: number; // seconds
  bounceRate: number; // percentage
  
  // Chatbot metrics (if applicable)
  chatSessions?: number;
  chatMessages?: number;
  chatConversions?: number;
  
  // Conversion metrics
  emailCaptures?: number;
  affiliateClicks?: number;
  purchases?: number;
  revenue?: number; // in CZK
  
  // Top pages
  topPages?: Array<{
    path: string;
    views: number;
  }>;
  
  // User demographics (if available)
  topCountries?: Array<{
    country: string;
    visitors: number;
  }>;
  
  // Custom events (project-specific)
  customEvents?: Record<string, number>;
}

export interface CentralizedReport {
  reportDate: string; // ISO date string
  generatedAt: string; // ISO timestamp
  projects: ProjectStats[];
  
  // Aggregated totals
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    chatSessions: number;
    chatMessages: number;
    conversions: number;
    revenue: number;
  };
}

/**
 * Webhook payload for real-time updates
 */
export interface ReportingWebhookPayload {
  projectId: string;
  eventType: 'page_view' | 'chat_session' | 'conversion' | 'purchase' | 'custom';
  timestamp: string; // ISO timestamp
  data: Record<string, any>;
  apiKey: string; // For authentication
}

/**
 * API Response format
 */
export interface CentralizedReportingResponse {
  success: boolean;
  data?: CentralizedReport;
  error?: string;
}
