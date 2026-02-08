import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useRef, useState } from "react";

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
 * Hook for listing pages - fetches active tests and variants for multiple articles
 */
export function useHeadlineVariants(articleSlugs: string[]) {
  const [variants, setVariants] = useState<Record<string, string>>({});
  
  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("amulets_visitor_id") || "";
  }, []);

  const { data: activeTests } = trpc.articles.getActiveHeadlineTests.useQuery(undefined, {
    staleTime: 60_000, // Cache for 1 minute
    retry: false,
  });

  // For each active test that matches our article slugs, fetch the variant
  const activeArticleSlugs = useMemo(() => {
    if (!activeTests) return [];
    return articleSlugs.filter(slug => activeTests.includes(slug));
  }, [activeTests, articleSlugs]);

  // Fetch variants for active tests one by one
  const variantQueries = activeArticleSlugs.map(slug => 
    trpc.articles.getHeadlineVariant.useQuery(
      { articleSlug: slug, visitorId },
      { 
        enabled: !!visitorId && !!slug,
        staleTime: Infinity,
        retry: false,
      }
    )
  );

  // Build variants map
  useEffect(() => {
    const newVariants: Record<string, string> = {};
    activeArticleSlugs.forEach((slug, i) => {
      const query = variantQueries[i];
      if (query?.data?.headline) {
        newVariants[slug] = query.data.headline;
      }
    });
    if (Object.keys(newVariants).length > 0) {
      setVariants(prev => ({ ...prev, ...newVariants }));
    }
  }, [variantQueries.map(q => q.data).join(",")]);

  const getTitle = (slug: string, originalTitle: string) => {
    return variants[slug] || originalTitle;
  };

  return { getTitle, isLoading: variantQueries.some(q => q.isLoading) };
}
