import { Star } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import LazyImage from "@/components/LazyImage";

const chineseZodiac2026 = [
  { name: "Krysa", url: "/predpoved-2026/predpoved-2026-krysa", image: "/images/predictions-2026/krysa-2026.webp" },
  { name: "Bůvol", url: "/predpoved-2026/predpoved-2026-buvol", image: "/images/predictions-2026/buvol-2026.webp" },
  { name: "Tygr", url: "/predpoved-2026/predpoved-2026-tygr", image: "/images/predictions-2026/tygr-2026.webp" },
  { name: "Králík", url: "/predpoved-2026/predpoved-2026-kralik", image: "/images/predictions-2026/kralik-2026.webp" },
  { name: "Drak", url: "/predpoved-2026/predpoved-2026-drak", image: "/images/predictions-2026/drak-2026.webp" },
  { name: "Had", url: "/predpoved-2026/predpoved-2026-had", image: "/images/predictions-2026/had-2026.webp" },
  { name: "Kůň", url: "/predpoved-2026/predpoved-2026-kun", image: "/images/predictions-2026/kun-2026.webp", highlight: true },
  { name: "Koza", url: "/predpoved-2026/predpoved-2026-koza", image: "/images/predictions-2026/koza-2026.webp" },
  { name: "Opice", url: "/predpoved-2026/predpoved-2026-opice", image: "/images/predictions-2026/opice-2026.webp" },
  { name: "Kohout", url: "/predpoved-2026/predpoved-2026-kohout", image: "/images/predictions-2026/kohout-2026.webp" },
  { name: "Pes", url: "/predpoved-2026/predpoved-2026-pes", image: "/images/predictions-2026/pes-2026.webp" },
  { name: "Prase", url: "/predpoved-2026/predpoved-2026-prase", image: "/images/predictions-2026/prase-2026.webp" },
];

export default function ChineseHoroscope2026Section() {
  const [showAll, setShowAll] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const displayedZodiac = showAll ? chineseZodiac2026 : chineseZodiac2026.slice(0, 6);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="w-full bg-gradient-to-br from-orange-50/50 to-red-50/50 py-16">
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
            <Star className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              🐎 Čínský horoskop 2026
            </h2>
            <p className="text-sm text-muted-foreground">
              Rok Ohnivého Koně - předpovědi pro všechna znamení
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayedZodiac.map((zodiac, index) => (
            <Link
              key={index}
              href={zodiac.url}
              className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 flex flex-col items-center gap-3 ${zodiac.highlight ? 'ring-2 ring-orange-400' : ''} ${hasAnimated ? 'animate-zoom-in-card' : 'opacity-0'}`}
              style={{
                animationDelay: hasAnimated ? `${index * 150}ms` : '0ms',
              }}
            >
              <div className="relative w-full">
                <LazyImage
                  src={zodiac.image}
                  alt={`Čínský horoskop ${zodiac.name} 2026`}
                  loading="lazy"
                  aspectRatio="square"
                  containerClassName="w-full rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-red-50"
                  showSkeleton={true}
                />
                {zodiac.highlight && (
                  <span className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Váš rok!
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground text-center">
                {zodiac.name}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            {showAll ? "Zobrazit méně" : `Zobrazit další (${chineseZodiac2026.length - 6})`}
          </button>
        </div>
      </div>
    </section>
  );
}
