import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

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
