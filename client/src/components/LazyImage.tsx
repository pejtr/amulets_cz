import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  rootMargin?: string;
  showSkeleton?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  objectFit?: "cover" | "contain" | "fill";
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage component with:
 * - Intersection Observer for lazy loading (with native fallback)
 * - Skeleton loading animation
 * - Smooth fade-in transition
 */
export default function LazyImage({
  src,
  alt,
  className,
  containerClassName,
  loading = "lazy",
  rootMargin = "300px", // Increased for earlier loading
  showSkeleton = true,
  aspectRatio = "auto",
  objectFit = "cover",
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Use Intersection Observer for lazy loading
  const [containerRef, , shouldLoad] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    triggerOnce: true,
    threshold: 0,
  });

  // Check if image is already cached
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalHeight !== 0) {
      setIsLoaded(true);
    }
  }, [shouldLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    onError?.();
  };

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  }[aspectRatio];

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  }[objectFit];

  // For eager loading, always load immediately
  const shouldRenderImage = loading === "eager" || shouldLoad;

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", aspectRatioClass, containerClassName)}
    >
      {/* Skeleton loader */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skeleton-shimmer" />
        </div>
      )}

      {/* Actual image - only render when in viewport or eager */}
      {shouldRenderImage && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            objectFitClass,
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-4xl">🖼️</span>
        </div>
      )}
    </div>
  );
}
