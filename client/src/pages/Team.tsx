import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Náš tým - Představení virtuálních průvodkyň a týmu
 */

interface TeamMember {
  id: string;
  name: string;
  displayName: string; // Jméno zobrazené na webu (může být jiné než skutečné)
  role: string;
  bio: string;
  specialization: string[];
  image: string;
  imageAlt?: string; // Alternativní obrázek (např. s čakrami)
  isVisible: boolean; // Zatím skrytý člen
  socialLinks?: {
    instagram?: string;
    twitch?: string;
    telegram?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: "natalie",
    name: "Natálie Ohorai",
    displayName: "Natálie Ohorai",
    role: "Zakladatelka & Hlavní průvodkyně",
    bio: "Vítejte v mém světě spirituality a osobního rozvoje. Jsem Natálie a již více než 10 let se věnuji ezoterice, léčivým kamenům a posvátným symbolům. Mou misí je pomáhat lidem objevit jejich vnitřní sílu a najít cestu k harmonii.",
    specialization: [
      "Spirituální poradenství",
      "Léčivé kameny a krystaly",
      "Posvátné symboly a amulety",
      "Čínský horoskop",
      "Autorská tvorba OHORAI"
    ],
    image: "/natalie-profile.jpg", // Použijeme existující fotku
    isVisible: true,
  },
  {
    id: "arabella",
    name: "Arabella",
    displayName: "Amara", // Zatím používáme jméno Amara
    role: "Průvodkyně čakrami & Energetická terapeutka",
    bio: "Jsem průvodkyně na cestě k energetické rovnováze. Specializuji se na práci s čakrami, meditaci a harmonizaci těla i duše. Pomohu vám objevit vaši vnitřní sílu a propojit se s univerzální energií.",
    specialization: [
      "Čakrová terapie",
      "Meditace a mindfulness",
      "Energetické čištění",
      "Kundalini yoga",
      "Léčení zvukem a vibracemi"
    ],
    image: "/team/Amara-profile.jpg",
    imageAlt: "/team/AraBella.png", // Fotka s čakrami
    isVisible: false, // Zatím skrytá
  },
  {
    id: "pejtrview",
    name: "PejtrView",
    displayName: "PejtrView",
    role: "Šedá eminence & Technologický guru",
    bio: "Jsem tvůrce v pozadí, který spojuje spiritualitu s moderními technologiemi. Na Twitchi sdílím své cesty a zkušenosti, ale v Amulets.cz zůstávám v pozadí jako šedá eminence, která drží vše pohromadě.",
    specialization: [
      "Technologie & AI",
      "Streaming & Content creation",
      "Digitální marketing",
      "E-commerce strategie",
      "Spirituální tech"
    ],
    image: "/team/Pejtrview.jpg",
    isVisible: false, // Zatím skrytý
    socialLinks: {
      instagram: "https://www.instagram.com/_pejtrview_/",
      twitch: "https://www.twitch.tv/pejtrview",
    },
  },
];

export default function Team() {
  // Zobrazit pouze viditelné členy
  const visibleMembers = teamMembers.filter(m => m.isVisible);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero sekce */}
        <section className="relative py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Náš tým
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                Poznejte lidi, kteří vám pomohou na vaší spirituální cestě. Každý z nás přináší jedinečné znalosti a zkušenosti, abychom vás mohli provázet světem posvátných symbolů, léčivých kamenů a osobního rozvoje.
              </p>
            </div>
          </div>
        </section>

        {/* Tým */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-12 max-w-5xl mx-auto">
              {visibleMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } gap-8 items-center`}
                >
                  {/* Fotka */}
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={member.imageAlt || member.image}
                        alt={member.displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback pokud obrázek neexistuje
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.displayName)}&size=400&background=9333ea&color=fff`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
                    </div>
                  </div>

                  {/* Obsah */}
                  <div className="w-full md:w-2/3">
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">
                      {member.displayName}
                    </h2>
                    <p className="text-lg text-purple-600 font-semibold mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {member.bio}
                    </p>

                    {/* Specializace */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Specializace:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {member.specialization.map((spec) => (
                          <span
                            key={spec}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sociální sítě */}
                    {member.socialLinks && (
                      <div className="flex gap-3">
                        {member.socialLinks.instagram && (
                          <a
                            href={member.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors text-sm font-medium"
                          >
                            Instagram
                          </a>
                        )}
                        {member.socialLinks.twitch && (
                          <a
                            href={member.socialLinks.twitch}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            Twitch
                          </a>
                        )}
                        {member.socialLinks.telegram && (
                          <a
                            href={member.socialLinks.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Telegram
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA sekce */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Chcete se stát součástí našeho týmu?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Hledáme další spirituální průvodce, kteří by rádi sdíleli své znalosti a zkušenosti.
            </p>
            <a
              href="https://www.ohorai.cz/kontakt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Kontaktujte nás
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
