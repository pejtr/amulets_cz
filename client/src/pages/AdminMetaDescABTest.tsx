import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  FileText,
  Search,
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
  { slug: "10-nejsilnejsich-amuletu-pro-ochranu-2025", title: "10 nejsilnějších amuletů pro ochranu 2025" },
  { slug: "jak-vybrat-kamen-podle-znameni-zveroruhu", title: "Jak vybrat kámen podle znamení zvěrokruhu" },
  { slug: "modry-lotos-egyptska-mytologie", title: "Modrý lotos - Egyptská mytologie" },
  { slug: "tantra-a-posvátná-sexualita", title: "Tantra a posvátná sexualita" },
];

export default function AdminMetaDescABTest() {
  const { user, loading: authLoading } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState<string>("");
  const [articleType, setArticleType] = useState<string>("magazine");
  const [aiArticleSlug, setAiArticleSlug] = useState<string>("");
  const [aiArticleTitle, setAiArticleTitle] = useState<string>("");
  const [aiOriginalDesc, setAiOriginalDesc] = useState<string>("");
  const [aiArticleExcerpt, setAiArticleExcerpt] = useState<string>("");
  const [aiArticleType, setAiArticleType] = useState<string>("magazine");
  const [aiNumVariants, setAiNumVariants] = useState<number>(3);
  const [aiPreviewResult, setAiPreviewResult] = useState<any>(null);
  const [variants, setVariants] = useState<Array<{ key: string; metaDescription: string; isControl: boolean }>>([
    { key: "control", metaDescription: "", isControl: true },
    { key: "variant-b", metaDescription: "", isControl: false },
  ]);

  const { data: results, isLoading: resultsLoading, refetch } = trpc.articles.getMetaDescTestResults.useQuery(undefined, {
    enabled: !!user && user.role === 'admin',
  });

  const evaluateMutation = trpc.articles.evaluateMetaDescTests.useMutation({
    onSuccess: (data: any) => {
      if (data && data.length > 0) {
        toast.success(`Vyhodnoceno ${data.length} testů`);
      } else {
        toast.info("Žádný test zatím nedosáhl statistické signifikance");
      }
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deployWinnerMutation = trpc.articles.deployMetaDescWinner.useMutation({
    onSuccess: (data: any) => {
      toast.success(data.message || "Vítěz nasazen!");
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const autoDeployMutation = trpc.articles.autoEvaluateMetaDesc.useMutation({
    onSuccess: (data: any) => {
      if (data.deployed > 0) {
        toast.success(`Nasazeno ${data.deployed} vítězných variant z ${data.evaluated} vyhodnocených testů`);
      } else if (data.evaluated > 0) {
        toast.info(`Vyhodnoceno ${data.evaluated} testů, ale žádný nebyl automaticky nasazen`);
      } else {
        toast.info("Žádný test zatím nedosáhl statistické signifikance");
      }
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const createTestMutation = trpc.articles.createMetaDescTest.useMutation({
    onSuccess: () => {
      toast.success("A/B test meta description vytvořen!");
      refetch();
      setVariants([
        { key: "control", metaDescription: "", isControl: true },
        { key: "variant-b", metaDescription: "", isControl: false },
      ]);
      setSelectedArticle("");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // AI meta description generation mutations
  const aiPreviewMutation = trpc.articles.generateMetaDescVariants.useMutation({
    onSuccess: (data: any) => {
      setAiPreviewResult(data);
      toast.success(`AI navrhla ${data.variants.length - 1} alternativních meta descriptions`);
    },
    onError: (err: any) => toast.error(`Chyba AI: ${err.message}`),
  });

  const aiGenerateAndTestMutation = trpc.articles.generateAndCreateMetaDescTest.useMutation({
    onSuccess: (data: any) => {
      if (data.testCreated) {
        toast.success(`A/B test vytvořen s ${data.variants.length} variantami!`);
        setAiPreviewResult(null);
        setAiArticleSlug("");
        setAiArticleTitle("");
        setAiOriginalDesc("");
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
    const key = `variant-${String.fromCharCode(97 + variants.length)}`;
    setVariants([...variants, { key, metaDescription: "", isControl: false }]);
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
    if (variants.some(v => !v.metaDescription.trim())) {
      toast.error("Vyplňte všechny meta descriptions");
      return;
    }
    createTestMutation.mutate({
      articleSlug: selectedArticle,
      articleType,
      variants: variants.map(v => ({
        variantKey: v.key,
        metaDescription: v.metaDescription,
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
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
              <Search className="w-6 h-6" />
              A/B Testování Meta Descriptions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Optimalizujte CTR z vyhledávačů testováním různých meta descriptions
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
            <Card className="border-teal-200 bg-gradient-to-br from-teal-50/50 to-emerald-50/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-teal-600" />
                  AI Generování meta descriptions
                </CardTitle>
                <p className="text-sm text-gray-500">
                  AI analyzuje obsah článku a navrhne optimalizované meta descriptions pro vyšší CTR z Google a Seznam.
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
                  <Label>Titulek článku</Label>
                  <Input
                    value={aiArticleTitle}
                    onChange={(e) => setAiArticleTitle(e.target.value)}
                    placeholder="Název článku..."
                  />
                </div>
                <div>
                  <Label>Původní meta description</Label>
                  <Textarea
                    value={aiOriginalDesc}
                    onChange={(e) => setAiOriginalDesc(e.target.value)}
                    placeholder="Současný meta description článku..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Úryvek / popis článku</Label>
                  <Textarea
                    value={aiArticleExcerpt}
                    onChange={(e) => setAiArticleExcerpt(e.target.value)}
                    placeholder="Krátký popis obsahu článku pro kontext AI..."
                    rows={2}
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
                      if (!aiArticleSlug || !aiArticleTitle || !aiOriginalDesc || !aiArticleExcerpt) {
                        toast.error("Vyplňte všechna pole");
                        return;
                      }
                      aiPreviewMutation.mutate({
                        articleSlug: aiArticleSlug,
                        originalTitle: aiArticleTitle,
                        originalDescription: aiOriginalDesc,
                        articleExcerpt: aiArticleExcerpt,
                        articleType: aiArticleType as "magazine" | "guide" | "stone",
                        numberOfVariants: aiNumVariants,
                      });
                    }}
                    variant="outline"
                    className="border-teal-300 text-teal-700 hover:bg-teal-100"
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
                      if (!aiArticleSlug || !aiArticleTitle || !aiOriginalDesc || !aiArticleExcerpt) {
                        toast.error("Vyplňte všechna pole");
                        return;
                      }
                      aiGenerateAndTestMutation.mutate({
                        articleSlug: aiArticleSlug,
                        originalTitle: aiArticleTitle,
                        originalDescription: aiOriginalDesc,
                        articleExcerpt: aiArticleExcerpt,
                        articleType: aiArticleType as "magazine" | "guide" | "stone",
                        numberOfVariants: aiNumVariants,
                      });
                    }}
                    className="bg-teal-600 hover:bg-teal-700"
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
                  <div className="mt-4 bg-white rounded-lg border border-teal-200 p-4">
                    <h3 className="font-medium text-teal-800 flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4" />
                      AI navržené varianty meta descriptions
                    </h3>
                    <div className="space-y-2">
                      {aiPreviewResult.variants.map((v: any, i: number) => (
                        <div key={i} className={`flex flex-col gap-1 p-3 rounded-lg ${v.isControl ? 'bg-blue-50 border border-blue-200' : 'bg-teal-50 border border-teal-200'}`}>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${v.isControl ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                              {v.isControl ? 'Kontrola' : v.strategy || v.variantKey}
                            </span>
                            <span className="text-xs text-gray-400">
                              {v.metaDescription?.length || 0} znaků
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{v.metaDescription}</p>
                          {!v.isControl && v.strategy && (
                            <p className="text-xs text-gray-500">Strategie: {v.strategy}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    {aiPreviewResult.reasoning && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800">
                          <strong>AI zdůvodnění:</strong> {aiPreviewResult.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual">
            <Card className="border-teal-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-teal-600" />
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
                        <SelectItem value="stone">Kameny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Varianty meta description</Label>
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded mt-2 whitespace-nowrap ${variant.isControl ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                        {variant.isControl ? 'Kontrola' : variant.key.toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <Textarea
                          value={variant.metaDescription}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[index].metaDescription = e.target.value;
                            setVariants(updated);
                          }}
                          placeholder={variant.isControl ? "Původní meta description..." : "Alternativní meta description..."}
                          rows={2}
                        />
                        <span className="text-xs text-gray-400">{variant.metaDescription.length}/160 znaků</span>
                      </div>
                      {!variant.isControl && variants.length > 2 && (
                        <Button variant="ghost" size="icon" onClick={() => removeVariant(index)} className="mt-1">
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
                      className="bg-teal-600 hover:bg-teal-700"
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
              Systém analyzuje všechny aktivní meta description testy a identifikuje varianty, které dosáhly statistické signifikance (95% confidence). Vítězné varianty lze nasadit jedním kliknutím.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button
                onClick={() => evaluateMutation.mutate({})}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
                disabled={evaluateMutation.isPending}
              >
                {evaluateMutation.isPending ? "Analyzuji..." : "Analyzovat testy"}
              </Button>
              <Button
                onClick={() => autoDeployMutation.mutate({})}
                className="bg-green-600 hover:bg-green-700"
                disabled={autoDeployMutation.isPending}
              >
                {autoDeployMutation.isPending ? "Nasazuji..." : "Auto-deploy vítězů"}
              </Button>
            </div>

            {evaluateMutation.data && evaluateMutation.data.length > 0 ? (
              <div className="space-y-3">
                {evaluateMutation.data.map((result: any) => (
                  <div key={result.articleSlug} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">{result.articleSlug}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {result.winner?.confidence || 0}% jistota
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-green-50 rounded p-2">
                        <div className="flex items-center gap-1 text-green-700 font-medium mb-1">
                          <Crown className="w-3 h-3" /> Vítěz: {result.winner?.variantKey}
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2">{result.winner?.metaDescription}</p>
                        <p className="text-green-600 font-mono text-xs mt-1">CTR: {result.winner?.ctr?.toFixed(1)}%</p>
                      </div>
                      <div className="bg-red-50 rounded p-2">
                        <div className="flex items-center gap-1 text-red-700 font-medium mb-1">
                          Poražený: {result.loser?.variantKey}
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2">{result.loser?.metaDescription}</p>
                        <p className="text-red-600 font-mono text-xs mt-1">CTR: {result.loser?.ctr?.toFixed(1)}%</p>
                      </div>
                    </div>
                    {result.recommendation && (
                      <p className="text-xs text-gray-500 mt-2">{result.recommendation}</p>
                    )}
                    <Button
                      size="sm"
                      className="mt-2 bg-green-600 hover:bg-green-700"
                      onClick={() => deployWinnerMutation.mutate({
                        articleSlug: result.articleSlug,
                        winnerVariantKey: result.winner?.variantKey,
                      })}
                      disabled={deployWinnerMutation.isPending}
                    >
                      Nasadit vítěze
                    </Button>
                  </div>
                ))}
              </div>
            ) : evaluateMutation.data && evaluateMutation.data.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Žádný test zatím nedosáhl statistické signifikance. Potřeba více dat (min. 100 zobrazení na variantu).</p>
            ) : null}
          </CardContent>
        </Card>

        {/* Results */}
        <h2 className="text-xl font-bold text-teal-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Výsledky testů meta descriptions
        </h2>

        {resultsLoading ? (
          <div className="text-center py-8 text-gray-500">Načítání výsledků...</div>
        ) : Object.keys(groupedResults).length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="py-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Zatím žádné testy</p>
              <p className="text-sm mt-1">Vytvořte první A/B test meta description výše</p>
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
                <Card key={slug} className="border-teal-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-600" />
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
                          <tr className="border-b border-teal-100">
                            <th className="text-left py-2 px-3 font-medium text-gray-600">Varianta</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-600">Meta Description</th>
                            <th className="text-center py-2 px-3 font-medium text-gray-600">
                              <span className="flex items-center justify-center gap-1">
                                <MousePointerClick className="w-3 h-3" /> Impr.
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
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded inline-flex items-center gap-1 ${r.isControl ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                                    {isWinner && <Crown className="w-3 h-3 text-amber-500" />}
                                    {r.variantKey}
                                  </span>
                                </td>
                                <td className="py-2 px-3 max-w-[300px]">
                                  <p className="text-xs text-gray-700 line-clamp-2" title={r.metaDescription}>
                                    {r.metaDescription}
                                  </p>
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
                                        className="h-full rounded-full bg-teal-500"
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
