import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Sparkles, TrendingUp, Users, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

// Article metadata for display (from static data)
import { magazineArticles } from '@/data/magazineContent';
import { tantraArticles } from '@/data/tantraArticles';

interface RecommendedArticlesProps {
  currentArticleSlug: string;
  articleType?: string;
  visitorId: string;
  limit?: number;
  className?: string;
}

// Map article slugs to display data
function getArticleDisplayData(slug: string, type: string): { title: string; image?: string; excerpt?: string; url: string } | null {
  // Check magazine articles
  const magArticle = magazineArticles.find((a: any) => a.slug === slug);
  if (magArticle) {
    return {
      title: magArticle.title,
      image: magArticle.image,
      excerpt: magArticle.excerpt,
      url: `/magazin/${slug}`,
    };
  }

  // Check tantra articles
  const tantraArticle = tantraArticles.find((a: any) => a.slug === slug);
  if (tantraArticle) {
    return {
      title: tantraArticle.title,
      image: tantraArticle.image,
      excerpt: tantraArticle.excerpt,
      url: `/magazin/${slug}`,
    };
  }

  // Guide articles - construct URL based on type
  if (type === 'guide') {
    return {
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      url: `/symbol/${slug}`,
    };
  }

  return null;
}

function getSourceIcon(source: string) {
  switch (source) {
    case 'collaborative': return <Users className="w-3.5 h-3.5" />;
    case 'content': return <BookOpen className="w-3.5 h-3.5" />;
    case 'popular': return <TrendingUp className="w-3.5 h-3.5" />;
    default: return <Sparkles className="w-3.5 h-3.5" />;
  }
}

function getSourceLabel(source: string) {
  switch (source) {
    case 'collaborative': return 'Čtenáři také četli';
    case 'content': return 'Podobný obsah';
    case 'popular': return 'Populární';
    default: return 'Doporučeno';
  }
}

export default function RecommendedArticles({ 
  currentArticleSlug, 
  articleType = 'magazine',
  visitorId, 
  limit = 4,
  className = '' 
}: RecommendedArticlesProps) {
  const { data: recommendations, isLoading } = trpc.articles.getRecommendations.useQuery(
    { visitorId, currentArticleSlug, limit },
    { 
      enabled: !!visitorId && !!currentArticleSlug,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  // Map recommendations to display data
  const displayRecs = useMemo(() => {
    if (!recommendations) return [];
    return recommendations
      .map(rec => {
        const display = getArticleDisplayData(rec.articleSlug, rec.articleType);
        if (!display) return null;
        return { ...rec, ...display };
      })
      .filter(Boolean) as Array<{
        articleSlug: string;
        articleType: string;
        score: number;
        reason: string;
        source: string;
        title: string;
        image?: string;
        excerpt?: string;
        url: string;
      }>;
  }, [recommendations]);

  if (isLoading) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Načítání doporučení...</span>
        </div>
      </div>
    );
  }

  if (!displayRecs || displayRecs.length === 0) {
    return null; // Don't show anything if no recommendations
  }

  return (
    <section className={`py-10 ${className}`}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Doporučené pro vás</h3>
            <p className="text-sm text-gray-500">Na základě vaší historie čtení</p>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayRecs.map((rec) => (
            <Link
              key={rec.articleSlug}
              href={rec.url}
              className="group block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-rose-200 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              {rec.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-3.5">
                {/* Source badge */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                    {getSourceIcon(rec.source)}
                    {getSourceLabel(rec.source)}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-rose-600 transition-colors leading-snug">
                  {rec.title}
                </h4>

                {/* Excerpt */}
                {rec.excerpt && (
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {rec.excerpt}
                  </p>
                )}

                {/* Read more */}
                <div className="flex items-center gap-1 mt-2.5 text-xs font-medium text-rose-500 group-hover:text-rose-600">
                  <span>Přečíst</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
