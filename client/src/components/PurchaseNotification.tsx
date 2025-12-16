import { useEffect, useState } from "react";
import { X, ShoppingBag } from "lucide-react";

interface PurchaseData {
  name: string;
  city: string;
  product: string;
  productImage: string;
}

const purchaseData: PurchaseData[] = [
  { name: "Eva", city: "Brna", product: "Esence Andělská", productImage: "/products/esence-andelska.webp" },
  { name: "Petra", city: "Prahy", product: "Pyramida Hojnost", productImage: "/products/pyramida-hojnost.webp" },
  { name: "Jana", city: "Ostravy", product: "Esence Plynoucí", productImage: "/products/esence-plynouci.webp" },
  { name: "Lucie", city: "Plzně", product: "Pyramida Světlo univerza", productImage: "/products/pyramida-svetlo-univerza-new.webp" },
  { name: "Martina", city: "Liberce", product: "Esence Tantra", productImage: "/products/esence-tantra.webp" },
  { name: "Kateřina", city: "Olomouce", product: "Pyramida Kristovo světlo", productImage: "/products/pyramida-kristovo-svetlo.webp" },
  { name: "Tereza", city: "Hradce Králové", product: "Esence Matka Země", productImage: "/products/esence-matka-zeme.webp" },
  { name: "Veronika", city: "Českých Budějovic", product: "Pyramida Kundaliní", productImage: "/products/pyramida-kundalini.webp" },
  { name: "Lenka", city: "Pardubic", product: "Esence Koruna", productImage: "/products/esence-andelska.webp" },
  { name: "Michaela", city: "Zlína", product: "Pyramida Hojnost", productImage: "/products/pyramida-hojnost.webp" },
];

export default function PurchaseNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosedManually, setIsClosedManually] = useState(false);

  useEffect(() => {
    if (isClosedManually) return;

    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // Show first notification after 5 seconds

    return () => clearTimeout(initialDelay);
  }, [isClosedManually]);

  useEffect(() => {
    if (isClosedManually) return;

    const interval = setInterval(() => {
      // Hide current notification
      setIsVisible(false);

      // After fade out, change to next notification
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchaseData.length);
        setIsVisible(true);
      }, 500); // Wait for fade out animation
    }, 12000); // Show each notification for 12 seconds

    return () => clearInterval(interval);
  }, [isClosedManually]);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosedManually(true);
  };

  if (isClosedManually) return null;

  const currentPurchase = purchaseData[currentIndex];

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-border p-4 max-w-sm flex items-start gap-3">
        {/* Product Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5">
          <img
            src={currentPurchase.productImage}
            alt={currentPurchase.product}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <ShoppingBag className="h-4 w-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-foreground">
              Nedávno zakoupeno
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{currentPurchase.name}</span> z{' '}
            <span className="font-medium text-foreground">{currentPurchase.city}</span>
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {currentPurchase.product}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-muted rounded-full transition-colors"
          aria-label="Zavřít"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
