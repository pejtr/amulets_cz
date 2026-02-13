import { Button } from "@/components/ui/button";
import { track } from "@/lib/tracking";
import { Eye } from "lucide-react";
import { useLocation } from "wouter";
import { useMusic } from "@/contexts/MusicContext";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const { isPlaying: isMusicPlaying } = useMusic();
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax calculations - velmi jemné pro elegantní "vznášení"
  // Použití easing funkce pro plynulejší pohyb
  const easeOutQuad = (t: number) => t * (2 - t);
  const scrollProgress = Math.min(scrollY / 600, 1);
  const easedProgress = easeOutQuad(scrollProgress);
  
  const parallaxBg = scrollY * 0.15; // Velmi jemný pohyb pozadí
  const parallaxSymbols = scrollY * 0.08; // Ještě jemnější pohyb symbolů
  const parallaxOpacity = Math.max(0, 1 - easedProgress); // Smooth fade out

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Mobile: cropped hero image (without buttons) + functional buttons below */}
      <div className="md:hidden relative">
        <img
          src="/hero-mobile-cropped.webp"
          alt="Natálie Ohorai - Zakladatelka Amulets.cz"
          className="w-full h-auto"
        />
        
        {/* Animated sparkles overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating sparkles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
          
          {/* Larger glowing orbs */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-200 to-amber-300 rounded-full animate-float-glow"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
                filter: 'blur(1px)',
                boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.5)',
              }}
            />
          ))}
        </div>
        
        {/* Functional buttons below the image on mobile */}
        <div className="px-4 py-4 space-y-3 bg-gradient-to-b from-[#1a1a2e] to-white">
          {/* First row - two main buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-sm rounded-lg shadow-lg h-16 flex items-center justify-center gap-2 py-2 border-2 border-[#D4AF37]"
              onClick={() => {
                track.ctaClicked('Zobrazit produkty', 'Hero Section', '#produkty');
                const produktySection = document.getElementById('produkty');
                if (produktySection) {
                  produktySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <Eye className="w-5 h-5 text-white" />
              <span className="flex flex-col leading-tight"><span>Zobrazit</span><span>produkty</span></span>
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-[#FDF8E8] to-[#F5ECD0] hover:from-[#D4AF37] hover:to-[#F0D060] text-black font-bold text-sm flex items-center justify-center gap-2 rounded-lg shadow-lg border-2 border-[#D4AF37] h-16"
              onClick={() => {
                track.ohoraiButtonClicked('Hero Section', 'mobile');
                window.open('https://www.ohorai.cz?utm_source=amulets&utm_medium=hero_cta&utm_campaign=cross_promotion&utm_content=mobile', '_blank');
              }}
            >
              <span>Přejít na</span>
              <img src="/ohorai-logo.webp" alt="OHORAI" className="h-6 w-auto brightness-0" />
            </Button>
          </div>
          
          {/* Second row - Zjisti svůj amulet + POPOVÍDAT SI */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-[2] bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm rounded-full shadow-xl relative overflow-hidden group h-16 flex items-center justify-center"
              onClick={() => {
                track.ctaClicked('Zjisti svůj amulet', 'Hero Section', '/kviz');
                setLocation('/kviz');
              }}
            >
              <span className="relative z-10"><span className="text-2xl mr-1">☥</span>Zjisti svůj amulet</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl group-hover:translate-x-1 transition-transform">
                →
              </div>
            </Button>
            
            {/* POPOVÍDAT SI button */}
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-xs rounded-lg shadow-lg h-16 flex flex-col items-center justify-center gap-0.5 border-2 border-purple-400"
              onClick={() => {
                track.ctaClicked('Popovídat si', 'Hero Section', 'chatbot');
                const chatButton = document.querySelector('[aria-label="Otevřít chat s Natálií"]') as HTMLButtonElement;
                if (chatButton) chatButton.click();
              }}
            >
              <span className="text-sm">💬 POPOVÍDAT SI</span>
              <span className="text-[9px] text-white/80 leading-tight">Online 8:00-22:00</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: original version with overlay text + PARALLAX */}
      <div className="hidden md:block relative w-full min-h-[600px]">
        {/* ARCHANDĚLSKÁ KŘÍDLA - Božsky bílá křídla ZA Natálií - plynulá animace při hudbě */}
        <div className={`absolute inset-0 pointer-events-none overflow-hidden z-5 transition-all duration-[2000ms] ease-out ${isMusicPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ transformOrigin: 'center center' }}>
          {/* Obrázek archandělských křídel - vycentrováno za Natálií */}
          <div 
            className="absolute animate-angel-wings"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '800px',
              height: '600px',
            }}
          >
            <img 
              src="/angel-wings-white.png" 
              alt="Archandělská křídla"
              className="w-full h-full object-contain"
              style={{
                filter: 'brightness(1.8) drop-shadow(0 0 50px rgba(255, 255, 255, 1)) drop-shadow(0 0 100px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 150px rgba(255, 255, 255, 0.6))',
              }}
            />
          </div>
          
          {/* Zlatá záře za hlavou - HALO efekt - výrazný */}
          <div 
            className="absolute animate-golden-glow rounded-full"
            style={{
              right: '18%',
              top: '2%',
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(212, 175, 55, 0.6) 30%, rgba(255, 223, 0, 0.3) 60%, transparent 80%)',
            }}
          />
          
          {/* Éterické částice - vznášející se zlaté jiskry */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`ethereal-${i}`}
              className="absolute animate-ethereal-particle"
              style={{
                right: `${10 + Math.random() * 35}%`,
                top: `${5 + Math.random() * 60}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: 'radial-gradient(circle, rgba(255, 223, 0, 0.9) 0%, rgba(212, 175, 55, 0.6) 50%, transparent 100%)',
                borderRadius: '50%',
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                boxShadow: '0 0 6px 2px rgba(255, 215, 0, 0.4)',
              }}
            />
          ))}
          
          {/* Světelné paprsky z křídel */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`ray-${i}`}
              className="absolute animate-wing-light-ray"
              style={{
                right: `${15 + i * 5}%`,
                top: '5%',
                width: '3px',
                height: '400px',
                background: 'linear-gradient(to bottom, rgba(255, 223, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 30%, transparent 100%)',
                transformOrigin: 'top center',
                '--ray-angle': `${-20 + i * 8}deg`,
                animationDelay: `${i * 0.3}s`,
              } as React.CSSProperties}
            />
          ))}
          
          {/* Třpytky na křídlech */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`sparkle-wing-${i}`}
              className="absolute animate-wing-sparkle"
              style={{
                right: `${8 + Math.random() * 40}%`,
                top: `${10 + Math.random() * 50}%`,
                width: '4px',
                height: '4px',
                background: 'white',
                borderRadius: '50%',
                boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(255, 215, 0, 0.5)',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Background image with parallax */}
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/89740521/BdmiRovyxtpcIWTi.jpg"
          alt="Natálie Ohorai - Zakladatelka Amulets.cz"
          className="w-full h-full object-cover relative z-0"
          style={{
            transform: `translateY(${parallaxBg}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        
        {/* Animated sparkles overlay - Desktop with parallax */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            transform: `translateY(${parallaxSymbols}px)`,
            opacity: parallaxOpacity,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
          }}
        >
          {/* Floating sparkles */}
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: 0.5 + Math.random() * 0.5,
              }}
            />
          ))}
          
          {/* Larger glowing orbs */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute w-3 h-3 bg-gradient-to-r from-yellow-200 to-amber-300 rounded-full animate-float-glow"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
                filter: 'blur(1px)',
                boxShadow: '0 0 15px 3px rgba(255, 215, 0, 0.4)',
              }}
            />
          ))}
          
          {/* Subtle light rays */}
          <div 
            className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-b from-yellow-100/20 via-transparent to-transparent animate-pulse-slow"
            style={{ transform: 'rotate(15deg)', transformOrigin: 'top center' }}
          />
          <div 
            className="absolute top-0 right-1/3 w-24 h-full bg-gradient-to-b from-amber-100/15 via-transparent to-transparent animate-pulse-slow"
            style={{ transform: 'rotate(-10deg)', transformOrigin: 'top center', animationDelay: '1s' }}
          />
        </div>

        {/* Content overlay - positioned on the LEFT */}
        <div className="absolute inset-0 flex items-end md:items-center z-20">
          <div className="container">
            <div className="max-w-xl">
              {/* Text content - LEFT aligned */}
              <div className="relative space-y-2 md:space-y-6 px-4 py-3 md:py-8 lg:py-16 mb-4 md:mb-0 md:mt-0">
                <div className="space-y-3 md:space-y-4">
                  {/* Semi-transparent background for better readability */}
                  <div className="bg-white/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-3 md:p-0 rounded-lg md:rounded-none">
                    <h1 
                      className="text-xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2C3E50] leading-tight animate-fade-in-up relative"
                      style={{
                        textShadow: '2px 2px 4px rgba(255, 255, 255, 1), -2px -2px 4px rgba(255, 255, 255, 1), 0 0 15px rgba(255, 255, 255, 0.9), 0 0 25px rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      Posvátné symboly<br />a amulety
                    </h1>
                    <p className="text-sm md:text-lg lg:text-xl text-[#2C3E50] font-semibold animate-fade-in-up animation-delay-200"
                       style={{
                         textShadow: '1px 1px 3px rgba(255, 255, 255, 1), -1px -1px 3px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 0.9)'
                       }}>
                      Objevte sílu drahých kamenů a talismanů
                    </p>
                  </div>
                </div>

                {/* First row - two main buttons */}
                <div className="flex flex-row gap-1.5 animate-fade-in-up animation-delay-400">
                  <Button
                    size="lg"
                    className="flex-1 bg-[#E85A9F] hover:bg-[#E85A9F]/90 text-white font-semibold px-4 sm:px-6 text-xs sm:text-base whitespace-nowrap h-[60px] flex items-center justify-center gap-2"
                    onClick={() => {
                      track.ctaClicked('Zobrazit produkty', 'Hero Section', '#produkty');
                      const produktySection = document.getElementById('produkty');
                      if (produktySection) {
                        produktySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    <Eye className="w-5 h-5" />
                    Zobrazit produkty
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-2 border-[#D4AF37] bg-gradient-to-r from-[#FDF8E8] to-[#F5ECD0] hover:from-[#D4AF37] hover:to-[#F0D060] font-semibold px-3 sm:px-6 text-xs sm:text-base flex items-center justify-center gap-1.5 transition-all duration-300 group whitespace-nowrap shadow-md h-[60px]"
                    onClick={() => {
                      track.ohoraiButtonClicked('Hero Section', 'desktop');
                      window.open('https://www.ohorai.cz?utm_source=amulets&utm_medium=hero_cta&utm_campaign=cross_promotion&utm_content=desktop', '_blank');
                    }}
                  >
                    <span className="text-black group-hover:text-white transition-colors duration-300">Přejít na</span>
                    <img src="/ohorai-logo.webp" alt="OHORAI" className="h-10 sm:h-12 w-auto group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                  </Button>
                </div>

                {/* Second row - Zjisti svůj amulet + POPOVÍDAT SI */}
                <div className="flex flex-row gap-1.5 animate-fade-in-up animation-delay-600">
                  <Button
                    size="lg"
                    className="flex-[2] bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold pl-6 pr-12 text-lg rounded-full shadow-xl relative overflow-hidden group h-[60px] flex items-center justify-center"
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
                  
                  {/* POPOVÍDAT SI button */}
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-4 sm:px-6 text-xs sm:text-base flex flex-col items-center justify-center gap-1 transition-all duration-300 whitespace-nowrap shadow-md h-[60px] border-2 border-purple-400 rounded-lg"
                    onClick={() => {
                      track.ctaClicked('Popovídat si', 'Hero Section', 'chatbot');
                      const chatButton = document.querySelector('[aria-label="Otevřít chat s Natálií"]') as HTMLButtonElement;
                      if (chatButton) chatButton.click();
                    }}
                  >
                    <span className="text-sm sm:text-base">💬 POPOVÍDAT SI</span>
                    <span className="text-[9px] sm:text-[10px] text-white/80">Online 8:00-22:00</span>
                  </Button>
                </div>

                {/* Signature - moved below Zjisti svůj amulet button */}
                <div className="relative animate-fade-in-up animation-delay-800 inline-block mt-24 ml-[165px]">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
