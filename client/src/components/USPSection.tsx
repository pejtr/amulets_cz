import { Truck, Sparkles, Hand, Gift } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

interface USPItem {
  icon: typeof Truck;
  titleKey: string;
  descKey: string;
  showOnMobile: boolean;
}

const uspItemDefs: USPItem[] = [
  {
    icon: Truck,
    titleKey: "usp.delivery.title",
    descKey: "usp.delivery.desc",
    showOnMobile: false,
  },
  {
    icon: Sparkles,
    titleKey: "usp.handmade.title",
    descKey: "usp.handmade.desc",
    showOnMobile: true,
  },
  {
    icon: Hand,
    titleKey: "usp.handcraft.title",
    descKey: "usp.handcraft.desc",
    showOnMobile: true,
  },
  {
    icon: Gift,
    titleKey: "usp.gift.title",
    descKey: "usp.gift.desc",
    showOnMobile: true,
  },
];

// Mobile order: Dárek pro každého first, then Úpravy na míru, then Ruční výroba
const mobileOrder = [3, 1, 2];

// Desktop animated item component
function DesktopUSPItem({ item, index }: { item: USPItem; index: number }) {
  const [isAnimated, setIsAnimated] = useState(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const { t } = useTranslation();
  
  useEffect(() => {
    if (isVisible && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, index * 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isAnimated, index]);

  const Icon = item.icon;
  
  return (
    <div 
      ref={ref}
      className={`flex items-start gap-4 transition-all duration-700 ease-out ${
        isAnimated 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-110 translate-y-4'
      }`}
      style={{ 
        transitionDelay: `${index * 150}ms`,
        transformOrigin: 'center center'
      }}
    >
      <div className={`w-14 h-14 rounded-full bg-[#E85A9F]/20 flex items-center justify-center flex-shrink-0 transition-transform duration-500 ${
        isAnimated ? 'scale-100' : 'scale-125'
      }`}
      style={{ transitionDelay: `${index * 150 + 100}ms` }}
      >
        <Icon className="w-7 h-7 text-[#E85A9F]" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-foreground text-sm mb-1 leading-tight">
          {t(item.titleKey)}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t(item.descKey)}
        </p>
      </div>
    </div>
  );
}

export default function USPSection() {
  const { t } = useTranslation();
  
  // Filter items for mobile (exclude those with showOnMobile: false) and reorder
  const mobileItems = mobileOrder
    .map(i => uspItemDefs[i])
    .filter(item => item.showOnMobile !== false);

  return (
    <section className="w-full bg-gradient-to-b from-white/80 to-white py-8 md:py-12">
      <div className="container">
        {/* Desktop - 4 columns horizontal with zoom-in animation */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {uspItemDefs.map((item, index) => (
            <DesktopUSPItem key={index} item={item} index={index} />
          ))}
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
                    isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-110'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-500 ${
                  isVisible ? 'scale-100' : 'scale-125'
                }`}
                style={{ transitionDelay: `${index * 100 + 100}ms` }}
                >
                  <Icon className="w-8 h-8 text-black" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base mb-1">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(item.descKey)}
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
