import { mysqlTable, int, varchar, text, boolean, timestamp, decimal, json } from "drizzle-orm/mysql-core";

// ============================================
// WIDGET A/B TESTING TABLES
// ============================================

// Widget Variants - různé verze UI widgetů (CTA tlačítka, doporučovací widgety, atd.)
export const widgetVariants = mysqlTable("widget_variants", {
  id: int("id").autoincrement().primaryKey(),
  widgetKey: varchar("widgetKey", { length: 100 }).notNull(), // např. 'hero_cta', 'recommendation_widget', 'exit_popup'
  variantKey: varchar("variantKey", { length: 100 }).notNull(), // např. 'hero_cta_v1', 'hero_cta_v2'
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Konfigurace varianty
  config: json("config").notNull(), // JSON s konfigurací (text, barva, velikost, pozice, atd.)
  
  // A/B testování
  isActive: boolean("isActive").default(true).notNull(),
  weight: int("weight").default(50).notNull(), // váha pro náhodný výběr (0-100)
  isControl: boolean("isControl").default(false).notNull(), // je to kontrolní varianta?
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: varchar("createdBy", { length: 100 }),
  
  // Poznámky
  notes: text("notes"),
});

export type WidgetVariant = typeof widgetVariants.$inferSelect;
export type InsertWidgetVariant = typeof widgetVariants.$inferInsert;

