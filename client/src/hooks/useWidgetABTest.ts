import { useState, useEffect, useCallback, useRef } from 'react';
import { trpc } from '@/lib/trpc';

export interface WidgetVariantConfig {
  // Základní konfigurace
  text?: string;
  buttonText?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  
  // Styling
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  borderColor?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  
  // Layout
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  alignment?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
  
  // Behavior
  showDelay?: number; // ms
  autoHide?: boolean;
  autoHideDelay?: number; // ms
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  
  // Content
  imageUrl?: string;
  iconName?: string;
  ctaUrl?: string;
  
  // Custom fields
  [key: string]: any;
}

export interface WidgetVariant {
  id: number;
  widgetKey: string;
  variantKey: string;
  name: string;
  description?: string;
  config: WidgetVariantConfig;
  isActive: boolean;
  weight: number;
  isControl: boolean;
}

export interface UseWidgetABTestOptions {
  widgetKey: string;
  defaultConfig?: WidgetVariantConfig;
  enabled?: boolean;
  autoTrackImpressions?: boolean;
  autoTrackInteractions?: boolean;
}

export interface UseWidgetABTestReturn {
  variant: WidgetVariant | null;
  config: WidgetVariantConfig;
  isLoading: boolean;
  error: Error | null;
  
  // Tracking methods
  trackImpression: () => void;
  trackInteraction: (interactionType: string, interactionTarget?: string, interactionValue?: string) => void;
  trackConversion: (conversionType: string, conversionValue?: number, metadata?: Record<string, any>) => void;
  
  // Variant info
  isControl: boolean;
  variantKey: string;
  variantName: string;
}

/**
 * React hook pro A/B testování UI widgetů
 * 
 * @example
 * ```tsx
 * const { config, trackInteraction, trackConversion } = useWidgetABTest({
 *   widgetKey: 'hero_cta',
 *   defaultConfig: {
 *     buttonText: 'Objevte amulety',
 *     buttonColor: '#8B5CF6',
 *   },
 * });
 * 
 * return (
 *   <button 
 *     style={{ backgroundColor: config.buttonColor }}
 *     onClick={() => {
 *       trackInteraction('click', 'cta_button');
 *       // ... navigate to product page
 *     }}
 *   >
 *     {config.buttonText}
 *   </button>
 * );
 * ```
 */
