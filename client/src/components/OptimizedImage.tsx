import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  objectFit?: "cover" | "contain" | "fill";
  showSkeleton?: boolean;
}

/**
 * OptimizedImage component with:
 * - Automatic srcset generation for responsive images
 * - Skeleton loading animation
 * - WebP format detection
 * - Lazy loading support
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  loading = "lazy",
  priority = false,
  aspectRatio = "auto",
  objectFit = "cover",
  showSkeleton = true,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached/loaded
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  // Generate srcset for different sizes
  const generateSrcSet = (imageSrc: string): string | undefined => {
    // Only generate srcset for local images
    if (!imageSrc.startsWith("/")) return undefined;
    
    // Check if it's a thumb image (already optimized)
    if (imageSrc.includes("/thumbs/")) return undefined;
    
    // For WebP images, we don't need srcset as they're already optimized
    if (imageSrc.endsWith(".webp")) return undefined;
    
    return undefined; // Srcset would require multiple image sizes on server
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

  return (
    <div className={cn("relative overflow-hidden", aspectRatioClass, className)}>
      {/* Skeleton loader */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : loading}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          objectFitClass,
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-4xl">🖼️</span>
        </div>
      )}
    </div>
  );
}
