import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import ProductQuickView from "@/components/ProductQuickView";
import { useState } from "react";

const pyramids = [
  {
    name: "Pyramida OHORAI ~ Hojnost",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-hojnost.jpg",
    url: "https://www.ohorai.cz/pyramida-ohorai-hojnost/",
    description: "Ručně vyráběná pyramida s drahými krystaly a vzácnou bylinou pro přitahování hojnosti",
  },
  {
    name: "Pyramida OHORAI ~ Světlo univerza",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-svetlo-univerza-new.webp",
    url: "https://www.ohorai.cz/pyramida-ohorai-hojnost-2/",
    description: "Vesmír ukrytý v pyramidě ❤️ ručně vyrobená pyramida v meditativním stavu, v duchu propojení duše s vyšším...",
  },
  {
    name: "Pyramida OHORAI ~ Kristovo světlo",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-kristovo-svetlo.jpg",
    url: "https://www.ohorai.cz/pyramida-ohorai-pevnost-vule/",
    description: "Pyramida nesoucí energii Kristova světla pro duchovní růst",
  },
  {
    name: "Pyramida OHORAI ~ Kundaliní",
    price: "9 000 Kč",
    available: true,
    image: "/products/pyramida-kundalini.jpg",
    url: "https://www.ohorai.cz/pyramida-ohorai-kundalini/",
    description: "Pyramida pro probuzení a harmonizaci kundaliní energie",
  },
];

const essences = [
  {
    name: "Ikonická esence ~ OHORAI modrý lotos 10ml",
    price: "1 100 Kč",
    available: true,
    image: "/products/esence-modry-lotos.jpg",
    url: "https://www.ohorai.cz/esence-ohorai-modry-lotos/",
    description: "Ikonická, vámi oblíbená esence Ohorai snoubící vůni omamného modrého leknínu, růže, gerania a lípy...",
  },
  {
    name: "Esence ~ OhoRÁJ lotos",
    price: "2 200 Kč",
    available: true,
    image: "/products/esence-ohoraj-lotos.webp",
    url: "https://www.ohorai.cz/esence-ohoraj/",
    description: "Silná esence snoubící Bulharskou růži, lípu, jasmín. Esence, která tvoří dokonalou kombinaci síly a jemnosti...",
  },
  {
    name: "Esence ~ MUŽ 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-muz.jpg",
    url: "https://www.ohorai.cz/esence-muz/",
    description: "Velmi silná esence snoubící vůně dřevin - santalu, ylang ylang, borovice až po velmi silnou esenci vetiver...",
  },
  {
    name: "Esence ~ Žena - mateřská 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-zlata-brana.jpg",
    url: "https://www.ohorai.cz/esence-zena-materska/",
    description: "Jemná esence snoubící růži a jasmín podporující naladění na nejjemnější vibrace něžnosti, lehkosti, přijetí...",
  },
  {
    name: "Esence ~ Andělská 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-andelska.jpg",
    url: "https://www.ohorai.cz/esence-andelska/",
    description: "Jemná, lehká esence snoubící Bulharskou růži nejvyšší kvality destilace, jasmín, santal, bílý lotos...",
  },
  {
    name: "Esence ~ Plynoucí 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-plynouci.jpg",
    url: "https://www.ohorai.cz/esence-plynouci/",
    description: "Jemná esence snoubící pravou Bulharskou růži, jasmín a zklidnující levanduli podpoří životní flow...",
  },
  {
    name: "Esence ~ Tantra 5ml",
    price: "440 Kč",
    available: true,
    image: "/products/esence-tantra.jpg",
    url: "https://www.ohorai.cz/esence-tantra/",
    description: "Silná esence kombinující oblíbený ylang-ylang v kombinaci s pomerančem a levandulí podpoří vnitřní ohen...",
  },
  {
    name: "Esence ~ matka Země 10ml",
    price: "690 Kč",
    available: true,
    image: "/products/esence-matka-zeme.jpg",
    url: "https://www.ohorai.cz/esence-matka-zeme-10ml/",
    description: "Silná esence snoubící vůni skořice, borovice, kadidla tvoří v kombinaci s modrým lotosem propojení...",
  },
];

export default function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  return (
    <div id="produkty" className="w-full bg-white py-16">
      <div className="container space-y-16">
        {/* Pyramidy */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Orgonitové pyramidy
              </h2>
              <p className="text-muted-foreground">
                Ručně vyráběné pyramidy s drahými krystaly a vzácnou, silnou bylinou modrý lotos
              </p>
              <div className="text-sm mt-2">
                <span className="text-muted-foreground">Přečtěte si: </span>
                <Link 
                  href="/magazin/mysterium-modreho-lotosu"
                  className="text-[#D4AF37] hover:underline font-semibold"
                >
                  Mystérium modrého lotosu
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
              <ProductCard 
                key={index} 
                {...product} 
                onQuickView={() => handleQuickView(product)}
              />
            ))}
          </div>
        </section>

        {/* Esence */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Aromaterapeutické esence
              </h2>
              <p className="text-muted-foreground max-w-3xl">
                Ručně vyráběné vůně ze 100% esenciálních olejů nejvyšší kvality. Řada KORUNA s nejčistšími esencemi, krystaly a pravým 24k zlatem.
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
              onClick={() => window.open('https://www.ohorai.cz/esence/', '_blank')}
            >
              Zobrazit vše
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {essences.map((product, index) => (
              <ProductCard 
                key={index} 
                {...product} 
                onQuickView={() => handleQuickView(product)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </div>
  );
}
