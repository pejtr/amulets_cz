import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

/**
 * Hook for Widget A/B Testing
 * 
 * Automatically assigns a visitor to a widget variant and provides
 * click tracking. Use this hook in any component that renders a widget
 * whose placement or style you want to A/B test.
 * 
 * Usage:
 * ```tsx
 * const { variant, isLoading, trackClick } = useWidgetABTest("recommendations", "article-slug");
 * 
 * if (variant) {
 *   // Render widget at variant.placement position
 *   // Call trackClick() when user interacts with the widget
 * }
 * ```
 */

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("amulets_visitor_id");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("amulets_visitor_id", id);
  }
  return id;
}

export function useWidgetABTest(widgetName: string, articleSlug?: string) {
  const visitorId = useMemo(() => getVisitorId(), []);

  // Fetch or assign variant for this visitor
  const { data: variant, isLoading } = trpc.articles.getOrAssignWidgetVariant.useQuery(
    {
      widgetName,
      visitorId,
      articleSlug,
    },
    {
      enabled: !!visitorId && !!widgetName,
      staleTime: Infinity, // Assignment is permanent per visitor
      retry: false,
    }
  );

  // Click tracking mutation
  const clickMutation = trpc.articles.trackWidgetClick.useMutation();

  const trackClick = useCallback(() => {
    if (variant?.variantId && visitorId) {
      clickMutation.mutate({
        variantId: variant.variantId,
        visitorId,
      });
    }
  }, [variant?.variantId, visitorId, clickMutation]);

  return {
    /** The assigned variant (null if no active test or loading) */
    variant,
    /** Whether the variant is still being fetched */
    isLoading,
    /** Call this when the user clicks/interacts with the widget */
    trackClick,
    /** The placement string from the variant (e.g., "before-related", "after-comments") */
    placement: variant?.placement || null,
    /** The variant name for conditional rendering */
    variantName: variant?.variantName || null,
    /** Whether there's an active A/B test for this widget */
    hasActiveTest: !!variant,
  };
}

/**
 * Hook for admin to view all widget A/B tests
 * Returns test data with CTR calculations
 */
export function useWidgetABTestAdmin() {
  const { data: tests, isLoading, refetch } = trpc.articles.getAllWidgetTests.useQuery(undefined, {
    staleTime: 30_000,
  });

  const deployMutation = trpc.articles.deployWidgetWinner.useMutation({
    onSuccess: () => refetch(),
  });

  const createMutation = trpc.articles.createWidgetTest.useMutation({
    onSuccess: () => refetch(),
  });

  const getTestResults = (testId: number) => {
    return trpc.articles.getWidgetTestResults.useQuery(
      { testId },
      { enabled: !!testId }
    );
  };

  return {
    tests: tests || [],
    isLoading,
    refetch,
    deployWinner: (testId: number, winnerVariantId: number) =>
      deployMutation.mutateAsync({ testId, winnerVariantId }),
    createTest: (widgetName: string, variants: Array<{ variantName: string; placement: string }>) =>
      createMutation.mutateAsync({ widgetName, variants }),
    isDeploying: deployMutation.isPending,
    isCreating: createMutation.isPending,
    getTestResults,
  };
}
