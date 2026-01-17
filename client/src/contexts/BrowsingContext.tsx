import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BrowsingData {
  visitedPages: string[];
  viewedProducts: string[];
  timeOnSite: number;
  lastActivity: Date;
  interests: string[];
}

interface BrowsingContextType {
  browsingData: BrowsingData;
  trackPageView: (page: string) => void;
  trackProductView: (productId: string, category?: string) => void;
  trackInterest: (interest: string) => void;
  getBrowsingContext: () => string;
}

const BrowsingContext = createContext<BrowsingContextType | undefined>(undefined);

export function BrowsingProvider({ children }: { children: ReactNode }) {
  const [browsingData, setBrowsingData] = useState<BrowsingData>(() => {
    // Load from localStorage
    const saved = localStorage.getItem("amulets_browsing");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastActivity: new Date(parsed.lastActivity),
        };
      } catch {
        return {
          visitedPages: [],
          viewedProducts: [],
          timeOnSite: 0,
          lastActivity: new Date(),
          interests: [],
        };
      }
    }
    return {
      visitedPages: [],
      viewedProducts: [],
      timeOnSite: 0,
      lastActivity: new Date(),
      interests: [],
    };
  });

  // Track time on site
  useEffect(() => {
    const interval = setInterval(() => {
      setBrowsingData((prev) => ({
        ...prev,
        timeOnSite: prev.timeOnSite + 1,
        lastActivity: new Date(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("amulets_browsing", JSON.stringify(browsingData));
  }, [browsingData]);

  const trackPageView = (page: string) => {
    setBrowsingData((prev) => ({
      ...prev,
      visitedPages: Array.from(new Set([...prev.visitedPages, page])).slice(-20), // Keep last 20
      lastActivity: new Date(),
    }));
  };

  const trackProductView = (productId: string, category?: string) => {
    setBrowsingData((prev) => ({
      ...prev,
      viewedProducts: Array.from(new Set([...prev.viewedProducts, productId])).slice(-10), // Keep last 10
      interests: category
        ? Array.from(new Set([...prev.interests, category])).slice(-5)
        : prev.interests,
      lastActivity: new Date(),
    }));
  };

  const trackInterest = (interest: string) => {
    setBrowsingData((prev) => ({
      ...prev,
      interests: Array.from(new Set([...prev.interests, interest])).slice(-5),
      lastActivity: new Date(),
    }));
  };

  const getBrowsingContext = (): string => {
    const { visitedPages, viewedProducts, timeOnSite, interests } = browsingData;

    let context = "";

    if (timeOnSite > 0) {
      const minutes = Math.floor(timeOnSite / 60);
      context += `Zákazník je na webu ${minutes > 0 ? `${minutes} minut` : `${timeOnSite} sekund`}. `;
    }

    if (visitedPages.length > 0) {
      context += `Navštívil stránky: ${visitedPages.slice(-5).join(", ")}. `;
    }

    if (viewedProducts.length > 0) {
      context += `Prohlížel si produkty: ${viewedProducts.slice(-3).join(", ")}. `;
    }

    if (interests.length > 0) {
      context += `Zajímá se o: ${interests.join(", ")}. `;
    }

    return context || "Nový návštěvník.";
  };

  return (
    <BrowsingContext.Provider
      value={{
        browsingData,
        trackPageView,
        trackProductView,
        trackInterest,
        getBrowsingContext,
      }}
    >
      {children}
    </BrowsingContext.Provider>
  );
}

export function useBrowsing() {
  const context = useContext(BrowsingContext);
  if (!context) {
    throw new Error("useBrowsing must be used within BrowsingProvider");
  }
  return context;
}
