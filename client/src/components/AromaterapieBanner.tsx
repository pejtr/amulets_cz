import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AromaterapieBanner() {
  const handleClick = () => {
    window.open("https://www.ohorai.cz/aromaterapie/", "_blank");
  };

  return (
    <section className="relative w-full overflow-hidden py-4 md:py-8">
      {/* Full width background image - no container restrictions */}
      <div 
        className="relative w-full h-[200px] sm:h-[280px] md:h-[400px] lg:h-[500px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/aromaterapie-banner.png')" }}
      >
        {/* SEO only - hidden heading */}
        <h2 className="sr-only">
          Vůně, která vám rozzáří život - 100% čisté aromaterapeutické esence
        </h2>
        
        {/* CTA Button - positioned to overlay the original button in the image */}
        <div className="absolute top-[55%] md:top-[52%] left-[8%] md:left-[12%]">
          <Button
            onClick={handleClick}
            size="lg"
            className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#D4AF37] text-black font-bold px-4 sm:px-6 md:px-10 py-2 sm:py-3 md:py-6 text-sm sm:text-base md:text-xl shadow-lg hover:shadow-xl transition-all duration-300 group rounded-full"
          >
            <span>Prohlédnout kolekci</span>
            <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
