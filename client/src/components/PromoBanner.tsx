import { X } from "lucide-react";
import { useState } from "react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 shadow-md"
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
