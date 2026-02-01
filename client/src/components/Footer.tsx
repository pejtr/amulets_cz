import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import OhoraiBanner from "@/components/OhoraiBanner";

export default function Footer() {
  return (
    <>
      <OhoraiBanner />
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

        {/* Partners - všechny v jednom řádku */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="text-center mb-6">
            <h4 className="text-base md:text-lg font-semibold text-foreground">✨ Spřízněné projekty ✨</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3 max-w-7xl mx-auto">
            {/* Dobrá čajovna Praha */}
            <a
              href="https://www.dobracajovnapraha.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">🍵</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">Dobrá Čajovna</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">Prémiové čaje</p>
            </a>

            {/* Pro Erecta */}
            <a
              href="https://www.silnelibido.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">💪</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">Pro Erecta</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">Silné libido</p>
            </a>

            {/* Donuterie */}
            <a
              href="https://www.donuterie.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">🍩</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">Donuterie Prague</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">Výdejna OHORAI</p>
            </a>

            {/* DO-ITALIE.cz */}
            <a
              href="https://do-italie.manus.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">🍕</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">DO-ITALIE.cz</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">Dovolená v Itálii</p>
            </a>

            {/* Bindu */}
            <a
              href="http://bindu.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">ॐ</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">Bindu z.s.</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">❤ Charita</p>
            </a>

            {/* Recepty Zdraví */}
            <a
              href="https://receptyzdravi.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">🥗</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">Recepty Zdraví</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">Zdravé recepty</p>
            </a>

            {/* YouKeto */}
            <a
              href="https://youketo.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">🥑</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">YouKeto</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">Keto dieta</p>
            </a>

            {/* Last Minute */}
            <a
              href="https://lastminutedovolene.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">✈️</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">Last Minute</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">Cestování</p>
            </a>

            {/* Jan Kroča */}
            <a
              href="https://www.jankroca.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group hover:scale-105"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">🏛️</div>
              <span className="text-sm md:text-base font-semibold text-primary group-hover:underline text-center">Jan Kroča</span>
              <p className="text-xs md:text-sm text-muted-foreground text-center">Léčivá místa</p>
            </a>
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
