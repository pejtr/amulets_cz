import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useState } from "react";

/**
 * Hook for A/B testing article headlines
 * 
 * Fetches the assigned headline variant for a visitor and tracks engagement.
 * Falls back to the original title if no test is active.
 */
export function useHeadlineABTest(articleSlug: string, originalTitle: string) {
  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem("amulets_visitor_id");
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("amulets_visitor_id", id);
    }
    return id;
  }, []);

  const { data: variant, isLoading } = trpc.articles.getHeadlineVariant.useQuery(
    { articleSlug, visitorId },
    { 
      enabled: !!visitorId && !!articleSlug,
      staleTime: Infinity, // Don't refetch - assignment is permanent
      retry: false,
    }
  );

  const displayTitle = variant?.headline || originalTitle;
  const variantKey = variant?.variantKey || null;
  const isControl = variant?.isControl ?? true;

  return {
    displayTitle,
    variantKey,
    isControl,
    isLoading,
    hasActiveTest: !!variant,
  };
}

/**
 * Hook for tracking headline clicks from listing pages
 * Returns a click handler that tracks the click before navigation
 */
export function useHeadlineClickTracker() {
  const trackClick = trpc.articles.trackHeadlineClick.useMutation();

  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("amulets_visitor_id") || "";
  }, []);

  const handleClick = (articleSlug: string) => {
    if (visitorId) {
      trackClick.mutate({ articleSlug, visitorId });
    }
  };

  return { handleClick };
}

/**
 * Hook for listing pages - fetches active tests and variants for multiple articles.
 * 
 * FIXED: Previously called useQuery inside .map() which violated React Rules of Hooks.
 * Now uses a single query to fetch all active tests, then fetches variants in a single
 * batch effect instead of individual hook calls per article.
 */
export function useHeadlineVariants(articleSlugs: string[]) {
  const [variants, setVariants] = useState<Record<string, string>>({});
  
  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("amulets_visitor_id") || "";
  }, []);

  const { data: activeTests } = trpc.articles.getActiveHeadlineTests.useQuery(undefined, {
    staleTime: 60_000,
    retry: false,
  });

  // Find which of our article slugs have active tests
  const activeArticleSlugs = useMemo(() => {
    if (!activeTests) return [];
    return articleSlugs.filter(slug => activeTests.includes(slug));
  }, [activeTests, articleSlugs]);

  // Use a single batch query to get all variants at once via tRPC
  // Instead of calling useQuery in a loop, we fetch via a single effect
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!visitorId || activeArticleSlugs.length === 0) return;

    let cancelled = false;

    const fetchAllVariants = async () => {
      const results: Record<string, string> = {};
      
      // Fetch all variants in parallel using tRPC utils (not hooks)
      const promises = activeArticleSlugs.map(async (slug) => {
        try {
          const variant = await utils.articles.getHeadlineVariant.fetch(
            { articleSlug: slug, visitorId },
          );
          if (variant?.headline) {
            results[slug] = variant.headline;
          }
        } catch {
          // Silently fail for individual variants
        }
      });

      await Promise.all(promises);

      if (!cancelled && Object.keys(results).length > 0) {
        setVariants(prev => ({ ...prev, ...results }));
      }
    };

    fetchAllVariants();

    return () => { cancelled = true; };
  }, [visitorId, activeArticleSlugs.join(","), utils]);

  const getTitle = (slug: string, originalTitle: string) => {
    return variants[slug] || originalTitle;
  };

  const isLoading = activeArticleSlugs.length > 0 && Object.keys(variants).length === 0;

  return { getTitle, isLoading };
}
