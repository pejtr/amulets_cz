import { Heart, Sparkles, Gem } from "lucide-react";
import { Link } from "wouter";

const guideCategories = [
  {
    title: "Výběr dle použití",
    description: "Rychlý výběr podle účelu amuletů",
    icon: Heart,
    links: [
      { name: "Pro podporu financí a hojnosti", url: "/ucel/finance-a-hojnost" },
      { name: "Pro podporu vztahů a lásky", url: "/ucel/vztahy-a-laska" },
      { name: "Pro podporu vnitřního hlasu a intuice", url: "/ucel/vnitrni-hlas-a-intuice" },
      { name: "Pro transformaci v životě", url: "/ucel/transformace-v-zivote" },
    ],
    allLink: null,
  },
  {
    title: "Výběr podle symbolů",
    description: "Jaký je jejich význam?",
    icon: Sparkles,
    links: [
      { name: "Ruka Fatimy", url: "/symbol/ruka-fatimy" },
      { name: "Květ života v lotosu", url: "/symbol/kvet-zivota-v-lotosu" },
      { name: "Čínský drak", url: "/symbol/cinsky-drak" },
      { name: "Davidova hvězda", url: "/symbol/davidova-hvezda" },
      { name: "Strom života", url: "/symbol/strom-zivota" },
      { name: "Hvězda sjednocení", url: "/symbol/hvezda-sjednoceni" },
      { name: "Květ života", url: "/symbol/kvet-zivota" },
      { name: "Metatronova krychle", url: "/symbol/metatronova-krychle" },
      { name: "Choku Rei", url: "/symbol/choku-rei" },
      { name: "Buddha", url: "/symbol/buddha" },
      { name: "Jin Jang", url: "/symbol/jin-jang" },
      { name: "Horovo oko", url: "/symbol/horovo-oko" },
    ],
    allLink: null,
  },
  {
    title: "Výběr podle kamenů",
    description: "Rychlý výběr podle druhu kamenů",
    icon: Gem,
    links: [
      { name: "Lapis lazuli", url: "/kamen/lapis-lazuli" },
      { name: "Ametyst", url: "/kamen/ametyst" },
      { name: "Růženín", url: "/kamen/ruzenin" },
      { name: "Tygří oko", url: "/kamen/tygri-oko" },
      { name: "Křišťál", url: "/kamen/kristal" },
      { name: "Obsidián", url: "/kamen/obsidian" },
      { name: "Čaroit", url: "/kamen/caroit" },
      { name: "Turmalín", url: "/kamen/turmalin" },
    ],
    allLink: null,
  },
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guideCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E85A9F]/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[#E85A9F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.url}
                        className="text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
