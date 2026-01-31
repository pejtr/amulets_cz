import { useState } from "react";
import { X } from "lucide-react";

/**
 * OHORAI Sticky Widget
 * 
 * Kompaktní sticky widget propagující OHORAI.cz
 * - Video: Promo video z OHORAI.cz
 * - Pozice: Levá strana (aby nepřekrýval chatbota vpravo)
 */
export default function OhoraiWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  return (
    <div
      data-ohorai-widget
      className={`fixed z-40 transition-all duration-300 ${
        isMinimized
          ? "bottom-4 left-4 w-14 h-14"
          : "bottom-4 left-4 w-64 md:w-72"
      }`}
    >
      {isMinimized ? (
        // Minimized state - just icon
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          title="Otevřít OHORAI"
        >
          <img
            src="/ohorai-logo.webp"
            alt="OHORAI"
            className="w-8 h-8 object-contain"
          />
        </button>
      ) : (
        // Expanded state - compact widget with video
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-purple-200">
          {/* Header with logo and controls */}
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600">
            <img
              src="/ohorai-logo.webp"
              alt="OHORAI"
              className="h-6 w-auto"
            />
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
                title="Minimalizovat"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
                title="Zavřít"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>

          {/* Video */}
          <a
            href="https://ohorai.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <video
              src="/ohorai-promo.mp4"
              className="w-full"
              autoPlay
              loop
              muted
              playsInline
            />
          </a>

          {/* CTA */}
          <a
            href="https://ohorai.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 text-center text-sm transition-all"
          >
            Objevte OHORAI.cz ✨
          </a>
        </div>
      )}
    </div>
  );
}
