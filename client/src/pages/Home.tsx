import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import USPSection from "@/components/USPSection";
import ProductsSection from "@/components/ProductsSection";
import GuideSection from "@/components/GuideSection";
import MagazineSection from "@/components/MagazineSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createWebsiteSchema, createOrganizationSchema, createFAQSchema } from "@/lib/schema";
import { faqData } from "@/data/faqData";

export default function Home() {
  useEffect(() => {
    document.title = "Amulets.cz - Otevřete své srdce zázrakům";
    
    setOpenGraphTags({
      title: "Amulets.cz - Otevřete své srdce zázrakům",
      description: "Ručně vyráběné orgonitové pyramidy s drahými krystaly a modrým lotosem. Aromaterapeutické esence ze 100% esenciálních olejů nejvyšší kvality.",
      url: "https://amulets.cz/",
      type: "website",
    });

    // Schema.org markup
    setSchemaMarkup([
      createWebsiteSchema(),
      createOrganizationSchema(),
      createFAQSchema(faqData),
    ]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <USPSection />
        <ProductsSection />
        <TestimonialsSection />
        <GuideSection />
        <MagazineSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
