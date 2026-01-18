import { eq, and, gte, lte, sql, desc, sum, avg, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, chatbotVariants, chatbotSessions, chatbotMessages, chatbotEvents, chatbotDailyStats } from "../drizzle/schema";
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
    lte(chatbotSessions.startedAt, endDate)
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
