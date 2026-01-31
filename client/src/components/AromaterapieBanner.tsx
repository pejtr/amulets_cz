import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AromaterapieBanner() {
  const handleClick = () => {
    window.open("https://www.ohorai.cz/aromaterapie/", "_blank");
  };

  return (
    <section className="relative w-full overflow-hidden py-4 md:py-8">
      {/* Full width background image - no container restrictions */}
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[480px] lg:h-[580px]">
        <img
          src="/aromaterapie-banner.png"
          alt="Aromaterapie banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* SEO only - hidden heading */}
        <h2 className="sr-only">
          Vůně, která vám rozzáří život - 100% čisté aromaterapeutické esence
        </h2>
        
        {/* CTA Button - positioned to overlay the original button in the image */}
        <div className="absolute top-[52%] sm:top-[50%] md:top-[48%] left-[5%] sm:left-[7%] md:left-[10%]">
          <Button
            onClick={handleClick}
            size="lg"
            className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#D4AF37] text-black font-bold px-10 sm:px-14 md:px-20 lg:px-24 py-5 sm:py-6 md:py-8 lg:py-10 text-lg sm:text-xl md:text-2xl lg:text-3xl shadow-lg hover:shadow-xl transition-all duration-300 group rounded-full"
          >
            <span>Prohlédnout kolekci</span>
            <ArrowRight className="ml-2 sm:ml-3 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
