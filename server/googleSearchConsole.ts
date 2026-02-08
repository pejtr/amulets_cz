/**
 * Google Search Console API Integration
 * 
 * Provides organic CTR data from Google Search for A/B test evaluation.
 * Requires GSC_SERVICE_ACCOUNT_EMAIL and GSC_PRIVATE_KEY env vars.
 * 
 * When GSC is not configured, falls back to internal tracking data.
 */

interface GSCPerformanceRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCQueryResult {
  rows: GSCPerformanceRow[];
  responseAggregationType: string;
}

interface PagePerformance {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCConfig {
  serviceAccountEmail: string;
  privateKey: string;
  siteUrl: string;
}

/**
 * Check if GSC is configured
 */
export function isGSCConfigured(): boolean {
  const email = process.env.GSC_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GSC_PRIVATE_KEY;
  const site = process.env.GSC_SITE_URL;
  return !!(email && key && site);
}

/**
 * Get GSC configuration from environment
 */
function getGSCConfig(): GSCConfig | null {
  const email = process.env.GSC_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GSC_PRIVATE_KEY;
  const site = process.env.GSC_SITE_URL;
  
  if (!email || !key || !site) return null;
  
  return {
    serviceAccountEmail: email,
    privateKey: key.replace(/\\n/g, '\n'),
    siteUrl: site,
  };
}

/**
 * Generate a JWT token for Google API authentication
 */
async function getAccessToken(config: GSCConfig): Promise<string> {
  // Use jose for JWT signing (already in project dependencies)
  const { SignJWT, importPKCS8 } = await import("jose");
  
  const now = Math.floor(Date.now() / 1000);
  const privateKey = await importPKCS8(config.privateKey, "RS256");
  
  const jwt = await new SignJWT({
    iss: config.serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(privateKey);

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`GSC Auth failed: ${error}`);
  }

  const tokenData = await tokenResponse.json() as { access_token: string };
  return tokenData.access_token;
}

// Cache access token
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getCachedAccessToken(config: GSCConfig): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }
  
  const token = await getAccessToken(config);
  cachedToken = { token, expiresAt: now + 3500000 }; // ~58 min
  return token;
}

/**
 * Query GSC Search Analytics API for page performance data
 */
export async function getPagePerformance(
  pagePaths: string[],
  startDate: string, // YYYY-MM-DD
  endDate: string,   // YYYY-MM-DD
): Promise<PagePerformance[]> {
  const config = getGSCConfig();
  if (!config) {
    console.log("[GSC] Not configured, returning empty results");
    return [];
  }

  try {
    const accessToken = await getCachedAccessToken(config);
    
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ["page"],
          dimensionFilterGroups: pagePaths.length > 0 ? [{
            groupType: "and",
            filters: [{
              dimension: "page",
              operator: "includingRegex",
              expression: pagePaths.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|"),
            }],
          }] : undefined,
          rowLimit: 1000,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GSC API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as GSCQueryResult;
    
    if (!data.rows || data.rows.length === 0) {
      return [];
    }

    return data.rows.map(row => ({
      page: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr * 100, // Convert to percentage
      position: row.position,
    }));
  } catch (error) {
    console.error("[GSC] Error fetching performance data:", error);
    throw error;
  }
}

/**
 * Get top performing pages by organic traffic
 */
export async function getTopPages(
  limit: number = 20,
  days: number = 28,
): Promise<PagePerformance[]> {
  const config = getGSCConfig();
  if (!config) {
    return [];
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const accessToken = await getCachedAccessToken(config);
    
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          dimensions: ["page"],
          rowLimit: limit,
          // GSC returns sorted by clicks desc by default
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GSC API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as GSCQueryResult;
    
    if (!data.rows) return [];

    return data.rows
      .map(row => ({
        page: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr * 100,
        position: row.position,
      }))
      .sort((a, b) => b.impressions - a.impressions);
  } catch (error) {
    console.error("[GSC] Error fetching top pages:", error);
    throw error;
  }
}

/**
 * Get CTR data for specific article URLs (for A/B test evaluation)
 */
export async function getArticleCTRData(
  articleSlugs: string[],
  siteBaseUrl: string,
  days: number = 14,
): Promise<Map<string, { clicks: number; impressions: number; ctr: number; position: number }>> {
  const result = new Map<string, { clicks: number; impressions: number; ctr: number; position: number }>();
  
  const config = getGSCConfig();
  if (!config) {
    return result;
  }

  // Build page paths from slugs
  const pagePaths = articleSlugs.map(slug => {
    if (slug.includes("/")) return slug;
    return `${siteBaseUrl}/magazin/${slug}`;
  });

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const pages = await getPagePerformance(
      pagePaths,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    );

    for (const page of pages) {
      // Extract slug from URL
      const urlParts = page.page.split("/");
      const slug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      
      result.set(slug, {
        clicks: page.clicks,
        impressions: page.impressions,
        ctr: page.ctr,
        position: page.position,
      });
    }
  } catch (error) {
    console.error("[GSC] Error fetching article CTR data:", error);
  }

  return result;
}

/**
 * Get GSC status info for admin dashboard
 */
export function getGSCStatus(): {
  configured: boolean;
  siteUrl: string | null;
  serviceAccount: string | null;
} {
  const config = getGSCConfig();
  return {
    configured: !!config,
    siteUrl: config?.siteUrl || null,
    serviceAccount: config?.serviceAccountEmail || null,
  };
}
