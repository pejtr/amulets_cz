import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-transparent z-[100]">
      <div
        className="h-full bg-[#D4AF37] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(212,175,55,0.8)]"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.9), 0 0 25px rgba(212, 175, 55, 0.6)'
        }}
      />
    </div>
  );
}
