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
  Zap,
  Sparkles,
  Wand2,
  Loader2,
  Brain,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [aiArticleSlug, setAiArticleSlug] = useState<string>("");
  const [aiArticleTitle, setAiArticleTitle] = useState<string>("");
  const [aiArticleExcerpt, setAiArticleExcerpt] = useState<string>("");
  const [aiArticleType, setAiArticleType] = useState<string>("magazine");
  const [aiNumVariants, setAiNumVariants] = useState<number>(3);
  const [aiPreviewResult, setAiPreviewResult] = useState<any>(null);
  const [variants, setVariants] = useState<Array<{ key: string; headline: string; isControl: boolean }>>([
    { key: "control", headline: "", isControl: true },
    { key: "variant-b", headline: "", isControl: false },
  ]);

  const { data: results, isLoading: resultsLoading, refetch } = trpc.articles.getHeadlineTestResults.useQuery(undefined, {
    enabled: !!user && user.role === 'admin',
  });

  const evaluateQuery = trpc.articles.evaluateTests.useQuery(undefined, {
    enabled: false, // Only fetch on demand
  });

  const deployWinnerMutation = trpc.articles.deployWinner.useMutation({
    onSuccess: (data: any) => {
      toast.success(data.message);
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const autoDeployMutation = trpc.articles.autoEvaluateAndDeploy.useMutation({
    onSuccess: (data: any) => {
      if (data.deployed > 0) {
        toast.success(`Nasazeno ${data.deployed} vítězných variant z ${data.evaluated} vyhodnocených testů`);
      } else if (data.evaluated > 0) {
        toast.info(`Vyhodnoceno ${data.evaluated} testů, ale žádný nebyl automaticky nasazen`);
      } else {
        toast.info("Žádný test zatím nedosáhl statistické signifikance");
      }
      refetch();
      evaluateQuery.refetch();
    },
    onError: (err: any) => toast.error(err.message),
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

  // AI headline generation mutations
  const aiPreviewMutation = trpc.articles.aiGenerateHeadlines.useMutation({
    onSuccess: (data: any) => {
      setAiPreviewResult(data);
      toast.success(`AI navrhla ${data.variants.length - 1} alternativních titulků`);
    },
    onError: (err: any) => toast.error(`Chyba AI: ${err.message}`),
  });

  const aiGenerateAndTestMutation = trpc.articles.aiGenerateAndTest.useMutation({
    onSuccess: (data: any) => {
      if (data.testCreated) {
        toast.success(`A/B test vytvořen s ${data.variants.length} variantami!`);
        setAiPreviewResult(null);
        setAiArticleSlug("");
        setAiArticleTitle("");
        setAiArticleExcerpt("");
        refetch();
      } else {
        toast.error("Test se nepodařilo vytvořit");
      }
    },
    onError: (err: any) => toast.error(`Chyba: ${err.message}`),
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

        {/* Create New Test - Tabs */}
        <Tabs defaultValue="ai" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Generování
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Manuální
            </TabsTrigger>
          </TabsList>

          {/* AI Generation Tab */}
          <TabsContent value="ai">
            <Card className="border-violet-200 bg-gradient-to-br from-violet-50/50 to-purple-50/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-600" />
                  AI Generování titulků
                </CardTitle>
                <p className="text-sm text-gray-500">
                  AI analyzuje obsah článku a navrhne optimalizované varianty titulků na základě copywritingových strategií a historických dat z A/B testů.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Slug článku</Label>
                    <Input
                      value={aiArticleSlug}
                      onChange={(e) => setAiArticleSlug(e.target.value)}
                      placeholder="napr. aromaterapie-esence"
                    />
                  </div>
                  <div>
                    <Label>Typ článku</Label>
                    <Select value={aiArticleType} onValueChange={setAiArticleType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="magazine">Magazín</SelectItem>
                        <SelectItem value="guide">Průvodce symboly</SelectItem>
                        <SelectItem value="stone">Průvodce kameny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Původní titulek</Label>
                  <Input
                    value={aiArticleTitle}
                    onChange={(e) => setAiArticleTitle(e.target.value)}
                    placeholder="Současný titulek článku..."
                  />
                </div>
                <div>
                  <Label>Úryvek / popis článku</Label>
                  <Input
                    value={aiArticleExcerpt}
                    onChange={(e) => setAiArticleExcerpt(e.target.value)}
                    placeholder="Krátký popis obsahu článku pro kontext AI..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label>Počet variant:</Label>
                    <Select value={String(aiNumVariants)} onValueChange={(v) => setAiNumVariants(Number(v))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      if (!aiArticleSlug || !aiArticleTitle || !aiArticleExcerpt) {
                        toast.error("Vyplňte všechna pole");
                        return;
                      }
                      aiPreviewMutation.mutate({
                        articleSlug: aiArticleSlug,
                        originalTitle: aiArticleTitle,
                        articleExcerpt: aiArticleExcerpt,
                        articleType: aiArticleType as "magazine" | "guide" | "stone",
                        numberOfVariants: aiNumVariants,
                      });
                    }}
                    variant="outline"
                    className="border-violet-300 text-violet-700 hover:bg-violet-100"
                    disabled={aiPreviewMutation.isPending}
                  >
                    {aiPreviewMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI generuje...</>
                    ) : (
                      <><Wand2 className="w-4 h-4 mr-2" /> Náhled variant</>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      if (!aiArticleSlug || !aiArticleTitle || !aiArticleExcerpt) {
                        toast.error("Vyplňte všechna pole");
                        return;
                      }
                      aiGenerateAndTestMutation.mutate({
                        articleSlug: aiArticleSlug,
                        originalTitle: aiArticleTitle,
                        articleExcerpt: aiArticleExcerpt,
                        articleType: aiArticleType as "magazine" | "guide" | "stone",
                        numberOfVariants: aiNumVariants,
                      });
                    }}
                    className="bg-violet-600 hover:bg-violet-700"
                    disabled={aiGenerateAndTestMutation.isPending}
                  >
                    {aiGenerateAndTestMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Vytvářím test...</>
                    ) : (
                      <><Rocket className="w-4 h-4 mr-2" /> Generovat & spustit test</>
                    )}
                  </Button>
                </div>

                {/* AI Preview Results */}
                {aiPreviewResult && (
                  <div className="mt-4 bg-white rounded-lg border border-violet-200 p-4">
                    <h3 className="font-medium text-violet-800 flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4" />
                      AI navržené varianty
                    </h3>
                    <div className="space-y-2">
                      {aiPreviewResult.variants.map((v: any, i: number) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${v.isControl ? 'bg-blue-50 border border-blue-200' : 'bg-violet-50 border border-violet-200'}`}>
                          <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${v.isControl ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'}`}>
                            {v.isControl ? 'Kontrola' : v.strategy}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{v.headline}</p>
                            {!v.isControl && (
                              <p className="text-xs text-gray-500 mt-1">Strategie: {v.strategy}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>AI zdůvodnění:</strong> {aiPreviewResult.reasoning}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  Manuálně vytvořit test
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
          </TabsContent>
        </Tabs>

        {/* Auto-Evaluate & Deploy */}
        <Card className="mb-8 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Automatické vyhodnocení & nasazení
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Systém analyzuje všechny aktivní testy a identifikuje varianty, které dosáhly statistické signifikance (95% confidence). Vítězné varianty lze nasadit jedním kliknutím.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button
                onClick={() => evaluateQuery.refetch()}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
                disabled={evaluateQuery.isFetching}
              >
                {evaluateQuery.isFetching ? "Analyzuji..." : "🔍 Analyzovat testy"}
              </Button>
              <Button
                onClick={() => autoDeployMutation.mutate({})}
                className="bg-green-600 hover:bg-green-700"
                disabled={autoDeployMutation.isPending}
              >
                {autoDeployMutation.isPending ? "Nasazuji..." : "🚀 Auto-deploy vítězů"}
              </Button>
            </div>

            {evaluateQuery.data && evaluateQuery.data.length > 0 ? (
              <div className="space-y-3">
                {evaluateQuery.data.map((result: any) => (
                  <div key={result.articleSlug} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">{result.articleSlug}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {result.winner.confidence}% jistota
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-green-50 rounded p-2">
                        <div className="flex items-center gap-1 text-green-700 font-medium mb-1">
                          <Crown className="w-3 h-3" /> Vítěz: {result.winner.variantKey}
                        </div>
                        <p className="text-gray-600 truncate" title={result.winner.headline}>{result.winner.headline}</p>
                        <p className="text-green-600 font-mono">CTR: {result.winner.ctr.toFixed(1)}% | Dočtení: {result.winner.completionRate.toFixed(1)}%</p>
                      </div>
                      <div className="bg-red-50 rounded p-2">
                        <div className="flex items-center gap-1 text-red-700 font-medium mb-1">
                          Poražený: {result.loser.variantKey}
                        </div>
                        <p className="text-gray-600 truncate" title={result.loser.headline}>{result.loser.headline}</p>
                        <p className="text-red-600 font-mono">CTR: {result.loser.ctr.toFixed(1)}% | Dočtení: {result.loser.completionRate.toFixed(1)}%</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{result.recommendation}</p>
                    <Button
                      size="sm"
                      className="mt-2 bg-green-600 hover:bg-green-700"
                      onClick={() => deployWinnerMutation.mutate({
                        articleSlug: result.articleSlug,
                        winnerVariantKey: result.winner.variantKey,
                      })}
                      disabled={deployWinnerMutation.isPending}
                    >
                      Nasadit vítěze
                    </Button>
                  </div>
                ))}
              </div>
            ) : evaluateQuery.data && evaluateQuery.data.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Žádný test zatím nedosáhl statistické signifikance. Potřeba více dat (min. 100 zobrazení na variantu).</p>
            ) : null}
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
