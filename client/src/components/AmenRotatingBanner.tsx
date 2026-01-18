import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

/**
 * Dynamický rotující banner s AMEN produkty z Irisimo
 * - Automatická rotace každých 5 sekund
 * - Manuální navigace šipkami
 * - Tracking kliků pro analytiku
 * - Responzivní design
 */

interface AmenBannerProps {
  /**
   * Počet produktů k zobrazení
   * @default 6
   */
  productCount?: number;
  
  /**
   * Interval rotace v milisekundách
   * @default 5000
   */
  rotationInterval?: number;
  
  /**
   * Zobrazit navigační šipky
   * @default true
   */
  showNavigation?: boolean;
  
  /**
   * Zobrazit indikátory (tečky)
   * @default true
   */
  showIndicators?: boolean;
  
  /**
   * Kategorie produktů (nahrdelnik, naramek, prsten, nausnice, privesek)
   * @default undefined (všechny)
   */
  category?: 'nahrdelnik' | 'naramek' | 'prsten' | 'nausnice' | 'privesek';
  
  /**
   * Kolekce (Rosary, Tennis, Tree of Life, Heart, Quadricuore, Angels)
   * @default undefined (všechny)
   */
  collection?: string;
  
  /**
   * Zobrazit pouze featured produkty
   * @default false
   */
  featuredOnly?: boolean;
}

export default function AmenRotatingBanner({
  productCount = 6,
  rotationInterval = 5000,
  showNavigation = true,
  showIndicators = true,
  category,
  collection,
  featuredOnly = false,
}: AmenBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Načíst AMEN produkty z API
  const { data: products, isLoading } = trpc.irisimo.getAmenPendants.useQuery({
    category,
    collection,
    featuredOnly,
    limit: productCount,
  });

  // Tracking kliků
  const trackClickMutation = trpc.chatbotAB.logEvent.useMutation();

  // Automatická rotace
  useEffect(() => {
    if (!products || products.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [products, isPaused, rotationInterval]);

  const handlePrevious = () => {
    if (!products) return;
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    if (!products) return;
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handleProductClick = (productId: string, productName: string, url: string) => {
    // Track klik
    trackClickMutation.mutate({
      visitorId: 'anonymous',
      eventType: 'amen_banner_click',
      eventData: JSON.stringify({
        productId,
        productName,
        position: currentIndex,
        category: category || 'all',
        collection: collection || 'all',
      }),
    });

    // Otevřít affiliate link
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <Card className="w-full p-8 animate-pulse">
        <div className="h-64 bg-muted rounded-lg" />
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <Card 
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner obsah */}
      <div className="relative aspect-[16/6] md:aspect-[21/6] bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Levá strana - Obrázek produktu */}
              <div className="flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <img
                    src={currentProduct.imageUrl}
                    alt={currentProduct.name}
                    className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  {currentProduct.featured && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Bestseller
                    </div>
                  )}
                </div>
              </div>

              {/* Pravá strana - Informace o produktu */}
              <div className="text-center md:text-left space-y-4">
                <div className="inline-block px-3 py-1 bg-pink-500/10 dark:bg-pink-500/20 rounded-full text-sm font-medium text-pink-700 dark:text-pink-300">
                  {currentProduct.collection}
                </div>
                
                <h3 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {currentProduct.name}
                </h3>
                
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                  {currentProduct.description}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {currentProduct.price.toLocaleString('cs-CZ')} Kč
                  </div>
                {currentProduct.material && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentProduct.material}
                  </div>
                )}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg"
                    onClick={() => handleProductClick(currentProduct.id, currentProduct.name, currentProduct.url)}
                  >
                    Zobrazit na Irisimo.cz
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {currentProduct.availability === 'skladem' && (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Skladem
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigační šipky */}
        {showNavigation && products.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Indikátory (tečky) */}
        {showIndicators && products.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-pink-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Přejít na produkt ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
