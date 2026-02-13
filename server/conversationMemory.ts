import { getDb } from "./db";
import { conversations, messages, type Conversation, type Message } from "../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

/**
 * Create a new conversation for a user
 */
export async function createConversation(userId: number, title?: string): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(conversations).values({
    userId,
    title: title || "Nová konverzace",
    messageCount: 0,
  });

  return result[0].insertId;
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId: number): Promise<Conversation | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  return result[0] || null;
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: number, limit: number = 20): Promise<Conversation[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.lastMessageAt))
    .limit(limit);
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  conversationId: number,
  role: "user" | "assistant" | "system",
  content: string,
  metadata?: Record<string, any>
): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Insert message
  const result = await db.insert(messages).values({
    conversationId,
    role,
    content,
    metadata: metadata ? JSON.stringify(metadata) : null,
  });

  // Update conversation stats
  await db
    .update(conversations)
    .set({
      messageCount: sql`${conversations.messageCount} + 1`,
      lastMessageAt: new Date(),
    })
    .where(eq(conversations.id, conversationId));

  return result[0].insertId;
}

/**
 * Get messages from a conversation
 */
export async function getConversationMessages(
  conversationId: number,
  limit?: number
): Promise<Message[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  if (limit) {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt)
      .limit(limit);
  }

  return await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

/**
 * Get recent messages from a conversation (for context window)
 */
export async function getRecentMessages(
  conversationId: number,
  count: number = 10
): Promise<Array<{ role: string; content: string }>> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const recentMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(count);

  // Reverse to get chronological order
  return recentMessages.reverse().map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(
  conversationId: number,
  title: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(conversations)
    .set({ title })
    .where(eq(conversations.id, conversationId));
}

/**
 * Update conversation summary
 */
export async function updateConversationSummary(
  conversationId: number,
  summary: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(conversations)
    .set({ summary })
    .where(eq(conversations.id, conversationId));
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(conversationId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Messages will be automatically deleted due to CASCADE
  await db.delete(conversations).where(eq(conversations.id, conversationId));
}

/**
 * Get or create a conversation for a user
 * If user has an active conversation (less than 24 hours old), return it
 * Otherwise, create a new one
 */
export async function getOrCreateConversation(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check for recent conversation (within 24 hours)
  const recentConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.lastMessageAt))
    .limit(1);

  if (recentConversations.length > 0) {
    const lastConversation = recentConversations[0];
    const hoursSinceLastMessage =
      (Date.now() - new Date(lastConversation.lastMessageAt).getTime()) / (1000 * 60 * 60);

    // If last message was within 24 hours, continue the conversation
    if (hoursSinceLastMessage < 24) {
      return lastConversation.id;
    }
  }

  // Create new conversation
  return await createConversation(userId);
}
