import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { magazineArticles } from "@/data/magazineContent";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Magazine() {
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

        {/* Articles Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {magazineArticles.map((article) => (
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
                      <h2 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      
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

            {/* Empty State (if no articles) */}
            {magazineArticles.length === 0 && (
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
