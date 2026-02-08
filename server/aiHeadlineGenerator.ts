/**
 * AI Headline Generator
 * 
 * Uses LLM to analyze article content and generate optimized headline variants
 * for A/B testing. Learns from historical test data to improve suggestions.
 */

import { invokeLLM } from "./_core/llm";
import { getHeadlineTestResults, createHeadlineTest } from "./headlineABTest";

export interface GeneratedHeadline {
  variantKey: string;
  headline: string;
  strategy: string;
  isControl: boolean;
}

export interface HeadlineGenerationResult {
  articleSlug: string;
  originalTitle: string;
  variants: GeneratedHeadline[];
  reasoning: string;
}

/**
 * Get historical winning patterns from past A/B tests
 */
async function getWinningPatterns(): Promise<string> {
  try {
    const allResults = await getHeadlineTestResults();
    
    if (allResults.length === 0) {
      return "Zatím nemáme historická data z A/B testů.";
    }

    // Group by article and find winners
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
          `Článek "${slug}": Vítěz "${best.headline}" (CTR ${best.ctr.toFixed(1)}%, dočtení ${best.completionRate.toFixed(0)}%) vs. poražený "${worst.headline}" (CTR ${worst.ctr.toFixed(1)}%, dočtení ${worst.completionRate.toFixed(0)}%)`
        );
      }
    }

    if (patterns.length === 0) {
      return "Máme data z testů, ale zatím bez jasných vítězů.";
    }

    return `Historické vzorce z úspěšných A/B testů:\n${patterns.join("\n")}`;
  } catch {
    return "Historická data nejsou k dispozici.";
  }
}

/**
 * Generate AI-powered headline variants for an article
 */
export async function generateHeadlineVariants(
  articleSlug: string,
  originalTitle: string,
  articleExcerpt: string,
  articleType: "magazine" | "guide" | "stone" = "magazine",
  numberOfVariants: number = 3
): Promise<HeadlineGenerationResult> {
  const winningPatterns = await getWinningPatterns();

  const systemPrompt = `Jsi expert na copywriting a SEO optimalizaci pro český spirituální a ezoterický web Amulets.cz.

Tvým úkolem je navrhnout alternativní titulky pro článek, které zvýší CTR (click-through rate) a míru dočtení.

PRAVIDLA:
1. Titulky musí být v češtině
2. Titulky musí být relevantní k obsahu článku
3. Každý titulek musí používat jinou strategii (viz níže)
4. Titulky by měly být 40-80 znaků
5. Nepoužívej clickbait - titulky musí odpovídat obsahu
6. Zachovej spirituální a ezoterický tón webu
7. Optimalizuj pro SEO - zahrň klíčová slova přirozeně

STRATEGIE PRO TITULKY:
- "curiosity" - Vyvolej zvědavost (otázka, překvapivý fakt)
- "benefit" - Zdůrazni přínos pro čtenáře (co získá)
- "number" - Použij číslo nebo seznam (5 způsobů, 7 tipů)
- "emotional" - Emocionální apel (strach, touha, naděje)
- "seo_power" - SEO optimalizovaný s hlavním klíčovým slovem na začátku
- "how_to" - Návod/průvodce formát (Jak..., Průvodce...)
- "authority" - Odborný/autoritativní tón (Kompletní průvodce, Vše co potřebujete vědět)

${winningPatterns}`;

  const userPrompt = `Navrhni ${numberOfVariants} alternativní titulky pro tento článek:

Typ: ${articleType === "magazine" ? "Magazínový článek" : articleType === "guide" ? "Průvodce symboly/amulety" : "Průvodce drahými kameny"}
Původní titulek: "${originalTitle}"
Popis/úryvek: "${articleExcerpt}"
Slug: ${articleSlug}

Vrať JSON s polem variant. Každá varianta musí mít:
- variantKey: unikátní klíč (např. "ai-curiosity-1")
- headline: navržený titulek
- strategy: použitá strategie (jedna z výše uvedených)

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
          name: "headline_variants",
          strict: true,
          schema: {
            type: "object",
            properties: {
              variants: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    variantKey: { type: "string", description: "Unique key like ai-curiosity-1" },
                    headline: { type: "string", description: "The proposed headline in Czech" },
                    strategy: { type: "string", description: "Strategy used: curiosity, benefit, number, emotional, seo_power, how_to, authority" },
                  },
                  required: ["variantKey", "headline", "strategy"],
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
      variants: Array<{ variantKey: string; headline: string; strategy: string }>;
      reasoning: string;
    };

    // Build result with control variant (original title)
    const variants: GeneratedHeadline[] = [
      {
        variantKey: "control",
        headline: originalTitle,
        strategy: "original",
        isControl: true,
      },
      ...parsed.variants.map(v => ({
        variantKey: v.variantKey,
        headline: v.headline,
        strategy: v.strategy,
        isControl: false,
      })),
    ];

    return {
      articleSlug,
      originalTitle,
      variants,
      reasoning: parsed.reasoning,
    };
  } catch (error) {
    console.error("[AI Headline] Error generating variants:", error);
    throw new Error(`Chyba při generování titulků: ${error instanceof Error ? error.message : "Neznámá chyba"}`);
  }
}

/**
 * Generate headlines AND automatically create an A/B test
 */
export async function generateAndCreateTest(
  articleSlug: string,
  originalTitle: string,
  articleExcerpt: string,
  articleType: "magazine" | "guide" | "stone" = "magazine",
  numberOfVariants: number = 3
): Promise<HeadlineGenerationResult & { testCreated: boolean }> {
  // Generate variants
  const result = await generateHeadlineVariants(
    articleSlug,
    originalTitle,
    articleExcerpt,
    articleType,
    numberOfVariants
  );

  // Create A/B test automatically
  const testCreated = await createHeadlineTest({
    articleSlug,
    articleType,
    variants: result.variants.map(v => ({
      variantKey: v.variantKey,
      headline: v.headline,
      isControl: v.isControl,
    })),
  });

  console.log(`[AI Headline] Generated ${result.variants.length} variants for "${articleSlug}", test created: ${testCreated}`);

  return {
    ...result,
    testCreated,
  };
}

/**
 * Batch generate headlines for multiple articles at once
 */
export async function batchGenerateHeadlines(
  articles: Array<{
    slug: string;
    title: string;
    excerpt: string;
    type: "magazine" | "guide" | "stone";
  }>,
  numberOfVariants: number = 3,
  autoCreateTests: boolean = false
): Promise<Array<HeadlineGenerationResult & { testCreated: boolean; error?: string }>> {
  const results: Array<HeadlineGenerationResult & { testCreated: boolean; error?: string }> = [];

  for (const article of articles) {
    try {
      if (autoCreateTests) {
        const result = await generateAndCreateTest(
          article.slug,
          article.title,
          article.excerpt,
          article.type,
          numberOfVariants
        );
        results.push(result);
      } else {
        const result = await generateHeadlineVariants(
          article.slug,
          article.title,
          article.excerpt,
          article.type,
          numberOfVariants
        );
        results.push({ ...result, testCreated: false });
      }
    } catch (error) {
      results.push({
        articleSlug: article.slug,
        originalTitle: article.title,
        variants: [],
        reasoning: "",
        testCreated: false,
        error: error instanceof Error ? error.message : "Neznámá chyba",
      });
    }
  }

  return results;
}
