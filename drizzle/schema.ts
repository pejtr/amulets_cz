import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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

// Shared User Profiles - for cross-project chatbot personalization
export const sharedUserProfiles = mysqlTable("shared_user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  // Psychological profile
  personalityType: varchar("personalityType", { length: 50 }), // e.g., "spiritual", "practical", "analytical"
  interests: text("interests"), // JSON: ["amulets", "crystals", "meditation"]
  purchaseHistory: text("purchaseHistory"), // JSON: {amulets: 5, ohorai: 3}
  preferredProducts: text("preferredProducts"), // JSON: ["amethyst", "rose quartz"]
  communicationStyle: varchar("communicationStyle", { length: 50 }), // "formal", "casual", "spiritual"
  engagementLevel: varchar("engagementLevel", { length: 20 }), // "high", "medium", "low"
  lastInteractionProject: varchar("lastInteractionProject", { length: 50 }), // "amulets" or "ohorai"
  crossProjectScore: int("crossProjectScore").default(0), // 0-100: likelihood to buy from other project
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SharedUserProfile = typeof sharedUserProfiles.$inferSelect;
export type InsertSharedUserProfile = typeof sharedUserProfiles.$inferInsert;

// User Interactions - for learning user psychology
export const userInteractions = mysqlTable("user_interactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectName: varchar("projectName", { length: 50 }).notNull(), // "amulets" or "ohorai"
  interactionType: varchar("interactionType", { length: 50 }).notNull(), // "chat", "purchase", "view", "inquiry"
  content: text("content"), // The actual message or interaction
  sentiment: varchar("sentiment", { length: 20 }), // "positive", "negative", "neutral"
  category: varchar("category", { length: 50 }), // "amulets", "crystals", "spirituality", etc.
  duration: int("duration"), // Time spent in seconds
  result: varchar("result", { length: 50 }), // "converted", "interested", "bounced"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserInteraction = typeof userInteractions.$inferSelect;
export type InsertUserInteraction = typeof userInteractions.$inferInsert;

// TODO: Add your tables here