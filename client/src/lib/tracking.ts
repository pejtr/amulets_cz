// Tracking utility pro Facebook Pixel a Google Analytics 4

// Facebook Pixel types
declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, any>
    ) => void;
    _fbq?: any;
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

// Initialize Facebook Pixel
export function initFacebookPixel(pixelId: string) {
  if (typeof window === "undefined" || !pixelId) return;

  // Check if already initialized
  if (window.fbq) return;

  // Facebook Pixel Code
  const fbq: any = function (...args: any[]) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      fbq.queue.push(args);
    }
  };

  if (!window.fbq) {
    window.fbq = fbq as any;
  }

  (window.fbq as any).push = fbq;
  (window.fbq as any).loaded = true;
  (window.fbq as any).version = "2.0";
  (window.fbq as any).queue = [];

  // Load Facebook Pixel script
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  // Initialize pixel
  window.fbq?.("init", pixelId);
  window.fbq?.("track", "PageView");
}

// Initialize Google Analytics 4
export function initGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined" || !measurementId) return;

  // Check if already initialized
  if (window.gtag) return;

  // Load gtag.js script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.gtag = function () {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(arguments);
  };

  window.gtag("js", new Date() as any);
  window.gtag("config", measurementId);
}

// Facebook Pixel Events
export const trackFacebookEvent = {
  // Quiz started
  quizStarted: () => {
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: "Quiz Started",
        content_category: "Quiz",
        content_type: "quiz_start",
      });
    }
  },

  // Quiz progress
  quizProgress: (questionNumber: number, totalQuestions: number) => {
    if (window.fbq) {
      window.fbq("trackCustom", "QuizProgress", {
        question_number: questionNumber,
        total_questions: totalQuestions,
        progress_percentage: Math.round((questionNumber / totalQuestions) * 100),
      });
    }
  },

  // Quiz completed
  quizCompleted: (resultSymbol: string, symbolName: string) => {
    if (window.fbq) {
      window.fbq("track", "CompleteRegistration", {
        content_name: "Quiz Completed",
        content_category: "Quiz",
        status: "completed",
        result_symbol: resultSymbol,
        result_name: symbolName,
      });
    }
  },

  // Result viewed
  resultViewed: (resultSymbol: string, symbolName: string) => {
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: `Result: ${symbolName}`,
        content_category: "Quiz Result",
        content_type: "quiz_result",
        result_symbol: resultSymbol,
      });
    }
  },

  // Result shared
  resultShared: (resultSymbol: string, symbolName: string, platform: string) => {
    if (window.fbq) {
      window.fbq("trackCustom", "Share", {
        content_name: `Result: ${symbolName}`,
        content_category: "Quiz Result",
        result_symbol: resultSymbol,
        platform: platform,
      });
    }
  },

  // Symbol detail viewed (from quiz result)
  symbolDetailViewed: (symbolSlug: string, symbolName: string, source: string) => {
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: symbolName,
        content_category: "Symbol Detail",
        content_type: "symbol",
        symbol_slug: symbolSlug,
        source: source, // "quiz_result" or "guide"
      });
    }
  },
};

// Google Analytics 4 Events
export const trackGoogleEvent = {
  // Quiz started
  quizStarted: () => {
    if (window.gtag) {
      window.gtag("event", "quiz_start", {
        event_category: "Quiz",
        event_label: "Quiz Started",
      });
    }
  },

  // Quiz progress
  quizProgress: (questionNumber: number, totalQuestions: number) => {
    if (window.gtag) {
      window.gtag("event", "quiz_progress", {
        event_category: "Quiz",
        event_label: `Question ${questionNumber} of ${totalQuestions}`,
        question_number: questionNumber,
        total_questions: totalQuestions,
        progress_percentage: Math.round((questionNumber / totalQuestions) * 100),
      });
    }
  },

  // Quiz completed
  quizCompleted: (resultSymbol: string, symbolName: string) => {
    if (window.gtag) {
      window.gtag("event", "quiz_complete", {
        event_category: "Quiz",
        event_label: `Result: ${symbolName}`,
        result_symbol: resultSymbol,
        result_name: symbolName,
      });
    }
  },

  // Result viewed
  resultViewed: (resultSymbol: string, symbolName: string) => {
    if (window.gtag) {
      window.gtag("event", "view_item", {
        event_category: "Quiz Result",
        event_label: symbolName,
        result_symbol: resultSymbol,
        result_name: symbolName,
      });
    }
  },

  // Result shared
  resultShared: (resultSymbol: string, symbolName: string, platform: string) => {
    if (window.gtag) {
      window.gtag("event", "share", {
        event_category: "Quiz Result",
        event_label: symbolName,
        method: platform,
        content_type: "quiz_result",
        item_id: resultSymbol,
      });
    }
  },

  // Symbol detail viewed (from quiz result)
  symbolDetailViewed: (symbolSlug: string, symbolName: string, source: string) => {
    if (window.gtag) {
      window.gtag("event", "view_item", {
        event_category: "Symbol Detail",
        event_label: symbolName,
        symbol_slug: symbolSlug,
        source: source,
      });
    }
  },
};

