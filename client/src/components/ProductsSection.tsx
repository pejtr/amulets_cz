import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    name: "Pyramida OHORAI ~ Jednota",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-jednota.jpg",
    url: "https://www.ohorai.cz/pyramida-ohorai-odevzdani/",
    description: "Pyramida podporující harmonii a propojení s vyššími vibracemi",
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
    video: "/esence-ohoraj-video.mp4",
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
];

export default function ProductsSection() {
  return (
    <div className="w-full bg-white py-16">
      <div className="container space-y-16">
        {/* Pyramidy */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Orgonitové pyramidy
              </h2>
              <p className="text-muted-foreground">
                Ručně vyráběné pyramidy s drahými krystaly a vzácnou, silnou bylinou{' '}
                <a 
                  href="https://www.ohorai.cz/modry-lotos/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  modrý lotos
                </a>
              </p>
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
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </section>

        {/* Esence */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Aromaterapeutické esence
              </h2>
              <p className="text-muted-foreground">
                Čistá vůně přírody pro harmonii těla & ducha
              </p>
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
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
