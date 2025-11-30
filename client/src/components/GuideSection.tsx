import { Heart, Sparkles, Gem } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const symbols = [
  // Původních 12
  { name: "Ruka Fatimy", url: "/symbol/ruka-fatimy", image: "/images/symbols/thumbs/ruka-fatimy-thumb.jpg" },
  { name: "Květ života v lotosu", url: "/symbol/kvet-zivota-v-lotosu", image: "/images/symbols/thumbs/kvet-zivota-thumb.jpg" },
  { name: "Čínský drak", url: "/symbol/cinsky-drak", image: "/images/symbols/thumbs/cinsky-drak-thumb.jpg" },
  { name: "Davidova hvězda", url: "/symbol/davidova-hvezda", image: "/images/symbols/thumbs/davidova-hvezda-thumb.jpg" },
  { name: "Strom života", url: "/symbol/strom-zivota", image: "/images/symbols/thumbs/strom-zivota-thumb.jpg" },
  { name: "Hvězda sjednocení", url: "/symbol/hvezda-sjednoceni", image: "/images/symbols/thumbs/hvezda-sjednoceni-thumb.jpg" },
  { name: "Květ života", url: "/symbol/kvet-zivota", image: "/images/symbols/thumbs/kvet-zivota-simple-thumb.jpg" },
  { name: "Metatronova krychle", url: "/symbol/metatronova-krychle", image: "/images/symbols/thumbs/metatronova-krychle-thumb.jpg" },
  { name: "Choku Rei", url: "/symbol/choku-rei", image: "/images/symbols/thumbs/choku-rei-thumb.jpg" },
  { name: "Buddha", url: "/symbol/buddha", image: "/images/symbols/thumbs/buddha-thumb.jpg" },
  { name: "Jin Jang", url: "/symbol/jin-jang", image: "/images/symbols/thumbs/jin-jang-thumb.jpg" },
  { name: "Horovo oko", url: "/symbol/horovo-oko", image: "/images/symbols/thumbs/horovo-oko-thumb.jpg" },
  
  // Nových 21 symbolů
  { name: "Om", url: "/symbol/om", image: "/images/symbols/thumbs/om-thumb.jpg" },
  { name: "Pentagram", url: "/symbol/pentagram", image: "/images/symbols/thumbs/pentagram-thumb.jpg" },
  { name: "Ankh", url: "/symbol/ankh", image: "/images/symbols/thumbs/ankh-thumb.jpg" },
  { name: "Triquetra", url: "/symbol/triquetra", image: "/images/symbols/thumbs/triquetra-thumb.jpg" },
  { name: "Merkaba", url: "/symbol/merkaba", image: "/images/symbols/thumbs/merkaba-thumb.jpg" },
  { name: "Hamsa s okem", url: "/symbol/hamsa-s-okem", image: "/images/symbols/thumbs/hamsa-eye-thumb.jpg" },
  { name: "Lotosová mandala", url: "/symbol/lotosova-mandala", image: "/images/symbols/thumbs/lotus-mandala-thumb.jpg" },
  { name: "Sri Yantra", url: "/symbol/sri-yantra", image: "/images/symbols/thumbs/sri-yantra-thumb.jpg" },
  { name: "Triskelion", url: "/symbol/triskelion", image: "/images/symbols/thumbs/triskelion-thumb.jpg" },
  { name: "Vesica Piscis", url: "/symbol/vesica-piscis", image: "/images/symbols/thumbs/vesica-piscis-thumb.jpg" },
  { name: "Nekonečno", url: "/symbol/nekonecno", image: "/images/symbols/thumbs/infinity-thumb.jpg" },
  { name: "Trojitý měsíc", url: "/symbol/trojity-mesic", image: "/images/symbols/thumbs/triple-moon-thumb.jpg" },
  { name: "Kříž", url: "/symbol/kriz", image: "/images/symbols/thumbs/cross-thumb.jpg" },
  { name: "Skarabeus", url: "/symbol/skarabeus", image: "/images/symbols/thumbs/scarab-thumb.jpg" },
  { name: "Caduceus", url: "/symbol/caduceus", image: "/images/symbols/thumbs/caduceus-thumb.jpg" },
  { name: "Pentakl", url: "/symbol/pentakl", image: "/images/symbols/thumbs/pentacle-thumb.jpg" },
  { name: "Půlměsíc", url: "/symbol/pulmesic", image: "/images/symbols/thumbs/crescent-moon-thumb.jpg" },
  { name: "Slunce", url: "/symbol/slunce", image: "/images/symbols/thumbs/sun-thumb.jpg" },
  { name: "Enso", url: "/symbol/enso", image: "/images/symbols/thumbs/enso-thumb.jpg" },
  { name: "Ouroboros", url: "/symbol/ouroboros", image: "/images/symbols/thumbs/ouroboros-thumb.jpg" },
  { name: "Keltský kříž", url: "/symbol/keltsky-kriz", image: "/images/symbols/thumbs/celtic-cross-thumb.jpg" },
  { name: "Mandala", url: "/symbol/mandala", image: "/images/symbols/thumbs/mandala-thumb.jpg" },
  { name: "Dharmachakra", url: "/symbol/dharmachakra", image: "/images/symbols/thumbs/dharma-wheel-thumb.jpg" },
  { name: "Spirála", url: "/symbol/spirala", image: "/images/symbols/thumbs/spiral-thumb.jpg" },
  { name: "Hexagram", url: "/symbol/hexagram", image: "/images/symbols/thumbs/hexagram-thumb.jpg" },
  { name: "Posvátné pero", url: "/symbol/posvatne-pero", image: "/images/symbols/thumbs/feather-thumb.jpg" },
];

