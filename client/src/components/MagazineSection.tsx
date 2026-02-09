import { Link } from "wouter";
import { magazineArticles } from "@/data/magazineContent";
import { tantraArticles } from "@/data/tantraArticles";
import { ArrowRight, Star } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useHeadlineVariants, useHeadlineClickTracker } from "@/hooks/useHeadlineABTest";
import { useTranslation } from 'react-i18next';

// Kombinovat všechny články
const allArticles = [...magazineArticles, ...tantraArticles];

// Připnutý článek - 4 země, 4 kultury (nový IG post)
const featuredArticle = allArticles.find(a => a.slug === "4-zeme-4-kultury-4-sily");

// Ostatní články (bez připnutého) - zobrazit prvních 6
const displayArticles = allArticles
  .filter(a => a.slug !== "4-zeme-4-kultury-4-sily")
  .slice(0, 6);

export default function MagazineSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // A/B test headline variants
  const articleSlugs = useMemo(() => allArticles.map(a => a.slug), []);
  const { getTitle } = useHeadlineVariants(articleSlugs);
  const { handleClick: trackHeadlineClick } = useHeadlineClickTracker();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="magazin" className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('magazine.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('magazine.subtitle')}
          </p>
        </div>

        {/* Připnutý článek - Modrý lotos */}
        {featuredArticle && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                Doporučený článek
              </span>
            </div>
            <Link
              href={`/magazin/${featuredArticle.slug}`}
              className="group block max-w-4xl mx-auto"
            >
              <article className="bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10 rounded-2xl overflow-hidden border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                    {featuredArticle.image ? (
                      <img
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-blue-600/30 to-purple-600/30">
                        🪷
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-sm text-blue-600 font-medium mb-2">
                      Egyptská mytologie
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-[#D4AF37] transition-colors">
                      {getTitle(featuredArticle.slug, featuredArticle.title)}
                    </h3>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold group-hover:gap-3 transition-all">
                      Číst článek
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Grid ostatních článků s animací */}
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayArticles.map((article, index) => (
            <Link
              key={article.slug}
              href={`/magazin/${article.slug}`}
              onClick={() => trackHeadlineClick(article.slug)}
              className={`group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${hasAnimated ? 'animate-zoom-in-card' : 'opacity-0'}`}
              style={{
                animationDelay: hasAnimated ? `${index * 150}ms` : '0ms',
              }}
            >
              {/* Obrázek */}
              {article.image && (
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              {/* Obsah */}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {getTitle(article.slug, article.title)}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[#D4AF37] font-medium text-sm group-hover:gap-3 transition-all">
                  Číst více
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tlačítko Zobrazit další */}
        <div className="flex justify-center mt-10">
          <Link
            href="/magazin"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-full hover:from-[#B8860B] hover:to-[#8B6914] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t('magazine.showMore')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
