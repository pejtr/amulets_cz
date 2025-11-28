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

  // Interpolace barvy podle progress (0-100)
  const getColorForProgress = (progress: number) => {
    // Růžová #E85A9F (232, 90, 159) → Fialová #9B59B6 (155, 89, 182)
    const startColor = { r: 232, g: 90, b: 159 };
    const endColor = { r: 155, g: 89, b: 182 };
    
    const ratio = progress / 100;
    
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Barvy podle zařízení
  const backgroundColor = isMobile ? getColorForProgress(progress) : '#FFFFFF';
  
  const boxShadowColor = isMobile 
    ? (() => {
        const color = getColorForProgress(progress);
        return `0 0 20px ${color}, 0 0 40px ${color}CC, 0 0 60px ${color}80, 0 2px 10px ${color}B3`;
      })()
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
