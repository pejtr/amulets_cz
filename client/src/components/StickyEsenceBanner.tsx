import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

/**
 * Sticky Banner - Vyjíždějící reklama ze spodku stránky
 * Propaguje aromaterapeutické esence OHORAI
 */
export default function StickyEsenceBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Zkontrolovat, jestli už uživatel banner zavřel (v této session)
    const bannerClosed = sessionStorage.getItem('esence_banner_closed');
    if (bannerClosed === 'true') {
      setIsClosed(true);
      return;
    }

    // Zobrazit banner po 3 sekundách
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true);
    sessionStorage.setItem('esence_banner_closed', 'true');
  };

  const handleClick = () => {
    // Otevřít odkaz v novém okně
    window.open('https://www.ohorai.cz/esence/', '_blank');
  };

  if (isClosed) return null;

  return (
    <>
      {/* Overlay pro backdrop efekt */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-500"
          onClick={handleClose}
        />
      )}

      {/* Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-700 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container py-4">
          <div className="relative max-w-4xl mx-auto">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute -top-2 -right-2 z-10 bg-white hover:bg-gray-100 rounded-full shadow-lg w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Banner Content - Clickable */}
            <button
              onClick={handleClick}
              className="block w-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-4 border-white"
            >
              <img
                src="/esence-banner.png"
                alt="Vůně, která vám rozzáří život - 100% čisté aromaterapeutické esence OHORAI"
                className="w-full h-auto"
              />
            </button>

            {/* Optional: Text overlay for better accessibility */}
            <div className="sr-only">
              Klikněte pro zobrazení aromaterapeutických esencí OHORAI - 
              100% čisté esence, ruční tvorba a muzikoterapie. 
              Česká značka, vůně čisté přírody, harmonie těla a ducha.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
