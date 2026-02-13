import { Link } from "wouter";
import { symbolsData } from "@/data/guideContent";

// Mapování symbolů k souvisejícím symbolům pro interní prolinkování
const relatedSymbolsMap: Record<string, string[]> = {
  // Egyptské symboly
  "egyptsky-symbol-lasky": ["ankh", "skarabeus", "horovo-oko"],
  "ankh": ["egyptsky-symbol-lasky", "horovo-oko", "skarabeus", "znak-zivota"],
  "horovo-oko": ["ankh", "egyptsky-symbol-lasky", "symbol-ochrany", "skarabeus"],
  "skarabeus": ["ankh", "egyptsky-symbol-lasky", "horovo-oko", "symbol-nesmrtelnosti"],
  
  // Ochranné symboly
  "symbol-ochrany": ["ruka-fatimy", "horovo-oko", "pentagram", "nejsilnejsi-ochranny-symbol"],
  "nejsilnejsi-ochranny-symbol": ["metatronova-krychle", "kvet-zivota", "pentagram", "symbol-ochrany"],
  "ruka-fatimy": ["symbol-ochrany", "horovo-oko", "hamsa-s-okem", "nejsilnejsi-ochranny-symbol"],
  "pentagram": ["symbol-ochrany", "pentakl", "nejsilnejsi-ochranny-symbol", "triquetra"],
  "pentakl": ["pentagram", "symbol-ochrany", "metatronova-krychle"],
  
  // Symboly harmonie
  "symbol-harmonie": ["jin-jang", "kvet-zivota", "mandala", "om"],
  "jin-jang": ["symbol-harmonie", "enso", "mandala", "triskelion"],
  "mandala": ["symbol-harmonie", "kvet-zivota", "sri-yantra", "jin-jang"],
  "om": ["symbol-harmonie", "buddha", "dharmachakra", "lotosova-mandala"],
  "enso": ["jin-jang", "symbol-harmonie", "buddha", "mandala"],
  
  // Keltské symboly
  "keltsky-symbol-lasky": ["triquetra", "triskelion", "keltsky-kriz", "spirala"],
  "triquetra": ["keltsky-symbol-lasky", "triskelion", "keltsky-kriz", "trojity-mesic"],
  "triskelion": ["triquetra", "keltsky-symbol-lasky", "spirala", "keltsky-kriz"],
  "keltsky-kriz": ["triquetra", "kriz", "keltsky-symbol-lasky", "triskelion"],
  
  // Symboly života a nesmrtelnosti
  "znak-zivota": ["ankh", "strom-zivota", "kvet-zivota", "symbol-nesmrtelnosti"],
  "symbol-nesmrtelnosti": ["ouroboros", "ankh", "skarabeus", "znak-zivota"],
  "strom-zivota": ["znak-zivota", "kvet-zivota", "spirala", "keltsky-kriz"],
  "ouroboros": ["symbol-nesmrtelnosti", "nekonecno", "spirala", "jin-jang"],
  
  // Posvátná geometrie
  "kvet-zivota": ["metatronova-krychle", "vesica-piscis", "sri-yantra", "symbol-harmonie"],
  "metatronova-krychle": ["kvet-zivota", "nejsilnejsi-ochranny-symbol", "merkaba", "hexagram"],
  "vesica-piscis": ["kvet-zivota", "sri-yantra", "metatronova-krychle", "mandala"],
  "sri-yantra": ["mandala", "kvet-zivota", "vesica-piscis", "merkaba"],
  "merkaba": ["metatronova-krychle", "davidova-hvezda", "hexagram", "sri-yantra"],
  "hexagram": ["davidova-hvezda", "merkaba", "metatronova-krychle", "sri-yantra"],
  "davidova-hvezda": ["hexagram", "merkaba", "symbol-ochrany", "kvet-zivota"],
  
  // Další symboly
  "spirala": ["triskelion", "ouroboros", "nekonecno", "keltsky-symbol-lasky"],
  "nekonecno": ["ouroboros", "spirala", "symbol-nesmrtelnosti", "jin-jang"],
  "trojity-mesic": ["pulmesic", "triquetra", "slunce", "keltsky-symbol-lasky"],
  "pulmesic": ["trojity-mesic", "slunce", "jin-jang", "symbol-harmonie"],
  "slunce": ["pulmesic", "jin-jang", "horovo-oko", "ankh"],
  "cinsky-drak": ["jin-jang", "om", "buddha", "triskelion"],
  "buddha": ["om", "dharmachakra", "lotosova-mandala", "enso"],
  "dharmachakra": ["buddha", "om", "lotosova-mandala", "mandala"],
  "lotosova-mandala": ["mandala", "kvet-zivota-v-lotosu", "buddha", "om"],
  "kvet-zivota-v-lotosu": ["kvet-zivota", "lotosova-mandala", "mandala", "symbol-harmonie"],
  "choku-rei": ["om", "symbol-ochrany", "kvet-zivota", "merkaba"],
  "caduceus": ["ankh", "horovo-oko", "symbol-ochrany", "merkaba"],
  "symbol-lasky": ["egyptsky-symbol-lasky", "keltsky-symbol-lasky", "jin-jang", "triquetra"],
  "hvezda-sjednoceni": ["davidova-hvezda", "merkaba", "kvet-zivota", "symbol-harmonie"],
  "hamsa-s-okem": ["ruka-fatimy", "horovo-oko", "symbol-ochrany", "nejsilnejsi-ochranny-symbol"],
  "kriz": ["keltsky-kriz", "ankh", "symbol-ochrany", "triquetra"],
  "posvatne-pero": ["skarabeus", "ankh", "spirala", "strom-zivota"],
};

interface RelatedSymbolsProps {
  currentSlug: string;
  maxItems?: number;
}

export default function RelatedSymbols({ currentSlug, maxItems = 4 }: RelatedSymbolsProps) {
  // Získáme související symboly pro aktuální slug
  const relatedSlugs = relatedSymbolsMap[currentSlug] || [];
  
  // Pokud nemáme definované související symboly, vybereme náhodné
  const slugsToShow = relatedSlugs.length > 0 
    ? relatedSlugs.slice(0, maxItems)
    : symbolsData
        .filter(s => s.slug !== currentSlug)
        .sort(() => Math.random() - 0.5)
        .slice(0, maxItems)
        .map(s => s.slug);
  
  // Najdeme data pro zobrazení
  const relatedItems = slugsToShow
    .map(slug => symbolsData.find(s => s.slug === slug))
    .filter(Boolean);
  
  if (relatedItems.length === 0) return null;
  
  return (
    <div className="mt-12 border-t border-border pt-8">
      <h3 className="text-xl font-bold mb-6 text-foreground">Související symboly</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedItems.map((item) => (
          <Link 
            key={item!.slug}
            href={`/symbol/${item!.slug}`}
            className="group block p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
          >
            {item!.image && (
              <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-2">
                <img 
                  src={item!.image} 
                  alt={item!.title}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <h4 className="font-semibold text-sm text-foreground group-hover:text-[#D4AF37] transition-colors line-clamp-2">
              {item!.title}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
}