// Widget Impressions - zobrazení widgetu
export const widgetImpressions = mysqlTable("widget_impressions", {
  id: int("id").autoincrement().primaryKey(),
  variantId: int("variantId").notNull().references(() => widgetVariants.id),
  widgetKey: varchar("widgetKey", { length: 100 }).notNull(),
  variantKey: varchar("variantKey", { length: 100 }).notNull(),
  
  // Visitor info
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  sessionId: varchar("sessionId", { length: 64 }),
  userId: int("userId"), // pokud je přihlášen
  
  // Context
  page: varchar("page", { length: 500 }).notNull(),
  referrer: varchar("referrer", { length: 500 }),
  device: varchar("device", { length: 50 }),
  browser: varchar("browser", { length: 100 }),
  language: varchar("language", { length: 10 }),
  
  // Tracking
  viewDuration: int("viewDuration"), // jak dlouho byl widget viditelný (ms)
  scrollDepth: int("scrollDepth"), // jak hluboko uživatel scrolloval (%)
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WidgetImpression = typeof widgetImpressions.$inferSelect;
export type InsertWidgetImpression = typeof widgetImpressions.$inferInsert;

// Widget Interactions - interakce s widgetem (kliknutí, hover, atd.)
export const widgetInteractions = mysqlTable("widget_interactions", {
  id: int("id").autoincrement().primaryKey(),
  impressionId: int("impressionId").references(() => widgetImpressions.id, { onDelete: "cascade" }),
  variantId: int("variantId").notNull().references(() => widgetVariants.id),
  widgetKey: varchar("widgetKey", { length: 100 }).notNull(),
  variantKey: varchar("variantKey", { length: 100 }).notNull(),
  
  // Visitor info
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  sessionId: varchar("sessionId", { length: 64 }),
  
  // Interaction details
  interactionType: varchar("interactionType", { length: 50 }).notNull(), // 'click', 'hover', 'close', 'submit', atd.
  interactionTarget: varchar("interactionTarget", { length: 100 }), // který element byl kliknut
  interactionValue: text("interactionValue"), // hodnota interakce (např. text tlačítka, vybraná položka)
  
  // Timing
  timeToInteraction: int("timeToInteraction"), // čas od zobrazení do interakce (ms)
  
  // Metadata
  metadata: json("metadata"), // další data o interakci
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WidgetInteraction = typeof widgetInteractions.$inferSelect;
export type InsertWidgetInteraction = typeof widgetInteractions.$inferInsert;

// Widget Conversions - konverze spojené s widgetem
export const widgetConversions = mysqlTable("widget_conversions", {
  id: int("id").autoincrement().primaryKey(),
  impressionId: int("impressionId").references(() => widgetImpressions.id, { onDelete: "cascade" }),
  interactionId: int("interactionId").references(() => widgetInteractions.id, { onDelete: "cascade" }),
  variantId: int("variantId").notNull().references(() => widgetVariants.id),
  widgetKey: varchar("widgetKey", { length: 100 }).notNull(),
  variantKey: varchar("variantKey", { length: 100 }).notNull(),
  
  // Visitor info
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  sessionId: varchar("sessionId", { length: 64 }),
  
  // Conversion details
  conversionType: varchar("conversionType", { length: 50 }).notNull(), // 'purchase', 'signup', 'email_capture', 'add_to_cart', atd.
  conversionValue: decimal("conversionValue", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("CZK"),
  
  // Attribution
  timeToConversion: int("timeToConversion"), // čas od interakce do konverze (ms)
  
  // Metadata
  metadata: json("metadata"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WidgetConversion = typeof widgetConversions.$inferSelect;
export type InsertWidgetConversion = typeof widgetConversions.$inferInsert;

// Widget Daily Stats - denní statistiky pro každou variantu
export const widgetDailyStats = mysqlTable("widget_daily_stats", {
  id: int("id").autoincrement().primaryKey(),
  variantId: int("variantId").notNull().references(() => widgetVariants.id),
  widgetKey: varchar("widgetKey", { length: 100 }).notNull(),
  variantKey: varchar("variantKey", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  
  // Impressions
  totalImpressions: int("totalImpressions").default(0).notNull(),
  uniqueVisitors: int("uniqueVisitors").default(0).notNull(),
  
  // Interactions
  totalInteractions: int("totalInteractions").default(0).notNull(),
  uniqueInteractors: int("uniqueInteractors").default(0).notNull(),
  interactionRate: decimal("interactionRate", { precision: 5, scale: 4 }).default("0"), // interakce / zobrazení
  
  // Conversions
  totalConversions: int("totalConversions").default(0).notNull(),
  uniqueConverters: int("uniqueConverters").default(0).notNull(),
  conversionRate: decimal("conversionRate", { precision: 5, scale: 4 }).default("0"), // konverze / zobrazení
  conversionRateFromInteraction: decimal("conversionRateFromInteraction", { precision: 5, scale: 4 }).default("0"), // konverze / interakce
  totalConversionValue: decimal("totalConversionValue", { precision: 12, scale: 2 }).default("0"),
  avgConversionValue: decimal("avgConversionValue", { precision: 10, scale: 2 }).default("0"),
  
  // Timing
  avgTimeToInteraction: int("avgTimeToInteraction").default(0), // průměrný čas do interakce (ms)
  avgTimeToConversion: int("avgTimeToConversion").default(0), // průměrný čas do konverze (ms)
  avgViewDuration: int("avgViewDuration").default(0), // průměrná doba zobrazení (ms)
  
  // Engagement
  avgScrollDepth: int("avgScrollDepth").default(0), // průměrná hloubka scrollu (%)
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WidgetDailyStat = typeof widgetDailyStats.$inferSelect;
export type InsertWidgetDailyStat = typeof widgetDailyStats.$inferInsert;

// Widget AB Test Results - výsledky A/B testů s statistickou signifikancí
export const widgetABTestResults = mysqlTable("widget_ab_test_results", {
  id: int("id").autoincrement().primaryKey(),
  widgetKey: varchar("widgetKey", { length: 100 }).notNull(),
  testName: varchar("testName", { length: 255 }).notNull(),
  
  // Test configuration
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  status: varchar("status", { length: 20 }).default("running").notNull(), // 'running', 'completed', 'paused', 'archived'
  
  // Winner
  winnerVariantId: int("winnerVariantId").references(() => widgetVariants.id),
  winnerDeclaredAt: timestamp("winnerDeclaredAt"),
  winnerConfidence: decimal("winnerConfidence", { precision: 5, scale: 4 }), // statistická významnost (0-1)
  
  // Test results
  results: json("results"), // JSON s detailními výsledky pro každou variantu
  
  // Notes
  notes: text("notes"),
  conclusions: text("conclusions"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WidgetABTestResult = typeof widgetABTestResults.$inferSelect;
export type InsertWidgetABTestResult = typeof widgetABTestResults.$inferInsert;
