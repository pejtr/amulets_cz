import { Truck, Sparkles, Mail, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { track } from "@/lib/tracking";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const uspItems = [
  {
    icon: Truck,
    title: "Doprava zdarma od 1 500 Kč",
    description: "Nakupte výhodně a ušetřete na poštovném",
  },
  {
    icon: Sparkles,
    title: "Úprava na míru",
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
  const [, setLocation] = useLocation();

  return (
    <section className="w-full bg-gradient-to-b from-white/80 to-white py-8 md:py-12">
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

        {/* Mobile - white cards with golden icons */}
        <div className="md:hidden space-y-4">
          {uspItems.map((item, index) => {
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

          {/* Quiz CTA Button - Mobile Only */}
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 text-lg rounded-full shadow-xl relative overflow-hidden group"
              onClick={() => {
                track.ctaClicked('Zjistit svůj amulet', 'USP Section', '/kviz');
                setLocation('/kviz');
              }}
            >
              <span className="relative z-10">Zjistit svůj amulet</span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl group-hover:translate-x-1 transition-transform">
                →
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
