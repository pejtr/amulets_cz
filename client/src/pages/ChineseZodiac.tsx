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
    document.title = "🐉 Čínský horoskop - Kalkulačka znamení a kompatibilita | Amulets.cz";
    
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Zjistěte své čínské znamení, element a kompatibilitu s ostatními znameními. Interaktivní kalkulačka čínského horoskopu podle data narození.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDesc);
    }

    setOpenGraphTags({
      title: "🐉 Čínský horoskop - Kalkulačka znamení a kompatibilita",
      description: "Zjistěte své čínské znamení, element a kompatibilitu s ostatními znameními. Interaktivní kalkulačka čínského horoskopu.",
      url: "https://amulets.cz/cinsky-horoskop",
      type: "website",
      image: "https://amulets.cz/images/symbols/cinsky-kalendar.webp",
    });

    const breadcrumbs = createBreadcrumbSchema([
      { name: "Domů", url: "https://amulets.cz/" },
      { name: "Čínský horoskop", url: "https://amulets.cz/cinsky-horoskop" },
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
    { name: "Kůň", emoji: "🐎", slug: "cinsky-horoskop-kun", years: "2026, 2014, 2002, 1990" },
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
            { label: "Čínský horoskop" }
          ]} />

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              🐉 Čínský horoskop
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Objevte tajemství čínské astrologie. Zjistěte své znamení, element a kompatibilitu s ostatními.
            </p>
          </div>

          {/* Rok 2025 banner */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 md:p-8 mb-12 text-center">
            <div className="text-4xl mb-2">🐍</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Rok 2025 - Rok Dřevěného Hada</h2>
            <p className="text-purple-100 mb-4">
              Čínský Nový rok začíná 29. ledna 2025. Had symbolizuje moudrost, intuici a transformaci.
            </p>
            <Link 
              href="/symbol/cinsky-horoskop-had"
              className="inline-block bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition-colors"
            >
              Více o roku Hada →
            </Link>
          </div>

          {/* Kalkulačka */}
          <section id="kalkulacka" className="mb-16">
            <ChineseZodiacCalculator />
          </section>

          {/* Kompatibilita */}
          <section id="kompatibilita" className="mb-16">
            <ChineseZodiacCompatibility />
          </section>

          {/* 12 znamení */}
          <section id="znameni" className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              12 Čínských znamení
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {chineseZodiacSigns.map((sign) => (
                <Link
                  key={sign.name}
                  href={`/symbol/${sign.slug}`}
                  className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-red-100"
                >
                  <div className="text-4xl mb-2">{sign.emoji}</div>
                  <h3 className="font-bold text-foreground">{sign.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{sign.years}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* 5 elementů */}
          <section id="elementy" className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              5 Elementů čínské astrologie
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {elements.map((element) => (
                <Link
                  key={element.name}
                  href={`/symbol/${element.slug}`}
                  className={`bg-gradient-to-br ${element.color} rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
                >
                  <div className="text-4xl mb-2">{element.emoji}</div>
                  <h3 className="font-bold text-foreground">{element.name}</h3>
                </Link>
              ))}
            </div>
          </section>

          {/* Odkaz na hlavní stránku čínského kalendáře */}
          <div className="text-center">
            <Link 
              href="/symbol/cinsky-kalendar"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
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
