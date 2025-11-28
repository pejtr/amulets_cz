import { Heart, Sparkles, Gem } from "lucide-react";
import { Link } from "wouter";

const symbols = [
  { name: "Ruka Fatimy", url: "/symbol/ruka-fatimy", image: "/images/symbols/ruka-fatimy.png" },
  { name: "Květ života v lotosu", url: "/symbol/kvet-zivota-v-lotosu", image: "/images/symbols/kvet-zivota.png" },
  { name: "Čínský drak", url: "/symbol/cinsky-drak", image: "/images/symbols/cinsky-drak.png" },
  { name: "Davidova hvězda", url: "/symbol/davidova-hvezda", image: "/images/symbols/davidova-hvezda.png" },
  { name: "Strom života", url: "/symbol/strom-zivota", image: "/images/symbols/strom-zivota.png" },
  { name: "Hvězda sjednocení", url: "/symbol/hvezda-sjednoceni", image: "/images/symbols/hvezda-sjednoceni.png" },
  { name: "Květ života", url: "/symbol/kvet-zivota", image: "/images/symbols/kvet-zivota-simple.png" },
  { name: "Metatronova krychle", url: "/symbol/metatronova-krychle", image: "/images/symbols/metatronova-krychle.png" },
  { name: "Choku Rei", url: "/symbol/choku-rei", image: "/images/symbols/choku-rei.png" },
  { name: "Buddha", url: "/symbol/buddha", image: "/images/symbols/buddha.png" },
  { name: "Jin Jang", url: "/symbol/jin-jang", image: "/images/symbols/jin-jang.png" },
  { name: "Horovo oko", url: "/symbol/horovo-oko", image: "/images/symbols/horovo-oko.png" },
];

const stones = [
  { name: "Lapis lazuli", url: "/kamen/lapis-lazuli", image: "/images/stones/lapis-lazuli.png" },
  { name: "Ametyst", url: "/kamen/ametyst", image: "/images/stones/ametyst.png" },
  { name: "Růženín", url: "/kamen/ruzenin", image: "/images/stones/ruzenin.png" },
  { name: "Tygří oko", url: "/kamen/tygri-oko", image: "/images/stones/tygriooko.png" },
  { name: "Křišťál", url: "/kamen/kristal", image: "/images/stones/kristal.png" },
  { name: "Obsidián", url: "/kamen/obsidian", image: "/images/stones/obsidian.png" },
  { name: "Čaroit", url: "/kamen/caroit", image: "/images/stones/caroit.png" },
  { name: "Turmalín", url: "/kamen/turmalin", image: "/images/stones/turmalin.png" },
];

const purposes = [
  { name: "Pro podporu financí a hojnosti", url: "/ucel/finance-a-hojnost" },
  { name: "Pro podporu vztahů a lásky", url: "/ucel/vztahy-a-laska" },
  { name: "Pro podporu vnitřního hlasu a intuice", url: "/ucel/vnitrni-hlas-a-intuice" },
  { name: "Pro transformaci v životě", url: "/ucel/transformace-v-zivote" },
];

export default function GuideSection() {
  return (
    <section className="w-full bg-accent/20 py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Průvodce amulety
          </h2>
          <p className="text-muted-foreground text-lg">
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
            {symbols.map((symbol, index) => (
              <Link
                key={index}
                href={symbol.url}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 flex flex-col items-center gap-3"
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                  <img
                    src={symbol.image}
                    alt={symbol.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-foreground text-center">
                  {symbol.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Výběr podle kamenů */}
        <div>
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
