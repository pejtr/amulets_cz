import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detekce mobilního zařízení
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const updateProgress = () => {
      // Celková výška dokumentu minus výška viewportu
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Aktuální scroll pozice
      const scrollTop = window.scrollY;
      
      // Vypočítáme procento (0-100)
      const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setProgress(scrollProgress);
    };

    // Inicializace
    updateProgress();

    // Event listener pro scroll
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Barvy podle zařízení
  const backgroundColor = isMobile 
    ? 'linear-gradient(to right, #E85A9F, #9B59B6)' 
    : '#FFFFFF';
  
  const boxShadowColor = isMobile 
    ? '0 0 20px rgba(232, 90, 159, 0.8), 0 0 40px rgba(155, 89, 182, 0.6), 0 0 60px rgba(232, 90, 159, 0.4), 0 2px 10px rgba(155, 89, 182, 0.5)'
    : '0 0 15px rgba(255, 255, 255, 0.9), 0 0 25px rgba(255, 255, 255, 0.6), 0 0 35px rgba(255, 255, 255, 0.3)';

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[100] pointer-events-none">
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{ 
          width: `${progress}%`,
          background: backgroundColor,
          boxShadow: boxShadowColor
        }}
      />
    </div>
  );
}
