import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import HeroSection from "@/components/HeroSection";
import USPSection from "@/components/USPSection";
import ProductsSection from "@/components/ProductsSection";
import GuideSection from "@/components/GuideSection";
import MagazineSection from "@/components/MagazineSection";
import TestimonialsSection from "@/components/TestimonialsSection";

import { GuideCTA } from "@/components/GuideCTA";
import QuizCTA from "@/components/QuizCTA";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { useEffect } from "react";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createWebsiteSchema, createOrganizationSchema, createFAQSchema } from "@/lib/schema";
import { faqData } from "@/data/faqData";

export default function Home() {
  useEffect(() => {
    document.title = "Amulets.cz - Zjisti svůj spirituální symbol | 33 posvátných symbolů";
    
    setOpenGraphTags({
      title: "Amulets.cz - Zjisti svůj spirituální symbol | 33 posvátných symbolů",
      description: "Objevte význam 33 spirituálních symbolů a najděte svůj osobní talisman. Průvodce ezoterikými symboly, drahými kameny a jejich léčivými účinky. Ručně vyráběné orgonitové pyramidy a aromaterapeutické esence.",
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
      <PromoBanner />
      <Header />
      <main>
        <HeroSection />
        <USPSection />
        <GuideCTA />
        <ProductsSection />
        <TestimonialsSection />
        <GuideSection />
        <QuizCTA />
        <MagazineSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
