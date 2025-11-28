import { Phone, Mail, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-accent/30 border-t border-border mt-16">
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
                href="#"
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

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>2020 - 2025 © Amulets.cz, všechna práva vyhrazena</p>
        </div>
      </div>
    </footer>
  );
}
