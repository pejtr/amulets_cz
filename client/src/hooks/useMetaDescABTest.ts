import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useRef } from "react";

/**
 * Hook for A/B testing article meta descriptions for SEO optimization.
 * 
 * Fetches the assigned meta description variant for a visitor,
 * sets the <meta name="description"> tag dynamically,
 * and tracks engagement (organic clicks, read time, scroll depth).
 */
export function useMetaDescABTest(articleSlug: string, originalDescription: string) {
  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem("amulets_visitor_id");
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("amulets_visitor_id", id);
    }
    return id;
  }, []);

  const hasTrackedClick = useRef(false);

  // Fetch assigned meta description variant
  const { data: variant, isLoading } = trpc.articles.getMetaDescVariant.useQuery(
    { articleSlug, visitorId },
    {
      enabled: !!visitorId && !!articleSlug,
      staleTime: Infinity, // Assignment is permanent per visitor
      retry: false,
    }
  );

  const trackClickMutation = trpc.articles.trackMetaDescClick.useMutation();
  const updateEngagementMutation = trpc.articles.updateMetaDescEngagement.useMutation();

  const displayDescription = variant?.metaDescription || originalDescription;
  const variantKey = variant?.variantKey || null;
  const isControl = variant?.isControl ?? true;

  // Set meta description tag dynamically
  useEffect(() => {
    if (!displayDescription) return;

    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", displayDescription);

    // Also update OG description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", displayDescription);
    }
  }, [displayDescription]);

  // Track organic click (when user arrives from search engine)
  useEffect(() => {
    if (!variant || hasTrackedClick.current) return;

    const referrer = document.referrer;
    let referrerSource = "direct";

    if (referrer) {
      try {
        const url = new URL(referrer);
        const host = url.hostname.toLowerCase();
        
        if (host.includes("google")) referrerSource = "google";
        else if (host.includes("seznam")) referrerSource = "seznam";
        else if (host.includes("bing")) referrerSource = "bing";
        else if (host.includes("duckduckgo")) referrerSource = "duckduckgo";
        else if (host.includes("yahoo")) referrerSource = "yahoo";
        else if (host.includes("facebook") || host.includes("fb.")) referrerSource = "facebook";
        else if (host.includes("instagram")) referrerSource = "instagram";
        else if (host.includes("twitter") || host.includes("x.com")) referrerSource = "twitter";
        else referrerSource = "other";
      } catch {
        referrerSource = "unknown";
      }
    }

    // Only track as organic click if from search engine
    const isOrganic = ["google", "seznam", "bing", "duckduckgo", "yahoo"].includes(referrerSource);
    
    if (isOrganic) {
      trackClickMutation.mutate({
        articleSlug,
        visitorId,
        referrerSource,
      });
      hasTrackedClick.current = true;
    }
  }, [variant, articleSlug, visitorId]);

  // Track engagement on page leave
  useEffect(() => {
    if (!variant) return;

    const startTime = Date.now();
    let maxScroll = 0;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
        maxScroll = Math.max(maxScroll, scrollPercent);
      }
    };

    const sendEngagement = () => {
      const readTimeSeconds = Math.round((Date.now() - startTime) / 1000);
      const completed = maxScroll >= 80; // 80%+ scroll = completed

      updateEngagementMutation.mutate({
        articleSlug,
        visitorId,
        readTimeSeconds,
        scrollDepthPercent: maxScroll,
        completed,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", sendEngagement);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) sendEngagement();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", sendEngagement);
      sendEngagement();
    };
  }, [variant, articleSlug, visitorId]);

  return {
    displayDescription,
    variantKey,
    isControl,
    isLoading,
    hasActiveTest: !!variant,
  };
}
