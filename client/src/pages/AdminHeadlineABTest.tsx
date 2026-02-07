import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BarChart3,
  MousePointerClick,
  Clock,
  ScrollText,
  CheckCircle2,
  FlaskConical,
  TrendingUp,
  Crown,
} from "lucide-react";

// Magazine articles for dropdown
const MAGAZINE_ARTICLES = [
  { slug: "aromaterapie-esence", title: "Aromaterapie & esence" },
  { slug: "orgonit-pyramida", title: "Orgonit pyramida" },
  { slug: "solfeggio-frekvence", title: "Solfeggio frekvence" },
  { slug: "meditace-zacatecnici", title: "Meditace pro začátečníky" },
  { slug: "kristalova-mrizka", title: "Křišťálová mřížka" },
  { slug: "cakry-pruvodce", title: "Čakry - průvodce" },
  { slug: "lunni-ritualy", title: "Lunární rituály" },
  { slug: "posvátná-geometrie", title: "Posvátná geometrie" },
];

export default function AdminHeadlineABTest() {
  const { user, loading: authLoading } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState<string>("");
  const [articleType, setArticleType] = useState<string>("magazine");
  const [variants, setVariants] = useState<Array<{ key: string; headline: string; isControl: boolean }>>([
    { key: "control", headline: "", isControl: true },
    { key: "variant-b", headline: "", isControl: false },
  ]);

  const { data: results, isLoading: resultsLoading, refetch } = trpc.articles.getHeadlineTestResults.useQuery(undefined, {
    enabled: !!user && user.role === 'admin',
  });

  const createTestMutation = trpc.articles.createHeadlineTest.useMutation({
    onSuccess: () => {
      toast.success("A/B test titulku vytvořen!");
      refetch();
      setVariants([
        { key: "control", headline: "", isControl: true },
        { key: "variant-b", headline: "", isControl: false },
      ]);
      setSelectedArticle("");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Group results by article
  const groupedResults = useMemo(() => {
    if (!results) return {};
    const groups: Record<string, typeof results> = {};
    for (const r of results) {
      if (!groups[r.articleSlug]) groups[r.articleSlug] = [];
      groups[r.articleSlug].push(r);
    }
    return groups;
  }, [results]);

  const addVariant = () => {
    const key = `variant-${String.fromCharCode(97 + variants.length)}`; // variant-b, variant-c, etc.
    setVariants([...variants, { key, headline: "", isControl: false }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 2) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!selectedArticle) {
      toast.error("Vyberte článek");
      return;
    }
    if (variants.some(v => !v.headline.trim())) {
      toast.error("Vyplňte všechny titulky");
      return;
    }
    createTestMutation.mutate({
      articleSlug: selectedArticle,
      articleType,
      variants: variants.map(v => ({
        variantKey: v.key,
        headline: v.headline,
        isControl: v.isControl,
      })),
    });
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Načítání...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Přístup odepřen</div>;
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
              <FlaskConical className="w-6 h-6" />
              A/B Testování Titulků
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Měřte, který titulek generuje vyšší CTR a míru dočtení
            </p>
          </div>
        </div>

        {/* Create New Test */}
        <Card className="mb-8 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Vytvořit nový test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Článek</Label>
                <Select value={selectedArticle} onValueChange={setSelectedArticle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte článek..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MAGAZINE_ARTICLES.map(a => (
                      <SelectItem key={a.slug} value={a.slug}>{a.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Typ článku</Label>
                <Select value={articleType} onValueChange={setArticleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="magazine">Magazín</SelectItem>
                    <SelectItem value="guide">Průvodce</SelectItem>
                    <SelectItem value="tantra">Účel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Varianty titulku</Label>
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${variant.isControl ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {variant.isControl ? 'Kontrola' : variant.key.toUpperCase()}
                  </span>
                  <Input
                    value={variant.headline}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[index].headline = e.target.value;
                      setVariants(updated);
                    }}
                    placeholder={variant.isControl ? "Původní titulek..." : "Alternativní titulek..."}
                    className="flex-1"
                  />
                  {!variant.isControl && variants.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removeVariant(index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="w-4 h-4 mr-1" /> Přidat variantu
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createTestMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {createTestMutation.isPending ? "Vytvářím..." : "Vytvořit test"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Výsledky testů
        </h2>

        {resultsLoading ? (
          <div className="text-center py-8 text-gray-500">Načítání výsledků...</div>
        ) : Object.keys(groupedResults).length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="py-12 text-center text-gray-500">
              <FlaskConical className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Zatím žádné testy</p>
              <p className="text-sm mt-1">Vytvořte první A/B test titulku výše</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedResults).map(([slug, articleResults]) => {
              // Find winner (highest CTR with at least 10 impressions)
              const qualifiedResults = articleResults.filter((r: any) => r.impressions >= 10);
              const winner = qualifiedResults.length > 0
                ? qualifiedResults.reduce((best: any, r: any) => r.ctr > best.ctr ? r : best)
                : null;

              return (
                <Card key={slug} className="border-purple-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ScrollText className="w-4 h-4 text-purple-600" />
                        {slug}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${articleResults[0]?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {articleResults[0]?.isActive ? 'Aktivní' : 'Ukončen'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-purple-100">
                            <th className="text-left py-2 px-3 font-medium text-gray-600">Varianta</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-600">Titulek</th>
                            <th className="text-center py-2 px-3 font-medium text-gray-600">
                              <span className="flex items-center justify-center gap-1">
                                <MousePointerClick className="w-3 h-3" /> Zobrazení
                              </span>
                            </th>
                            <th className="text-center py-2 px-3 font-medium text-gray-600">
                              <span className="flex items-center justify-center gap-1">
                                <TrendingUp className="w-3 h-3" /> CTR
                              </span>
                            </th>
                            <th className="text-center py-2 px-3 font-medium text-gray-600">
                              <span className="flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" /> Ø Čas
                              </span>
                            </th>
                            <th className="text-center py-2 px-3 font-medium text-gray-600">
                              <span className="flex items-center justify-center gap-1">
                                <ScrollText className="w-3 h-3" /> Ø Scroll
                              </span>
                            </th>
                            <th className="text-center py-2 px-3 font-medium text-gray-600">
                              <span className="flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Dočtení
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {articleResults.map((r: any) => {
                            const isWinner = winner && r.variantKey === winner.variantKey;
                            return (
                              <tr
                                key={r.variantKey}
                                className={`border-b border-gray-50 ${isWinner ? 'bg-green-50' : ''}`}
                              >
                                <td className="py-2 px-3">
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded inline-flex items-center gap-1 ${r.isControl ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {isWinner && <Crown className="w-3 h-3 text-amber-500" />}
                                    {r.variantKey}
                                  </span>
                                </td>
                                <td className="py-2 px-3 max-w-[300px] truncate" title={r.headline}>
                                  {r.headline}
                                </td>
                                <td className="py-2 px-3 text-center font-mono">
                                  {r.impressions}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span className={`font-bold ${getCTRColor(r.ctr)}`}>
                                    {r.ctr.toFixed(1)}%
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-center font-mono">
                                  {Math.round(r.avgReadTime)}s
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-purple-500"
                                        style={{ width: `${Math.min(100, r.avgScrollDepth)}%` }}
                                      />
                                    </div>
                                    <span className="text-xs">{Math.round(r.avgScrollDepth)}%</span>
                                  </div>
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span className={`font-bold ${getCompletionColor(r.completionRate)}`}>
                                    {r.completionRate.toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getCTRColor(ctr: number): string {
  if (ctr >= 10) return 'text-green-600';
  if (ctr >= 5) return 'text-amber-600';
  return 'text-red-500';
}

function getCompletionColor(rate: number): string {
  if (rate >= 50) return 'text-green-600';
  if (rate >= 25) return 'text-amber-600';
  return 'text-red-500';
}
