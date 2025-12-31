import { Button } from "@/components/ui/button";
import { track } from "@/lib/tracking";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Mobile: cropped hero image (without buttons) + functional buttons below */}
      <div className="md:hidden">
        <img
          src="/hero-mobile-cropped.jpg"
          alt="Natálie Ohorai - Zakladatelka Amulets.cz"
          className="w-full h-auto"
        />
        
        {/* Functional buttons below the image on mobile */}
        <div className="px-4 py-4 space-y-3 bg-gradient-to-b from-[#1a1a2e] to-white">
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-sm rounded-lg shadow-lg h-14 flex items-center justify-center"
              onClick={() => {
                track.ctaClicked('PROHLÉDNOUT', 'Hero Section', '#produkty');
                const produktySection = document.getElementById('produkty');
                if (produktySection) {
                  produktySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              PROHLÉDNOUT
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-[#FDF8E8] to-[#F5ECD0] hover:from-[#D4AF37] hover:to-[#F0D060] text-black font-bold text-sm flex items-center justify-center gap-2 rounded-lg shadow-lg border-2 border-[#D4AF37] h-14"
              onClick={() => {
                track.ohoraiButtonClicked('Hero Section');
                window.open('https://www.ohorai.cz', '_blank');
              }}
            >
              <span>Přejít na</span>
              <img src="/ohorai-logo.webp" alt="OHORAI" className="h-6 w-auto brightness-0" />
            </Button>
          </div>
          
          {/* Zjisti svůj amulet button - below the two buttons */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 text-base rounded-full shadow-xl relative overflow-hidden group"
            onClick={() => {
              track.ctaClicked('Zjisti svůj amulet', 'Hero Section', '/kviz');
              setLocation('/kviz');
            }}
          >
            <span className="relative z-10"><span className="text-3xl mr-2">☥</span>Zjisti svůj amulet</span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl group-hover:translate-x-1 transition-transform">
              →
            </div>
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
                      Otevřete své srdce<br />zázrakům
                    </h1>
                    <p className="text-sm md:text-lg lg:text-xl text-[#2C3E50] font-semibold animate-fade-in-up animation-delay-200"
                       style={{
                         textShadow: '1px 1px 3px rgba(255, 255, 255, 1), -1px -1px 3px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 0.9)'
                       }}>
                      ...začněte s tím právě teď
                    </p>
                  </div>
                </div>

                {/* Two main buttons */}
                <div className="flex flex-row gap-1.5 animate-fade-in-up animation-delay-400">
                  <Button
                    size="lg"
                    className="bg-[#E85A9F] hover:bg-[#E85A9F]/90 text-white font-semibold px-4 sm:px-6 text-xs sm:text-base whitespace-nowrap h-[52px] sm:h-[60px] flex items-center justify-center"
                    onClick={() => {
                      track.ctaClicked('PROHLÉDNOUT', 'Hero Section', '#produkty');
                      const produktySection = document.getElementById('produkty');
                      if (produktySection) {
                        produktySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                >
                    PROHLÉDNOUT
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#D4AF37] bg-gradient-to-r from-[#FDF8E8] to-[#F5ECD0] hover:from-[#D4AF37] hover:to-[#F0D060] font-semibold px-3 sm:px-6 text-xs sm:text-base flex items-center justify-center gap-1.5 transition-all duration-300 group whitespace-nowrap shadow-md h-[52px] sm:h-[60px]"
                    onClick={() => {
                      track.ohoraiButtonClicked('Hero Section');
                      window.open('https://www.ohorai.cz', '_blank');
                    }}
                  >
                    <span className="text-black group-hover:text-white transition-colors duration-300">Přejít na</span>
                    <img src="/ohorai-logo.webp" alt="OHORAI" className="h-10 sm:h-12 w-auto group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                  </Button>
                </div>

                {/* Zjisti svůj amulet button - below the two buttons on desktop */}
                <div className="animate-fade-in-up animation-delay-600">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold pl-10 pr-14 py-6 text-lg rounded-full shadow-xl relative overflow-hidden group"
                    onClick={() => {
                      track.ctaClicked('Zjisti svůj amulet', 'Hero Section', '/kviz');
                      setLocation('/kviz');
                    }}
                  >
                    <span className="relative z-10"><span className="text-4xl mr-2">☥</span>Zjisti svůj amulet</span>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl group-hover:translate-x-1 transition-transform">
                      →
                    </div>
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
