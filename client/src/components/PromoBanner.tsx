import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Listen for chat open/close events
  useEffect(() => {
    const handleChatOpen = () => setIsChatOpen(true);
    const handleChatClose = () => setIsChatOpen(false);

    window.addEventListener('chatOpen', handleChatOpen);
    window.addEventListener('chatClose', handleChatClose);

    return () => {
      window.removeEventListener('chatOpen', handleChatOpen);
      window.removeEventListener('chatClose', handleChatClose);
    };
  }, []);

  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div 
      className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 shadow-md ${
        isChatOpen ? 'md:pb-2 pb-[calc(100dvh+0.5rem)]' : ''
      }`}
      style={{
        // Na mobilu: když je chat otevřený, banner nesmí překrývat chat
        ...(isChatOpen && window.innerWidth < 640 ? { position: 'relative', zIndex: 40 } : {})
      }}
    >
      <div className="container flex items-center justify-center gap-2 relative">
        <span className="text-sm md:text-base font-semibold text-center">
          🎁 {t('promo.freeShipping')}
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
