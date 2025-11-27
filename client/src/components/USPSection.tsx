import { Truck, Sparkles, Mail, Gift } from "lucide-react";

const uspItems = [
  {
    icon: Truck,
    title: "Doprava zdarma od 1 500 Kč",
    description: "Nakupte výhodně a ušetřete na poštovném",
  },
  {
    icon: Sparkles,
    title: "Úprava amuletů na míru",
    description: "Ručně orgonitové a amulety na míru",
  },
  {
    icon: Mail,
    title: "Ruční výroba",
    description: "Šperky a pyramidy pro vás s láskou vyrábíme",
  },
  {
    icon: Gift,
    title: "Dárek pro každého",
    description: "Přibalíme malé překvapení pro hezčí den",
  },
];

export default function USPSection() {
  return (
    <section className="w-full bg-white py-8 md:py-12 border-t border-gray-100">
      <div className="container">
        {/* Desktop - 4 columns horizontal */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {uspItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E85A9F]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-[#E85A9F]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-sm mb-1 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile - stacked list */}
        <div className="md:hidden space-y-6">
          {uspItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E85A9F]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-[#E85A9F]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
