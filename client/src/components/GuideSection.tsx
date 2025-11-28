import { Heart, Sparkles, Gem } from "lucide-react";

const guideCategories = [
  {
    title: "Výběr dle použití",
    description: "Rychlý výběr podle účelu amuletů",
    icon: Heart,
    links: [
      { name: "Pro podporu financí a hojnosti", url: "https://www.ohorai.cz/pro-podporu-financi-a-hojnosti/" },
      { name: "Pro podporu vztahů a lásky", url: "https://www.ohorai.cz/pro-podporu-vztahu-a-lasky/" },
      { name: "Pro podporu vnitřního hlasu a intuice", url: "https://www.ohorai.cz/pro-podporu-vnitrniho-hlasu-a-intuice/" },
      { name: "Pro transformaci v životě", url: "https://www.ohorai.cz/pro-transformaci-v-zivote/" },
    ],
    allLink: { name: "Všechny amulety", url: "https://www.ohorai.cz/amulety-podle-ucelu/" },
  },
  {
    title: "Výběr podle symbolů",
    description: "Jaký je jejich význam?",
    icon: Sparkles,
    links: [
      { name: "Ruka Fatimy", url: "https://www.ohorai.cz/symbol-ruka-fatimy/" },
      { name: "Květ života v lotosu", url: "https://www.ohorai.cz/symbol-kvet-zivota-v-lotosu/" },
      { name: "Čínský drak", url: "https://www.ohorai.cz/symbol-cinsky-drak/" },
      { name: "Davidova hvězda", url: "https://www.ohorai.cz/symbol-davidova-hvezda/" },
      { name: "Strom života", url: "https://www.ohorai.cz/symbol-strom-zivota/" },
      { name: "Hvězda sjednocení", url: "https://www.ohorai.cz/symbol-hvezda-sjednoceni/" },
      { name: "Květ života", url: "https://www.ohorai.cz/symbol-kvet-zivota/" },
      { name: "Metatronova krychle", url: "https://www.ohorai.cz/symbol-metatronova-krychle/" },
    ],
    allLink: { name: "Všechny symboly", url: "https://www.ohorai.cz/symboly-amuletu/" },
  },
  {
    title: "Výběr podle kamenů",
    description: "Rychlý výběr podle druhu kamenů",
    icon: Gem,
    links: [
      { name: "Lapis lazuli", url: "https://www.ohorai.cz/kamen-lapis-lazuli-lazurit/" },
      { name: "Ametyst", url: "https://www.ohorai.cz/kamen-ametyst/" },
      { name: "Růženín", url: "https://www.ohorai.cz/kamen-ruzenin/" },
      { name: "Tygří oko", url: "https://www.ohorai.cz/kamen-tygri-oko/" },
      { name: "Křišťál", url: "https://www.ohorai.cz/kamen-kristal/" },
      { name: "Obsidián", url: "https://www.ohorai.cz/kamen-obsidian/" },
      { name: "Čaroit", url: "https://www.ohorai.cz/kamen-caroit/" },
      { name: "Turmalín", url: "https://www.ohorai.cz/kamen-turmalim/" },
    ],
    allLink: { name: "Všechny kameny", url: "https://www.ohorai.cz/vyznamy-kamenu/" },
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

                <ul className="space-y-2 mb-4">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>

                <a
                  href={category.allLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[#D4AF37] hover:underline font-semibold text-sm"
                >
                  {category.allLink.name} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
