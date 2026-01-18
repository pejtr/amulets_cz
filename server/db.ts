import { eq, and, gte, lte, sql, desc, sum, avg, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, chatbotVariants, chatbotSessions, chatbotMessages, chatbotEvents, chatbotDailyStats, chatbotConversions, chatbotTickets, chatbotTicketResponses } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ============================================
// CHATBOT A/B TESTING HELPERS
// ============================================

// Get random variant based on weights
export async function getRandomChatbotVariant() {
  const db = await getDb();
  if (!db) return null;
  
  const variants = await db.select().from(chatbotVariants).where(eq(chatbotVariants.isActive, true));
  
  if (variants.length === 0) return null;
  
  // Calculate total weight
  const totalWeight = variants.reduce((s, v) => s + v.weight, 0);
  
  // Random selection based on weight
  let random = Math.random() * totalWeight;
  for (const variant of variants) {
    random -= variant.weight;
    if (random <= 0) return variant;
  }
  
  return variants[0];
}

// Get variant by key
export async function getChatbotVariantByKey(variantKey: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [variant] = await db.select().from(chatbotVariants).where(eq(chatbotVariants.variantKey, variantKey));
  return variant;
}

// Get all variants
export async function getAllChatbotVariants() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(chatbotVariants).orderBy(chatbotVariants.id);
}

// Create new session
export async function createChatbotSession(data: {
  sessionId: string;
  visitorId: string;
  variantId: number;
  userId?: number;
  sourcePage?: string;
  referrer?: string;
  device?: string;
  browser?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(chatbotSessions).values(data);
  return result;
}

// Update session
export async function updateChatbotSession(sessionId: string, data: Partial<{
  endedAt: Date;
  duration: number;
  messageCount: number;
  userMessageCount: number;
  botMessageCount: number;
  categoryClicks: number;
  questionClicks: number;
  converted: boolean;
  conversionType: string;
  conversionValue: string;
  overallSentiment: string;
  satisfactionScore: number;
  status: string;
}>) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(chatbotSessions).set(data).where(eq(chatbotSessions.sessionId, sessionId));
}

