import { Flower2, Music, User, Sparkles } from "lucide-react";

const categories = [
  {
    icon: Flower2,
    title: "Modrý lotos - Posvátná květina",
    description: "Autorská tvorba s modrým lotosem",
    url: "https://www.ohorai.cz/modry-lotos/",
  },
  {
    icon: Music,
    title: "Křišťálové nástroje",
    description: "Muzikoterapeutické nástroje z křišťálového skla",
    url: "https://www.ohorai.cz/",
  },
  {
    icon: User,
    title: "Meditační setkání",
    description: "Meditační setkání s ceremoniálním kakaem",
    url: "https://www.ohorai.cz/",
  },
  {
    icon: Sparkles,
    title: "Aromaterapeutické esence",
    description: "Čistá vůně přírody pro harmonii těla & ducha",
    url: "https://www.ohorai.cz/esence/",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <a
                key={index}
                href={category.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center p-6 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                {/* Ikona v kruhu */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E8C4D8] to-[#D4AF37]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
                </div>

                {/* Nadpis */}
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {category.title}
                </h3>

                {/* Popis */}
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
