import { getDb } from "./db";
import { widgetVariants } from "../drizzle/schema";

/**
 * Seed data pro Widget A/B testování
 * Vytvoří testovací varianty pro Hero CTA tlačítka
 */
export async function seedWidgetVariants() {
  const db = await getDb();

  console.log("🌱 Seeding Widget A/B Test variants...");

  // Hero CTA Button Variants
  const heroCtaVariants = [
    {
      widgetKey: "hero_cta_primary",
      variantKey: "hero_cta_v1_control",
      name: "Hero CTA - Kontrolní varianta (Zobrazit produkty)",
      description: "Původní verze s textem 'Zobrazit produkty' a růžovým gradientem",
      config: {
        buttonText: "Zobrazit produkty",
        buttonIcon: "Eye",
        backgroundColor: "linear-gradient(to right, #ec4899, #db2777)",
        textColor: "#FFFFFF",
        borderColor: "#D4AF37",
        borderWidth: "2px",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "16px",
        borderRadius: "8px",
        hoverEffect: "scale",
      },
      weight: 50,
      isControl: true,
      isActive: true,
      notes: "Kontrolní varianta - současná verze",
    },
    {
      widgetKey: "hero_cta_primary",
      variantKey: "hero_cta_v2_discover",
      name: "Hero CTA - Varianta 2 (Objevte amulety)",
      description: "Změna textu na 'Objevte amulety' s fialovým gradientem",
      config: {
        buttonText: "Objevte amulety",
        buttonIcon: "Sparkles",
        backgroundColor: "linear-gradient(to right, #8b5cf6, #7c3aed)",
        textColor: "#FFFFFF",
        borderColor: "#D4AF37",
        borderWidth: "2px",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "16px",
        borderRadius: "8px",
        hoverEffect: "glow",
      },
      weight: 50,
      isControl: false,
      isActive: true,
      notes: "Testovací varianta - změna textu a barvy",
    },
  ];

  // Hero CTA Secondary Button Variants (OHORAI button)
  const heroCtaSecondaryVariants = [
    {
      widgetKey: "hero_cta_secondary",
      variantKey: "hero_cta_sec_v1_control",
      name: "Hero CTA Secondary - Kontrolní (Přejít na OHORAI)",
      description: "Původní verze s textem 'Přejít na' + logo",
      config: {
        buttonText: "Přejít na",
        showLogo: true,
        logoUrl: "/ohorai-logo.webp",
        backgroundColor: "linear-gradient(to right, #FDF8E8, #F5ECD0)",
        textColor: "#000000",
        borderColor: "#D4AF37",
        borderWidth: "2px",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "16px",
        borderRadius: "8px",
        hoverEffect: "gold",
      },
      weight: 50,
      isControl: true,
      isActive: true,
      notes: "Kontrolní varianta - současná verze",
    },
    {
      widgetKey: "hero_cta_secondary",
      variantKey: "hero_cta_sec_v2_nehtova",
      name: "Hero CTA Secondary - Varianta 2 (Nehtová móda)",
      description: "Změna textu na 'Nehtová móda' pro lepší kontext",
      config: {
        buttonText: "Nehtová móda",
        showLogo: true,
        logoUrl: "/ohorai-logo.webp",
        backgroundColor: "linear-gradient(to right, #FDF8E8, #F5ECD0)",
        textColor: "#000000",
        borderColor: "#D4AF37",
        borderWidth: "2px",
        fontSize: "13px",
        fontWeight: "bold",
        padding: "16px",
        borderRadius: "8px",
        hoverEffect: "gold",
      },
      weight: 50,
      isControl: false,
      isActive: true,
      notes: "Testovací varianta - změna textu pro lepší kontext",
    },
  ];

  // Quiz CTA Button Variants
  const quizCtaVariants = [
    {
      widgetKey: "hero_cta_quiz",
      variantKey: "hero_cta_quiz_v1_control",
      name: "Quiz CTA - Kontrolní (Zjisti svůj amulet)",
      description: "Původní verze s textem 'Zjisti svůj amulet'",
      config: {
        buttonText: "Zjisti svůj amulet",
        buttonIcon: "☥",
        backgroundColor: "linear-gradient(to right, #ec4899, #9333ea)",
        textColor: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "16px",
        borderRadius: "9999px",
        hoverEffect: "pulse",
        showArrow: true,
      },
      weight: 50,
      isControl: true,
      isActive: true,
      notes: "Kontrolní varianta - současná verze",
    },
    {
      widgetKey: "hero_cta_quiz",
      variantKey: "hero_cta_quiz_v2_najdi",
      name: "Quiz CTA - Varianta 2 (Najdi svůj ochranný symbol)",
      description: "Změna textu na 'Najdi svůj ochranný symbol' pro lepší konverzi",
      config: {
        buttonText: "Najdi svůj ochranný symbol",
        buttonIcon: "✨",
        backgroundColor: "linear-gradient(to right, #ec4899, #9333ea)",
        textColor: "#FFFFFF",
        fontSize: "13px",
        fontWeight: "bold",
        padding: "16px",
        borderRadius: "9999px",
        hoverEffect: "pulse",
        showArrow: true,
      },
      weight: 50,
      isControl: false,
      isActive: true,
      notes: "Testovací varianta - změna textu pro lepší konverzi",
    },
  ];

  // Recommendation Widget Variants
  const recommendationWidgetVariants = [
    {
      widgetKey: "recommendation_widget",
      variantKey: "recommendation_v1_control",
      name: "Doporučení - Kontrolní (Doporučujeme pro vás)",
      description: "Původní verze s 4 produkty v gridu",
      config: {
        title: "Doporučujeme pro vás",
        subtitle: "Na základě vašeho zájmu",
        layout: "grid",
        itemsCount: 4,
        showPrices: true,
        showRatings: true,
        showAddToCart: true,
        backgroundColor: "#FFFFFF",
        titleColor: "#1a1a2e",
      },
      weight: 50,
      isControl: true,
      isActive: true,
      notes: "Kontrolní varianta - současná verze",
    },
    {
      widgetKey: "recommendation_widget",
      variantKey: "recommendation_v2_personalized",
      name: "Doporučení - Varianta 2 (Vybrali jsme pro vás)",
      description: "Personalizovaný text s 6 produkty",
      config: {
        title: "Vybrali jsme pro vás",
        subtitle: "Podle vašeho znamení a preferencí",
        layout: "grid",
        itemsCount: 6,
        showPrices: true,
        showRatings: true,
        showAddToCart: true,
        backgroundColor: "#FFFFFF",
        titleColor: "#8b5cf6",
      },
      weight: 50,
      isControl: false,
      isActive: true,
      notes: "Testovací varianta - personalizovaný text a více produktů",
    },
  ];

  // Combine all variants
  const allVariants = [
    ...heroCtaVariants,
    ...heroCtaSecondaryVariants,
    ...quizCtaVariants,
    ...recommendationWidgetVariants,
  ];

  // Insert variants
  for (const variant of allVariants) {
    try {
      // Check if variant already exists
      const existing = await db
        .select()
        .from(widgetVariants)
        .where((t) => t.widgetKey === variant.widgetKey && t.variantKey === variant.variantKey)
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  Variant ${variant.variantKey} already exists, skipping...`);
        continue;
      }

      await db.insert(widgetVariants).values({
        widgetKey: variant.widgetKey,
        variantKey: variant.variantKey,
        name: variant.name,
        description: variant.description || null,
        config: JSON.stringify(variant.config),
        weight: variant.weight,
        isControl: variant.isControl,
        isActive: variant.isActive,
        notes: variant.notes || null,
        createdBy: "seed_script",
      });

      console.log(`✅ Created variant: ${variant.name}`);
    } catch (error) {
      console.error(`❌ Error creating variant ${variant.variantKey}:`, error);
    }
  }

  console.log("🎉 Widget variants seeded successfully!");
}

// Run if called directly
if (require.main === module) {
  seedWidgetVariants()
    .then(() => {
      console.log("✅ Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}
