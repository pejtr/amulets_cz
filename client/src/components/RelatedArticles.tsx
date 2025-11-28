import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface Article {
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  category: string;
}

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">
          Související články
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((article, index) => (
            <Link
              key={index}
              href={article.category === 'magazin' ? `/magazin/${article.slug}` : `/${article.category}/${article.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-[#D4AF37] font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Číst více</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
