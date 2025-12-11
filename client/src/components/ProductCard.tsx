import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, ExternalLink } from "lucide-react";
import { track } from "@/lib/tracking";
import StarRating from "@/components/StarRating";

interface ProductCardProps {
  name: string;
  price: string;
  image?: string;
  video?: string;
  available?: boolean;
  url?: string;
  description?: string;
  onQuickView?: () => void;
  badgeText?: string; // Custom urgency badge text
  rating?: number; // 0-5 star rating
  reviewCount?: number; // Number of reviews
}

export default function ProductCard({
  name,
  price,
  image,
  video,
  available = true,
  url,
  description,
  onQuickView,
  badgeText,
  rating,
  reviewCount,
}: ProductCardProps) {
  // Determine badge text based on product type
  const getBadgeText = () => {
    if (badgeText) return badgeText;
    
    // Pyramids: "Skladem" (each is unique original)
    if (name.includes('Pyramida')) {
      return 'Skladem';
    }
    
    // Essences: "Limitovaná edice"
    return 'Limitovaná edice';
  };
  const handleClick = () => {
    if (url) {
      // Track product click
      const priceNum = parseInt(price.replace(/\D/g, ''));
      const category = name.includes('Pyramida') ? 'Pyramidy' : 'Esence';
      track.buyButtonClicked(name, priceNum, url);
      
      window.open(url, '_blank');
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView();
    }
  };

  return (
    <div 
      className={`group bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow ${
        url ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      {/* Image or Video */}
      <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
        {video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl">🔺</div>
        )}
        {!available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold bg-destructive px-4 py-2 rounded">
              Vyprodáno
            </span>
          </div>
        )}
        {available && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            {getBadgeText()}
          </div>
        )}
        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            aria-label="Rychlý náhled"
          >
            <Eye className="h-5 w-5 text-[#D4AF37]" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Star Rating */}
        {rating !== undefined && reviewCount !== undefined && (
          <div className="pt-1">
            <StarRating 
              rating={rating} 
              reviewCount={reviewCount} 
              showCount={true}
              size="sm"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary whitespace-nowrap">{price}</span>
          <Button
            size="sm"
            className="gap-1.5 bg-[#D4AF37] hover:bg-[#C19B2E] text-black font-semibold"
            disabled={!available}
            title="Přesměrování na obchod OHORAI.cz"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Koupit na</span>
            <span className="font-bold">OHORAI</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
