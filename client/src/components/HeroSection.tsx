import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Hero background image */}
      <div className="relative w-full min-h-[400px] md:min-h-[600px]">
        <img
          src="/hero-natalie-bg.jpg"
          alt="Natálie Ohorai - Zakladatelka Amulets.cz"
          className="w-full h-full object-cover"
        />

        {/* Content overlay - positioned on the LEFT to avoid covering the person */}
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl">
              {/* Text content - LEFT aligned */}
              <div className="relative space-y-4 md:space-y-6 px-4 py-6 md:py-8 lg:py-16">
                <div className="space-y-3 md:space-y-4">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2C3E50] leading-tight animate-fade-in-up relative">
                    Otevřete své srdce zázrakům
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl text-[#2C3E50]/80 animate-fade-in-up animation-delay-200">
                    ...začněte s tím právě teď
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 animate-fade-in-up animation-delay-400">
                  <Button
                    size="lg"
                    className="bg-[#E85A9F] hover:bg-[#E85A9F]/90 text-white font-semibold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base whitespace-nowrap"
                  >
                    ZÍSKAT VÍCE
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#D4AF37] bg-white hover:bg-[#D4AF37] hover:border-[#D4AF37] font-semibold px-4 sm:px-6 py-5 sm:py-6 text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 group whitespace-nowrap"
                    onClick={() => window.open('https://www.ohorai.cz', '_blank')}
                  >
                    <span className="text-black group-hover:text-white transition-colors duration-300">Přejít na</span>
                    <img src="/ohorai-logo.webp" alt="OHORAI" className="h-6 sm:h-8 w-auto group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                  </Button>
                </div>

                {/* Signature - below buttons with minimal spacing */}
                <div className="relative mt-3 md:mt-4 mb-0 animate-fade-in-up animation-delay-600 inline-block">
                  {/* White fog background with minimal padding */}
                  <div className="absolute -inset-1 bg-white/80 backdrop-blur-sm rounded -z-10"></div>
                  
                  <div className="text-sm relative z-10 px-2 py-1">
                    <p className="font-bold text-lg md:text-xl" style={{ 
                      color: '#D4AF37',
                      textShadow: '0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)'
                    }}>Natálie Ohorai</p>
                    <p className="italic text-[#2C3E50] font-semibold text-sm md:text-base" style={{
                      textShadow: '0 0 8px rgba(255, 255, 255, 0.9), 0 0 15px rgba(255, 255, 255, 0.7)'
                    }}>Zakladatelka Amulets.cz</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
