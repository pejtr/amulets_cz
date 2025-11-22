import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const pyramids = [
  {
    name: "Pyramida OHORAI ~ Hojnost",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-hojnost.jpg",
  },
  {
    name: "Pyramida OHORAI ~ Jednota",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-hojnost.jpg",
  },
  {
    name: "Pyramida OHORAI ~ Kristovo světlo",
    price: "8 800 Kč",
    available: true,
    image: "/products/pyramida-rovnovaha.jpg",
  },
  {
    name: "Pyramida OHORAI ~ Kundaliní",
    price: "9 000 Kč",
    available: true,
    image: "/products/pyramida-rovnovaha.jpg",
  },
];

const essences = [
  {
    name: "Ikonická esence ~ OHORAI modrý lotos 10ml",
    price: "1 100 Kč",
    available: true,
    image: "/products/esence-modry-lotos.jpg",
  },
  {
    name: "Esence ~ OhoRÁJ lotos",
    price: "2 200 Kč",
    available: true,
    image: "/products/esence-ohoraj.jpg",
  },
  {
    name: "Esence ~ MUŽ 10ml",
    price: "890 Kč",
    available: true,
    image: "/products/esence-ohoraj.jpg",
  },
  {
    name: "Esence ~ Zlatá brána 10ml",
    price: "990 Kč",
    available: true,
    image: "/products/esence-modry-lotos.jpg",
  },
];

export default function ProductsSection() {
  return (
    <div className="w-full bg-white py-16">
      <div className="container space-y-16">
        {/* Pyramidy */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Orgonitové pyramidy
              </h2>
              <p className="text-muted-foreground">
                Ručně vyráběné pyramidy s drahými krystaly a vzácnou, silnou
                bylinou
              </p>
            </div>
            <Button variant="outline" className="gap-2">
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Aromaterapeutické esence
              </h2>
              <p className="text-muted-foreground">
                Čistá vůně přírody pro harmonii těla & ducha
              </p>
            </div>
            <Button variant="outline" className="gap-2">
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
