import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";


import PurchaseNotification from "@/components/PurchaseNotification";
import HeroSection from "@/components/HeroSection";
import USPSection from "@/components/USPSection";

import GuideSection from "@/components/GuideSection";
import ChineseHoroscope2026Section from "@/components/ChineseHoroscope2026Section";
import MagazineSection from "@/components/MagazineSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AmenPendantsSection from "@/components/AmenPendantsSection";
import AmenCategorySections from "@/components/AmenCategorySections";
import CoachingSection from "@/components/CoachingSection";
import { trpc } from "@/lib/trpc";
import QuizCTA from "@/components/QuizCTA";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import HarmonyTuner from "@/components/HarmonyTuner";
import MobileBottomNav from "@/components/MobileBottomNav";
import EnhancedChatbot from "@/components/EnhancedChatbot";
import AromaterapieBanner from "@/components/AromaterapieBanner";
import { useEffect } from "react";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createWebsiteSchema, createOrganizationSchema, createFAQSchema } from "@/lib/schema";
import { faqData } from "@/data/faqData";

// Wrapper komponenta pro načítání AMEN produktů z API
function AmenCategorySectionsWrapper() {
  const { data: products, isLoading } = trpc.irisimo.getAmenProducts.useQuery();

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Načítání italských šperků AMEN...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return <AmenCategorySections products={products} />;
}

export default function Home() {
  useEffect(() => {
    document.title = "Amulets - Posvátné symboly a amulety | Amulets.cz";
    
    setOpenGraphTags({
      title: "Amulets - Posvátné symboly a amulety | Amulets.cz",
      description: "Amulets.cz - Objevte výnam posvátných symbolů, druhých kamenů a amule tů. Průvodce ezoterickými symboly a jejich léčivou silou.",
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
        <ChineseHoroscope2026Section />
        <GuideSection />
        <QuizCTA />

        <TestimonialsSection />
        <AromaterapieBanner />
        <CoachingSection />
        <AmenPendantsSection />
        <AmenCategorySectionsWrapper />
        <MagazineSection />
        <FAQSection />
      </main>

      <Footer />
      <HarmonyTuner />
      <MobileBottomNav />
      <EnhancedChatbot />
    </div>
  );
}
