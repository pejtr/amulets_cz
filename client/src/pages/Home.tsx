import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import USPSection from "@/components/USPSection";
import ProductsSection from "@/components/ProductsSection";
import GuideSection from "@/components/GuideSection";
import MagazineSection from "@/components/MagazineSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { GuideCTA } from "@/components/GuideCTA";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { useEffect } from "react";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createWebsiteSchema, createOrganizationSchema, createFAQSchema } from "@/lib/schema";
import { faqData } from "@/data/faqData";

export default function Home() {
  useEffect(() => {
    document.title = "Amulets.cz - Otevřete své srdce zázrakům";
    
    setOpenGraphTags({
      title: "Amulets.cz - Otevřete své srdce zázrakům",
      description: "Ručně vyráběné orgonitové pyramidy s drahými krystaly a modrým lotosem. Aromaterapeutické esence ze 100% esenciálních olejů nejvyšší kvality. Objevte sílu drahých kamenů a posvátné geometrie.",
      url: "https://amulets.cz/",
      type: "website",
      image: "https://amulets.cz/og-image.jpg",
      imageWidth: "1200",
      imageHeight: "630",
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
      <ReadingProgressBar />
      <Header />
      <main>
        <HeroSection />
        <USPSection />
        <GuideCTA />
        <ProductsSection />
        <TestimonialsSection />
        <GuideSection />
        <MagazineSection />
        <FAQSection />
        <TestimonialsCarousel />
      </main>
      <Footer />
    </div>
  );
}
