import { Button } from "@/components/ui/button";
import { track } from "@/lib/tracking";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Mobile: mockup image with text already in it */}
      <div className="md:hidden">
        <img
          src="/hero-mobile-mockup.jpg"
          alt="Natálie Ohorai - Zakladatelka Amulets.cz"
          className="w-full h-auto"
        />
        
        {/* Buttons below the image on mobile */}
        <div className="px-4 py-6 space-y-3 bg-gradient-to-b from-white/80 to-white">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-6 text-base rounded-lg shadow-lg"
            onClick={() => {
              track.ctaClicked('ZÍSKAT VÍCE', 'Hero Section', '#produkty');
              const produktySection = document.getElementById('produkty');
              if (produktySection) {
                produktySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            ZÍSKAT VÍCE
          </Button>
          <Button
            size="lg"
            className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-black font-bold py-6 text-base flex items-center justify-center gap-2 rounded-lg shadow-lg"
            onClick={() => {
              track.ohoraiButtonClicked('Hero Section');
              window.open('https://www.ohorai.cz', '_blank');
            }}
          >
            <span>Přejít na</span>
            <img src="/ohorai-logo.webp" alt="OHORAI" className="h-10 w-auto brightness-0" />
          </Button>
        </div>
      </div>

      {/* Desktop: original version with overlay text */}
      <div className="hidden md:block relative w-full min-h-[600px]">
        <img
          src="/hero-natalie-bg.jpg"
          alt="Natálie Ohorai - Zakladatelka Amulets.cz"
          className="w-full h-full object-cover"
        />

        {/* Content overlay - positioned on the LEFT */}
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="container">
            <div className="max-w-xl">
              {/* Text content - LEFT aligned */}
              <div className="relative space-y-2 md:space-y-6 px-4 py-3 md:py-8 lg:py-16 mb-4 md:mb-0 md:mt-0">
                {/* Signature - moved to top */}
                <div className="relative mb-2 md:mb-4 animate-fade-in-up inline-block">
                  {/* White fog background with minimal padding */}
                  <div className="absolute -inset-1 bg-white/80 backdrop-blur-sm rounded -z-10"></div>
                  
                  <div className="text-sm relative z-10 px-2 py-0.5">
                    <p className="font-bold text-base md:text-xl" style={{ 
                      color: '#D4AF37',
                      textShadow: '0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)'
                    }}>Natálie Ohorai</p>
                    <p className="italic text-[#2C3E50] font-semibold text-sm md:text-base" style={{
                      textShadow: '0 0 8px rgba(255, 255, 255, 0.9), 0 0 15px rgba(255, 255, 255, 0.7)'
                    }}>Zakladatelka Amulets.cz</p>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {/* Semi-transparent background for better readability */}
                  <div className="bg-white/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-3 md:p-0 rounded-lg md:rounded-none">
                    <h1 
                      className="text-xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2C3E50] leading-tight animate-fade-in-up relative"
                      style={{
                        textShadow: '2px 2px 4px rgba(255, 255, 255, 1), -2px -2px 4px rgba(255, 255, 255, 1), 0 0 15px rgba(255, 255, 255, 0.9), 0 0 25px rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      Otevřete své<br />srdce zázrakům
                    </h1>
                    <p className="text-sm md:text-lg lg:text-xl text-[#2C3E50] font-semibold animate-fade-in-up animation-delay-200"
                       style={{
                         textShadow: '1px 1px 3px rgba(255, 255, 255, 1), -1px -1px 3px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 0.9)'
                       }}>
                      ...začněte s tím právě teď
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-1.5 animate-fade-in-up animation-delay-400">
                  <Button
                    size="lg"
                    className="bg-[#E85A9F] hover:bg-[#E85A9F]/90 text-white font-semibold px-4 sm:px-8 py-3 sm:py-6 text-xs sm:text-base whitespace-nowrap"
                    onClick={() => {
                      track.ctaClicked('ZÍSKAT VÍCE', 'Hero Section', '#produkty');
                      const produktySection = document.getElementById('produkty');
                      if (produktySection) {
                        produktySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    ZÍSKAT VÍCE
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#D4AF37] bg-white hover:bg-[#D4AF37] hover:border-[#D4AF37] font-semibold px-3 sm:px-6 py-3 sm:py-6 text-xs sm:text-base flex items-center justify-center gap-1.5 transition-all duration-300 group whitespace-nowrap"
                    onClick={() => {
                      track.ohoraiButtonClicked('Hero Section');
                      window.open('https://www.ohorai.cz', '_blank');
                    }}
                  >
                    <span className="text-black group-hover:text-white transition-colors duration-300">Přejít na</span>
                    <img src="/ohorai-logo.webp" alt="OHORAI" className="h-10 sm:h-12 w-auto group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
