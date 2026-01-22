import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { 
  weeklyHoroscopes, 
  planetaryEvents, 
  horoscopeGenerationLog,
  type InsertWeeklyHoroscope 
} from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

// Zodiac signs configuration
export const ZODIAC_SIGNS = [
  { key: "aries", nameCs: "Beran", emoji: "♈", element: "fire" },
  { key: "taurus", nameCs: "Býk", emoji: "♉", element: "earth" },
  { key: "gemini", nameCs: "Blíženci", emoji: "♊", element: "air" },
  { key: "cancer", nameCs: "Rak", emoji: "♋", element: "water" },
  { key: "leo", nameCs: "Lev", emoji: "♌", element: "fire" },
  { key: "virgo", nameCs: "Panna", emoji: "♍", element: "earth" },
  { key: "libra", nameCs: "Váhy", emoji: "♎", element: "air" },
  { key: "scorpio", nameCs: "Štír", emoji: "♏", element: "water" },
  { key: "sagittarius", nameCs: "Střelec", emoji: "♐", element: "fire" },
  { key: "capricorn", nameCs: "Kozoroh", emoji: "♑", element: "earth" },
  { key: "aquarius", nameCs: "Vodnář", emoji: "♒", element: "air" },
  { key: "pisces", nameCs: "Ryby", emoji: "♓", element: "water" },
] as const;

export type ZodiacSignKey = typeof ZODIAC_SIGNS[number]["key"];

// Lucky stones by zodiac sign
const LUCKY_STONES: Record<ZodiacSignKey, string[]> = {
  aries: ["Karneol", "Diamant", "Jaspis"],
  taurus: ["Smaragd", "Růženín", "Tyrkys"],
  gemini: ["Achát", "Citrín", "Tygří oko"],
  cancer: ["Měsíční kámen", "Perla", "Opál"],
  leo: ["Jantar", "Rubín", "Sluneční kámen"],
  virgo: ["Jaspis", "Sardonyx", "Amazonit"],
  libra: ["Lapis lazuli", "Opál", "Růženín"],
  scorpio: ["Obsidián", "Granát", "Malachit"],
  sagittarius: ["Tyrkys", "Topaz", "Ametyst"],
  capricorn: ["Onyx", "Granát", "Turmalín"],
  aquarius: ["Ametyst", "Akvamarín", "Labradorit"],
  pisces: ["Ametyst", "Akvamarín", "Fluorit"],
};

// System prompt for horoscope generation
const SYSTEM_PROMPT = `Jsi zkušená astroložka a spirituální průvodkyně jménem Natálie. Píšeš týdenní horoskopy pro český spirituální web Amulets.cz. Tvůj styl je:

- Vřelý a empatický, ale ne přehnaně sladký
- Praktický s konkrétními radami
- Spirituální, ale přístupný i skeptikům
- Motivující a pozitivní, i když upozorňuješ na výzvy
- Používáš metafory z přírody a každodenního života

DŮLEŽITÉ PRAVIDLA:
1. Nikdy nepoužívej generické fráze jako "tento týden bude zajímavý"
2. Každý horoskop musí obsahovat alespoň jednu konkrétní radu
3. Zmiň alespoň jeden konkrétní den v týdnu pro důležitou událost
4. Propoj obsah s aktuálními planetárními vlivy
5. Používej českou diakritiku a přirozený český jazyk
6. Délka každé sekce: 80-120 slov`;

// Interface for generated horoscope
interface GeneratedHoroscope {
  overallRating: number;
  overallText: string;
  loveRating: number;
  loveText: string;
  careerRating: number;
  careerText: string;
  financeRating: number;
  financeText: string;
  healthRating: number;
  healthText: string;
  luckyDays: string[];
  luckyNumbers: number[];
  luckyColor: string;
  luckyStone: string;
  planetaryInfluences: string;
  metaTitle: string;
  metaDescription: string;
}

// Get week dates (Monday to Sunday)
export function getWeekDates(date: Date = new Date()): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

