import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import PurchaseNotification from "@/components/PurchaseNotification";
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
    document.title = "Amulets.cz - Posvátné symboly a amulety";
    
    setOpenGraphTags({
      title: "Amulets.cz - Posvátné symboly a amulety",
      description: "Objevte význam posvátných symbolů, drahých kamenů a amuletů. Průvodce ezoterickými symboly a jejich léčivou silou.",
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
      <PurchaseNotification />
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
