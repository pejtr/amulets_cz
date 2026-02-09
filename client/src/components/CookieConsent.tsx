import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Zkontrolovat, zda uživatel již souhlasil
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Zobrazit banner po 1 sekundě
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-border shadow-lg animate-in slide-in-from-bottom duration-500">
      <div className="container py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-[#E85A9F]/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="h-5 w-5 text-[#E85A9F]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {t('cookie.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('cookie.description')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={declineCookies}
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('cookie.reject')}
            </button>
            <button
              onClick={acceptCookies}
              className="flex-1 md:flex-none px-6 py-2 text-sm font-medium text-white bg-[#E85A9F] hover:bg-[#E85A9F]/90 rounded-md transition-colors"
            >
              {t('cookie.accept')}
            </button>
            <button
              onClick={declineCookies}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Zavřít"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
