import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// A/B Test variant types
export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // Probability weight (0-1)
  props: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  winner?: string; // Winner variant ID if test concluded
  startDate: string;
  endDate?: string;
}

export interface ABTestConversion {
  testId: string;
  variantId: string;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, any>;
}

interface ABTestContextType {
  // Get assigned variant for a test
  getVariant: (testId: string) => ABTestVariant | null;
  // Track conversion for a test
  trackConversion: (testId: string, metadata?: Record<string, any>) => void;
  // Get all tests
  tests: ABTest[];
  // Get conversions for a test
  getConversions: (testId: string) => ABTestConversion[];
  // Get conversion rate for a variant
  getConversionRate: (testId: string, variantId: string) => number;
  // Get total impressions for a variant
  getImpressions: (testId: string, variantId: string) => number;
  // Reset user's variant assignment
  resetVariant: (testId: string) => void;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

// Storage keys
const STORAGE_KEY_ASSIGNMENTS = 'ab-test-assignments';
const STORAGE_KEY_CONVERSIONS = 'ab-test-conversions';
const STORAGE_KEY_IMPRESSIONS = 'ab-test-impressions';

// Premium button A/B test variants
export const PREMIUM_BUTTON_TEST: ABTest = {
  id: 'premium-button-v1',
  name: 'Premium tlačítko - barvy a texty',
  startDate: '2026-01-22',
  variants: [
    {
      id: 'control',
      name: 'Kontrolní (zlatá)',
      weight: 0.25,
      props: {
        text: 'Získat PREMIUM',
        bgColor: 'from-[#D4AF37] to-[#B8860B]',
        textColor: 'text-white',
        icon: '👑',
        subtext: '88 Kč/měsíc',
      },
    },
    {
      id: 'pink-gradient',
      name: 'Růžový gradient',
      weight: 0.25,
      props: {
        text: 'Aktivovat PREMIUM',
        bgColor: 'from-pink-500 to-pink-600',
        textColor: 'text-white',
        icon: '✨',
        subtext: 'Pouze 88 Kč/měsíc',
      },
    },
    {
      id: 'purple-urgency',
      name: 'Fialová s urgencí',
      weight: 0.25,
      props: {
        text: 'Odemknout VŠE',
        bgColor: 'from-purple-600 to-purple-700',
        textColor: 'text-white',
        icon: '🔓',
        subtext: 'Limitovaná nabídka!',
      },
    },
    {
      id: 'green-value',
      name: 'Zelená s hodnotou',
      weight: 0.25,
      props: {
        text: 'Získat přístup',
        bgColor: 'from-emerald-500 to-emerald-600',
        textColor: 'text-white',
        icon: '💎',
        subtext: 'Hodnota 888 Kč za 88 Kč',
      },
    },
  ],
};

// All active tests
const ACTIVE_TESTS: ABTest[] = [PREMIUM_BUTTON_TEST];

interface ABTestProviderProps {
  children: ReactNode;
}

export function ABTestProvider({ children }: ABTestProviderProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [conversions, setConversions] = useState<ABTestConversion[]>([]);
  const [impressions, setImpressions] = useState<Record<string, Record<string, number>>>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedAssignments = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
      const storedConversions = localStorage.getItem(STORAGE_KEY_CONVERSIONS);
      const storedImpressions = localStorage.getItem(STORAGE_KEY_IMPRESSIONS);

      if (storedAssignments) {
        setAssignments(JSON.parse(storedAssignments));
      }
      if (storedConversions) {
        setConversions(JSON.parse(storedConversions));
      }
      if (storedImpressions) {
        setImpressions(JSON.parse(storedImpressions));
      }
    } catch (e) {
      console.error('Error loading A/B test data:', e);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(assignments));
    } catch (e) {
      console.error('Error saving assignments:', e);
    }
  }, [assignments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONVERSIONS, JSON.stringify(conversions));
    } catch (e) {
      console.error('Error saving conversions:', e);
    }
  }, [conversions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IMPRESSIONS, JSON.stringify(impressions));
    } catch (e) {
      console.error('Error saving impressions:', e);
    }
  }, [impressions]);

  // Assign variant based on weights
  const assignVariant = useCallback((test: ABTest): ABTestVariant => {
    // If test has a winner, always return that
    if (test.winner) {
      const winner = test.variants.find(v => v.id === test.winner);
      if (winner) return winner;
    }

    // Random assignment based on weights
    const random = Math.random();
    let cumulative = 0;

    for (const variant of test.variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return variant;
      }
    }

    // Fallback to first variant
    return test.variants[0];
  }, []);

  // Get variant for a test
  const getVariant = useCallback((testId: string): ABTestVariant | null => {
    const test = ACTIVE_TESTS.find(t => t.id === testId);
    if (!test) return null;

    // Check if already assigned
    let variantId = assignments[testId];
    
    if (!variantId) {
      // Assign new variant
      const variant = assignVariant(test);
      variantId = variant.id;
      
      setAssignments(prev => ({
        ...prev,
        [testId]: variantId,
      }));
    }

    // Track impression
    setImpressions(prev => ({
      ...prev,
      [testId]: {
        ...(prev[testId] || {}),
        [variantId]: ((prev[testId] || {})[variantId] || 0) + 1,
      },
    }));

    return test.variants.find(v => v.id === variantId) || null;
  }, [assignments, assignVariant]);

  // Track conversion
  const trackConversion = useCallback((testId: string, metadata?: Record<string, any>) => {
    const variantId = assignments[testId];
    if (!variantId) return;

    const conversion: ABTestConversion = {
      testId,
      variantId,
      timestamp: Date.now(),
      metadata,
    };

    setConversions(prev => [...prev, conversion]);

    // Also send to server for persistent tracking
    try {
      fetch('/api/trpc/abtest.trackConversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversion),
      }).catch(() => {
        // Silently fail - localStorage is backup
      });
    } catch (e) {
      // Ignore network errors
    }
  }, [assignments]);

  // Get conversions for a test
  const getConversions = useCallback((testId: string): ABTestConversion[] => {
    return conversions.filter(c => c.testId === testId);
  }, [conversions]);

  // Get conversion rate for a variant
  const getConversionRate = useCallback((testId: string, variantId: string): number => {
    const variantConversions = conversions.filter(
      c => c.testId === testId && c.variantId === variantId
    ).length;
    const variantImpressions = (impressions[testId] || {})[variantId] || 0;

    if (variantImpressions === 0) return 0;
    return (variantConversions / variantImpressions) * 100;
  }, [conversions, impressions]);

  // Get impressions for a variant
  const getImpressions = useCallback((testId: string, variantId: string): number => {
    return (impressions[testId] || {})[variantId] || 0;
  }, [impressions]);

  // Reset variant assignment
  const resetVariant = useCallback((testId: string) => {
    setAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[testId];
      return newAssignments;
    });
  }, []);

  const value: ABTestContextType = {
    getVariant,
    trackConversion,
    tests: ACTIVE_TESTS,
    getConversions,
    getConversionRate,
    getImpressions,
    resetVariant,
  };

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
}

// Hook for Premium button specifically
export function usePremiumButtonVariant() {
  const { getVariant, trackConversion } = useABTest();
  const variant = getVariant(PREMIUM_BUTTON_TEST.id);

  const trackPremiumClick = useCallback(() => {
    trackConversion(PREMIUM_BUTTON_TEST.id, { action: 'click' });
  }, [trackConversion]);

  const trackPremiumPurchase = useCallback((amount: number) => {
    trackConversion(PREMIUM_BUTTON_TEST.id, { action: 'purchase', amount });
  }, [trackConversion]);

  return {
    variant,
    trackPremiumClick,
    trackPremiumPurchase,
    props: variant?.props || PREMIUM_BUTTON_TEST.variants[0].props,
  };
}
