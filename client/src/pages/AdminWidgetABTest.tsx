import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BarChart3,
  MousePointerClick,
  CheckCircle2,
  FlaskConical,
  Crown,
  Loader2,
  LayoutGrid,
  Eye,
  TrendingUp,
  Trophy,
  AlertTriangle,
  Rocket,
} from "lucide-react";

export default function AdminWidgetABTest() {
  const { user, loading: authLoading } = useAuth();
  const [newWidgetName, setNewWidgetName] = useState("");
  const [newVariants, setNewVariants] = useState<Array<{ variantName: string; placement: string }>>([
    { variantName: "Varianta A", placement: "before-related" },
    { variantName: "Varianta B", placement: "after-comments" },
  ]);

  const { data: tests, isLoading, refetch } = trpc.articles.getAllWidgetTests.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    staleTime: 15_000,
  });

  const createMutation = trpc.articles.createWidgetTest.useMutation({
    onSuccess: () => {
      toast.success("Widget A/B test vytvořen!");
      refetch();
      setNewWidgetName("");
      setNewVariants([
        { variantName: "Varianta A", placement: "before-related" },
        { variantName: "Varianta B", placement: "after-comments" },
      ]);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deployMutation = trpc.articles.deployWidgetWinner.useMutation({
    onSuccess: () => {
      toast.success("Vítěz nasazen! Test ukončen.");
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!newWidgetName.trim()) {
      toast.error("Zadejte název widgetu");
      return;
    }
    if (newVariants.some((v) => !v.variantName.trim() || !v.placement.trim())) {
      toast.error("Vyplňte všechny varianty");
      return;
    }
    createMutation.mutate({
      widgetName: newWidgetName,
      variants: newVariants,
    });
  };

  const addVariant = () => {
    setNewVariants([
      ...newVariants,
      { variantName: `Varianta ${String.fromCharCode(65 + newVariants.length)}`, placement: "" },
    ]);
  };

  const removeVariant = (index: number) => {
    if (newVariants.length <= 2) return;
    setNewVariants(newVariants.filter((_, i) => i !== index));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Přístup odepřen
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
              <LayoutGrid className="w-6 h-6" />
              Widget A/B Testování
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Testujte umístění widgetů pro maximální CTR a konverze
            </p>
          </div>
        </div>

        {/* Create New Test */}
        <Card className="mb-8 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Vytvořit nový Widget A/B test
            </CardTitle>
            <CardDescription>
              Definujte widget a jeho varianty umístění. Systém automaticky přiřadí návštěvníky a měří CTR.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Název widgetu</Label>
              <Input
                value={newWidgetName}
                onChange={(e) => setNewWidgetName(e.target.value)}
                placeholder="např. recommendations, newsletter-cta, product-upsell"
              />
            </div>

            <div className="space-y-3">
              <Label>Varianty umístění</Label>
              {newVariants.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={v.variantName}
                    onChange={(e) => {
                      const updated = [...newVariants];
                      updated[i].variantName = e.target.value;
                      setNewVariants(updated);
                    }}
                    placeholder="Název varianty"
                    className="flex-1"
                  />
                  <Input
                    value={v.placement}
                    onChange={(e) => {
                      const updated = [...newVariants];
                      updated[i].placement = e.target.value;
                      setNewVariants(updated);
                    }}
                    placeholder="Placement (before-related, after-comments...)"
                    className="flex-1"
                  />
                  {newVariants.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addVariant}>
                <Plus className="w-4 h-4 mr-1" /> Přidat variantu
              </Button>
            </div>

            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <FlaskConical className="w-4 h-4 mr-2" />
              )}
              Vytvořit test
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Výsledky testů ({tests?.length || 0})
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : !tests || tests.length === 0 ? (
          <Card className="text-center py-12 text-gray-500">
            <CardContent>
              <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Zatím žádné widget A/B testy</p>
              <p className="text-sm mt-1">Vytvořte první test výše</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {tests.map((test: any) => (
              <WidgetTestCard
                key={test.id}
                test={test}
                onDeploy={(variantId) =>
                  deployMutation.mutate({ testId: test.id, winnerVariantId: variantId })
                }
                isDeploying={deployMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WidgetTestCard({
  test,
  onDeploy,
  isDeploying,
}: {
  test: any;
  onDeploy: (variantId: number) => void;
  isDeploying: boolean;
}) {
  const totalImpressions = test.variants.reduce((s: number, v: any) => s + v.impressions, 0);
  const totalClicks = test.variants.reduce((s: number, v: any) => s + v.clicks, 0);
  const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

  // Find best variant
  const bestVariant = test.variants.reduce(
    (best: any, v: any) => (!best || v.ctr > best.ctr ? v : best),
    null
  );

  // Calculate significance between top 2 variants
  let significance = null;
  if (test.variants.length >= 2) {
    const sorted = [...test.variants].sort((a: any, b: any) => b.ctr - a.ctr);
    const [a, b] = sorted;
    if (a.impressions >= 30 && b.impressions >= 30) {
      const p1 = a.clicks / a.impressions;
      const p2 = b.clicks / b.impressions;
      const pPooled = (a.clicks + b.clicks) / (a.impressions + b.impressions);
      const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / a.impressions + 1 / b.impressions));
      const zScore = se > 0 ? Math.abs(p1 - p2) / se : 0;
      significance = {
        zScore: zScore.toFixed(2),
        isSignificant: zScore >= 1.96,
        confidence: Math.min(99.9, zScore * 30).toFixed(1),
      };
    }
  }

  // Max CTR for bar chart scaling
  const maxCtr = Math.max(...test.variants.map((v: any) => v.ctr), 1);

  return (
    <Card className={`border ${test.isActive ? "border-purple-200" : "border-gray-200 opacity-75"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{test.widgetName}</CardTitle>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                test.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {test.isActive ? "Aktivní" : "Ukončen"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {totalImpressions.toLocaleString()} imp.
            </span>
            <span className="flex items-center gap-1">
              <MousePointerClick className="w-4 h-4" /> {totalClicks.toLocaleString()} kliků
            </span>
            <span className="flex items-center gap-1 font-semibold text-purple-700">
              <TrendingUp className="w-4 h-4" /> {overallCtr}% CTR
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Variant CTR Bars */}
        <div className="space-y-3 mb-4">
          {test.variants.map((variant: any) => {
            const isBest = bestVariant && variant.id === bestVariant.id;
            const barWidth = maxCtr > 0 ? (variant.ctr / maxCtr) * 100 : 0;

            return (
              <div key={variant.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {isBest && test.variants.length > 1 && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                    {variant.isWinner && (
                      <Trophy className="w-4 h-4 text-green-600" />
                    )}
                    <span className="font-medium">{variant.variantName}</span>
                    <span className="text-gray-400 text-xs">({variant.placement})</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{variant.impressions.toLocaleString()} imp.</span>
                    <span>{variant.clicks.toLocaleString()} kliků</span>
                    <span className="font-bold text-sm text-purple-700">{variant.ctr}%</span>
                  </div>
                </div>
                {/* CTR Bar */}
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isBest
                        ? "bg-gradient-to-r from-purple-500 to-purple-600"
                        : "bg-gradient-to-r from-gray-300 to-gray-400"
                    }`}
                    style={{ width: `${Math.max(barWidth, 2)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {variant.ctr > 0 ? `${variant.ctr}%` : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Significance & Deploy */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            {significance ? (
              significance.isSignificant ? (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Statisticky signifikantní (Z={significance.zScore}, {significance.confidence}% jistota)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  Zatím nesignifikantní (Z={significance.zScore}) — potřeba více dat
                </span>
              )
            ) : (
              <span className="text-gray-400">Nedostatek dat pro statistiku (min. 30 imp. na variantu)</span>
            )}
          </div>

          {test.isActive && bestVariant && significance?.isSignificant && (
            <Button
              size="sm"
              onClick={() => onDeploy(bestVariant.id)}
              disabled={isDeploying}
              className="bg-green-600 hover:bg-green-700"
            >
              {isDeploying ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Rocket className="w-4 h-4 mr-1" />
              )}
              Nasadit vítěze: {bestVariant.variantName}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
