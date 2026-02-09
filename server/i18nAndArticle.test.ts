import { describe, it, expect } from "vitest";

// ============================================
// 1. I18N TRANSLATION TESTS
// ============================================

describe("i18n Translation System", () => {
  it("i18n module exports and initializes correctly", async () => {
    const i18n = await import("../client/src/i18n");
    expect(i18n).toBeDefined();
  });

  it("Czech translations contain all main component keys", async () => {
    // Import the raw file to check keys
    const i18nModule = await import("../client/src/i18n");
    // The module initializes i18next, so we check the resource structure
    // by importing the file content
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/i18n.ts", "utf-8");
    
    // Header keys
    expect(content).toContain('"header.search"');
    expect(content).toContain('"header.needHelp"');
    expect(content).toContain('"header.chatbot"');
    
    // Navigation keys
    expect(content).toContain('"nav.guides"');
    expect(content).toContain('"nav.symbol"');
    expect(content).toContain('"nav.pyramids"');
    expect(content).toContain('"nav.aromatherapy"');
    expect(content).toContain('"nav.magazine"');
    expect(content).toContain('"nav.about"');
    
    // Hero keys
    expect(content).toContain('"hero.title"');
    expect(content).toContain('"hero.subtitle"');
    expect(content).toContain('"hero.cta.products"');
    
    // USP keys
    expect(content).toContain('"usp.delivery.title"');
    
    // Products keys
    expect(content).toContain('"products.pyramids.title"');
    expect(content).toContain('"products.essences.title"');
    
    // Footer keys
    expect(content).toContain('"footer.aboutNatalie"');
    expect(content).toContain('"footer.copyright"');
    
    // FAQ keys
    expect(content).toContain('"faq.title"');
    expect(content).toContain('"faq.subtitle"');
    
    // Cookie keys
    expect(content).toContain('"cookie.title"');
    expect(content).toContain('"cookie.accept"');
    expect(content).toContain('"cookie.reject"');
    
    // Testimonials keys
    expect(content).toContain('"testimonials.title"');
    
    // Guide keys
    expect(content).toContain('"guide.title"');
    
    // Magazine keys
    expect(content).toContain('"magazine.title"');
    expect(content).toContain('"magazine.subtitle"');
    
    // Quiz CTA keys
    expect(content).toContain('"quiz.title"');
    expect(content).toContain('"quiz.desc"');
    
    // Exit popup keys
    expect(content).toContain('"exitPopup.discountTitle"');
  });

  it("English translations exist for all main keys", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/i18n.ts", "utf-8");
    
    // Find English section
    const enSection = content.split("en:")[1]?.split("it:")[0] || "";
    
    // Check English has key translations
    expect(enSection).toContain('"header.search"');
    expect(enSection).toContain('"header.needHelp"');
    expect(enSection).toContain('"nav.guides"');
    expect(enSection).toContain('"nav.symbol"');
    expect(enSection).toContain('"hero.title"');
    expect(enSection).toContain('"hero.subtitle"');
    expect(enSection).toContain('"usp.delivery.title"');
    expect(enSection).toContain('"products.pyramids.title"');
    expect(enSection).toContain('"footer.aboutNatalie"');
    expect(enSection).toContain('"faq.title"');
    expect(enSection).toContain('"cookie.title"');
    expect(enSection).toContain('"testimonials.title"');
    expect(enSection).toContain('"guide.title"');
    expect(enSection).toContain('"magazine.title"');
    expect(enSection).toContain('"quiz.title"');
    expect(enSection).toContain('"exitPopup.discountTitle"');
  });

  it("Italian translations exist for all main keys", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/i18n.ts", "utf-8");
    
    // Find Italian section
    const itSection = content.split("it:")[1] || "";
    
    // Check Italian has key translations
    expect(itSection).toContain('"header.search"');
    expect(itSection).toContain('"nav.guides"');
    expect(itSection).toContain('"hero.title"');
    expect(itSection).toContain('"usp.delivery.title"');
    expect(itSection).toContain('"products.pyramids.title"');
    expect(itSection).toContain('"footer.aboutNatalie"');
    expect(itSection).toContain('"faq.title"');
    expect(itSection).toContain('"cookie.title"');
    expect(itSection).toContain('"testimonials.title"');
    expect(itSection).toContain('"magazine.title"');
    expect(itSection).toContain('"quiz.title"');
  });

  it("All three languages have matching key counts for critical sections", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/i18n.ts", "utf-8");
    
    // Count header keys in each language section
    const csSection = content.split("cs:")[1]?.split("en:")[0] || "";
    const enSection = content.split("en:")[1]?.split("it:")[0] || "";
    const itSection = content.split("it:")[1] || "";
    
    // Count header.* keys
    const csHeaderKeys = (csSection.match(/"header\./g) || []).length;
    const enHeaderKeys = (enSection.match(/"header\./g) || []).length;
    const itHeaderKeys = (itSection.match(/"header\./g) || []).length;
    
    expect(csHeaderKeys).toBe(enHeaderKeys);
    expect(csHeaderKeys).toBe(itHeaderKeys);
    
    // Count nav.* keys
    const csNavKeys = (csSection.match(/"nav\./g) || []).length;
    const enNavKeys = (enSection.match(/"nav\./g) || []).length;
    const itNavKeys = (itSection.match(/"nav\./g) || []).length;
    
    expect(csNavKeys).toBe(enNavKeys);
    expect(csNavKeys).toBe(itNavKeys);
  });

  it("Components import useTranslation hook", async () => {
    const fs = await import("fs");
    
    const components = [
      "client/src/components/Header.tsx",
      "client/src/components/HeroSection.tsx",
      "client/src/components/USPSection.tsx",
      "client/src/components/Footer.tsx",
      "client/src/components/FAQSection.tsx",
      "client/src/components/CookieConsent.tsx",
      "client/src/components/MobileBottomNav.tsx",
      "client/src/components/PromoBanner.tsx",
      "client/src/components/TestimonialsSection.tsx",
      "client/src/components/GuideSection.tsx",
      "client/src/components/ProductsSection.tsx",
      "client/src/components/MagazineSection.tsx",
      "client/src/components/GuideCTA.tsx",
      "client/src/components/QuizCTA.tsx",
      "client/src/components/ExitIntentPopup.tsx",
    ];
    
    for (const comp of components) {
      const content = fs.readFileSync(comp, "utf-8");
      expect(content).toContain("useTranslation");
    }
  });

  it("No duplicate translation keys exist in i18n.ts", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/i18n.ts", "utf-8");
    
    // Extract all translation keys from each language section
    const sections = ["cs", "en", "it"];
    
    for (const lang of sections) {
      let section: string;
      if (lang === "cs") {
        section = content.split("cs:")[1]?.split("en:")[0] || "";
      } else if (lang === "en") {
        section = content.split("en:")[1]?.split("it:")[0] || "";
      } else {
        section = content.split("it:")[1] || "";
      }
      
      const keyMatches = section.match(/"[a-zA-Z.]+"\s*:/g) || [];
      const keys = keyMatches.map(k => k.replace(/[":]/g, "").trim());
      const uniqueKeys = new Set(keys);
      
      // Check for duplicates
      if (keys.length !== uniqueKeys.size) {
        const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
        throw new Error(`Duplicate keys in ${lang}: ${duplicates.join(", ")}`);
      }
    }
  });
});

// ============================================
// 2. NEW MAGAZINE ARTICLE TESTS
// ============================================

describe("Magazine Article: 4 země, 4 kultury, 4 síly", () => {
  it("New article exists in magazineContent", async () => {
    const { magazineArticles } = await import("../client/src/data/magazineContent");
    const article = magazineArticles.find((a: any) => a.slug === "4-zeme-4-kultury-4-sily");
    
    expect(article).toBeDefined();
    expect(article!.title).toContain("4 země");
    expect(article!.title).toContain("4 kultury");
    expect(article!.title).toContain("4 síly");
  });

  it("Article has correct metadata", async () => {
    const { magazineArticles } = await import("../client/src/data/magazineContent");
    const article = magazineArticles.find((a: any) => a.slug === "4-zeme-4-kultury-4-sily");
    
    expect(article!.metaTitle).toBeDefined();
    expect(article!.metaDescription).toBeDefined();
    expect(article!.excerpt).toBeDefined();
    expect(article!.image).toContain("https://");
    expect(article!.datePublished).toBe("2026-02-09");
  });

  it("Article content contains all 4 cultures", async () => {
    const { magazineArticles } = await import("../client/src/data/magazineContent");
    const article = magazineArticles.find((a: any) => a.slug === "4-zeme-4-kultury-4-sily");
    
    expect(article!.content).toContain("Arábie");
    expect(article!.content).toContain("Sicílie");
    expect(article!.content).toContain("Česká");
    expect(article!.content).toContain("Egypt");
  });

  it("Article contains internal links to symbol pages (SEO)", async () => {
    const { magazineArticles } = await import("../client/src/data/magazineContent");
    const article = magazineArticles.find((a: any) => a.slug === "4-zeme-4-kultury-4-sily");
    
    // Must link to related symbol pages
    expect(article!.content).toContain("/symbol/pulmesic");
    expect(article!.content).toContain("/symbol/slunce");
    expect(article!.content).toContain("/symbol/strom-zivota");
    expect(article!.content).toContain("/symbol/skarabeus");
    expect(article!.content).toContain("/symbol/ankh");
    expect(article!.content).toContain("/symbol/lotosova-mandala");
    expect(article!.content).toContain("/symbol/hamsa-s-okem");
  });

  it("Article contains Instagram link for cross-promotion", async () => {
    const { magazineArticles } = await import("../client/src/data/magazineContent");
    const article = magazineArticles.find((a: any) => a.slug === "4-zeme-4-kultury-4-sily");
    
    expect(article!.content).toContain("instagram.com/ohorai.cz");
  });

  it("Article hero image is NOT duplicated in content body", async () => {
    const { magazineArticles } = await import("../client/src/data/magazineContent");
    const article = magazineArticles.find((a: any) => a.slug === "4-zeme-4-kultury-4-sily");
    
    // Hero image URL
    const heroUrl = article!.image;
    
    // Count occurrences in content - should be 0 (hero is separate from content)
    const contentImageMatches = (article!.content.match(new RegExp(heroUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    expect(contentImageMatches).toBe(0);
  });

  it("Article is set as featured in MagazineSection", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/components/MagazineSection.tsx", "utf-8");
    
    expect(content).toContain("4-zeme-4-kultury-4-sily");
  });

  it("Article image uses CDN URL (not local path)", async () => {
    const { magazineArticles } = await import("../client/src/data/magazineContent");
    const article = magazineArticles.find((a: any) => a.slug === "4-zeme-4-kultury-4-sily");
    
    expect(article!.image).toMatch(/^https:\/\//);
    expect(article!.image).not.toMatch(/^\/images\//);
  });
});
