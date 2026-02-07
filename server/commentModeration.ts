/**
 * AI-powered Comment Moderation
 * 
 * Uses LLM to automatically classify comments as:
 * - approved: Quality comment, safe to publish
 * - pending: Needs human review (borderline content)
 * - spam: Obvious spam, auto-reject
 * - rejected: Inappropriate content, auto-reject
 */

import { invokeLLM } from "./_core/llm";

export interface ModerationResult {
  decision: "approved" | "pending" | "spam" | "rejected";
  confidence: number; // 0-1
  reason: string;
  flags: string[]; // e.g. ["spam_links", "profanity", "off_topic"]
}

const MODERATION_SYSTEM_PROMPT = `Jsi moderátor komentářů pro český spirituální web Amulets.cz, který se zabývá amulety, drahými kameny, spirituálními symboly, aromaterapií a osobním rozvojem.

Tvým úkolem je klasifikovat komentáře pod články. Rozhoduj na základě těchto pravidel:

SCHVÁLIT (approved) - komentář je:
- Relevantní k tématu článku (spiritualita, kameny, symboly, wellness, osobní rozvoj)
- Zdvořilý a respektující
- Obsahuje osobní zkušenost, otázku nebo konstruktivní názor
- Může obsahovat drobné gramatické chyby (to je OK)
- Pozitivní nebo neutrální tón

ČEKÁ NA KONTROLU (pending) - komentář:
- Je hraniční - není jasně spam ani jasně kvalitní
- Obsahuje odkaz, ale může být relevantní
- Je velmi krátký (méně než 10 slov) ale ne spam
- Zmiňuje konkurenční produkty

SPAM (spam) - komentář:
- Obsahuje reklamní odkazy nesouvisející s tématem
- Je generický marketingový text
- Obsahuje nabídky léků, kasina, půjček, kryptoměn
- Je napsaný v jiném jazyce než čeština/slovenština bez relevance
- Obsahuje opakující se klíčová slova (keyword stuffing)

ZAMÍTNOUT (rejected) - komentář:
- Obsahuje vulgarismy nebo urážky
- Je nenávistný nebo diskriminační
- Obsahuje osobní útoky
- Šíří dezinformace o zdraví (nebezpečné rady)

Odpověz VŽDY jako JSON objekt s těmito poli:
{
  "decision": "approved" | "pending" | "spam" | "rejected",
  "confidence": 0.0-1.0,
  "reason": "stručné zdůvodnění česky",
  "flags": ["seznam", "příznaků"]
}`;

/**
 * Moderate a comment using AI
 */
export async function moderateCommentWithAI(data: {
  content: string;
  authorName: string;
  articleSlug: string;
  articleType: string;
}): Promise<ModerationResult> {
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: MODERATION_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Klasifikuj tento komentář:

Článek: ${data.articleSlug} (typ: ${data.articleType})
Autor: ${data.authorName}
Komentář: "${data.content}"`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "comment_moderation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              decision: {
                type: "string",
                enum: ["approved", "pending", "spam", "rejected"],
                description: "Rozhodnutí o komentáři",
              },
              confidence: {
                type: "number",
                description: "Míra jistoty 0-1",
              },
              reason: {
                type: "string",
                description: "Stručné zdůvodnění česky",
              },
              flags: {
                type: "array",
                items: { type: "string" },
                description: "Seznam příznaků",
              },
            },
            required: ["decision", "confidence", "reason", "flags"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices?.[0]?.message?.content as string | undefined;
    if (!content) {
      console.warn("[AI Moderation] Empty response from LLM");
      return {
        decision: "pending",
        confidence: 0,
        reason: "AI moderace nedostupná - vyžaduje manuální kontrolu",
        flags: ["ai_unavailable"],
      };
    }

    const result = JSON.parse(content) as ModerationResult;

    // Validate confidence range
    result.confidence = Math.max(0, Math.min(1, result.confidence));

    // If confidence is low, default to pending for human review
    if (result.confidence < 0.7 && result.decision !== "pending") {
      console.log(`[AI Moderation] Low confidence (${result.confidence}), defaulting to pending`);
      result.decision = "pending";
    }

    console.log(`[AI Moderation] ${data.articleSlug}: "${data.content.substring(0, 50)}..." → ${result.decision} (${result.confidence})`);
    return result;
  } catch (error) {
    console.error("[AI Moderation] Error:", error);
    // Fallback to pending on error - safe default
    return {
      decision: "pending",
      confidence: 0,
      reason: "Chyba AI moderace - vyžaduje manuální kontrolu",
      flags: ["ai_error"],
    };
  }
}

/**
 * Quick spam check using simple heuristics (no LLM needed)
 * Returns true if comment is likely spam
 */
export function quickSpamCheck(content: string): boolean {
  const lowerContent = content.toLowerCase();

  // URL spam patterns
  const urlCount = (content.match(/https?:\/\//g) || []).length;
  if (urlCount >= 2) return true;

  // Common spam keywords
  const spamKeywords = [
    "casino", "viagra", "cialis", "bitcoin", "crypto", "forex",
    "loan", "credit card", "make money", "earn money", "click here",
    "buy now", "free offer", "limited time", "act now", "winner",
    "congratulations", "lottery", "prize", "inheritance",
    "půjčka bez registru", "rychlá půjčka", "online kasino",
  ];

  const matchCount = spamKeywords.filter((kw) => lowerContent.includes(kw)).length;
  if (matchCount >= 2) return true;

  // Excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (content.length > 20 && capsRatio > 0.6) return true;

  // Repeated characters
  if (/(.)\1{5,}/.test(content)) return true;

  return false;
}
