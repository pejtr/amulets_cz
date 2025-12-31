import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // On mobile: hide banner when scrolled down more than 10px
      // Show banner only when at the very top (scrollY < 10)
      if (currentScrollY < 10) {
        setIsScrolled(false);
      } else if (currentScrollY > 50) {
        setIsScrolled(true);
      }
      // Between 10-50px, maintain current state (hysteresis)
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`sticky top-0 z-50 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 shadow-md transition-all duration-300 ${
        isScrolled ? 'md:block hidden' : ''
      }`}
    >
      <div className="container flex items-center justify-center gap-2 relative">
        <span className="text-sm md:text-base font-semibold text-center">
          🎁 Doprava zdarma nad 1 500 Kč
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Zavřít banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
