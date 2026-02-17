import { useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ChineseZodiacCalculator from "@/components/ChineseZodiacCalculator";
import ChineseZodiacCompatibility from "@/components/ChineseZodiacCompatibility";
import ChineseZodiacFAQ from "@/components/ChineseZodiacFAQ";
import { setOpenGraphTags, setHreflangTags } from "@/lib/seo";
import { setSchemaMarkup, createBreadcrumbSchema } from "@/lib/schema";

const SIGN_KEYS = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"] as const;
const SIGN_EMOJIS = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐏", "🐒", "🐓", "🐕", "🐖"];
const SIGN_SLUGS = [
  "cinsky-horoskop-krysa", "cinsky-horoskop-buvol", "cinsky-horoskop-tygr", "cinsky-horoskop-kralik",
  "cinsky-horoskop-drak", "cinsky-horoskop-had", "cinsky-horoskop-kun", "cinsky-horoskop-koza",
  "cinsky-horoskop-opice", "cinsky-horoskop-kohout", "cinsky-horoskop-pes", "cinsky-horoskop-prase",
];
const SIGN_YEARS = [
  "2020, 2008, 1996, 1984", "2021, 2009, 1997, 1985", "2022, 2010, 1998, 1986", "2023, 2011, 1999, 1987",
  "2024, 2012, 2000, 1988", "2025, 2013, 2001, 1989", "2026, 2014, 2002, 1990", "2027, 2015, 2003, 1991",
  "2028, 2016, 2004, 1992", "2029, 2017, 2005, 1993", "2030, 2018, 2006, 1994", "2031, 2019, 2007, 1995",
];

const ELEMENT_KEYS = ["wood", "fire", "earth", "metal", "water"] as const;
const ELEMENT_EMOJIS = ["🌳", "🔥", "🌍", "⚙️", "💧"];
const ELEMENT_SLUGS = ["element-drevo", "element-ohen", "element-zeme", "element-kov", "element-voda"];
const ELEMENT_COLORS = [
  "from-green-100 to-green-200", "from-red-100 to-orange-200", "from-amber-100 to-yellow-200",
  "from-gray-100 to-slate-200", "from-blue-100 to-cyan-200",
];

export default function ChineseZodiac() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('zh.pageTitle');
    
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', t('zh.metaDesc'));
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDesc);
    }

    setOpenGraphTags({
      title: t('zh.pageTitle'),
      description: t('zh.metaDesc'),
      url: "https://amulets.cz/cinsky-horoskop",
      type: "website",
      image: "https://amulets.cz/images/chinese-zodiac/kun.webp",
    });

    const breadcrumbs = createBreadcrumbSchema([
      { name: t('zh.breadcrumbHome'), url: "https://amulets.cz/" },
      { name: t('zh.breadcrumbHoroscope'), url: "https://amulets.cz/cinsky-horoskop" },
    ]);

    setSchemaMarkup([breadcrumbs]);
    setHreflangTags("/cinsky-horoskop");
  }, [t]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:py-16">
          <Breadcrumbs items={[
            { label: t('zh.breadcrumbHome'), href: "/" },
            { label: t('zh.breadcrumbHoroscope') }
          ]} />

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('zh.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('zh.subtitle')}
            </p>
          </div>

          {/* Year 2026 banner */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 text-white rounded-2xl p-6 md:p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="text-5xl md:text-6xl mb-4">🐎🔥</div>
              <h2 className="text-2xl md:text-4xl font-bold mb-3">{t('zh.yearBanner')}</h2>
              <p className="text-orange-100 mb-2 text-lg">
                {t('zh.newYearStart')} <strong>{t('zh.newYearDate')}</strong>
              </p>
              <p className="text-orange-200 mb-6 max-w-xl mx-auto">
                {t('zh.yearDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/symbol/cinsky-horoskop-kun"
                  className="inline-block bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-100 transition-colors shadow-lg"
                >
                  {t('zh.moreAboutHorse')}
                </Link>
                <Link 
                  href="#kalkulacka"
                  className="inline-block bg-orange-800/50 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-800 transition-colors border border-orange-400/30"
                >
                  {t('zh.findYourSign')}
                </Link>
              </div>
            </div>
          </div>

          {/* What 2026 brings */}
          <section className="mb-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 md:p-8 border border-orange-200">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-orange-800">
              {t('zh.whatBrings')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: "⚡", titleKey: "zh.energy", descKey: "zh.energyDesc" },
                { icon: "🏃", titleKey: "zh.freedom", descKey: "zh.freedomDesc" },
                { icon: "🔥", titleKey: "zh.passion", descKey: "zh.passionDesc" },
                { icon: "🎯", titleKey: "zh.success", descKey: "zh.successDesc" },
              ].map((item) => (
                <div key={item.titleKey} className="bg-white rounded-xl p-5 shadow-md text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-orange-800 mb-1">{t(item.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Zodiac signs SEO section */}
          <section id="cinska-znameni" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              {t('zh.signsTitle')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('zh.signsDesc')}
            </p>
          </section>

          {/* Predictions 2026 */}
          <section id="predpovedi-2026" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              {t('zh.predictionsTitle')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('zh.predictionsDesc')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {SIGN_KEYS.map((key, i) => {
                const isHorse = key === "horse";
                return (
                  <Link
                    key={key}
                    href={`/symbol/${SIGN_SLUGS[i]}`}
                    className={`rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border ${
                      isHorse 
                        ? "bg-gradient-to-br from-orange-100 to-red-100 border-orange-300 ring-2 ring-orange-400" 
                        : "bg-white border-orange-100"
                    }`}
                  >
                    <div className="text-4xl mb-2">{SIGN_EMOJIS[i]}</div>
                    <h3 className="font-bold text-foreground">{t(`zh.sign.${key}`)}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{SIGN_YEARS[i]}</p>
                    {isHorse && (
                      <span className="inline-block mt-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {t('zh.yourYear')}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Calculator */}
          <section id="kalkulacka" className="mb-16">
            <ChineseZodiacCalculator />
          </section>

          {/* Compatibility */}
          <section id="kompatibilita" className="mb-16">
            <ChineseZodiacCompatibility />
          </section>

          {/* 5 Elements */}
          <section id="elementy" className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              {t('zh.elementsTitle')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('zh.elementsDesc')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {ELEMENT_KEYS.map((key, i) => (
                <Link
                  key={key}
                  href={`/symbol/${ELEMENT_SLUGS[i]}`}
                  className={`bg-gradient-to-br ${ELEMENT_COLORS[i]} rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                    key === "fire" ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <div className="text-4xl mb-2">{ELEMENT_EMOJIS[i]}</div>
                  <h3 className="font-bold text-foreground">{t(`zh.el.${key}`)}</h3>
                  {key === "fire" && (
                    <span className="text-xs text-red-700 font-medium">{t('zh.element2026')}</span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <ChineseZodiacFAQ />

          {/* Year 2027 preview */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 text-center border border-pink-200">
              <div className="text-3xl mb-2">🐏🔥</div>
              <h3 className="text-xl font-bold text-pink-800 mb-2">{t('zh.prepare2027')}</h3>
              <p className="text-pink-700 mb-4 text-sm">
                {t('zh.prepare2027Desc')}
              </p>
              <Link 
                href="/symbol/cinsky-horoskop-koza"
                className="inline-block bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors"
              >
                {t('zh.moreAboutGoat')}
              </Link>
            </div>
          </section>

          {/* Calendar link */}
          <div className="text-center">
            <Link 
              href="/symbol/cinsky-kalendar"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              {t('zh.calendarLink')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
