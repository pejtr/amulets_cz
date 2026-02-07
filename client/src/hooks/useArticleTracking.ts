import { useEffect, useRef, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * Detailní detekce zařízení a kontextu pro přesnější mobilní analytiku.
 */
function getDeviceInfo() {
  const ua = navigator.userAgent;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const orientation = width > height ? 'landscape' : 'portrait';
  
  // Detailnější kategorizace zařízení
  let deviceType: string;
  if (width < 480) {
    deviceType = 'mobile-small'; // malé telefony
  } else if (width < 768) {
    deviceType = 'mobile'; // běžné telefony
  } else if (width < 1024) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }

  // Detekce OS
  let os = 'unknown';
  if (/iPhone|iPad|iPod/.test(ua)) os = 'ios';
  else if (/Android/.test(ua)) os = 'android';
  else if (/Windows/.test(ua)) os = 'windows';
  else if (/Mac/.test(ua)) os = 'macos';
  else if (/Linux/.test(ua)) os = 'linux';

  // Detekce prohlížeče
  let browser = 'other';
  if (/CriOS|Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'chrome';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'safari';
  else if (/Firefox|FxiOS/.test(ua)) browser = 'firefox';
  else if (/Edg/.test(ua)) browser = 'edge';

  // Detekce connection type (pokud dostupné)
  let connectionType = 'unknown';
  const nav = navigator as any;
  if (nav.connection) {
    connectionType = nav.connection.effectiveType || nav.connection.type || 'unknown';
  }

  return {
    deviceType,
    os,
    browser,
    screenWidth: width,
    screenHeight: height,
    dpr: Math.round(dpr * 10) / 10,
    isTouchDevice,
    orientation,
    connectionType,
  };
}

/**
 * Hook pro automatické trackování zobrazení článku a engagement metrik.
 * Vylepšená verze s detailním mobilním trackováním:
 * - Touch/scroll behavior na mobilech
 * - Orientace a viewport změny
 * - Detekce zařízení, OS, prohlížeče
 * - Aktivní vs pasivní čas čtení
 * - Interakce (kliknutí, tapy, swipe)
 */
export function useArticleTracking(articleSlug: string, articleType: 'magazine' | 'guide' | 'tantra' = 'magazine') {
  const viewIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const activeTimeRef = useRef<number>(0);
  const lastActiveRef = useRef<number>(Date.now());
  const isActiveRef = useRef<boolean>(true);
  const maxScrollRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const interactionCountRef = useRef<number>(0);
  const orientationChangesRef = useRef<number>(0);
  const scrollEventsRef = useRef<number>(0);

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

  // Track page view on mount with enhanced device info
  useEffect(() => {
    if (!articleSlug) return;

    const visitorId = getVisitorId();
    const deviceInfo = getDeviceInfo();

    // Compose device string with detailed info for DB
    const deviceString = `${deviceInfo.deviceType}|${deviceInfo.os}|${deviceInfo.browser}|${deviceInfo.screenWidth}x${deviceInfo.screenHeight}|dpr${deviceInfo.dpr}|${deviceInfo.orientation}|${deviceInfo.connectionType}|${deviceInfo.isTouchDevice ? 'touch' : 'mouse'}`;

    trackViewMutation.mutate({
      articleSlug,
      articleType,
      visitorId,
      referrer: document.referrer || undefined,
      sourcePage: window.location.pathname,
      device: deviceString,
    }, {
      onSuccess: (data) => {
        viewIdRef.current = data.viewId;
      },
    });

    startTimeRef.current = Date.now();
    lastActiveRef.current = Date.now();
    activeTimeRef.current = 0;
    maxScrollRef.current = 0;
    interactionCountRef.current = 0;
    orientationChangesRef.current = 0;
    scrollEventsRef.current = 0;
    isActiveRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleSlug]);

  // Track scroll depth - optimalizováno pro mobil (passive, throttled)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
          maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercent);
        }
        scrollEventsRef.current++;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active reading time (pause when tab hidden or user idle)
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const markActive = () => {
      if (!isActiveRef.current) {
        // Resuming from idle
        isActiveRef.current = true;
        lastActiveRef.current = Date.now();
      }
      // Reset idle timer
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (isActiveRef.current) {
          // Going idle
          activeTimeRef.current += Date.now() - lastActiveRef.current;
          isActiveRef.current = false;
        }
      }, 15000); // 15s idle threshold
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isActiveRef.current) {
          activeTimeRef.current += Date.now() - lastActiveRef.current;
          isActiveRef.current = false;
        }
      } else {
        isActiveRef.current = true;
        lastActiveRef.current = Date.now();
      }
    };

    // Listen for user activity signals
    const events = ['scroll', 'touchstart', 'touchmove', 'click', 'mousemove', 'keydown'];
    events.forEach(event => {
      window.addEventListener(event, markActive, { passive: true });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start idle timer
    markActive();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        window.removeEventListener(event, markActive);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Track touch interactions (mobile-specific)
  useEffect(() => {
    const handleInteraction = () => {
      interactionCountRef.current++;
    };

    // Touch events for mobile
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction, { passive: true });

    // Orientation changes
    const handleOrientationChange = () => {
      orientationChangesRef.current++;
    };

    // Use screen.orientation API if available, fallback to resize
    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    } else {
      window.addEventListener('orientationchange', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange);
      } else {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, []);

  // Update engagement periodically and on unmount
  useEffect(() => {
    const updateEngagement = () => {
      if (viewIdRef.current <= 0) return;

      const now = Date.now();
      // Debounce: don't update more than once per 10 seconds
      if (now - lastUpdateRef.current < 10000) return;
      lastUpdateRef.current = now;

      // Calculate active reading time
      let currentActiveTime = activeTimeRef.current;
      if (isActiveRef.current) {
        currentActiveTime += now - lastActiveRef.current;
      }
      const activeReadTimeSeconds = Math.round(currentActiveTime / 1000);
      const totalReadTimeSeconds = Math.round((now - startTimeRef.current) / 1000);

      updateEngagementMutation.mutate({
        viewId: viewIdRef.current,
        readTimeSeconds: totalReadTimeSeconds,
        scrollDepthPercent: maxScrollRef.current,
        activeReadTimeSeconds,
        interactionCount: interactionCountRef.current,
        orientationChanges: orientationChangesRef.current,
      });
    };

    // Update every 30 seconds
    const interval = setInterval(updateEngagement, 30000);

    // Update on page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateEngagement();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mobile: update on pagehide (more reliable than unload on mobile)
    const handlePageHide = () => {
      updateEngagement();
    };
    window.addEventListener('pagehide', handlePageHide);

    // Update on unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      updateEngagement();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    visitorId: getVisitorId(),
  };
}
