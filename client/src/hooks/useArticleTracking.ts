import { useEffect, useRef, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * Hook pro automatické trackování zobrazení článku a engagement metrik.
 * Sleduje: page view, čas čtení, hloubku scrollování.
 */
export function useArticleTracking(articleSlug: string, articleType: 'magazine' | 'guide' | 'tantra' = 'magazine') {
  const viewIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  // Get or create visitor ID
  const getVisitorId = useCallback(() => {
    let visitorId = localStorage.getItem('amulets_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('amulets_visitor_id', visitorId);
    }
    return visitorId;
  }, []);

  const trackViewMutation = trpc.articles.trackView.useMutation();
  const updateEngagementMutation = trpc.articles.updateEngagement.useMutation();

  // Track page view on mount
  useEffect(() => {
    if (!articleSlug) return;

    const visitorId = getVisitorId();
    const device = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';

    trackViewMutation.mutate({
      articleSlug,
      articleType,
      visitorId,
      referrer: document.referrer || undefined,
      sourcePage: window.location.pathname,
      device,
    }, {
      onSuccess: (data) => {
        viewIdRef.current = data.viewId;
      },
    });

    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleSlug]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update engagement on unmount or every 30 seconds
  useEffect(() => {
    const updateEngagement = () => {
      if (viewIdRef.current <= 0) return;
      
      const now = Date.now();
      // Debounce: don't update more than once per 10 seconds
      if (now - lastUpdateRef.current < 10000) return;
      lastUpdateRef.current = now;

      const readTimeSeconds = Math.round((now - startTimeRef.current) / 1000);
      
      updateEngagementMutation.mutate({
        viewId: viewIdRef.current,
        readTimeSeconds,
        scrollDepthPercent: maxScrollRef.current,
      });
    };

    // Update every 30 seconds
    const interval = setInterval(updateEngagement, 30000);

    // Update on page visibility change (user switches tab)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateEngagement();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update on unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      updateEngagement();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    visitorId: getVisitorId(),
  };
}
