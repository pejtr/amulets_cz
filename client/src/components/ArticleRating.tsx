import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ArticleRatingProps {
  articleSlug: string;
  articleType?: 'magazine' | 'guide' | 'tantra';
  visitorId: string;
}

export default function ArticleRating({ articleSlug, articleType = 'magazine', visitorId }: ArticleRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Get article stats (avg rating, total ratings)
  const { data: stats } = trpc.articles.getStats.useQuery({ articleSlug });
  
  // Get visitor's existing rating
  const { data: myRatingData } = trpc.articles.getMyRating.useQuery({ articleSlug, visitorId });
  
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (myRatingData?.rating) {
      setSelectedRating(myRatingData.rating);
      setSubmitted(true);
    }
  }, [myRatingData]);

  const rateMutation = trpc.articles.rate.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleRate = (rating: number) => {
    setSelectedRating(rating);
    rateMutation.mutate({
      articleSlug,
      articleType,
      visitorId,
      rating,
    });
  };

  const avgRating = stats?.ratings?.average || 0;
  const totalRatings = stats?.ratings?.total || 0;

  return (
    <div className="flex flex-col items-center gap-3 py-6 px-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-xl border border-amber-100/50">
      <h3 className="text-lg font-semibold text-[#2C3E50]">
        {submitted ? 'Děkujeme za hodnocení!' : 'Jak se vám článek líbil?'}
      </h3>
      
      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoveredStar || selectedRating);
          return (
            <button
              key={star}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => handleRate(star)}
              aria-label={`Hodnotit ${star} z 5`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-none text-gray-300 hover:text-amber-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Rating summary */}
      {totalRatings > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{avgRating}</span>
          </div>
          <span>•</span>
          <span>{totalRatings} {totalRatings === 1 ? 'hodnocení' : totalRatings < 5 ? 'hodnocení' : 'hodnocení'}</span>
        </div>
      )}

      {submitted && (
        <p className="text-sm text-emerald-600 font-medium animate-in fade-in">
          Vaše hodnocení: {selectedRating}/5 ⭐
        </p>
      )}
    </div>
  );
}