// Add message to session
export async function addChatbotMessage(data: {
  sessionId: number;
  variantId: number;
  role: string;
  content: string;
  responseTime?: number;
  tokenCount?: number;
  clickedCategory?: string;
  clickedQuestion?: string;
  sentiment?: string;
  intent?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(chatbotMessages).values(data);
  return result;
}

// Log event
export async function logChatbotEvent(data: {
  sessionId?: number;
  variantId?: number;
  visitorId: string;
  eventType: string;
  eventData?: string;
  page?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(chatbotEvents).values(data);
  return result;
}

// Get session by sessionId
export async function getChatbotSessionBySessionId(sessionId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [session] = await db.select().from(chatbotSessions).where(eq(chatbotSessions.sessionId, sessionId));
  return session;
}

// Get variant stats for date range
export async function getChatbotVariantStats(variantId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return null;
  
  const stats = await db.select({
    totalSessions: count(chatbotSessions.id),
    totalMessages: sum(chatbotSessions.messageCount),
    avgDuration: avg(chatbotSessions.duration),
    totalConversions: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END)`,
    conversionRate: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100`,
  })
  .from(chatbotSessions)
  .where(and(
    eq(chatbotSessions.variantId, variantId),
    gte(chatbotSessions.startedAt, startDate),
    lte(chatbotSessions.startedAt, endDate)
  ));
  
  return stats[0];
}

// Get all variants comparison stats
export async function getChatbotComparisonStats(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  // Extend endDate to include the entire day (add 1 day)
  const endDateExtended = new Date(endDate);
  endDateExtended.setDate(endDateExtended.getDate() + 1);
  
  const stats = await db.select({
    variantId: chatbotSessions.variantId,
    variantKey: chatbotVariants.variantKey,
    variantName: chatbotVariants.name,
    totalSessions: count(chatbotSessions.id),
    totalMessages: sum(chatbotSessions.messageCount),
    avgDuration: avg(chatbotSessions.duration),
    avgMessages: avg(chatbotSessions.messageCount),
    totalConversions: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END)`,
    conversionRate: sql<number>`ROUND(SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2)`,
    totalConversionValue: sum(chatbotSessions.conversionValue),
  })
  .from(chatbotSessions)
  .innerJoin(chatbotVariants, eq(chatbotSessions.variantId, chatbotVariants.id))
  .where(and(
    gte(chatbotSessions.startedAt, startDate),
    lte(chatbotSessions.startedAt, endDateExtended)
  ))
  .groupBy(chatbotSessions.variantId, chatbotVariants.variantKey, chatbotVariants.name);
  
  return stats;
}

// Get daily stats for a variant
export async function getChatbotDailyStats(variantId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return db.select()
    .from(chatbotDailyStats)
    .where(and(
      eq(chatbotDailyStats.variantId, variantId),
      gte(chatbotDailyStats.date, startDate)
    ))
    .orderBy(desc(chatbotDailyStats.date));
}


// ============================================
// CHATBOT CONVERSION TRACKING HELPERS
// ============================================

// Track a conversion event
export async function trackChatbotConversion(data: {
  sessionId?: number;
  variantId: number;
  visitorId: string;
  conversionType: 'email_capture' | 'whatsapp_click' | 'affiliate_click' | 'purchase' | 'newsletter';
  conversionSubtype?: string;
  conversionValue?: string;
  currency?: string;
  productId?: string;
  productName?: string;
  affiliatePartner?: string;
  referralUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(chatbotConversions).values({
    sessionId: data.sessionId,
    variantId: data.variantId,
    visitorId: data.visitorId,
    conversionType: data.conversionType,
    conversionSubtype: data.conversionSubtype,
    conversionValue: data.conversionValue,
    currency: data.currency || 'CZK',
    productId: data.productId,
    productName: data.productName,
    affiliatePartner: data.affiliatePartner,
    referralUrl: data.referralUrl,
    metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
  });
  
  // Also update session converted flag
  if (data.sessionId) {
    const session = await db.select().from(chatbotSessions).where(eq(chatbotSessions.id, data.sessionId)).limit(1);
    if (session.length > 0) {
      await db.update(chatbotSessions).set({
        converted: true,
        conversionType: data.conversionType,
        conversionValue: data.conversionValue,
      }).where(eq(chatbotSessions.id, data.sessionId));
    }
  }
  
  return result;
}

// Get conversion stats by variant
export async function getChatbotConversionStats(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  // Extend endDate to include the entire day (add 1 day)
  const endDateExtended = new Date(endDate);
  endDateExtended.setDate(endDateExtended.getDate() + 1);
  
  const stats = await db.select({
    variantId: chatbotConversions.variantId,
    variantKey: chatbotVariants.variantKey,
    variantName: chatbotVariants.name,
    conversionType: chatbotConversions.conversionType,
    totalConversions: count(chatbotConversions.id),
    totalValue: sum(chatbotConversions.conversionValue),
  })
  .from(chatbotConversions)
  .innerJoin(chatbotVariants, eq(chatbotConversions.variantId, chatbotVariants.id))
  .where(and(
    gte(chatbotConversions.createdAt, startDate),
    lte(chatbotConversions.createdAt, endDateExtended)
  ))
  .groupBy(chatbotConversions.variantId, chatbotVariants.variantKey, chatbotVariants.name, chatbotConversions.conversionType);
  
  return stats;
}

// Get affiliate click stats
export async function getChatbotAffiliateStats(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  // Extend endDate to include the entire day (add 1 day)
  const endDateExtended = new Date(endDate);
  endDateExtended.setDate(endDateExtended.getDate() + 1);
  
  const stats = await db.select({
    variantId: chatbotConversions.variantId,
    variantKey: chatbotVariants.variantKey,
    variantName: chatbotVariants.name,
    affiliatePartner: chatbotConversions.affiliatePartner,
    totalClicks: count(chatbotConversions.id),
    totalValue: sum(chatbotConversions.conversionValue),
  })
  .from(chatbotConversions)
  .innerJoin(chatbotVariants, eq(chatbotConversions.variantId, chatbotVariants.id))
  .where(and(
    eq(chatbotConversions.conversionType, 'affiliate_click'),
    gte(chatbotConversions.createdAt, startDate),
    lte(chatbotConversions.createdAt, endDateExtended)
  ))
  .groupBy(chatbotConversions.variantId, chatbotVariants.variantKey, chatbotVariants.name, chatbotConversions.affiliatePartner);
  
  return stats;
}

// Get all conversions for a session
export async function getChatbotSessionConversions(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(chatbotConversions)
    .where(eq(chatbotConversions.sessionId, sessionId))
    .orderBy(desc(chatbotConversions.createdAt));
}

// Get conversion funnel data
export async function getChatbotConversionFunnel(variantId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return null;
  
  // Extend endDate to include the entire day (add 1 day)
  const endDateExtended = new Date(endDate);
  endDateExtended.setDate(endDateExtended.getDate() + 1);
  
  // Get total sessions
  const [sessionsResult] = await db.select({
    total: count(chatbotSessions.id),
  })
  .from(chatbotSessions)
  .where(and(
    eq(chatbotSessions.variantId, variantId),
    gte(chatbotSessions.startedAt, startDate),
    lte(chatbotSessions.startedAt, endDateExtended)
  ));
  
  // Get sessions with messages
  const [engagedResult] = await db.select({
    total: count(chatbotSessions.id),
  })
  .from(chatbotSessions)
  .where(and(
    eq(chatbotSessions.variantId, variantId),
    gte(chatbotSessions.startedAt, startDate),
    lte(chatbotSessions.startedAt, endDateExtended),
    gte(chatbotSessions.userMessageCount, 1)
  ));
  
  // Get conversions by type
  const conversionsByType = await db.select({
    conversionType: chatbotConversions.conversionType,
    total: count(chatbotConversions.id),
  })
  .from(chatbotConversions)
  .where(and(
    eq(chatbotConversions.variantId, variantId),
    gte(chatbotConversions.createdAt, startDate),
    lte(chatbotConversions.createdAt, endDateExtended)
  ))
  .groupBy(chatbotConversions.conversionType);
  
  return {
    totalSessions: sessionsResult?.total || 0,
    engagedSessions: engagedResult?.total || 0,
    conversions: conversionsByType,
  };
}


// ============================================
// OFFLINE TICKET SYSTEM HELPERS
// ============================================

// Create a new ticket
export async function createChatbotTicket(data: {
  visitorId: string;
  variantId?: number;
  sessionId?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  conversationHistory?: string;
  sourcePage?: string;
  device?: string;
  browser?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(chatbotTickets).values({
    visitorId: data.visitorId,
    variantId: data.variantId,
    sessionId: data.sessionId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    conversationHistory: data.conversationHistory,
    sourcePage: data.sourcePage,
    device: data.device,
    browser: data.browser,
    status: 'pending',
    priority: 'normal',
  });
  
  return result;
}

// Get ticket by ID
export async function getChatbotTicketById(ticketId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [ticket] = await db.select().from(chatbotTickets).where(eq(chatbotTickets.id, ticketId));
  return ticket;
}

// Get pending tickets
export async function getPendingChatbotTickets() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(chatbotTickets)
    .where(eq(chatbotTickets.status, 'pending'))
    .orderBy(desc(chatbotTickets.createdAt));
}

// Update ticket status
export async function updateChatbotTicketStatus(ticketId: number, status: 'pending' | 'processing' | 'answered' | 'closed') {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.update(chatbotTickets)
    .set({ status })
    .where(eq(chatbotTickets.id, ticketId));
  
  return result;
}

// Add response to ticket
export async function addChatbotTicketResponse(data: {
  ticketId: number;
  responseType: 'email' | 'chat' | 'internal_note';
  content: string;
  senderType: 'ai' | 'operator' | 'customer';
  senderName?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(chatbotTicketResponses).values({
    ticketId: data.ticketId,
    responseType: data.responseType,
    content: data.content,
    senderType: data.senderType,
    senderName: data.senderName,
    emailSent: false,
  });
  
  return result;
}

// Mark ticket as answered with response
export async function answerChatbotTicket(ticketId: number, response: string, respondedBy: string = 'ai') {
  const db = await getDb();
  if (!db) return null;
  
  // Update ticket
  await db.update(chatbotTickets)
    .set({
      status: 'answered',
      response,
      respondedAt: new Date(),
      respondedBy,
    })
    .where(eq(chatbotTickets.id, ticketId));
  
  // Add response record
  await addChatbotTicketResponse({
    ticketId,
    responseType: 'email',
    content: response,
    senderType: respondedBy === 'ai' ? 'ai' : 'operator',
    senderName: respondedBy,
  });
  
  return true;
}

// Get ticket responses
export async function getChatbotTicketResponses(ticketId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(chatbotTicketResponses)
    .where(eq(chatbotTicketResponses.ticketId, ticketId))
    .orderBy(chatbotTicketResponses.createdAt);
}

// Get tickets by visitor
export async function getChatbotTicketsByVisitor(visitorId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(chatbotTickets)
    .where(eq(chatbotTickets.visitorId, visitorId))
    .orderBy(desc(chatbotTickets.createdAt));
}

// Get all tickets with filters (admin)
export async function getAllChatbotTickets(status: 'pending' | 'answered' | 'all' = 'all', limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return { tickets: [], total: 0 };
  
  let query = db.select().from(chatbotTickets);
  
  if (status !== 'all') {
    query = query.where(eq(chatbotTickets.status, status)) as typeof query;
  }
  
  const tickets = await query
    .orderBy(desc(chatbotTickets.createdAt))
    .limit(limit)
    .offset(offset);
  
  // Get total count
  const countQuery = status !== 'all' 
    ? db.select().from(chatbotTickets).where(eq(chatbotTickets.status, status))
    : db.select().from(chatbotTickets);
  const allTickets = await countQuery;
  
  return { tickets, total: allTickets.length };
}

// Mark email as sent
export async function markTicketEmailSent(responseId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.update(chatbotTicketResponses)
    .set({
      emailSent: true,
      emailSentAt: new Date(),
    })
    .where(eq(chatbotTicketResponses.id, responseId));
  
  return result;
}
