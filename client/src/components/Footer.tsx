import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import FeaturedCategories from "@/components/FeaturedCategories";

export default function Footer() {
  return (
    <>
      <FeaturedCategories />
      <footer className="w-full bg-accent/30 border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg">
              Potřebujete se zeptat na něco konkrétního?
            </h3>
            <p className="text-sm text-muted-foreground">
              Zavolej, nebo napiš na email.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-semibold">776 041 740</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Po-Pá: 9:00 - 19:00
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@amulets.cz</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                napsat nám můžeš kdykoliv
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg">
              Vše o nákupu
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://rostecky.cz/natalie-ohorai-amulets-t45227" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  O nás
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Doprava a platba
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Obchodní podmínky
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Podmínky ochrany osobních údajů
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Vrácení zboží
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg">
              Sledujte nás
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61584549954925"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://instagram.com/amulets.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="text-center mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">✨ Naši přátelé ✨</h4>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {/* Dobrá čajovna Praha */}
            <div className="flex flex-col items-center gap-2">
              <a
                href="https://www.dobracajovnapraha.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Dobrá čajovna Praha
              </a>
              <a
                href="https://instagram.com/dobracajovnapraha"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-3 w-3" />
                @dobracajovnapraha
              </a>
            </div>

            {/* Donuterie */}
            <div className="flex flex-col items-center gap-2">
              <a
                href="https://www.donuterie.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Donuterie Prague
              </a>
              <p className="text-xs text-muted-foreground text-center">
                Showroom & výdejna OHORAI
              </p>
              <a
                href="https://instagram.com/DonuteriePrague"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-3 w-3" />
                @DonuteriePrague
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>2020 - 2025 © Amulets.cz, všechna práva vyhrazena</p>
        </div>
      </div>
    </footer>
    </>
  );
}
