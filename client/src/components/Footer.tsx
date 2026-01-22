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
                <a href="/o-nas" className="hover:text-primary transition-colors">
                  O Natálii
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
            <h4 className="text-sm font-semibold text-foreground mb-3">✨ Spřízňené projekty ✨</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* E-shop sloupec */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">E-shop</h5>
              <div className="flex flex-col gap-6">
                {/* Dobrá čajovna Praha */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="text-2xl flex-shrink-0">🍵</div>
                  <div className="flex-1">
                    <a
                      href="https://www.dobracajovnapraha.cz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors font-medium block mb-1"
                    >
                      Dobrá Čajovna Praha
                    </a>
                    <p className="text-xs text-muted-foreground mb-2">
                      Prémiové čaje a čajové doplňky
                    </p>
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
                </div>

                {/* Amarex */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="text-2xl flex-shrink-0">🌶️</div>
                  <div className="flex-1">
                    <a
                      href="https://www.amarex.cz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors font-medium block mb-1"
                    >
                      Amarex
                    </a>
                    <p className="text-xs text-muted-foreground">
                      Přírodní produkt na podporu erekce
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Další sloupec */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">Další</h5>
              <div className="flex flex-col gap-6">
                {/* Donuterie */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="text-2xl flex-shrink-0">🍩</div>
                  <div className="flex-1">
                    <a
                      href="https://www.donuterie.eu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors font-medium block mb-1"
                    >
                      Donuterie Prague
                    </a>
                    <p className="text-xs text-muted-foreground mb-2">
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

                {/* Bindu - charitativní organizace */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="text-2xl flex-shrink-0">ॐ</div>
                  <div className="flex-1">
                    <a
                      href="http://bindu.cz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors font-medium block mb-1"
                    >
                      Bindu z.s.
                    </a>
                    <p className="text-xs text-muted-foreground mb-1">
                      Charita pro děti v Indii a Nepálu
                    </p>
                    <span className="text-xs text-pink-500 font-medium">
                      ❤ 100% příspěvků jde dětem
                    </span>
                  </div>
                </div>
              </div>
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
