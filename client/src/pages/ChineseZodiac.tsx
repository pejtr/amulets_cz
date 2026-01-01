import { useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ChineseZodiacCalculator from "@/components/ChineseZodiacCalculator";
import ChineseZodiacCompatibility from "@/components/ChineseZodiacCompatibility";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createBreadcrumbSchema } from "@/lib/schema";

export default function ChineseZodiac() {
  useEffect(() => {
    document.title = "🐎 Čínský horoskop 2026 - Rok Ohnivého Koně | Kalkulačka a kompatibilita | Amulets.cz";
    
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Čínský horoskop 2026 - Rok Ohnivého Koně začíná 17. února 2026. Zjistěte své čínské znamení, element a kompatibilitu. Interaktivní kalkulačka podle data narození.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDesc);
    }

    setOpenGraphTags({
      title: "🐎 Čínský horoskop 2026 - Rok Ohnivého Koně | Kalkulačka a kompatibilita",
      description: "Rok Ohnivého Koně 2026 začíná 17. února. Zjistěte své čínské znamení, element a kompatibilitu s ostatními znameními.",
      url: "https://amulets.cz/cinsky-horoskop",
      type: "website",
      image: "https://amulets.cz/images/chinese-zodiac/kun.webp",
    });

    const breadcrumbs = createBreadcrumbSchema([
      { name: "Domů", url: "https://amulets.cz/" },
      { name: "Čínský horoskop 2026", url: "https://amulets.cz/cinsky-horoskop" },
    ]);

    setSchemaMarkup([breadcrumbs]);
  }, []);

  const chineseZodiacSigns = [
    { name: "Krysa", emoji: "🐀", slug: "cinsky-horoskop-krysa", years: "2020, 2008, 1996, 1984" },
    { name: "Bůvol", emoji: "🐂", slug: "cinsky-horoskop-buvol", years: "2021, 2009, 1997, 1985" },
    { name: "Tygr", emoji: "🐅", slug: "cinsky-horoskop-tygr", years: "2022, 2010, 1998, 1986" },
    { name: "Králík", emoji: "🐇", slug: "cinsky-horoskop-kralik", years: "2023, 2011, 1999, 1987" },
    { name: "Drak", emoji: "🐉", slug: "cinsky-horoskop-drak", years: "2024, 2012, 2000, 1988" },
    { name: "Had", emoji: "🐍", slug: "cinsky-horoskop-had", years: "2025, 2013, 2001, 1989" },
    { name: "Kůň", emoji: "🐎", slug: "cinsky-horoskop-kun", years: "2026, 2014, 2002, 1990", highlight: true },
    { name: "Koza", emoji: "🐏", slug: "cinsky-horoskop-koza", years: "2027, 2015, 2003, 1991" },
    { name: "Opice", emoji: "🐒", slug: "cinsky-horoskop-opice", years: "2028, 2016, 2004, 1992" },
    { name: "Kohout", emoji: "🐓", slug: "cinsky-horoskop-kohout", years: "2029, 2017, 2005, 1993" },
    { name: "Pes", emoji: "🐕", slug: "cinsky-horoskop-pes", years: "2030, 2018, 2006, 1994" },
    { name: "Prase", emoji: "🐖", slug: "cinsky-horoskop-prase", years: "2031, 2019, 2007, 1995" },
  ];

  const elements = [
    { name: "Dřevo", emoji: "🌳", slug: "element-drevo", color: "from-green-100 to-green-200" },
    { name: "Oheň", emoji: "🔥", slug: "element-ohen", color: "from-red-100 to-orange-200" },
    { name: "Země", emoji: "🌍", slug: "element-zeme", color: "from-amber-100 to-yellow-200" },
    { name: "Kov", emoji: "⚙️", slug: "element-kov", color: "from-gray-100 to-slate-200" },
    { name: "Voda", emoji: "💧", slug: "element-voda", color: "from-blue-100 to-cyan-200" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:py-16">
          <Breadcrumbs items={[
            { label: "Domů", href: "/" },
            { label: "Čínský horoskop 2026" }
          ]} />

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              🐎 Čínský horoskop 2026
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rok Ohnivého Koně - období energie, vášně a dobrodružství. Zjistěte své znamení a co vám rok 2026 přinese.
            </p>
          </div>

          {/* Rok 2026 - hlavní banner */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 text-white rounded-2xl p-6 md:p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="text-5xl md:text-6xl mb-4">🐎🔥</div>
              <h2 className="text-2xl md:text-4xl font-bold mb-3">Rok Ohnivého Koně 2026</h2>
              <p className="text-orange-100 mb-2 text-lg">
                Čínský Nový rok začíná <strong>17. února 2026</strong>
              </p>
              <p className="text-orange-200 mb-6 max-w-xl mx-auto">
                Kůň symbolizuje rychlost, nezávislost a dobrodružství. Rok 2026 přinese příležitosti pro odvážné činy, 
                nové začátky a dynamické změny. Ohnivý element zesiluje energii a vášeň.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/symbol/cinsky-horoskop-kun"
                  className="inline-block bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-100 transition-colors shadow-lg"
                >
                  🐎 Více o roku Koně 2026 →
                </Link>
                <Link 
                  href="#kalkulacka"
                  className="inline-block bg-orange-800/50 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-800 transition-colors border border-orange-400/30"
                >
                  🔮 Zjistit své znamení
                </Link>
              </div>
            </div>
          </div>

          {/* Co přinese rok 2026 */}
          <section className="mb-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 md:p-8 border border-orange-200">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-orange-800">
              🌟 Co přinese Rok Koně 2026?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: "⚡", title: "Energie", desc: "Čas pro akci a odvážné kroky" },
                { icon: "🏃", title: "Svoboda", desc: "Nezávislost a nové cesty" },
                { icon: "🔥", title: "Vášeň", desc: "Intenzivní emoce a vztahy" },
                { icon: "🎯", title: "Úspěch", desc: "Rychlé výsledky a pokrok" },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 shadow-md text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-orange-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Předpovědi 2026 pro jednotlivá znamení */}
          <section id="predpovedi-2026" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              🔮 Předpovědi pro rok 2026
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Klikněte na své znamení a zjistěte, co vám Rok Koně přinese v lásce, kariéře a zdraví.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {chineseZodiacSigns.map((sign) => (
                <Link
                  key={sign.name}
                  href={`/symbol/${sign.slug}`}
                  className={`rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border ${
                    sign.highlight 
                      ? "bg-gradient-to-br from-orange-100 to-red-100 border-orange-300 ring-2 ring-orange-400" 
                      : "bg-white border-orange-100"
                  }`}
                >
                  <div className="text-4xl mb-2">{sign.emoji}</div>
                  <h3 className="font-bold text-foreground">{sign.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{sign.years}</p>
                  {sign.highlight && (
                    <span className="inline-block mt-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      🐎 Váš rok!
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* Kalkulačka */}
          <section id="kalkulacka" className="mb-16">
            <ChineseZodiacCalculator />
          </section>

          {/* Kompatibilita */}
          <section id="kompatibilita" className="mb-16">
            <ChineseZodiacCompatibility />
          </section>

          {/* 5 elementů */}
          <section id="elementy" className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              🔥 5 Elementů čínské astrologie
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
              Rok 2026 je rokem <strong>Ohnivého</strong> Koně. Element Oheň přináší vášeň, energii a transformaci.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {elements.map((element) => (
                <Link
                  key={element.name}
                  href={`/symbol/${element.slug}`}
                  className={`bg-gradient-to-br ${element.color} rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                    element.name === "Oheň" ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <div className="text-4xl mb-2">{element.emoji}</div>
                  <h3 className="font-bold text-foreground">{element.name}</h3>
                  {element.name === "Oheň" && (
                    <span className="text-xs text-red-700 font-medium">Element 2026</span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* Rok 2027 - menší sekce */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 text-center border border-pink-200">
              <div className="text-3xl mb-2">🐏🔥</div>
              <h3 className="text-xl font-bold text-pink-800 mb-2">Připravte se na rok 2027</h3>
              <p className="text-pink-700 mb-4 text-sm">
                Rok Ohnivé Kozy začíná 6. února 2027 - rok kreativity, harmonie a umění.
              </p>
              <Link 
                href="/symbol/cinsky-horoskop-koza"
                className="inline-block bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors"
              >
                Více o roku Kozy →
              </Link>
            </div>
          </section>

          {/* Odkaz na hlavní stránku čínského kalendáře */}
          <div className="text-center">
            <Link 
              href="/symbol/cinsky-kalendar"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              📅 Čínský kalendář - Kompletní přehled
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
