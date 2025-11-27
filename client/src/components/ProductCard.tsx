import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  image?: string;
  available?: boolean;
  url?: string;
}

export default function ProductCard({
  name,
  price,
  image,
  available = true,
  url,
}: ProductCardProps) {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div 
      className={`group bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow ${
        url ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
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
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Skladem
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{price}</span>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            disabled={!available}
          >
            <ShoppingCart className="h-4 w-4" />
            Do košíku
          </Button>
        </div>
      </div>
    </div>
  );
}
