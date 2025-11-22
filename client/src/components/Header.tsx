import { APP_LOGO } from "@/const";
import { Search, ShoppingCart, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-border">
      {/* Top bar */}
      <div className="container py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src={APP_LOGO} alt="Amulets.cz" className="h-16 w-auto" />
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Co hledáte? Najít příběhy na xxx"
                className="pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Contact info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs">👤</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Potřebujete poradit?</div>
                <div className="flex items-center gap-1 text-primary">
                  <Phone className="h-3 w-3" />
                  <span className="font-semibold">776 041 740</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  pon - pá: 9:00 - 19:00
                </div>
              </div>
            </div>

            {/* Cart */}
            <Button variant="outline" className="bg-primary/10 border-primary/20">
              <ShoppingCart className="h-4 w-4 mr-2 text-primary" />
              <span className="font-semibold">0 Kč</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-accent/50 border-t border-border">
        <div className="container">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <NavItem label="Orgonitové pyramidy" hasDropdown />
              <NavItem label="Aromaterapie" hasDropdown />
              <NavItem label="Startovací balíčky" />
              <NavItem label="Domov" hasDropdown />
              <NavItem label="Drahé kameny" hasDropdown />
              <NavItem label="Šperky" hasDropdown />
              <NavItem label="Průvodce amulety" icon="🦋" />
              <NavItem label="Magazín" />
              <NavItem label="Kontakt" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavItem({
  label,
  hasDropdown,
  icon,
}: {
  label: string;
  hasDropdown?: boolean;
  icon?: string;
}) {
  return (
    <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
      {icon && <span className="mr-1">{icon}</span>}
      {label}
      {hasDropdown && <ChevronDown className="h-3 w-3" />}
    </button>
  );
}