// Format date for display
function formatDateCs(date: Date): string {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

// Format date for SQL (YYYY-MM-DD)
function formatDateSql(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

// Get planetary events for the week
async function getPlanetaryContext(weekStart: Date, weekEnd: Date): Promise<string> {
  try {
    const db = await getDb();
    if (!db) {
      return "PLANETÁRNÍ KONTEXT: Standardní planetární vlivy pro tento týden.";
    }
    
    const weekStartSql = formatDateSql(weekStart);
    const weekEndSql = formatDateSql(weekEnd);
    
    const events = await db
      .select()
      .from(planetaryEvents)
      .where(
        and(
          sql`${planetaryEvents.eventDate} >= ${weekStartSql}`,
          sql`${planetaryEvents.eventDate} <= ${weekEndSql}`,
          eq(planetaryEvents.isActive, true)
        )
      );

    if (events.length === 0) {
      return `PLANETÁRNÍ KONTEXT PRO TENTO TÝDEN:
- Slunce pokračuje ve svém průchodu aktuálním znamením
- Měsíc prochází několika znameními, což ovlivňuje emoce
- Merkur podporuje komunikaci a myšlení
- Venuše přináší harmonii do vztahů`;
    }

    let context = "PLANETÁRNÍ KONTEXT PRO TENTO TÝDEN:\n";
    for (const event of events) {
      context += `- ${event.titleCs} (${formatDateCs(new Date(event.eventDate))}): ${event.descriptionCs}\n`;
    }
    return context;
  } catch (error) {
    console.error("Error fetching planetary events:", error);
    return "PLANETÁRNÍ KONTEXT: Standardní planetární vlivy pro tento týden.";
  }
}

// Generate horoscope for a single zodiac sign
async function generateSingleHoroscope(
  sign: typeof ZODIAC_SIGNS[number],
  weekStart: Date,
  weekEnd: Date,
  planetaryContext: string
): Promise<GeneratedHoroscope> {
  const prompt = `Vygeneruj týdenní horoskop pro znamení ${sign.nameCs} (${sign.emoji}) na období ${formatDateCs(weekStart)} - ${formatDateCs(weekEnd)}.

${planetaryContext}

FORMÁT ODPOVĚDI (JSON):
{
  "overallRating": <1-5>,
  "overallText": "<celkový přehled týdne, 100-150 slov>",
  
  "loveRating": <1-5>,
  "loveText": "<horoskop pro lásku, 80-120 slov, rozděl na singles a páry>",
  
  "careerRating": <1-5>,
  "careerText": "<horoskop pro kariéru, 80-120 slov>",
  
  "financeRating": <1-5>,
  "financeText": "<horoskop pro finance, 80-120 slov>",
  
  "healthRating": <1-5>,
  "healthText": "<horoskop pro zdraví, 80-120 slov>",
  
  "luckyDays": ["<den1>", "<den2>"],
  "luckyNumbers": [<číslo1>, <číslo2>, <číslo3>],
  "luckyColor": "<barva>",
  "luckyStone": "<kámen z: ${LUCKY_STONES[sign.key].join(", ")}>",
  
  "planetaryInfluences": "<krátký popis planetárních vlivů, 50-80 slov>",
  
  "metaTitle": "<SEO title, max 60 znaků>",
  "metaDescription": "<SEO description, max 155 znaků>"
}

PRAVIDLA PRO HODNOCENÍ:
- 5 hvězdiček: Výjimečně příznivé období, velké příležitosti
- 4 hvězdičky: Pozitivní období s menšími výzvami
- 3 hvězdičky: Neutrální období, záleží na vlastním přístupu
- 2 hvězdičky: Náročnější období vyžadující trpělivost
- 1 hvězdička: Velmi náročné období, čas na introspekci

Vrať POUZE validní JSON bez dalšího textu.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "horoscope",
        strict: true,
        schema: {
          type: "object",
          properties: {
            overallRating: { type: "integer", minimum: 1, maximum: 5 },
            overallText: { type: "string" },
            loveRating: { type: "integer", minimum: 1, maximum: 5 },
            loveText: { type: "string" },
            careerRating: { type: "integer", minimum: 1, maximum: 5 },
            careerText: { type: "string" },
            financeRating: { type: "integer", minimum: 1, maximum: 5 },
            financeText: { type: "string" },
            healthRating: { type: "integer", minimum: 1, maximum: 5 },
            healthText: { type: "string" },
            luckyDays: { type: "array", items: { type: "string" } },
            luckyNumbers: { type: "array", items: { type: "integer" } },
            luckyColor: { type: "string" },
            luckyStone: { type: "string" },
            planetaryInfluences: { type: "string" },
            metaTitle: { type: "string" },
            metaDescription: { type: "string" },
          },
          required: [
            "overallRating", "overallText",
            "loveRating", "loveText",
            "careerRating", "careerText",
            "financeRating", "financeText",
            "healthRating", "healthText",
            "luckyDays", "luckyNumbers", "luckyColor", "luckyStone",
            "planetaryInfluences", "metaTitle", "metaDescription"
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error(`No content in LLM response for ${sign.key}`);
  }

  return JSON.parse(content) as GeneratedHoroscope;
}

// Main function to generate all horoscopes for a week
export async function generateWeeklyHoroscopes(
  targetDate: Date = new Date()
): Promise<{ success: boolean; message: string; generatedCount: number }> {
  const db = await getDb();
  if (!db) {
    return {
      success: false,
      message: "Databáze není dostupná",
      generatedCount: 0,
    };
  }

  const { start: weekStart, end: weekEnd } = getWeekDates(targetDate);
  const weekStartSql = formatDateSql(weekStart);
  const weekEndSql = formatDateSql(weekEnd);

  console.log(`[Horoscope Generator] Starting generation for week ${weekStartSql} - ${weekEndSql}`);

  // Check if horoscopes already exist for this week
  const existing = await db
    .select()
    .from(weeklyHoroscopes)
    .where(sql`${weeklyHoroscopes.weekStart} = ${weekStartSql}`)
    .limit(1);

  if (existing.length > 0) {
    console.log(`[Horoscope Generator] Horoscopes already exist for this week`);
    return {
      success: true,
      message: `Horoskopy pro týden ${formatDateCs(weekStart)} - ${formatDateCs(weekEnd)} již existují`,
      generatedCount: 0,
    };
  }

  // Create generation log entry
  const [logEntry] = await db.insert(horoscopeGenerationLog).values({
    weekStart: new Date(weekStartSql),
    weekEnd: new Date(weekEndSql),
    status: "started",
    totalSigns: 12,
    completedSigns: 0,
  }).$returningId();

  const logId = logEntry.id;
  const startTime = Date.now();
  let completedSigns = 0;
  const failedSigns: string[] = [];

  try {
    // Get planetary context
    const planetaryContext = await getPlanetaryContext(weekStart, weekEnd);

    // Generate horoscopes for all signs
    for (const sign of ZODIAC_SIGNS) {
      try {
        console.log(`[Horoscope Generator] Generating for ${sign.nameCs}...`);
        
        const horoscope = await generateSingleHoroscope(sign, weekStart, weekEnd, planetaryContext);

        // Save to database
        const horoscopeData: InsertWeeklyHoroscope = {
          zodiacSign: sign.key,
          weekStart: new Date(weekStartSql),
          weekEnd: new Date(weekEndSql),
          overallRating: horoscope.overallRating,
          loveRating: horoscope.loveRating,
          careerRating: horoscope.careerRating,
          financeRating: horoscope.financeRating,
          healthRating: horoscope.healthRating,
          overallText: horoscope.overallText,
          loveText: horoscope.loveText,
          careerText: horoscope.careerText,
          financeText: horoscope.financeText,
          healthText: horoscope.healthText,
          luckyDays: JSON.stringify(horoscope.luckyDays),
          luckyNumbers: JSON.stringify(horoscope.luckyNumbers),
          luckyColor: horoscope.luckyColor,
          luckyStone: horoscope.luckyStone,
          planetaryInfluences: horoscope.planetaryInfluences,
          metaTitle: horoscope.metaTitle,
          metaDescription: horoscope.metaDescription,
          published: true,
          publishedAt: new Date(),
        };

        await db.insert(weeklyHoroscopes).values(horoscopeData);
        completedSigns++;

        // Update log
        await db
          .update(horoscopeGenerationLog)
          .set({ 
            completedSigns,
            status: "in_progress",
          })
          .where(eq(horoscopeGenerationLog.id, logId));

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (signError) {
        console.error(`[Horoscope Generator] Error for ${sign.nameCs}:`, signError);
        failedSigns.push(sign.key);
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    const status = failedSigns.length === 0 ? "completed" : "partial";

    // Update final log
    await db
      .update(horoscopeGenerationLog)
      .set({
        status,
        completedSigns,
        completedAt: new Date(),
        duration,
        failedSigns: failedSigns.length > 0 ? JSON.stringify(failedSigns) : null,
      })
      .where(eq(horoscopeGenerationLog.id, logId));

    console.log(`[Horoscope Generator] Completed: ${completedSigns}/12 signs in ${duration}s`);

    return {
      success: failedSigns.length === 0,
      message: `Vygenerováno ${completedSigns}/12 horoskopů pro týden ${formatDateCs(weekStart)} - ${formatDateCs(weekEnd)}`,
      generatedCount: completedSigns,
    };

  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    await db
      .update(horoscopeGenerationLog)
      .set({
        status: "failed",
        completedSigns,
        completedAt: new Date(),
        duration,
        errorMessage,
        failedSigns: failedSigns.length > 0 ? JSON.stringify(failedSigns) : null,
      })
      .where(eq(horoscopeGenerationLog.id, logId));

    console.error(`[Horoscope Generator] Failed:`, error);

    return {
      success: false,
      message: `Chyba při generování horoskopů: ${errorMessage}`,
      generatedCount: completedSigns,
    };
  }
}

// Get horoscope for a specific sign and week
export async function getWeeklyHoroscope(
  zodiacSign: ZodiacSignKey,
  weekStart?: Date
): Promise<typeof weeklyHoroscopes.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  const { start } = getWeekDates(weekStart);
  const weekStartSql = formatDateSql(start);

  const [horoscope] = await db
    .select()
    .from(weeklyHoroscopes)
    .where(
      and(
        eq(weeklyHoroscopes.zodiacSign, zodiacSign),
        sql`${weeklyHoroscopes.weekStart} = ${weekStartSql}`
      )
    )
    .limit(1);

  return horoscope || null;
}

// Get all horoscopes for current week
export async function getAllWeeklyHoroscopes(
  weekStart?: Date
): Promise<typeof weeklyHoroscopes.$inferSelect[]> {
  const db = await getDb();
  if (!db) return [];

  const { start } = getWeekDates(weekStart);
  const weekStartSql = formatDateSql(start);

  return db
    .select()
    .from(weeklyHoroscopes)
    .where(sql`${weeklyHoroscopes.weekStart} = ${weekStartSql}`);
}

// Increment view count
export async function incrementHoroscopeView(horoscopeId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(weeklyHoroscopes)
    .set({
      viewCount: sql`view_count + 1`,
    })
    .where(eq(weeklyHoroscopes.id, horoscopeId));
}
