import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import {
  createConversation,
  getOrCreateConversation,
  addMessage,
  getRecentMessages,
  getUserConversations,
  deleteConversation,
} from "./conversationMemory";
import { 
  addToKnowledgeBase,
  searchKnowledgeBase,
  buildRAGContext,
} from "./rag";

describe("Chatbot Memory & RAG System", () => {
  let testUserId: number;
  let testConversationId: number;

  beforeAll(async () => {
    // Create test user
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [user] = await db
      .insert(await import("../drizzle/schema").then(m => m.users))
      .values({
        openId: `test-${Date.now()}`,
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        loginMethod: "google",
      })
      .$returningId();

    testUserId = user.id;
  });

  afterAll(async () => {
    // Cleanup test data
    const db = await getDb();
    if (!db) return;

    const { users, conversations, messages, knowledgeBase } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    // Delete test conversations and messages
    if (testConversationId) {
      await db.delete(messages).where(eq(messages.conversationId, testConversationId));
      await db.delete(conversations).where(eq(conversations.id, testConversationId));
    }

    // Delete test user
    await db.delete(users).where(eq(users.id, testUserId));

    // Delete test knowledge base entries
    await db.delete(knowledgeBase).where(eq(knowledgeBase.category, "test"));
  });

  describe("Conversation Memory", () => {
    it("should create a new conversation", async () => {
      const conversation = await createConversation(testUserId, "Test Conversation");
      expect(conversation).toBeDefined();
      expect(conversation.userId).toBe(testUserId);
      expect(conversation.title).toBe("Test Conversation");
      testConversationId = conversation.id;
    });

    it("should get or create conversation (get existing)", async () => {
      const conversationId = await getOrCreateConversation(testUserId);
      expect(conversationId).toBe(testConversationId);
    });

    it("should add messages to conversation", async () => {
      await addMessage(testConversationId, "user", "Ahoj, jak se máš?");
      await addMessage(testConversationId, "assistant", "Ahoj! Mám se skvěle, děkuji. Jak ti mohu pomoci?");

      const messages = await getRecentMessages(testConversationId, 10);
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("user");
      expect(messages[1].role).toBe("assistant");
    });

    it("should get recent messages with limit", async () => {
      const messages = await getRecentMessages(testConversationId, 1);
      expect(messages).toHaveLength(1);
      expect(messages[0].role).toBe("assistant");
    });

    it("should get user conversations", async () => {
      const conversations = await getUserConversations(testUserId);
      expect(conversations.length).toBeGreaterThan(0);
      expect(conversations[0].userId).toBe(testUserId);
    });

    it("should delete conversation", async () => {
      await deleteConversation(testConversationId);
      const conversations = await getUserConversations(testUserId);
      expect(conversations.find(c => c.id === testConversationId)).toBeUndefined();
    });
  });

  describe("RAG System", () => {
    let testKnowledgeId: number;

    it("should add content to knowledge base", async () => {
      const entry = await addToKnowledgeBase({
        title: "Test Symbol - Květ života",
        content: "Květ života je posvátný geometrický symbol skládající se z překrývajících se kruhů. Představuje jednotu všeho stvoření.",
        category: "test",
        url: "/test/kvet-zivota",
      });

      expect(entry).toBeDefined();
      expect(entry.title).toBe("Test Symbol - Květ života");
      testKnowledgeId = entry.id;
    });

    it("should search knowledge base", async () => {
      // Add more test content
      await addToKnowledgeBase({
        title: "Test Symbol - Mandala",
        content: "Mandala je kruhový symbol používaný v meditaci a duchovních praktikách. Představuje vesmír a celistvost.",
        category: "test",
        url: "/test/mandala",
      });

      const results = await searchKnowledgeBase("geometrický symbol", 2);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain("Květ života");
    });

    it("should build RAG context", async () => {
      const results = await searchKnowledgeBase("meditace", 2);
      const context = buildRAGContext(results);

      expect(context).toBeDefined();
      expect(context).toContain("DATABÁZE ZNALOSTÍ");
      expect(context).toContain("Mandala");
    });

    it("should handle empty search results", async () => {
      const results = await searchKnowledgeBase("nonexistent query xyz123", 2);
      const context = buildRAGContext(results);

      // Should return empty string or minimal context
      expect(typeof context).toBe("string");
    });
  });

  describe("Integration Test", () => {
    it("should create conversation, add messages with RAG metadata", async () => {
      // Create new conversation
      const conversation = await createConversation(testUserId, "RAG Test");
      
      // Add user message
      await addMessage(conversation.id, "user", "Co je to Květ života?");

      // Search knowledge base
      const ragResults = await searchKnowledgeBase("Květ života", 2);
      
      // Add assistant message with RAG metadata
      await addMessage(
        conversation.id,
        "assistant",
        "Květ života je posvátný geometrický symbol...",
        {
          ragSources: ragResults.map(r => ({ title: r.title, url: r.url })),
          model: "gpt-4",
        }
      );

      // Verify messages
      const messages = await getRecentMessages(conversation.id, 10);
      expect(messages).toHaveLength(2);
      
      const assistantMessage = messages.find(m => m.role === "assistant");
      expect(assistantMessage).toBeDefined();
      expect(assistantMessage!.metadata).toBeDefined();

      // Cleanup
      await deleteConversation(conversation.id);
    });
  });
});
