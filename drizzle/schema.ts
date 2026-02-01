import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, date, time, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Shared User Profiles
export const sharedUserProfiles = mysqlTable("shared_user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  personalityType: varchar("personalityType", { length: 50 }),
  interests: text("interests"),
  purchaseHistory: text("purchaseHistory"),
  preferredProducts: text("preferredProducts"),
  communicationStyle: varchar("communicationStyle", { length: 50 }),
  engagementLevel: varchar("engagementLevel", { length: 20 }),
  lastInteractionProject: varchar("lastInteractionProject", { length: 50 }),
  crossProjectScore: int("crossProjectScore").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SharedUserProfile = typeof sharedUserProfiles.$inferSelect;
export type InsertSharedUserProfile = typeof sharedUserProfiles.$inferInsert;

// Offline Messages - zprávy poslané mimo pracovní dobu
export const offlineMessages = mysqlTable("offline_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }), // nullable - může být i nepřihlášený uživatel
  email: varchar("email", { length: 320 }), // email uživatele pokud ho zadal
  message: text("message").notNull(), // obsah zprávy
  conversationHistory: json("conversationHistory"), // historie konverzace pro kontext
  browsingContext: json("browsingContext"), // kontext prohlížení (stránka, referrer, atd.)
  isRead: boolean("isRead").default(false).notNull(), // zda byla zpráva přečtena adminem
  readAt: timestamp("readAt"), // kdy byla zpráva přečtena
  readBy: int("readBy").references(() => users.id, { onDelete: "set null" }), // kdo zprávu přečetl
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OfflineMessage = typeof offlineMessages.$inferSelect;
export type InsertOfflineMessage = typeof offlineMessages.$inferInsert;

// User Interactions
export const userInteractions = mysqlTable("user_interactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectName: varchar("projectName", { length: 50 }).notNull(),
  interactionType: varchar("interactionType", { length: 50 }).notNull(),
  content: text("content"),
  sentiment: varchar("sentiment", { length: 20 }),
  category: varchar("category", { length: 50 }),
  duration: int("duration"),
  result: varchar("result", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserInteraction = typeof userInteractions.$inferSelect;
export type InsertUserInteraction = typeof userInteractions.$inferInsert;

// E-book Downloads - lead magnet tracking
export const ebookDownloads = mysqlTable("ebook_downloads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  ebookType: varchar("ebookType", { length: 100 }).notNull().default("7-kroku-k-rovnovaze"),
  sourcePage: varchar("sourcePage", { length: 500 }),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  ctaVariant: varchar("ctaVariant", { length: 50 }), // pro exit-intent personalizaci
  emailSent: boolean("emailSent").default(false).notNull(),
  emailSentAt: timestamp("emailSentAt"),
  convertedToClient: boolean("convertedToClient").default(false).notNull(),
  conversionDate: timestamp("conversionDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EbookDownload = typeof ebookDownloads.$inferSelect;
export type InsertEbookDownload = typeof ebookDownloads.$inferInsert;

// ============================================
// CHATBOT CONVERSATIONS & MEMORY
// ============================================

// Conversations - perzistentní konverzace pro přihlášené uživatele
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  summary: text("summary"),
  messageCount: int("messageCount").default(0).notNull(),
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Messages - zprávy v konverzacích
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  metadata: text("metadata"), // JSON string for additional data (RAG sources, etc.)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Knowledge Base - vektorová databáze pro RAG
export const knowledgeBase = mysqlTable("knowledge_base", {
  id: int("id").autoincrement().primaryKey(),
  contentType: varchar("contentType", { length: 50 }).notNull(), // 'symbol', 'stone', 'product', 'article', 'faq'
  contentId: varchar("contentId", { length: 100 }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  url: varchar("url", { length: 500 }),
  embedding: text("embedding"), // JSON array of floats
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = typeof knowledgeBase.$inferInsert;

// ============================================
// CHATBOT A/B TESTING TABLES
// ============================================

// Chatbot Variants - 4 verze Natalie
export const chatbotVariants = mysqlTable("chatbot_variants", {
  id: int("id").autoincrement().primaryKey(),
  variantKey: varchar("variantKey", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  personalityPrompt: text("personalityPrompt").notNull(),
  initialMessage: text("initialMessage").notNull(),
  colorScheme: varchar("colorScheme", { length: 50 }),
  targetAudience: varchar("targetAudience", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  weight: int("weight").default(25).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatbotVariant = typeof chatbotVariants.$inferSelect;
export type InsertChatbotVariant = typeof chatbotVariants.$inferInsert;

// Chatbot Sessions
export const chatbotSessions = mysqlTable("chatbot_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  variantId: int("variantId").notNull().references(() => chatbotVariants.id),
  userId: int("userId").references(() => users.id),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
  duration: int("duration"),
  sourcePage: varchar("sourcePage", { length: 500 }),
  referrer: varchar("referrer", { length: 500 }),
  device: varchar("device", { length: 50 }),
  browser: varchar("browser", { length: 100 }),
  messageCount: int("messageCount").default(0).notNull(),
  userMessageCount: int("userMessageCount").default(0).notNull(),
  botMessageCount: int("botMessageCount").default(0).notNull(),
  categoryClicks: int("categoryClicks").default(0).notNull(),
  questionClicks: int("questionClicks").default(0).notNull(),
  converted: boolean("converted").default(false).notNull(),
  conversionType: varchar("conversionType", { length: 50 }),
  conversionValue: decimal("conversionValue", { precision: 10, scale: 2 }),
  overallSentiment: varchar("overallSentiment", { length: 20 }),
  satisfactionScore: int("satisfactionScore"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatbotSession = typeof chatbotSessions.$inferSelect;
export type InsertChatbotSession = typeof chatbotSessions.$inferInsert;

// Chatbot Messages
export const chatbotMessages = mysqlTable("chatbot_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().references(() => chatbotSessions.id, { onDelete: "cascade" }),
  variantId: int("variantId").notNull().references(() => chatbotVariants.id),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  responseTime: int("responseTime"),
  tokenCount: int("tokenCount"),
  clickedCategory: varchar("clickedCategory", { length: 50 }),
  clickedQuestion: varchar("clickedQuestion", { length: 200 }),
  sentiment: varchar("sentiment", { length: 20 }),
  intent: varchar("intent", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatbotMessage = typeof chatbotMessages.$inferSelect;
export type InsertChatbotMessage = typeof chatbotMessages.$inferInsert;

// Chatbot Events
export const chatbotEvents = mysqlTable("chatbot_events", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").references(() => chatbotSessions.id, { onDelete: "cascade" }),
  variantId: int("variantId").references(() => chatbotVariants.id),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(),
  eventData: text("eventData"),
  page: varchar("page", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatbotEvent = typeof chatbotEvents.$inferSelect;
export type InsertChatbotEvent = typeof chatbotEvents.$inferInsert;

// Chatbot Daily Stats
export const chatbotDailyStats = mysqlTable("chatbot_daily_stats", {
  id: int("id").autoincrement().primaryKey(),
  variantId: int("variantId").notNull().references(() => chatbotVariants.id),
  date: timestamp("date").notNull(),
  totalSessions: int("totalSessions").default(0).notNull(),
  totalMessages: int("totalMessages").default(0).notNull(),
  totalUserMessages: int("totalUserMessages").default(0).notNull(),
  totalBotMessages: int("totalBotMessages").default(0).notNull(),
  avgSessionDuration: int("avgSessionDuration").default(0).notNull(),
  avgMessagesPerSession: decimal("avgMessagesPerSession", { precision: 5, scale: 2 }).default("0"),
  totalCategoryClicks: int("totalCategoryClicks").default(0).notNull(),
  totalQuestionClicks: int("totalQuestionClicks").default(0).notNull(),
  totalConversions: int("totalConversions").default(0).notNull(),
  totalConversionValue: decimal("totalConversionValue", { precision: 12, scale: 2 }).default("0"),
  conversionRate: decimal("conversionRate", { precision: 5, scale: 4 }).default("0"),
  totalBounces: int("totalBounces").default(0).notNull(),
  bounceRate: decimal("bounceRate", { precision: 5, scale: 4 }).default("0"),
  positiveSentimentCount: int("positiveSentimentCount").default(0).notNull(),
  negativeSentimentCount: int("negativeSentimentCount").default(0).notNull(),
  neutralSentimentCount: int("neutralSentimentCount").default(0).notNull(),
  avgSatisfactionScore: decimal("avgSatisfactionScore", { precision: 3, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatbotDailyStat = typeof chatbotDailyStats.$inferSelect;
export type InsertChatbotDailyStat = typeof chatbotDailyStats.$inferInsert;

// ============================================
// CHATBOT CONVERSION TYPES
// ============================================

// Chatbot Conversions - Detailed tracking of conversion events
export const chatbotConversions = mysqlTable("chatbot_conversions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").references(() => chatbotSessions.id, { onDelete: "cascade" }),
  variantId: int("variantId").notNull().references(() => chatbotVariants.id),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  conversionType: varchar("conversionType", { length: 50 }).notNull(), // email_capture, whatsapp_click, affiliate_click, purchase
  conversionSubtype: varchar("conversionSubtype", { length: 100 }), // e.g., 'ohorai_affiliate', 'irisimo_affiliate', 'newsletter'
  conversionValue: decimal("conversionValue", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("CZK"),
  productId: varchar("productId", { length: 100 }),
  productName: varchar("productName", { length: 255 }),
  affiliatePartner: varchar("affiliatePartner", { length: 50 }), // 'ohorai', 'irisimo', 'donuterie'
  referralUrl: varchar("referralUrl", { length: 500 }),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatbotConversion = typeof chatbotConversions.$inferSelect;
export type InsertChatbotConversion = typeof chatbotConversions.$inferInsert;

// ============================================
// OFFLINE TICKET SYSTEM
// ============================================

// Offline Tickets - dotazy zanechané mimo pracovní dobu
export const chatbotTickets = mysqlTable("chatbot_tickets", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  variantId: int("variantId").references(() => chatbotVariants.id),
  sessionId: int("sessionId").references(() => chatbotSessions.id),
  
  // Kontaktní údaje
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  
  // Dotaz
  message: text("message").notNull(),
  conversationHistory: text("conversationHistory"), // JSON string s historií konverzace
  
  // Status
  status: mysqlEnum("status", ["pending", "processing", "answered", "closed"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),
  
  // Odpověď
  response: text("response"),
  respondedAt: timestamp("respondedAt"),
  respondedBy: varchar("respondedBy", { length: 100 }), // 'ai' nebo jméno operátora
  
  // Metadata
  sourcePage: varchar("sourcePage", { length: 500 }),
  device: varchar("device", { length: 20 }),
  browser: varchar("browser", { length: 100 }),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatbotTicket = typeof chatbotTickets.$inferSelect;
export type InsertChatbotTicket = typeof chatbotTickets.$inferInsert;

// Ticket Responses - historie odpovědí na ticket
export const chatbotTicketResponses = mysqlTable("chatbot_ticket_responses", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull().references(() => chatbotTickets.id, { onDelete: "cascade" }),
  
  // Odpověď
  responseType: mysqlEnum("responseType", ["email", "chat", "internal_note"]).notNull(),
  content: text("content").notNull(),
  
  // Odesílatel
  senderType: mysqlEnum("senderType", ["ai", "operator", "customer"]).notNull(),
  senderName: varchar("senderName", { length: 100 }),
  
  // Email tracking
  emailSent: boolean("emailSent").default(false),
  emailSentAt: timestamp("emailSentAt"),
  emailOpenedAt: timestamp("emailOpenedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatbotTicketResponse = typeof chatbotTicketResponses.$inferSelect;
export type InsertChatbotTicketResponse = typeof chatbotTicketResponses.$inferInsert;


// ============================================
// DEMAND ANALYSIS & CONTENT INSIGHTS
// ============================================

// Topic Categories - hlavní kategorie témat
export const topicCategories = mysqlTable("topic_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  parentId: int("parentId"), // pro hierarchii kategorií
  icon: varchar("icon", { length: 10 }), // emoji
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TopicCategory = typeof topicCategories.$inferSelect;
export type InsertTopicCategory = typeof topicCategories.$inferInsert;

// Detected Topics - témata extrahovaná z konverzací
export const detectedTopics = mysqlTable("detected_topics", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").references(() => chatbotSessions.id),
  messageId: int("messageId").references(() => chatbotMessages.id),
  
  // Téma
  topic: varchar("topic", { length: 200 }).notNull(),
  categoryId: int("categoryId").references(() => topicCategories.id),
  
  // Analýza
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]).default("neutral"),
  intent: mysqlEnum("intent", ["question", "purchase", "complaint", "feedback", "other"]).default("question"),
  urgency: mysqlEnum("urgency", ["low", "medium", "high"]).default("medium"),
  
  // Produkt/obsah
  relatedProduct: varchar("relatedProduct", { length: 200 }),
  contentGap: boolean("contentGap").default(false), // true pokud nemáme odpověď
  suggestedContent: text("suggestedContent"), // AI návrh na obsah
  
  // Metadata
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // 0.00 - 1.00
  extractedKeywords: text("extractedKeywords"), // JSON array
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DetectedTopic = typeof detectedTopics.$inferSelect;
export type InsertDetectedTopic = typeof detectedTopics.$inferInsert;

// Weekly Demand Reports - týdenní reporty poptávky
export const demandReports = mysqlTable("demand_reports", {
  id: int("id").autoincrement().primaryKey(),
  
  // Období
  reportType: mysqlEnum("reportType", ["daily", "weekly", "monthly"]).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  
  // Statistiky
  totalConversations: int("totalConversations").default(0),
  totalMessages: int("totalMessages").default(0),
  uniqueTopics: int("uniqueTopics").default(0),
  contentGaps: int("contentGaps").default(0),
  
  // Top témata (JSON)
  topTopics: text("topTopics"), // JSON: [{topic, count, trend}]
  topProducts: text("topProducts"), // JSON: [{product, mentions, sentiment}]
  topQuestions: text("topQuestions"), // JSON: [{question, count}]
  
  // Doporučení (AI generované)
  recommendations: text("recommendations"), // JSON: [{priority, type, suggestion, reason}]
  contentSuggestions: text("contentSuggestions"), // JSON: [{title, type, keywords, priority}]
  
  // Status
  status: mysqlEnum("status", ["generating", "ready", "sent", "archived"]).default("generating"),
  sentToTelegram: boolean("sentToTelegram").default(false),
  sentAt: timestamp("sentAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DemandReport = typeof demandReports.$inferSelect;
export type InsertDemandReport = typeof demandReports.$inferInsert;

// Content Suggestions - návrhy na nový obsah
export const contentSuggestions = mysqlTable("content_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").references(() => demandReports.id),
  
  // Návrh
  title: varchar("title", { length: 200 }).notNull(),
  contentType: mysqlEnum("contentType", ["article", "product", "guide", "faq", "video"]).notNull(),
  description: text("description"),
  keywords: text("keywords"), // JSON array
  
  // Priorita a důvod
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  demandScore: int("demandScore").default(0), // počet dotazů na toto téma
  reason: text("reason"), // proč to doporučujeme
  
  // Status implementace
  status: mysqlEnum("status", ["suggested", "approved", "in_progress", "completed", "rejected"]).default("suggested"),
  implementedAt: timestamp("implementedAt"),
  implementedUrl: varchar("implementedUrl", { length: 500 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentSuggestion = typeof contentSuggestions.$inferSelect;
export type InsertContentSuggestion = typeof contentSuggestions.$inferInsert;

// ============================================
// OHORAI SYNCHRONIZACE - Propojené nádoby
// ============================================

// OHORAI Platform Statistics - hodinová synchronizace
export const ohoraiStats = mysqlTable("ohorai_stats", {
  id: int("id").autoincrement().primaryKey(),
  
  // Časové období
  date: timestamp("date").notNull(),
  hour: int("hour").notNull(), // 0-23
  
  // Statistiky chatbota
  totalConversations: int("totalConversations").default(0),
  totalMessages: int("totalMessages").default(0),
  uniqueVisitors: int("uniqueVisitors").default(0),
  
  // Konverze
  emailCaptures: int("emailCaptures").default(0),
  affiliateClicks: int("affiliateClicks").default(0),
  productViews: int("productViews").default(0),
  
  // Engagement
  avgSessionDuration: int("avgSessionDuration").default(0), // v sekundách
  avgMessagesPerSession: int("avgMessagesPerSession").default(0),
  
  // Top témata (JSON)
  topTopics: text("topTopics"),
  
  // Metadata synchronizace
  syncedAt: timestamp("syncedAt").defaultNow().notNull(),
  sourceVersion: varchar("sourceVersion", { length: 50 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OhoraiStats = typeof ohoraiStats.$inferSelect;
export type InsertOhoraiStats = typeof ohoraiStats.$inferInsert;

// OHORAI Sync Log - historie synchronizací
export const ohoraiSyncLog = mysqlTable("ohorai_sync_log", {
  id: int("id").autoincrement().primaryKey(),
  
  syncType: mysqlEnum("syncType", ["hourly", "daily", "manual"]).notNull(),
  status: mysqlEnum("status", ["success", "failed", "partial"]).notNull(),
  
  recordsReceived: int("recordsReceived").default(0),
  recordsProcessed: int("recordsProcessed").default(0),
  
  errorMessage: text("errorMessage"),
  duration: int("duration"), // v ms
  
  syncedAt: timestamp("syncedAt").defaultNow().notNull(),
});

export type OhoraiSyncLog = typeof ohoraiSyncLog.$inferSelect;
export type InsertOhoraiSyncLog = typeof ohoraiSyncLog.$inferInsert;

// Affiliate Campaigns - všechny affiliate kampaně
export const affiliateCampaigns = mysqlTable("affiliate_campaigns", {
  id: varchar("id", { length: 50 }).primaryKey(), // např. 'irisimo', 'cajovnacerny'
  
  name: varchar("name", { length: 100 }).notNull(),
  baseUrl: varchar("baseUrl", { length: 255 }).notNull(),
  aAid: varchar("aAid", { length: 50 }).notNull(),
  aBid: varchar("aBid", { length: 50 }).notNull(),
  
  category: mysqlEnum("category", ["fashion", "jewelry", "lifestyle", "wellness", "food", "other"]).notNull(),
  relevance: mysqlEnum("relevance", ["high", "medium", "low"]).notNull(),
  
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  
  // Statistiky
  totalClicks: int("totalClicks").default(0),
  totalConversions: int("totalConversions").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AffiliateCampaign = typeof affiliateCampaigns.$inferSelect;
export type InsertAffiliateCampaign = typeof affiliateCampaigns.$inferInsert;

// Affiliate Clicks - tracking kliků na affiliate odkazy
export const affiliateClicks = mysqlTable("affiliate_clicks", {
  id: int("id").autoincrement().primaryKey(),
  
  campaignId: varchar("campaignId", { length: 50 }).notNull(),
  targetUrl: varchar("targetUrl", { length: 500 }).notNull(),
  
  // Kontext
  source: mysqlEnum("source", ["chatbot", "product_page", "recommendation", "email"]).notNull(),
  sessionId: varchar("sessionId", { length: 100 }),
  userId: int("userId"),
  
  // Metadata
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  
  clickedAt: timestamp("clickedAt").defaultNow().notNull(),
});

export type AffiliateClick = typeof affiliateClicks.$inferSelect;
export type InsertAffiliateClick = typeof affiliateClicks.$inferInsert;

// ============================================================================
// Centralized Reporting System
// ============================================================================

// Project Stats - denní statistiky z jednotlivých projektů
export const projectStats = mysqlTable("project_stats", {
  id: int("id").autoincrement().primaryKey(),
  
  projectId: varchar("projectId", { length: 50 }).notNull(),
  projectName: varchar("projectName", { length: 100 }).notNull(),
  date: date("date").notNull(),
  
  // Traffic metrics
  pageViews: int("pageViews").default(0).notNull(),
  uniqueVisitors: int("uniqueVisitors").default(0).notNull(),
  sessions: int("sessions").default(0).notNull(),
  avgSessionDuration: int("avgSessionDuration").default(0).notNull(), // seconds
  bounceRate: int("bounceRate").default(0).notNull(), // percentage * 100
  
  // Chatbot metrics
  chatSessions: int("chatSessions").default(0),
  chatMessages: int("chatMessages").default(0),
  chatConversions: int("chatConversions").default(0),
  
  // Conversion metrics
  emailCaptures: int("emailCaptures").default(0),
  affiliateClicks: int("affiliateClicks").default(0),
  purchases: int("purchases").default(0),
  revenue: int("revenue").default(0), // in CZK * 100 (haléře)
  
  // JSON data
  topPages: text("topPages"), // JSON array
  topCountries: text("topCountries"), // JSON array
  customEvents: text("customEvents"), // JSON object
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectStats = typeof projectStats.$inferSelect;
export type InsertProjectStats = typeof projectStats.$inferInsert;

// Project Stats Aggregated - agregované denní statistiky (cache)
export const projectStatsAggregated = mysqlTable("project_stats_aggregated", {
  id: int("id").autoincrement().primaryKey(),
  
  date: date("date").notNull(),
  
  // Aggregated totals
  totalPageViews: int("totalPageViews").default(0).notNull(),
  totalUniqueVisitors: int("totalUniqueVisitors").default(0).notNull(),
  totalSessions: int("totalSessions").default(0).notNull(),
  totalChatSessions: int("totalChatSessions").default(0).notNull(),
  totalChatMessages: int("totalChatMessages").default(0).notNull(),
  totalConversions: int("totalConversions").default(0).notNull(),
  totalRevenue: int("totalRevenue").default(0).notNull(), // in CZK * 100
  
  // Projects data (JSON)
  projectsData: text("projectsData").notNull(), // JSON array of ProjectStats
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectStatsAggregated = typeof projectStatsAggregated.$inferSelect;
export type InsertProjectStatsAggregated = typeof projectStatsAggregated.$inferInsert;


// =============================================================================
// COACHING LEADS - Zájemci o osobní koučing s Natálií
// =============================================================================

export const coachingLeads = mysqlTable("coaching_leads", {
  id: int("id").autoincrement().primaryKey(),
  
  // Kontaktní údaje
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  
  // Kvalifikační informace
  situation: text("situation"), // Co konkrétně řeší
  goals: text("goals"), // Jaké má cíle
  whyCoaching: text("whyCoaching"), // Proč hledá kouče
  expectations: text("expectations"), // Co očekává od koučingu
  
  // Konverzace
  conversationSummary: text("conversationSummary"), // Shrnutí konverzace z chatu
  sessionId: varchar("sessionId", { length: 100 }), // ID chatbot session
  
  // Stav
  status: mysqlEnum("status", [
    "new",           // Nový lead
    "contacted",     // Natálie kontaktovala
    "scheduled",     // Naplánované sezení
    "completed",     // Proběhlo sezení
    "declined",      // Odmítnuto (klientem nebo Natálií)
    "not_qualified"  // Nekvalifikovaný lead
  ]).default("new").notNull(),
  
  // Balíček
  interestedInPackage: boolean("interestedInPackage").default(false),
  packageType: varchar("packageType", { length: 50 }), // "single" | "package_5plus1"
  
  // Preference
  preferredContactMethod: mysqlEnum("preferredContactMethod", [
    "phone",
    "email", 
    "whatsapp"
  ]).default("phone"),
  preferredSessionType: mysqlEnum("preferredSessionType", [
    "in_person",
    "phone",
    "video"
  ]).default("phone"),
  
  // Natálie poznámky
  natalieNotes: text("natalieNotes"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  contactedAt: timestamp("contactedAt"),
  scheduledAt: timestamp("scheduledAt"),
});

export type CoachingLead = typeof coachingLeads.$inferSelect;
export type InsertCoachingLead = typeof coachingLeads.$inferInsert;

// =============================================================================
// VISITOR FEEDBACK - Zpětná vazba od návštěvníků
// =============================================================================

export const visitorFeedback = mysqlTable("visitor_feedback", {
  id: int("id").autoincrement().primaryKey(),
  
  // Identifikace návštěvníka
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  sessionId: varchar("sessionId", { length: 100 }),
  userId: int("userId"),
  
  // Feedback kategorie
  feedbackType: mysqlEnum("feedbackType", [
    "missing_feature",    // Co chybí
    "improvement",        // Co vylepšit
    "high_value",         // Nejvyšší hodnota
    "joy_factor",         // Co by udělalo radost
    "general"             // Obecný feedback
  ]).notNull(),
  
  // Obsah feedbacku
  content: text("content").notNull(),
  
  // Kontext
  currentPage: varchar("currentPage", { length: 255 }),
  conversationHistory: text("conversationHistory"), // JSON
  timeOnSite: int("timeOnSite"), // v sekundách
  
  // Sentiment (optional - může být analyzován AI)
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]),
  
  // Priorita (může být nastavena manuálně)
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  
  // Stav zpracování
  status: mysqlEnum("status", [
    "new",           // Nový feedback
    "reviewed",      // Prohlédnuto
    "planned",       // Naplánováno k implementaci
    "implemented",   // Implementováno
    "rejected"       // Odmítnuto
  ]).default("new").notNull(),
  
  // Poznámky vlastníka
  ownerNotes: text("ownerNotes"),
  
  // Metadata
  userAgent: text("userAgent"),
  device: varchar("device", { length: 50 }), // mobile | desktop
  browser: varchar("browser", { length: 100 }),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  implementedAt: timestamp("implementedAt"),
});

export type VisitorFeedback = typeof visitorFeedback.$inferSelect;
export type InsertVisitorFeedback = typeof visitorFeedback.$inferInsert;


// ============================================
// PREMIUM MEMBERSHIP & LUNAR READING
// ============================================

// Premium Subscriptions - měsíční předplatné
export const premiumSubscriptions = mysqlTable("premium_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Subscription details
  status: mysqlEnum("status", ["active", "cancelled", "expired", "trial"]).default("trial").notNull(),
  plan: mysqlEnum("plan", ["monthly", "yearly"]).default("monthly").notNull(),
  priceAmount: int("priceAmount").notNull(), // v haléřích (Kč * 100)
  currency: varchar("currency", { length: 3 }).default("CZK").notNull(),
  
  // Billing
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  cancelledAt: timestamp("cancelledAt"),
  
  // Payment
  paymentMethod: varchar("paymentMethod", { length: 50 }), // 'card', 'bank_transfer', etc.
  lastPaymentAt: timestamp("lastPaymentAt"),
  nextPaymentAt: timestamp("nextPaymentAt"),
  
  // Metadata
  trialEndsAt: timestamp("trialEndsAt"),
  metadata: text("metadata"), // JSON pro další data
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PremiumSubscription = typeof premiumSubscriptions.$inferSelect;
export type InsertPremiumSubscription = typeof premiumSubscriptions.$inferInsert;

// Lunar Profiles - uložené lunární profily uživatelů
export const lunarProfiles = mysqlTable("lunar_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id, { onDelete: "cascade" }),
  visitorId: varchar("visitorId", { length: 64 }), // pro nepřihlášené uživatele
  
  // Birth data
  birthDate: date("birthDate").notNull(),
  birthTime: time("birthTime"), // volitelný čas narození pro přesnější výpočet
  birthPlace: varchar("birthPlace", { length: 200 }), // volitelné místo narození
  
  // Calculated data
  moonPhase: varchar("moonPhase", { length: 50 }).notNull(),
  moonPhaseEmoji: varchar("moonPhaseEmoji", { length: 10 }).notNull(),
  lifePathNumber: int("lifePathNumber").notNull(),
  
  // Profile data (JSON)
  profileData: text("profileData").notNull(), // JSON s kompletním profilem
  
  // Premium features
  isPremium: boolean("isPremium").default(false).notNull(),
  premiumProfileData: text("premiumProfileData"), // JSON s rozšířeným profilem
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LunarProfile = typeof lunarProfiles.$inferSelect;
export type InsertLunarProfile = typeof lunarProfiles.$inferInsert;

// Monthly Forecasts - měsíční předpovědi pro PREMIUM členy
export const monthlyForecasts = mysqlTable("monthly_forecasts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  lunarProfileId: int("lunarProfileId").notNull().references(() => lunarProfiles.id, { onDelete: "cascade" }),
  
  // Forecast period
  forecastMonth: int("forecastMonth").notNull(), // 1-12
  forecastYear: int("forecastYear").notNull(),
  
  // Forecast data (JSON)
  forecastData: text("forecastData").notNull(), // JSON s předpovědí
  
  // Engagement
  viewed: boolean("viewed").default(false).notNull(),
  viewedAt: timestamp("viewedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MonthlyForecast = typeof monthlyForecasts.$inferSelect;
export type InsertMonthlyForecast = typeof monthlyForecasts.$inferInsert;

// Ritual Completions - sledování dokončených rituálů
export const ritualCompletions = mysqlTable("ritual_completions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  lunarProfileId: int("lunarProfileId").notNull().references(() => lunarProfiles.id, { onDelete: "cascade" }),
  
  // Ritual details
  ritualType: varchar("ritualType", { length: 100 }).notNull(), // 'new_moon', 'full_moon', 'daily', etc.
  ritualName: varchar("ritualName", { length: 200 }).notNull(),
  
  // Completion
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  notes: text("notes"), // uživatelské poznámky
  mood: mysqlEnum("mood", ["very_bad", "bad", "neutral", "good", "very_good"]),
  
  // Metadata
  moonPhaseAtCompletion: varchar("moonPhaseAtCompletion", { length: 50 }),
});

export type RitualCompletion = typeof ritualCompletions.$inferSelect;
export type InsertRitualCompletion = typeof ritualCompletions.$inferInsert;


// ============================================
// TELEGRAM PREMIUM & VIP MEMBERSHIP
// ============================================

// Membership Tiers - úrovně členství
export const membershipTiers = mysqlTable("membership_tiers", {
  id: int("id").autoincrement().primaryKey(),
  
  // Tier info
  tierKey: varchar("tierKey", { length: 50 }).notNull().unique(), // 'free', 'premium', 'premium_plus', 'lifetime', 'vip'
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  
  // Pricing
  priceMonthly: int("priceMonthly").default(0).notNull(), // v haléřích (Kč * 100)
  priceYearly: int("priceYearly").default(0).notNull(),
  priceLifetime: int("priceLifetime").default(0).notNull(),
  
  // Benefits (JSON)
  benefits: text("benefits"), // JSON array of benefit strings
  
  // Telegram
  telegramGroupLink: varchar("telegramGroupLink", { length: 255 }),
  telegramGroupChatId: varchar("telegramGroupChatId", { length: 50 }),
  
  // Cross-platform
  ohoraiDiscount: int("ohoraiDiscount").default(0).notNull(), // procento slevy na OHORAI
  
  // Status
  isActive: boolean("isActive").default(true).notNull(),
  isInviteOnly: boolean("isInviteOnly").default(false).notNull(), // pro VIP
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MembershipTier = typeof membershipTiers.$inferSelect;
export type InsertMembershipTier = typeof membershipTiers.$inferInsert;

// User Memberships - členství uživatelů
export const userMemberships = mysqlTable("user_memberships", {
  id: int("id").autoincrement().primaryKey(),
  
  // User reference
  userId: int("userId").references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 320 }),
  telegramId: varchar("telegramId", { length: 50 }),
  telegramUsername: varchar("telegramUsername", { length: 100 }),
  
  // Tier
  tierId: int("tierId").notNull().references(() => membershipTiers.id),
  
  // Status
  status: mysqlEnum("status", ["active", "cancelled", "expired", "pending"]).default("pending").notNull(),
  
  // Billing period
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  cancelledAt: timestamp("cancelledAt"),
  
  // Payment
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  lastPaymentAt: timestamp("lastPaymentAt"),
  
  // Cross-platform sync
  ohoraiSynced: boolean("ohoraiSynced").default(false).notNull(),
  ohoraiSyncedAt: timestamp("ohoraiSyncedAt"),
  
  // Telegram group status
  addedToGroup: boolean("addedToGroup").default(false).notNull(),
  addedToGroupAt: timestamp("addedToGroupAt"),
  
  // Metadata
  source: mysqlEnum("source", ["website", "telegram", "ohorai", "manual"]).default("website").notNull(),
  referredBy: varchar("referredBy", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserMembership = typeof userMemberships.$inferSelect;
export type InsertUserMembership = typeof userMemberships.$inferInsert;

// VIP Invites - pozvánky do VIP skupiny
export const vipInvites = mysqlTable("vip_invites", {
  id: int("id").autoincrement().primaryKey(),
  
  // Invite code
  inviteCode: varchar("inviteCode", { length: 50 }).notNull().unique(),
  
  // Creator
  createdByUserId: int("createdByUserId").references(() => users.id),
  createdByName: varchar("createdByName", { length: 100 }),
  
  // Usage
  maxUses: int("maxUses").default(1).notNull(),
  usedCount: int("usedCount").default(0).notNull(),
  
  // Expiration
  expiresAt: timestamp("expiresAt"),
  
  // Status
  isActive: boolean("isActive").default(true).notNull(),
  
  // Note
  note: text("note"), // poznámka pro koho je pozvánka
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VipInvite = typeof vipInvites.$inferSelect;
export type InsertVipInvite = typeof vipInvites.$inferInsert;

// VIP Invite Uses - použití VIP pozvánky
export const vipInviteUses = mysqlTable("vip_invite_uses", {
  id: int("id").autoincrement().primaryKey(),
  
  inviteId: int("inviteId").notNull().references(() => vipInvites.id, { onDelete: "cascade" }),
  
  // User who used the invite
  userId: int("userId").references(() => users.id),
  telegramId: varchar("telegramId", { length: 50 }),
  telegramUsername: varchar("telegramUsername", { length: 100 }),
  
  usedAt: timestamp("usedAt").defaultNow().notNull(),
});

export type VipInviteUse = typeof vipInviteUses.$inferSelect;
export type InsertVipInviteUse = typeof vipInviteUses.$inferInsert;

// Membership Activity Log - aktivita členů
export const membershipActivityLog = mysqlTable("membership_activity_log", {
  id: int("id").autoincrement().primaryKey(),
  
  membershipId: int("membershipId").notNull().references(() => userMemberships.id, { onDelete: "cascade" }),
  
  // Activity type
  activityType: mysqlEnum("activityType", [
    "joined",           // Připojil se
    "upgraded",         // Upgradoval tier
    "downgraded",       // Downgradoval tier
    "cancelled",        // Zrušil členství
    "renewed",          // Obnovil členství
    "payment_success",  // Úspěšná platba
    "payment_failed",   // Neúspěšná platba
    "added_to_group",   // Přidán do Telegram skupiny
    "removed_from_group", // Odebrán ze skupiny
    "ohorai_synced"     // Synchronizováno s OHORAI
  ]).notNull(),
  
  // Details
  details: text("details"), // JSON s detaily aktivity
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MembershipActivityLog = typeof membershipActivityLog.$inferSelect;
export type InsertMembershipActivityLog = typeof membershipActivityLog.$inferInsert;


// ============================================
// WEEKLY HOROSCOPES SYSTEM
// ============================================

// Weekly Horoscopes - týdenní horoskopy pro všech 12 znamení
export const weeklyHoroscopes = mysqlTable("weekly_horoscopes", {
  id: int("id").autoincrement().primaryKey(),
  
  // Identifikace
  zodiacSign: varchar("zodiacSign", { length: 20 }).notNull(), // aries, taurus, etc.
  weekStart: date("weekStart").notNull(), // Pondělí
  weekEnd: date("weekEnd").notNull(), // Neděle
  
  // Hodnocení (1-5 hvězdiček)
  overallRating: int("overallRating").notNull(),
  loveRating: int("loveRating").notNull(),
  careerRating: int("careerRating").notNull(),
  financeRating: int("financeRating").notNull(),
  healthRating: int("healthRating").notNull(),
  
  // Texty horoskopů
  overallText: text("overallText").notNull(),
  loveText: text("loveText").notNull(),
  careerText: text("careerText").notNull(),
  financeText: text("financeText").notNull(),
  healthText: text("healthText").notNull(),
  
  // Šťastné prvky
  luckyDays: text("luckyDays"), // JSON array: ["pondělí", "čtvrtek"]
  luckyNumbers: text("luckyNumbers"), // JSON array: [3, 7, 21]
  luckyColor: varchar("luckyColor", { length: 50 }),
  luckyStone: varchar("luckyStone", { length: 100 }),
  
  // Planetární vlivy
  planetaryInfluences: text("planetaryInfluences"),
  
  // SEO
  metaTitle: varchar("metaTitle", { length: 70 }),
  metaDescription: varchar("metaDescription", { length: 160 }),
  
  // Status
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  viewCount: int("viewCount").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WeeklyHoroscope = typeof weeklyHoroscopes.$inferSelect;
export type InsertWeeklyHoroscope = typeof weeklyHoroscopes.$inferInsert;

// Planetary Events - planetární události pro kontext horoskopů
export const planetaryEvents = mysqlTable("planetary_events", {
  id: int("id").autoincrement().primaryKey(),
  
  eventDate: date("eventDate").notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(), // new_moon, full_moon, retrograde, conjunction
  planet: varchar("planet", { length: 30 }), // Mercury, Venus, Mars, etc.
  
  titleCs: varchar("titleCs", { length: 200 }).notNull(),
  descriptionCs: text("descriptionCs"),
  
  zodiacSign: varchar("zodiacSign", { length: 20 }), // ve kterém znamení
  aspectType: varchar("aspectType", { length: 50 }), // conjunction, opposition, trine, etc.
  
  importance: mysqlEnum("importance", ["low", "medium", "high", "critical"]).default("medium"),
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlanetaryEvent = typeof planetaryEvents.$inferSelect;
export type InsertPlanetaryEvent = typeof planetaryEvents.$inferInsert;

// Horoscope Subscriptions - odběratelé týdenního horoskopu
export const horoscopeSubscriptions = mysqlTable("horoscope_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  zodiacSign: varchar("zodiacSign", { length: 20 }), // preferované znamení
  
  userId: int("userId").references(() => users.id),
  
  isActive: boolean("isActive").default(true).notNull(),
  confirmedAt: timestamp("confirmedAt"),
  unsubscribedAt: timestamp("unsubscribedAt"),
  
  // Statistiky
  emailsSent: int("emailsSent").default(0).notNull(),
  emailsOpened: int("emailsOpened").default(0).notNull(),
  lastSentAt: timestamp("lastSentAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HoroscopeSubscription = typeof horoscopeSubscriptions.$inferSelect;
export type InsertHoroscopeSubscription = typeof horoscopeSubscriptions.$inferInsert;

// Horoscope Generation Log - log automatického generování
export const horoscopeGenerationLog = mysqlTable("horoscope_generation_log", {
  id: int("id").autoincrement().primaryKey(),
  
  weekStart: date("weekStart").notNull(),
  weekEnd: date("weekEnd").notNull(),
  
  status: mysqlEnum("status", ["started", "in_progress", "completed", "partial", "failed"]).notNull(),
  
  totalSigns: int("totalSigns").default(12).notNull(),
  completedSigns: int("completedSigns").default(0).notNull(),
  failedSigns: text("failedSigns"), // JSON array of failed sign keys
  
  errorMessage: text("errorMessage"),
  duration: int("duration"), // in seconds
  
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HoroscopeGenerationLog = typeof horoscopeGenerationLog.$inferSelect;
export type InsertHoroscopeGenerationLog = typeof horoscopeGenerationLog.$inferInsert;
