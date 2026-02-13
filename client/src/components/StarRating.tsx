import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0-5
  reviewCount?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ 
  rating, 
  reviewCount, 
  showCount = true,
  size = "sm" 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const starSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const partial = rating > star - 1 && rating < star;
          
          return (
            <div key={star} className="relative">
              {partial ? (
                <>
                  {/* Background star (empty) */}
                  <Star 
                    className={`${starSize} text-muted-foreground/30`}
                    fill="currentColor"
                  />
                  {/* Foreground star (partial fill) */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${(rating - (star - 1)) * 100}%` }}
                  >
                    <Star 
                      className={`${starSize} text-[#FFD700]`}
                      fill="currentColor"
                    />
                  </div>
                </>
              ) : (
                <Star 
                  className={`${starSize} ${
                    filled ? 'text-[#FFD700]' : 'text-muted-foreground/30'
                  }`}
                  fill="currentColor"
                />
              )}
            </div>
          );
        })}
      </div>
      
      {showCount && reviewCount !== undefined && (
        <span className={`${textSize} text-muted-foreground font-medium`}>
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
