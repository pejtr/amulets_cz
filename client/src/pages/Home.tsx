import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import USPSection from "@/components/USPSection";
import ProductsSection from "@/components/ProductsSection";
import GuideSection from "@/components/GuideSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <USPSection />
        <ProductsSection />
        <GuideSection />
      </main>
      <Footer />
    </div>
  );
}
