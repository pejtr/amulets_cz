import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, Star, ShoppingCart, Users, Truck } from "lucide-react";
import { Link } from "wouter";
import { track } from "@/lib/tracking";
import { useState } from "react";
import ProductQuickView from "@/components/ProductQuickView";

const essences = [
  {
    name: "Ikonická esence ~ OHORAI modrý lotos 10ml",
    price: "1 100 Kč",
    image: "/products/esence-modry-lotos.webp",
    rating: 4.9,
    reviewCount: 22,
    url: "https://www.ohorai.cz/esence-ohorai-modry-lotos/",
    description: "Ikonická, vámi oblíbená esence OHORAI snoubící vůni omamného modrého leknínu, růže, gerania a lípy. Podporuje meditaci, relaxaci a duchovní probuzení. Obsahuje 24k zlato a křišťál. Obsah: 10 ml.",
  },
  {
    name: "Esence ~ OhoRÁJ lotos",
    price: "2 200 Kč",
    image: "/products/esence-ohoraj-lotos.webp",
    rating: 5.0,
    reviewCount: 9,
    url: "https://www.ohorai.cz/esence-ohoraj/",
    description: "Silná esence snoubící Bulharskou růži, lípu a jasmín. Tvoří dokonalou kombinaci síly a jemnosti. Obsahuje velké množství pravého plátkového 24k zlata od vyhlášené italské značky a křišťál. Obsah: 5 ml.",
  },
  {
    name: "Esence ~ MUŽ 10ml",
    price: "890 Kč",
    image: "/products/esence-muz.webp",
    rating: 4.7,
    reviewCount: 14,
    url: "https://www.ohorai.cz/esence-muz/",
    description: "Velmi silná esence snoubící vůně dřevin - santalu, ylang ylang, borovice a vetiveru. Podporuje mužskou energii, sílu a sebevědomí. Obsahuje 24k zlato a křišťál. Obsah: 10 ml.",
  },
  {
    name: "Esence ~ Žena - mateřská 10ml",
    price: "890 Kč",
    image: "/products/esence-zlata-brana.webp",
    rating: 4.8,
    reviewCount: 17,
    url: "https://www.ohorai.cz/esence-zena-materska/",
    description: "Jemná esence snoubící růži a jasmín podporující naladění na nejjemnější vibrace něžnosti, lehkosti a přijetí. Ideální pro ženy a matky. Obsahuje 24k zlato a křišťál. Obsah: 10 ml.",
  },
];

const pyramids = [
  {
    name: "Pyramida OHORAI ~ Hojnost",
    price: "8 800 Kč",
    image: "/products/pyramida-hojnost.webp",
    rating: 4.9,
    reviewCount: 13,
    url: "https://www.ohorai.cz/pyramida-ohorai-hojnost/",
    description: "Ručně vyráběná orgonitová pyramida s drahými krystaly a vzácnou bylinou modrého lotosu pro přitahování hojnosti. Obsahuje citrín, ametyst a 24k zlato. Vyrobena v meditativním stavu s láskou.",
  },
  {
    name: "Pyramida OHORAI ~ Světlo univerza",
    price: "8 800 Kč",
    image: "/products/pyramida-svetlo-univerza-new.webp",
    rating: 4.8,
    reviewCount: 9,
    url: "https://www.ohorai.cz/pyramida-ohorai-hojnost-2/",
    description: "Vesmír ukrytý v pyramidě ❤️ Ručně vyrobená orgonitová pyramida v meditativním stavu. Obsahuje vzácné krystaly, modrý lotos a 24k zlato pro duchovní transformaci.",
  },
  {
    name: "Pyramida OHORAI ~ Kristovo světlo",
    price: "8 800 Kč",
    image: "/products/pyramida-kristovo-svetlo.webp",
    rating: 4.9,
    reviewCount: 10,
    url: "https://www.ohorai.cz/pyramida-ohorai-pevnost-vule/",
    description: "Orgonitová pyramida nesoucí energii Kristova světla pro duchovní růst a vnitřní transformaci. Ručně vyráběná s drahými krystaly, modrým lotosem a 24k zlatem.",
  },
  {
    name: "Pyramida OHORAI ~ Kundalíní",
    price: "9 000 Kč",
    image: "/products/pyramida-kundalini.webp",
    rating: 4.7,
    reviewCount: 8,
    url: "https://www.ohorai.cz/pyramida-ohorai-kundalini/",
    description: "Orgonitová pyramida pro probuzení a harmonizaci kundalíní energie. Ručně vyráběná s drahými krystaly a 24k zlatem pro práci s čakrami.",
  },
];

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : star <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating} ({reviewCount})
      </span>
    </div>
  );
}

interface Product {
  name: string;
  price: string;
  image: string;
  rating: number;
  reviewCount: number;
  url: string;
  description: string;
}

export default function ProductsStrip() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    track.ctaClicked(product.name, 'ProductsStrip QuickView', product.url);
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <section className="w-full bg-white py-12 border-t">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Orgonitové pyramidy
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Ručně vyráběné pyramidy s drahými krystaly a vzácnou, silnou bylinou modrý lotos
            </p>
            <div className="text-sm mt-2">
              <span className="text-muted-foreground">Přečtěte si: </span>
              <Link 
                href="/magazin/modry-lotos-egyptska-historie"
                className="text-[#D4AF37] hover:underline font-semibold"
              >
                Modrý lotos - Posvátná květina
              </Link>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 self-start md:self-auto shrink-0"
            onClick={() => window.open('https://www.ohorai.cz/autorske-tvorba/', '_blank')}
          >
            Zobrazit vše
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pyramids.map((product, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image container */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    🔥 Poslední kusy!
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Skladem
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 
                  className="font-bold text-foreground line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-[#D4AF37] transition-colors"
                  onClick={() => handleProductClick(product)}
                >
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                
                {/* Social proof */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-pink-500" />
                    500+ spokojených
                  </span>
                  {parseInt(product.price) >= 1500 && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Truck className="w-3 h-3" />
                      Doprava zdarma
                    </span>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-lg font-bold text-[#E85A9F] whitespace-nowrap">
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs gap-1"
                    onClick={() => {
                      track.ctaClicked(product.name, 'ProductsStrip', product.url);
                      window.open(product.url, '_blank');
                    }}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Koupit na OHORAI
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Esence section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 mt-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Aromaterapeutické esence
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Ručně vyráběné vůně ze 100% esenciálních olejů nejvyšší kvality
            </p>
            <div className="text-sm mt-2">
              <span className="text-muted-foreground">Přečtěte si: </span>
              <Link 
                href="/magazin/aromaterapie-esence"
                className="text-[#D4AF37] hover:underline font-semibold"
              >
                Aromaterapie & esence - k čemu nám slouží?
              </Link>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 self-start md:self-auto shrink-0"
            onClick={() => window.open('https://www.ohorai.cz/aromaterapie/', '_blank')}
          >
            Zobrazit vše
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {essences.map((product, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image container */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Skladem
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 
                  className="font-bold text-foreground line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-[#D4AF37] transition-colors"
                  onClick={() => handleProductClick(product)}
                >
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                
                {/* Social proof */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-pink-500" />
                    500+ spokojených
                  </span>
                  {parseInt(product.price) >= 1500 && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Truck className="w-3 h-3" />
                      Doprava zdarma
                    </span>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-lg font-bold text-[#E85A9F] whitespace-nowrap">
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs gap-1"
                    onClick={() => {
                      track.ctaClicked(product.name, 'ProductsStrip', product.url);
                      window.open(product.url, '_blank');
                    }}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Koupit na OHORAI
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </section>
  );
}
