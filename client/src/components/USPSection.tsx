import { Truck, Sparkles, Mail, Gift } from "lucide-react";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const uspItems = [
  {
    icon: Truck,
    title: "Doprava zdarma od 1 500 Kč",
    description: "Nakupte výhodně a ušetřete na poštovném",
    showOnMobile: false, // Hidden on mobile - already shown in hero image
  },
  {
    icon: Sparkles,
    title: "Úpravy na míru",
    description: "Možnost zakázkové tvorby",
    showOnMobile: true,
  },
  {
    icon: Mail,
    title: "Ruční výroba",
    description: "Šperky a pyramidy pro vás s láskou vyrábíme",
    showOnMobile: true,
  },
  {
    icon: Gift,
    title: "Dárek pro každého",
    description: "Přibalíme malé překvapení pro hezčí den",
    showOnMobile: true,
  },
];

// Mobile order: Dárek pro každého first, then Úpravy na míru, then Ruční výroba
const mobileOrder = [3, 1, 2]; // indices: Gift, Sparkles, Mail

export default function USPSection() {
  // Filter items for mobile (exclude those with showOnMobile: false) and reorder
  const mobileItems = mobileOrder
    .map(i => uspItems[i])
    .filter(item => item.showOnMobile !== false);

  return (
    <section className="w-full bg-gradient-to-b from-white/80 to-white py-8 md:py-12">
      <div className="container">
        {/* Desktop - 4 columns horizontal (show all items) */}
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

        {/* Mobile - white cards with golden icons (reordered: Dárek first) */}
        <div className="md:hidden space-y-4">
          {mobileItems.map((item, index) => {
            const Icon = item.icon;
            const AnimatedCard = () => {
              const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
              return (
                <div 
                  ref={ref}
                  className={`flex items-start gap-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icon className="w-8 h-8 text-black" strokeWidth={2} />
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
            };
            return <AnimatedCard key={index} />;
          })}

        </div>
      </div>
    </section>
  );
}
