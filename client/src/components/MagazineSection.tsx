import { Link } from "wouter";
import { magazineArticles } from "@/data/magazineContent";
import { ArrowRight } from "lucide-react";

export default function MagazineSection() {
  return (
    <section id="magazin" className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Magazín</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Objevte zajímavé články o duchovnosti, léčivých rostlinách a aromaterapii
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {magazineArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/magazin/${article.slug}`}
              className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
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
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-[#D4AF37] transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[#D4AF37] font-medium group-hover:gap-3 transition-all">
                  Číst více
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