const stones = [
  { name: "Lapis lazuli", url: "/kamen/lapis-lazuli", image: "/images/stones/thumbs/lapis-lazuli-thumb.jpg" },
  { name: "Ametyst", url: "/kamen/ametyst", image: "/images/stones/thumbs/ametyst-thumb.jpg" },
  { name: "Růženín", url: "/kamen/ruzenin", image: "/images/stones/thumbs/ruzenin-thumb.jpg" },
  { name: "Tygrí oko", url: "/kamen/tygri-oko", image: "/images/stones/thumbs/tygriooko-thumb.jpg" },
  { name: "Křišťál", url: "/kamen/kristal", image: "/images/stones/thumbs/kristal-thumb.jpg" },
  { name: "Obsidián", url: "/kamen/obsidian", image: "/images/stones/thumbs/obsidian-thumb.jpg" },
  { name: "Čaroit", url: "/kamen/caroit", image: "/images/stones/thumbs/caroit-thumb.jpg" },
  { name: "Turmalín", url: "/kamen/turmalin", image: "/images/stones/thumbs/turmalin-thumb.jpg" },
];

const purposes = [
  { name: "💰 Pro podporu financí a hojnosti", url: "/ucel/finance-a-hojnost" },
  { name: "💕 Pro podporu vztahů a lásky", url: "/ucel/vztahy-a-laska" },
  { name: "🔮 Pro podporu vnitřního hlasu a intuice", url: "/ucel/vnitrni-hlas-a-intuice" },
  { name: "✨ Pro transformaci v životě", url: "/ucel/transformace-v-zivote" },
];

export default function GuideSection() {
  const [showAllSymbols, setShowAllSymbols] = useState(false);
  const displayedSymbols = showAllSymbols ? symbols : symbols.slice(0, 12);

  return (
    <section id="pruvodce-amulety" className="w-full bg-accent/20 py-16">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 px-6 py-4 md:px-8 md:py-5 rounded-2xl bg-gradient-to-br from-white via-purple-50/80 to-pink-50/80 shadow-lg">
              <span className="bg-gradient-to-r from-[#2C3E50] via-[#E85A9F] to-[#9B59B6] bg-clip-text text-transparent">
                Průvodce amulety
              </span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg mt-6">
            Potřebuješ s něčím poradit? Začni s výběrem zde
          </p>
        </div>

        {/* Výběr dle použití */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#E85A9F]/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-[#E85A9F]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Výběr dle použití
              </h3>
              <p className="text-sm text-muted-foreground">
                Rychlý výběr podle účelu amuletů
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {purposes.map((purpose, index) => (
              <Link
                key={index}
                href={purpose.url}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <p className="text-sm font-medium text-foreground text-center">
                  {purpose.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Výběr podle symbolů */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#E85A9F]/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-[#E85A9F]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Výběr podle symbolů
              </h3>
              <p className="text-sm text-muted-foreground">
                Jaký je jejich význam?
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {displayedSymbols.map((symbol, index) => (
              <Link
                key={index}
                href={symbol.url}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 flex flex-col items-center gap-3"
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                  <img
                    src={symbol.image}
                    alt={symbol.name}
                    loading={index < 4 ? "eager" : "lazy"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-foreground text-center">
                  {symbol.name}
                </p>
              </Link>
            ))}
          </div>
          
          {/* Tlačítko "Zobrazit další" */}
          {!showAllSymbols && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAllSymbols(true)}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Zobrazit další ({symbols.length - 12})
              </button>
            </div>
          )}
        </div>

        {/* Výběr podle kamenů */}
        <div id="vyber-podle-kamenu">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#E85A9F]/10 flex items-center justify-center">
              <Gem className="h-6 w-6 text-[#E85A9F]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Výběr podle kamenů
              </h3>
              <p className="text-sm text-muted-foreground">
                Rychlý výběr podle druhu kamenů
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {stones.map((stone, index) => (
              <Link
                key={index}
                href={stone.url}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 flex flex-col items-center gap-3"
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50">
                  <img
                    src={stone.image}
                    alt={stone.name}
                    loading={index < 4 ? "eager" : "lazy"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-foreground text-center">
                  {stone.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
