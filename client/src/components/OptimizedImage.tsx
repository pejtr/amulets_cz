import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Optimized image component with responsive srcset for better performance
 * Automatically generates srcset for -small variants if they exist
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  sizes = "(max-width: 768px) 263px, 800px",
  priority = false 
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  
  // Generate srcset if it's a predictions-2026 image
  const isPrediction = src.includes('/predictions-2026/');
  const srcset = isPrediction && !error
    ? `${src.replace('.webp', '-small.webp')} 263w, ${src} 800w`
    : undefined;

  return (
    <img
      src={src}
      srcSet={srcset}
      sizes={srcset ? sizes : undefined}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      onError={() => setError(true)}
    />
  );
}
