import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Zobrazit tlačítko po scrollu více než 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-28 right-6 z-40 w-10 h-10 rounded-full bg-[#E85A9F] text-white shadow-lg hover:bg-[#E85A9F]/90 transition-all hover:scale-110 animate-in fade-in slide-in-from-bottom-4 duration-300"
      aria-label="Zpět nahoru"
    >
      <ArrowUp className="h-5 w-5 mx-auto" />
    </button>
  );
}
