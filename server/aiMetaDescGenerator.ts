/**
 * AI Meta Description Generator
 * 
 * Uses LLM to generate optimized meta descriptions for articles
 * to improve organic CTR from search engines (Google, Seznam).
 */

import { invokeLLM } from "./_core/llm";
import { getMetaDescTestResults, createMetaDescTest } from "./metaDescABTest";

export interface GeneratedMetaDesc {
  variantKey: string;
  metaDescription: string;
  strategy: string;
  isControl: boolean;
}

export interface MetaDescGenerationResult {
  articleSlug: string;
  originalDescription: string;
  variants: GeneratedMetaDesc[];
  reasoning: string;
}

/**
 * Get historical winning patterns from past meta description A/B tests
 */
async function getWinningPatterns(): Promise<string> {
  try {
    const allResults = await getMetaDescTestResults();
    
    if (allResults.length === 0) {
      return "Zatím nemáme historická data z A/B testů meta popisků.";
    }

    const byArticle: Record<string, typeof allResults> = {};
    for (const r of allResults) {
      if (!byArticle[r.articleSlug]) byArticle[r.articleSlug] = [];
      byArticle[r.articleSlug].push(r);
    }

    const patterns: string[] = [];
    for (const [slug, variants] of Object.entries(byArticle)) {
      if (variants.length < 2) continue;
      
      const sorted = [...variants].sort((a, b) => b.ctr - a.ctr);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      
      if (best.ctr > 0 && worst.ctr > 0 && best.ctr > worst.ctr) {
        patterns.push(
          `"${slug}": Vítěz "${best.metaDescription.substring(0, 60)}..." (CTR ${best.ctr.toFixed(1)}%) vs. poražený "${worst.metaDescription.substring(0, 60)}..." (CTR ${worst.ctr.toFixed(1)}%)`
        );
      }
    }

    if (patterns.length === 0) {
      return "Máme data z testů meta popisků, ale zatím bez jasných vítězů.";
    }

    return `Historické vzorce z úspěšných A/B testů meta popisků:\n${patterns.join("\n")}`;
  } catch {
    return "Historická data nejsou k dispozici.";
  }
}

/**
 * Generate AI-powered meta description variants for an article
 */
export async function generateMetaDescVariants(
  articleSlug: string,
  originalTitle: string,
  originalDescription: string,
  articleExcerpt: string,
  articleType: "magazine" | "guide" | "stone" = "magazine",
  numberOfVariants: number = 3
): Promise<MetaDescGenerationResult> {
  const winningPatterns = await getWinningPatterns();

  const systemPrompt = `Jsi expert na SEO copywriting pro český spirituální a ezoterický web Amulets.cz.

Tvým úkolem je navrhnout alternativní meta descriptions (meta popisky) pro článek, které zvýší organický CTR z vyhledávačů (Google, Seznam).

PRAVIDLA PRO META DESCRIPTIONS:
1. Délka 120-155 znaků (optimální pro zobrazení ve výsledcích vyhledávání)
2. Musí být v češtině
3. Musí obsahovat hlavní klíčové slovo přirozeně
4. Musí motivovat ke kliknutí - jasný přínos pro čtenáře
5. Nepoužívej clickbait - musí odpovídat obsahu
6. Zachovej spirituální a ezoterický tón webu
7. Každá varianta musí používat jinou strategii

STRATEGIE PRO META DESCRIPTIONS:
- "benefit_cta" - Zdůrazni přínos + výzva k akci (Zjistěte..., Objevte...)
- "question" - Začni otázkou, která rezonuje s hledajícím
- "social_proof" - Zmínka o popularitě nebo autoritě (Tisíce lidí..., Odborníci doporučují...)
- "urgency" - Vyvolej pocit naléhavosti nebo exkluzivity
- "specific_value" - Konkrétní čísla a fakta (5 kroků, 33 symbolů)
- "emotional_hook" - Emocionální apel spojený s transformací
- "seo_rich" - Maximální SEO optimalizace s klíčovými slovy na začátku

${winningPatterns}`;

  const userPrompt = `Navrhni ${numberOfVariants} alternativní meta descriptions pro tento článek:

Typ: ${articleType === "magazine" ? "Magazínový článek" : articleType === "guide" ? "Průvodce symboly/amulety" : "Průvodce drahými kameny"}
Titulek: "${originalTitle}"
Aktuální meta description: "${originalDescription}"
Popis/úryvek: "${articleExcerpt}"
Slug: ${articleSlug}

Vrať JSON s polem variant. Každá varianta musí mít:
- variantKey: unikátní klíč (např. "ai-benefit-1")
- metaDescription: navržený meta popis (120-155 znaků)
- strategy: použitá strategie

Také přidej krátké zdůvodnění, proč jsi zvolil tyto varianty.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "meta_desc_variants",
          strict: true,
          schema: {
            type: "object",
            properties: {
              variants: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    variantKey: { type: "string", description: "Unique key like ai-benefit-1" },
                    metaDescription: { type: "string", description: "The proposed meta description in Czech, 120-155 chars" },
                    strategy: { type: "string", description: "Strategy used: benefit_cta, question, social_proof, urgency, specific_value, emotional_hook, seo_rich" },
                  },
                  required: ["variantKey", "metaDescription", "strategy"],
                  additionalProperties: false,
                },
              },
              reasoning: {
                type: "string",
                description: "Brief reasoning for the chosen variants in Czech",
              },
            },
            required: ["variants", "reasoning"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("Empty LLM response");
    }

    const parsed = JSON.parse(content) as {
      variants: Array<{ variantKey: string; metaDescription: string; strategy: string }>;
      reasoning: string;
    };

    const variants: GeneratedMetaDesc[] = [
      {
        variantKey: "control",
        metaDescription: originalDescription,
        strategy: "original",
        isControl: true,
      },
      ...parsed.variants.map(v => ({
        variantKey: v.variantKey,
        metaDescription: v.metaDescription,
        strategy: v.strategy,
        isControl: false,
      })),
    ];

    return {
      articleSlug,
      originalDescription,
      variants,
      reasoning: parsed.reasoning,
    };
  } catch (error) {
    console.error("[AI MetaDesc] Error generating variants:", error);
    throw new Error(`Chyba při generování meta popisků: ${error instanceof Error ? error.message : "Neznámá chyba"}`);
  }
}

/**
 * Generate meta descriptions AND automatically create an A/B test
 */
export async function generateAndCreateMetaDescTest(
  articleSlug: string,
  originalTitle: string,
  originalDescription: string,
  articleExcerpt: string,
  articleType: "magazine" | "guide" | "stone" = "magazine",
  numberOfVariants: number = 3
): Promise<MetaDescGenerationResult & { testCreated: boolean }> {
  const result = await generateMetaDescVariants(
    articleSlug,
    originalTitle,
    originalDescription,
    articleExcerpt,
    articleType,
    numberOfVariants
  );

  const testCreated = await createMetaDescTest({
    articleSlug,
    articleType,
    variants: result.variants.map(v => ({
      variantKey: v.variantKey,
      metaDescription: v.metaDescription,
      isControl: v.isControl,
    })),
  });

  console.log(`[AI MetaDesc] Generated ${result.variants.length} variants for "${articleSlug}", test created: ${testCreated}`);

  return {
    ...result,
    testCreated,
  };
}
