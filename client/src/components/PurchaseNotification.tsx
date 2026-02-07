import { useEffect, useState } from "react";
import { X, ShoppingBag, Clock } from "lucide-react";

interface PurchaseData {
  name: string;
  city: string;
  product: string;
  productImage: string;
  timeAgo: string;
}

const purchaseData: PurchaseData[] = [
  { name: "Eva", city: "Brna", product: "Esence Andělská", productImage: "/products/esence-andelska.webp", timeAgo: "před 3 minutami" },
  { name: "Petra", city: "Prahy", product: "Pyramida Hojnost", productImage: "/products/pyramida-hojnost.webp", timeAgo: "před 7 minutami" },
  { name: "Jana", city: "Ostravy", product: "Esence Plynoucí", productImage: "/products/esence-plynouci.webp", timeAgo: "před 12 minutami" },
  { name: "Lucie", city: "Plzně", product: "Pyramida Světlo univerza", productImage: "/products/pyramida-svetlo-univerza-new.webp", timeAgo: "před 18 minutami" },
  { name: "Martina", city: "Liberce", product: "Esence Tantra", productImage: "/products/esence-tantra.webp", timeAgo: "před 25 minutami" },
  { name: "Kateřina", city: "Olomouce", product: "Pyramida Kristovo světlo", productImage: "/products/pyramida-kristovo-svetlo.webp", timeAgo: "před 34 minutami" },
  { name: "Tereza", city: "Hradce Králové", product: "Esence Matka Země", productImage: "/products/esence-matka-zeme.webp", timeAgo: "před 47 minutami" },
  { name: "Veronika", city: "Českých Budějovic", product: "Pyramida Kundaliní", productImage: "/products/pyramida-kundalini.webp", timeAgo: "před 1 hodinou" },
  { name: "Lenka", city: "Pardubic", product: "Esence Koruna", productImage: "/products/esence-andelska.webp", timeAgo: "před 2 hodinami" },
  { name: "Michaela", city: "Zlína", product: "Pyramida Hojnost", productImage: "/products/pyramida-hojnost.webp", timeAgo: "před 3 hodinami" },
];

// Timing constants - delší prodlevy pro lepší UX
const INITIAL_DELAY = 60000; // 60 sekund před první notifikací
const NOTIFICATION_INTERVAL = 120000; // 2 minuty mezi notifikacemi
const FADE_OUT_DELAY = 500;

export default function PurchaseNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosedManually, setIsClosedManually] = useState(false);
  const [isOhoraiWidgetActive, setIsOhoraiWidgetActive] = useState(true);

  // Check if OHORAI widget is active (not minimized/closed)
  useEffect(() => {
    const checkOhoraiWidget = () => {
      // Check if OHORAI widget exists and is expanded (not minimized)
      const widget = document.querySelector('[data-ohorai-widget]');
      const isActive = widget && !widget.classList.contains('minimized');
      setIsOhoraiWidgetActive(!!isActive);
    };

    // Check initially
    checkOhoraiWidget();

    // Set up observer to watch for widget changes
    const observer = new MutationObserver(checkOhoraiWidget);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isClosedManually || isOhoraiWidgetActive) return;

    // Initial delay before first notification - delší prodleva
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, INITIAL_DELAY);

    return () => clearTimeout(initialDelay);
  }, [isClosedManually, isOhoraiWidgetActive]);

  useEffect(() => {
    if (isClosedManually || isOhoraiWidgetActive) return;

    const interval = setInterval(() => {
      // Hide current notification
      setIsVisible(false);

      // After fade out, change to next notification
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchaseData.length);
        setIsVisible(true);
      }, FADE_OUT_DELAY);
    }, NOTIFICATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isClosedManually, isOhoraiWidgetActive]);

  // Hide notification when OHORAI widget becomes active
  useEffect(() => {
    if (isOhoraiWidgetActive) {
      setIsVisible(false);
    }
  }, [isOhoraiWidgetActive]);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosedManually(true);
  };

  if (isClosedManually) return null;

  const currentPurchase = purchaseData[currentIndex];

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${
        isVisible && !isOhoraiWidgetActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-gradient-to-br from-white via-white to-emerald-50/60 rounded-lg shadow-2xl border border-emerald-100/50 p-4 max-w-md flex items-start gap-3">
        {/* Product Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <img
            src={currentPurchase.productImage}
            alt={currentPurchase.product}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-foreground">
                Nedávno zakoupeno
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{currentPurchase.name}</span> z{' '}
            <span className="font-medium text-foreground">{currentPurchase.city}</span>
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {currentPurchase.product}
          </p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground/70">
            <Clock className="h-3 w-3" />
            <span>{currentPurchase.timeAgo}</span>
          </div>
        </div>

        {/* CTA Button - úplně vpravo */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <button
            onClick={handleClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Zavřít"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
          <a
            href="https://ohorai.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            TAM CHCI &gt;
          </a>
        </div>
      </div>
    </div>
  );
}