export function useWidgetABTest(options: UseWidgetABTestOptions): UseWidgetABTestReturn {
  const {
    widgetKey,
    defaultConfig = {},
    enabled = true,
    autoTrackImpressions = true,
    autoTrackInteractions = false,
  } = options;

  const [variant, setVariant] = useState<WidgetVariant | null>(null);
  const [impressionId, setImpressionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const impressionTracked = useRef(false);
  const visitorId = useRef<string>('');
  const sessionId = useRef<string>('');

  // Get or create visitor ID
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get or create visitor ID
    let vid = localStorage.getItem('visitor_id');
    if (!vid) {
      vid = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', vid);
    }
    visitorId.current = vid;
    
    // Get or create session ID
    let sid = sessionStorage.getItem('session_id');
    if (!sid) {
      sid = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sid);
    }
    sessionId.current = sid;
  }, []);

  // Fetch variant
  const { data: variantData, isLoading: isLoadingVariant, error: variantError } = trpc.widgetABTest.getVariant.useQuery(
    { widgetKey },
    { enabled: enabled && !!widgetKey }
  );

  useEffect(() => {
    if (variantData) {
      setVariant(variantData);
      setIsLoading(false);
    }
    if (variantError) {
      setError(variantError as Error);
      setIsLoading(false);
    }
  }, [variantData, variantError]);

  // Track impression mutation
  const trackImpressionMutation = trpc.widgetABTest.trackImpression.useMutation();
  
  // Track interaction mutation
  const trackInteractionMutation = trpc.widgetABTest.trackInteraction.useMutation();
  
  // Track conversion mutation
  const trackConversionMutation = trpc.widgetABTest.trackConversion.useMutation();

  // Auto-track impression
  useEffect(() => {
    if (!autoTrackImpressions || !variant || impressionTracked.current || !enabled) return;
    
    trackImpression();
    impressionTracked.current = true;
  }, [variant, autoTrackImpressions, enabled]);

  // Track impression
  const trackImpression = useCallback(() => {
    if (!variant || !enabled) return;
    
    trackImpressionMutation.mutate({
      variantId: variant.id,
      widgetKey: variant.widgetKey,
      variantKey: variant.variantKey,
      visitorId: visitorId.current,
      sessionId: sessionId.current,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof window !== 'undefined' ? document.referrer : '',
      device: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'unknown',
      browser: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
      language: typeof window !== 'undefined' ? navigator.language : 'unknown',
    }, {
      onSuccess: (data) => {
        setImpressionId(data.impressionId);
      },
    });
  }, [variant, enabled, trackImpressionMutation]);

  // Track interaction
  const trackInteraction = useCallback((
    interactionType: string,
    interactionTarget?: string,
    interactionValue?: string
  ) => {
    if (!variant || !enabled) return;
    
    trackInteractionMutation.mutate({
      impressionId: impressionId || undefined,
      variantId: variant.id,
      widgetKey: variant.widgetKey,
      variantKey: variant.variantKey,
      visitorId: visitorId.current,
      sessionId: sessionId.current,
      interactionType,
      interactionTarget,
      interactionValue,
    });
  }, [variant, impressionId, enabled, trackInteractionMutation]);

  // Track conversion
  const trackConversion = useCallback((
    conversionType: string,
    conversionValue?: number,
    metadata?: Record<string, any>
  ) => {
    if (!variant || !enabled) return;
    
    trackConversionMutation.mutate({
      impressionId: impressionId || undefined,
      variantId: variant.id,
      widgetKey: variant.widgetKey,
      variantKey: variant.variantKey,
      visitorId: visitorId.current,
      sessionId: sessionId.current,
      conversionType,
      conversionValue,
      metadata,
    });
  }, [variant, impressionId, enabled, trackConversionMutation]);

  // Merge default config with variant config
  const config: WidgetVariantConfig = {
    ...defaultConfig,
    ...(variant?.config || {}),
  };

  return {
    variant,
    config,
    isLoading,
    error,
    trackImpression,
    trackInteraction,
    trackConversion,
    isControl: variant?.isControl || false,
    variantKey: variant?.variantKey || '',
    variantName: variant?.name || '',
  };
}

/**
 * Helper hook pro jednoduché CTA tlačítko A/B testování
 */
export function useCTAButtonABTest(widgetKey: string) {
  const { config, trackInteraction, trackConversion, ...rest } = useWidgetABTest({
    widgetKey,
    defaultConfig: {
      buttonText: 'Zjistit více',
      buttonColor: '#8B5CF6',
      buttonTextColor: '#FFFFFF',
      buttonSize: 'medium',
    },
  });

  const handleClick = useCallback((onClick?: () => void) => {
    trackInteraction('click', 'cta_button');
    onClick?.();
  }, [trackInteraction]);

  return {
    buttonText: config.buttonText || 'Zjistit více',
    buttonColor: config.buttonColor || '#8B5CF6',
    buttonTextColor: config.buttonTextColor || '#FFFFFF',
    buttonSize: config.buttonSize || 'medium',
    handleClick,
    trackConversion,
    ...rest,
  };
}

/**
 * Helper hook pro doporučovací widget A/B testování
 */
export function useRecommendationWidgetABTest(widgetKey: string) {
  const { config, trackInteraction, trackConversion, ...rest } = useWidgetABTest({
    widgetKey,
    defaultConfig: {
      title: 'Doporučujeme pro vás',
      layout: 'grid',
      itemsCount: 4,
      showPrices: true,
      showRatings: true,
    },
  });

  const handleProductClick = useCallback((productId: string, productName: string) => {
    trackInteraction('product_click', productId, productName);
  }, [trackInteraction]);

  const handleAddToCart = useCallback((productId: string, price: number) => {
    trackConversion('add_to_cart', price, { productId });
  }, [trackConversion]);

  return {
    title: config.title || 'Doporučujeme pro vás',
    layout: config.layout || 'grid',
    itemsCount: config.itemsCount || 4,
    showPrices: config.showPrices !== false,
    showRatings: config.showRatings !== false,
    handleProductClick,
    handleAddToCart,
    trackConversion,
    ...rest,
  };
}
