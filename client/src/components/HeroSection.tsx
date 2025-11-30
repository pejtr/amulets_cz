import { Button } from "@/components/ui/button";
import { track } from "@/lib/tracking";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Hero background image - use magical background on mobile */}
      <div className="relative w-full min-h-[600px] md:min-h-[600px]">
        {/* Mobile: magical background with Natalie */}
        <img
          src="/hero-mobile-mockup.jpg"
          alt="Natálie Ohorai - Zakladatelka Amulets.cz"
          className="md:hidden w-full h-full object-cover"
        />
        
        {/* Desktop: original background */}
        <img
          src="/hero-natalie-bg.jpg"
          alt="Natálie Ohorai - Zakladatelka Amulets.cz"
          className="hidden md:block w-full h-full object-cover"
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-start">
          <div className="container">
            <div className="max-w-xl md:ml-0 text-center md:text-left">
              {/* Text content */}
              <div className="relative space-y-4 md:space-y-6 px-4 py-8 md:py-16">
                
                {/* Main heading - white with strong shadow on mobile, dark on desktop */}
                <div className="space-y-2 md:space-y-4">
                  <h1 
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in-up"
                    style={{
                      color: 'white',
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), -2px -2px 8px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.7)'
                    }}
                  >
                    <span className="md:hidden">Otevřete své<br />srdce zázrakům</span>
                    <span className="hidden md:inline" style={{ color: '#2C3E50', textShadow: '2px 2px 4px rgba(255, 255, 255, 1), -2px -2px 4px rgba(255, 255, 255, 1), 0 0 15px rgba(255, 255, 255, 0.9)' }}>
                      Otevřete své<br />srdce zázrakům
                    </span>
                  </h1>
                  <p 
                    className="text-base md:text-lg lg:text-xl font-semibold animate-fade-in-up animation-delay-200"
                    style={{
                      color: 'white',
                      textShadow: '1px 1px 6px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    <span className="md:hidden">...začněte s tím právě teď</span>
                    <span className="hidden md:inline" style={{ color: '#2C3E50', textShadow: '1px 1px 3px rgba(255, 255, 255, 1), -1px -1px 3px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 0.9)' }}>
                      ...začněte s tím právě teď
                    </span>
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-400 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-8 py-6 text-base rounded-lg shadow-lg"
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
                    className="bg-[#D4AF37] hover:bg-[#C19B2E] text-black font-bold px-6 py-6 text-base flex items-center justify-center gap-2 rounded-lg shadow-lg"
                    onClick={() => {
                      track.ohoraiButtonClicked('Hero Section');
                      window.open('https://www.ohorai.cz', '_blank');
                    }}
                  >
                    <span>Přejít na</span>
                    <img src="/ohorai-logo.webp" alt="OHORAI" className="h-10 sm:h-12 w-auto brightness-0" />
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
