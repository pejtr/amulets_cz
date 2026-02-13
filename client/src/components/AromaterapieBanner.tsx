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
        <div className="absolute top-[50%] sm:top-[48%] md:top-[46%] left-[3%] sm:left-[5%] md:left-[8%]">
          <Button
            onClick={handleClick}
            size="lg"
            className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#D4AF37] text-black font-bold px-12 sm:px-16 md:px-24 lg:px-32 py-6 sm:py-8 md:py-10 lg:py-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl shadow-lg hover:shadow-xl transition-all duration-300 group rounded-full"
          >
            <span>Prohlédnout kolekci</span>
            <ArrowRight className="ml-2 sm:ml-3 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
