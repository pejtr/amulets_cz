import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

interface Product {
  name: string;
  image: string;
  price: string;
  description: string;
  url: string;
}

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">{product.name}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Zavřít</span>
          </button>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Obrázek produktu */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Informace o produktu */}
          <div className="flex flex-col gap-4">
            {/* Cena */}
            <div className="text-3xl font-bold text-[#D4AF37]">
              {product.price}
            </div>

            {/* Popis */}
            <div className="text-muted-foreground leading-relaxed">
              {product.description}
            </div>

            {/* Tlačítka */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E8C4D8] hover:from-[#C19B2E] hover:to-[#D4B0C4] text-white"
              >
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Zobrazit detail na Ohorai.cz
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onClose}
                className="w-full"
              >
                Zavřít náhled
              </Button>
            </div>

            {/* Info o přesměrování */}
            <p className="text-xs text-muted-foreground text-center">
              Produkt si můžete zakoupit na hlavním eshopu Ohorai.cz
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
