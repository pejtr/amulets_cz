import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { magazineArticles } from "@/data/magazineContent";
import { tantraArticles } from "@/data/tantraArticles";
import { Link } from "wouter";
import { ArrowRight, Star, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";

// Kombinovat všechny články
const allArticles = [...magazineArticles, ...tantraArticles];

// Připnutý článek - Modrý lotos
const featuredArticle = allArticles.find(a => a.slug === "modry-lotos-egyptska-historie");

// Ostatní články (bez připnutého)
const regularArticles = allArticles.filter(a => a.slug !== "modry-lotos-egyptska-historie");

// Články bez tantra článků pro sekci "Všechny články"
const otherArticles = regularArticles.filter(a => !tantraArticles.find(t => t.slug === a.slug));

const ARTICLES_PER_PAGE = 6;

export default function Magazine() {
  const [tantraVisible, setTantraVisible] = useState(ARTICLES_PER_PAGE);
  const [otherVisible, setOtherVisible] = useState(ARTICLES_PER_PAGE);

  const showMoreTantra = () => {
    setTantraVisible(prev => Math.min(prev + ARTICLES_PER_PAGE, tantraArticles.length));
  };

  const showMoreOther = () => {
    setOtherVisible(prev => Math.min(prev + ARTICLES_PER_PAGE, otherArticles.length));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Magazín
              </h1>
              <p className="text-lg text-muted-foreground">
                Objevte tajemství amuletů, drahých kamenů a duchovního růstu. 
                Praktické rady a hluboké znalosti pro vaši cestu k harmonii.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Article - Modrý lotos */}
        {featuredArticle && (
          <section className="py-12 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20">
            <div className="container">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                  Doporučený článek
                </span>
              </div>
              
              <Link href={`/magazin/${featuredArticle.slug}`} className="group block">
                <article className="grid md:grid-cols-2 gap-8 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  {/* Image */}
                  <div className="aspect-video md:aspect-auto md:h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 overflow-hidden">
                    {featuredArticle.image ? (
                      <img
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl">
                        🪷
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-blue-400 font-medium">
                        Egyptská mytologie
                      </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h2>
                    
                    <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="flex items-center text-primary font-semibold text-lg group-hover:gap-3 transition-all">
                      Číst článek
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          </section>
        )}

        {/* Tantra & Láska Section */}
        <section className="py-16 bg-gradient-to-b from-pink-900/10 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Tantra, Láska & Milování
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tantraArticles.slice(0, tantraVisible).map((article) => (
                <Link
                  key={article.slug}
                  href={`/magazin/${article.slug}`}
                  className="group"
                >
                  <article className="bg-card rounded-lg overflow-hidden border border-pink-500/20 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
                    {/* Image */}
                    <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-red-500/10 overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          💕
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-pink-500 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center text-pink-500 font-semibold text-sm group-hover:gap-2 transition-all">
                        Číst článek
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Show More Button - Tantra */}
            {tantraVisible < tantraArticles.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={showMoreTantra}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/20"
                >
                  Zobrazit další
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* All Other Articles Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Všechny články
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.slice(0, otherVisible).map((article) => (
                <Link
                  key={article.slug}
                  href={`/magazin/${article.slug}`}
                  className="group"
                >
                  <article className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          ✨
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                        Číst článek
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Show More Button - Other Articles */}
            {otherVisible < otherArticles.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={showMoreOther}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Zobrazit další
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Empty State (if no articles) */}
            {allArticles.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Zatím zde nejsou žádné články
                </h3>
                <p className="text-muted-foreground">
                  Brzy přidáme zajímavý obsah o amuletoch a duchovním růstu.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
