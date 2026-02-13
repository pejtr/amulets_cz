import { getDb } from "./db";
import { coachingLeads, type InsertCoachingLead, type CoachingLead } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Vytvořit nový coaching lead
 */
export async function createCoachingLead(data: Omit<InsertCoachingLead, "id" | "createdAt" | "updatedAt">): Promise<CoachingLead | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(coachingLeads).values(data);
  const insertId = result[0].insertId;
  
  const lead = await db.select().from(coachingLeads).where(eq(coachingLeads.id, insertId)).limit(1);
  return lead[0] || null;
}

/**
 * Aktualizovat coaching lead
 */
export async function updateCoachingLead(
  id: number, 
  data: Partial<Omit<InsertCoachingLead, "id" | "createdAt">>
): Promise<CoachingLead | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(coachingLeads).set(data).where(eq(coachingLeads.id, id));
  
  const lead = await db.select().from(coachingLeads).where(eq(coachingLeads.id, id)).limit(1);
  return lead[0] || null;
}

/**
 * Získat coaching lead podle ID
 */
export async function getCoachingLeadById(id: number): Promise<CoachingLead | null> {
  const db = await getDb();
  if (!db) return null;
  
  const lead = await db.select().from(coachingLeads).where(eq(coachingLeads.id, id)).limit(1);
  return lead[0] || null;
}

/**
 * Získat všechny nové coaching leads (pro Natálii)
 */
export async function getNewCoachingLeads(): Promise<CoachingLead[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(coachingLeads)
    .where(eq(coachingLeads.status, "new"))
    .orderBy(desc(coachingLeads.createdAt));
}

/**
 * Získat všechny coaching leads
 */
export async function getAllCoachingLeads(): Promise<CoachingLead[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(coachingLeads)
    .orderBy(desc(coachingLeads.createdAt));
}

/**
 * Označit lead jako kontaktovaný
 */
export async function markLeadAsContacted(id: number, notes?: string): Promise<CoachingLead | null> {
  return updateCoachingLead(id, {
    status: "contacted",
    contactedAt: new Date(),
    natalieNotes: notes,
  });
}

/**
 * Naplánovat sezení
 */
export async function scheduleCoachingSession(
  id: number, 
  scheduledDate: Date,
  notes?: string
): Promise<CoachingLead | null> {
  return updateCoachingLead(id, {
    status: "scheduled",
    scheduledAt: scheduledDate,
    natalieNotes: notes,
  });
}

/**
 * Formátovat lead pro Telegram notifikaci
 */
export function formatLeadForTelegram(lead: CoachingLead): string {
  const lines = [
    `🎯 *NOVÝ ZÁJEMCE O KOUČING*`,
    ``,
    `👤 *Jméno:* ${lead.name || "Neuvedeno"}`,
    `📧 *Email:* ${lead.email || "Neuvedeno"}`,
    `📱 *Telefon:* ${lead.phone || "Neuvedeno"}`,
    ``,
    `📋 *SITUACE:*`,
    lead.situation || "Neuvedeno",
    ``,
    `🎯 *CÍLE:*`,
    lead.goals || "Neuvedeno",
    ``,
    `❓ *PROČ HLEDÁ KOUČE:*`,
    lead.whyCoaching || "Neuvedeno",
    ``,
    `💭 *OČEKÁVÁNÍ:*`,
    lead.expectations || "Neuvedeno",
    ``,
    `📝 *SHRNUTÍ KONVERZACE:*`,
    lead.conversationSummary || "Neuvedeno",
    ``,
    `📞 *PREFEROVANÝ KONTAKT:* ${lead.preferredContactMethod || "telefon"}`,
    `🎥 *PREFEROVANÁ FORMA:* ${lead.preferredSessionType || "telefon"}`,
    `📦 *ZÁJEM O BALÍČEK:* ${lead.interestedInPackage ? "Ano (5+1)" : "Ne"}`,
    ``,
    `⏰ *Vytvořeno:* ${lead.createdAt.toLocaleString("cs-CZ")}`,
    ``,
    `💜 _Natálie, ozvi se tomuto člověku do 24 hodin!_`,
  ];
  
  return lines.join("\n");
}
