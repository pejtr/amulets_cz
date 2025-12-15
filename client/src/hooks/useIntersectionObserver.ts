import { useState, useEffect, useRef, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook for Intersection Observer API
 * Provides fallback for browsers without native lazy loading support
 * 
 * @param options - Configuration options for the observer
 * @returns [ref, isIntersecting, hasIntersected] - Ref to attach, current state, and if ever intersected
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean, boolean] {
  const { threshold = 0.1, rootMargin = "50px", triggerOnce = true } = options;
  
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback: immediately set as visible
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          setIsIntersecting(isVisible);
          
          if (isVisible) {
            setHasIntersected(true);
            
            // Unobserve if triggerOnce is true
            if (triggerOnce) {
              observer.unobserve(element);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isIntersecting, hasIntersected];
}

/**
 * Hook specifically for lazy loading images
 * Returns whether the image should start loading
 */
export function useLazyImage(rootMargin = "100px"): [RefObject<HTMLImageElement | null>, boolean] {
  const [ref, , hasIntersected] = useIntersectionObserver<HTMLImageElement>({
    rootMargin,
    triggerOnce: true,
    threshold: 0,
  });

  return [ref, hasIntersected];
}

export default useIntersectionObserver;
