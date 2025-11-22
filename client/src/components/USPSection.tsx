import { Package, Heart, Sparkles, Gift } from "lucide-react";

export default function USPSection() {
  return (
    <section className="w-full bg-white py-12 border-t border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <USPBox
            icon={<Package className="w-8 h-8" />}
            title="Doprava zdarma od 1 500 Kč"
            description="Nakupte výhodně a ušetřete na poštovném"
          />
          <USPBox
            icon={<Heart className="w-8 h-8" />}
            title="Úprava amuletů na míru"
            description="Ručně orgonitové a amulety na míru"
          />
          <USPBox
            icon={<Sparkles className="w-8 h-8" />}
            title="Ruční výroba"
            description="Šperky a pyramidy pro vás s láskou vyrábíme"
          />
          <USPBox
            icon={<Gift className="w-8 h-8" />}
            title="Dárek pro každého"
            description="Přibalíme malé překvapení pro hezčí den"
          />
        </div>
      </div>
    </section>
  );
}

function USPBox({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg hover:bg-accent/30 transition-colors">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
