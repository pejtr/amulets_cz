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
    image: "/products/pyramida-hojnost.webp",
    rating: 4.9,
    reviewCount: 13,
    url: "https://www.ohorai.cz/pyramida-ohorai-hojnost/",
    description: "Ručně vyráběná orgonitová pyramida s drahými krystaly a vzácnou bylinou modrého lotosu pro přitahování hojnosti. Obsahuje citrín, ametyst a 24k zlato. Vyrobena v meditativním stavu s láskou a pozitivní energií.",
  },
  {
    name: "Pyramida OHORAI ~ Světlo univerza",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-svetlo-univerza-new.webp",
    rating: 4.8,
    reviewCount: 9,
    url: "https://www.ohorai.cz/pyramida-ohorai-hojnost-2/",
    description: "Vesmír ukrytý v pyramidě ❤️ Ručně vyrobená orgonitová pyramida v meditativním stavu, v duchu propojení duše s vyšším vědomím. Obsahuje vzácné krystaly, modrý lotos a 24k zlato pro duchovní transformaci.",
  },
  {
    name: "Pyramida OHORAI ~ Kristovo světlo",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-kristovo-svetlo.webp",
    rating: 4.9,
    reviewCount: 10,
    url: "https://www.ohorai.cz/pyramida-ohorai-pevnost-vule/",
    description: "Orgonitová pyramida nesoucí energii Kristova světla pro duchovní růst a vnitřní transformaci. Ručně vyráběná s drahými krystaly, modrým lotosem a 24k zlatem. Podporuje meditaci a spojení s vyšším vědomím.",
  },
  {
    name: "Pyramida OHORAI ~ Kundalíní",
    price: "9 000 Kč",
    available: true,
    image: "/products/pyramida-kundalini.webp",
    rating: 4.7,
    reviewCount: 8,
    url: "https://www.ohorai.cz/pyramida-ohorai-kundalini/",
    description: "Orgonitová pyramida pro probuzení a harmonizaci kundalíní energie. Ručně vyráběná s drahými krystaly podporujícími energetické centrum. Obsahuje modrý lotos, 24k zlato a speciální krystaly pro práci s čakrami.",
  },
];

const essences = [
  {
    name: "Ikonická esence ~ OHORAI modrý lotos 10ml",
    price: "1 100 Kč",
    available: true,
    image: "/products/esence-modry-lotos.webp",
    rating: 4.9,
    reviewCount: 22,
    url: "https://www.ohorai.cz/esence-ohorai-modry-lotos/",
    description: "Ikonická, vámi oblíbená esence OHORAI snoubící vůni omamného modrého leknínu, růže, gerania a lípy. Podporuje meditaci, relaxaci a duchovní probuzení. Obsahuje 24k zlato a křišťál. Obsah: 10 ml. Určena pro aromaterapeutické účely.",
  },
  {
    name: "Esence ~ OhoRÁJ lotos",
    price: "2 200 Kč",
    available: true,
    image: "/products/esence-ohoraj-lotos.webp",
    rating: 5.0,
    reviewCount: 9,
    url: "https://www.ohorai.cz/esence-ohoraj/",
    description: "Silná esence snoubící Bulharskou růži, lípu a jasmín. Tvoří dokonalou kombinaci síly a jemnosti, představuje vrchol lidského potenciálu. Obsahuje velké množství pravého plátkového 24k zlata od vyhlášené italské značky a křišťál. Obsah: 5 ml.",
  },
  {
    name: "Esence ~ MUŽ 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-muz.webp",
    rating: 4.7,
    reviewCount: 14,
    url: "https://www.ohorai.cz/esence-muz/",
    description: "Velmi silná esence snoubící vůně dřevin - santalu, ylang ylang, borovice a vetiveru. Podporuje mužskou energii, sílu a sebevědomí. Obsahuje 24k zlato a křišťál. Obsah: 10 ml. Určena pro aromaterapeutické účely.",
  },
  {
    name: "Esence ~ Žena - mateřská 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-zlata-brana.webp",
    rating: 4.8,
    reviewCount: 17,
    url: "https://www.ohorai.cz/esence-zena-materska/",
    description: "Jemná esence snoubící růži a jasmín podporující naladění na nejjemnější vibrace něžnosti, lehkosti a přijetí. Ideální pro ženy a matky. Obsahuje 24k zlato a křišťál. Obsah: 10 ml. Určena pro aromaterapeutické účely.",
  },
  {
    name: "Esence ~ Andělská 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-andelska.webp",
    rating: 4.9,
    reviewCount: 20,
    url: "https://www.ohorai.cz/esence-andelska/",
    description: "Jemná, lehká esence snoubící Bulharskou růži nejvyšší kvality destilace, jasmín, santal a bílý lotos. Podporuje spojení s andělskou říší a vnitřní klid. Obsahuje 24k zlato a křišťál. Obsah: 10 ml. Určena pro aromaterapeutické účely.",
  },
  {
    name: "Esence ~ Plynoucí 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-plynouci.webp",
    rating: 4.8,
    reviewCount: 13,
    url: "https://www.ohorai.cz/esence-plynouci/",
    description: "Jemná esence snoubící pravou Bulharskou růži, jasmín a zklidňující levanduli. Podporuje životní flow, harmonii a vnitřní rovnováhu. Obsahuje 24k zlato a křišťál. Obsah: 10 ml. Určena pro aromaterapeutické účely.",
  },
{
    name: "Esence ~ Tantra 5ml",
    price: "440 Kč",
    available: true,
    image: "/products/esence-tantra.webp",
    rating: 4.6,
    reviewCount: 10,
    url: "https://www.ohorai.cz/esence-tantra/",
    description: "Silná esence kombinující oblíbený ylang-ylang s pomeračem a levanduli. Podporuje vnitřní oheň, vášeň a smyslnost. Obsahuje 24k zlato a křišťál. Obsah: 5 ml. Určena pro aromaterapeutické účely.",
  },
  {
    name: "Esence ~ matka Země 10ml",
    price: "690 Kč",
    available: true,
    image: "/products/esence-matka-zeme.webp",
    rating: 4.7,
    reviewCount: 11,
    url: "https://www.ohorai.cz/esence-matka-zeme-10ml/",
    description: "Silná esence snoubící vůni skořice, borovice a kadidla s modrým lotosem. Podporuje uzemňení a spojení s matkou Zemí. Obsahuje 24k zlato a křišťál. Obsah: 10 ml. Určena pro aromaterapeutické účely.",
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
        {/* Positioning Banner */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-[#D4AF37] rounded-lg p-4 md:p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🛍️</div>
            <div>
              <h3 className="font-bold text-foreground mb-1">
                Jak nakoupit?
              </h3>
              <p className="text-sm text-muted-foreground">
                Vyberte si produkt, klikněte na tlačítko <span className="font-semibold text-[#D4AF37]">"Koupit na OHORAI"</span> a budete přesměrováni na oficiální e-shop OHORAI.cz, kde dokončíte objednávku.
              </p>
            </div>
          </div>
        </div>
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
                Ručně vyráběné vůně ze 100% esenciálních olejů nejvyšší kvality. Řada KORUNA s nejčistšími esencemi, krystaly a pravým 24k zlatem. <span className="text-[#D4AF37] font-medium">Naše ikonická esence s modrým lotosem</span> – posvátnou květinou starověkého Egypta, která byla používána v chrámových rituálech a symbolizuje duchovní probuzení a spojení s vyššími sférami.
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