// Combined tracking function (tracks both FB and GA)
export const track = {
  quizStarted: () => {
    trackFacebookEvent.quizStarted();
    trackGoogleEvent.quizStarted();
  },

  quizProgress: (questionNumber: number, totalQuestions: number) => {
    trackFacebookEvent.quizProgress(questionNumber, totalQuestions);
    trackGoogleEvent.quizProgress(questionNumber, totalQuestions);
  },

  quizCompleted: (resultSymbol: string, symbolName: string) => {
    trackFacebookEvent.quizCompleted(resultSymbol, symbolName);
    trackGoogleEvent.quizCompleted(resultSymbol, symbolName);
  },

  resultViewed: (resultSymbol: string, symbolName: string) => {
    trackFacebookEvent.resultViewed(resultSymbol, symbolName);
    trackGoogleEvent.resultViewed(resultSymbol, symbolName);
  },

  resultShared: (resultSymbol: string, symbolName: string, platform: string) => {
    trackFacebookEvent.resultShared(resultSymbol, symbolName, platform);
    trackGoogleEvent.resultShared(resultSymbol, symbolName, platform);
  },

  symbolDetailViewed: (symbolSlug: string, symbolName: string, source: string = "guide") => {
    trackFacebookEvent.symbolDetailViewed(symbolSlug, symbolName, source);
    trackGoogleEvent.symbolDetailViewed(symbolSlug, symbolName, source);
  },

  // Product viewed
  productViewed: (productName: string, productPrice: number, productCategory: string) => {
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: productName,
        content_category: productCategory,
        content_type: "product",
        value: productPrice,
        currency: "CZK",
      });
    }
    if (window.gtag) {
      window.gtag("event", "view_item", {
        event_category: "Product",
        event_label: productName,
        value: productPrice,
        currency: "CZK",
        items: [{
          item_name: productName,
          item_category: productCategory,
          price: productPrice,
        }],
      });
    }
  },

  // Guide viewed (symbol/stone/purpose pages)
  guideViewed: (guideName: string, guideType: 'symbol' | 'stone' | 'purpose') => {
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: guideName,
        content_category: `Guide - ${guideType}`,
        content_type: "article",
      });
      window.fbq("trackCustom", "GuideViewed", {
        guide_name: guideName,
        guide_type: guideType,
      });
    }
    if (window.gtag) {
      window.gtag("event", "view_item", {
        event_category: "Guide",
        event_label: `${guideType}: ${guideName}`,
        guide_type: guideType,
      });
    }
  },

  // CTA button clicked
  ctaClicked: (ctaName: string, ctaLocation: string, destinationUrl?: string) => {
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        content_name: ctaName,
        content_category: "CTA Click",
      });
      window.fbq("trackCustom", "CTAClicked", {
        cta_name: ctaName,
        cta_location: ctaLocation,
        destination_url: destinationUrl || "",
      });
    }
    if (window.gtag) {
      window.gtag("event", "click", {
        event_category: "CTA",
        event_label: `${ctaName} - ${ctaLocation}`,
        destination_url: destinationUrl || "",
      });
    }
  },

  // Buy button clicked on product
  buyButtonClicked: (productName: string, productPrice: number, productUrl: string) => {
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        content_name: productName,
        content_category: "Product",
        content_type: "product",
        value: productPrice,
        currency: "CZK",
      });
      window.fbq("trackCustom", "BuyButtonClicked", {
        product_name: productName,
        product_price: productPrice,
        product_url: productUrl,
      });
    }
    if (window.gtag) {
      window.gtag("event", "begin_checkout", {
        event_category: "Product",
        event_label: productName,
        value: productPrice,
        currency: "CZK",
        items: [{
          item_name: productName,
          price: productPrice,
        }],
      });
    }
  },

  // "Go to Ohorai" button clicked
  ohoraiButtonClicked: (location: string) => {
    if (window.fbq) {
      window.fbq("trackCustom", "OhoraiButtonClicked", {
        button_location: location,
        destination: "https://www.ohorai.cz",
      });
    }
    if (window.gtag) {
      window.gtag("event", "click", {
        event_category: "External Link",
        event_label: `Ohorai Button - ${location}`,
        destination: "https://www.ohorai.cz",
      });
    }
  },
};
