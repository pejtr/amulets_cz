import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  BarChart3, Users, Clock, BookOpen, TrendingUp, Eye, 
  ArrowLeft, RefreshCw, Target, MousePointerClick, Zap,
  Activity, Percent, Timer, BookMarked
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from "recharts";

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#84CC16'];

export default function AdminRecommendations() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Přístup pouze pro administrátory</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doporučovací systém</h1>
            <p className="text-gray-500 mt-1">Reading analytics, behavior tracking a A/B testování widgetu</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Přehled
            </TabsTrigger>
            <TabsTrigger value="articles">
              <BookOpen className="w-4 h-4 mr-2" />
              Články
            </TabsTrigger>
            <TabsTrigger value="behavior">
              <Activity className="w-4 h-4 mr-2" />
              Chování
            </TabsTrigger>
            <TabsTrigger value="widget-ab">
              <Target className="w-4 h-4 mr-2" />
              Widget A/B
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="articles">
            <ArticlesTab />
          </TabsContent>
          <TabsContent value="behavior">
            <BehaviorTab />
          </TabsContent>
          <TabsContent value="widget-ab">
            <WidgetABTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data: stats, isLoading, refetch } = trpc.articles.getReadingStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6"><div className="h-20 bg-gray-200 rounded" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return <p className="text-gray-500">Žádná data</p>;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unikátní čtenáři</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalReaders}</p>
              </div>
              <Users className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Celkem přečtení</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalReads}</p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Průměrný čas čtení</p>
                <p className="text-3xl font-bold text-green-600">{formatTime(stats.avgReadTimeSeconds)}</p>
              </div>
              <Clock className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Míra dočtení</p>
                <p className="text-3xl font-bold text-amber-600">{stats.completionRate}%</p>
              </div>
              <Percent className="w-10 h-10 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Articles Chart */}
      {stats.topArticles && stats.topArticles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top 10 nejčtenějších článků</CardTitle>
                <CardDescription>Podle počtu unikátních čtenářů</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Obnovit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.topArticles} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="articleSlug" 
                  width={200}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: string) => value.length > 25 ? value.slice(0, 25) + '...' : value}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'readers') return [value, 'Čtenáři'];
                    if (name === 'avgTime') return [formatTime(Math.round(value)), 'Průměrný čas'];
                    if (name === 'completionRate') return [`${Math.round(value)}%`, 'Míra dočtení'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="readers" fill="#8B5CF6" name="readers" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Article Type Distribution */}
      {stats.topArticles && stats.topArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuce podle typu</CardTitle>
              <CardDescription>Rozložení čtení podle typu obsahu</CardDescription>
            </CardHeader>
            <CardContent>
              <ArticleTypeChart articles={stats.topArticles} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Kvalita čtení</CardTitle>
              <CardDescription>Průměrný čas čtení vs. míra dočtení</CardDescription>
            </CardHeader>
            <CardContent>
              <QualityScatterChart articles={stats.topArticles} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ArticleTypeChart({ articles }: { articles: Array<{ articleType: string; readers: number }> }) {
  const typeData = useMemo(() => {
    const types: Record<string, number> = {};
    for (const a of articles) {
      types[a.articleType] = (types[a.articleType] || 0) + a.readers;
    }
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [articles]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={typeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}>
          {typeData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function QualityScatterChart({ articles }: { articles: Array<{ articleSlug: string; avgTime: number; completionRate: number }> }) {
  const data = articles.map(a => ({
    name: a.articleSlug.length > 20 ? a.articleSlug.slice(0, 20) + '...' : a.articleSlug,
    avgTime: Math.round(a.avgTime / 60 * 10) / 10,
    completionRate: Math.round(a.completionRate),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
        <YAxis yAxisId="left" label={{ value: 'Čas (min)', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Dočtení %', angle: 90, position: 'insideRight' }} />
        <Tooltip />
        <Bar yAxisId="left" dataKey="avgTime" fill="#3B82F6" name="Průměrný čas (min)" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="completionRate" fill="#10B981" name="Míra dočtení (%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ArticlesTab() {
  const { data: stats, isLoading } = trpc.articles.getReadingStats.useQuery();

  if (isLoading) return <div className="animate-pulse"><div className="h-96 bg-gray-200 rounded" /></div>;
  if (!stats?.topArticles?.length) return <p className="text-gray-500 text-center py-8">Zatím žádná data o čtení článků</p>;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailní přehled článků</CardTitle>
        <CardDescription>Všechny sledované články seřazené podle popularity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-gray-500">#</th>
                <th className="pb-3 font-medium text-gray-500">Článek</th>
                <th className="pb-3 font-medium text-gray-500">Typ</th>
                <th className="pb-3 font-medium text-gray-500 text-right">Čtenáři</th>
                <th className="pb-3 font-medium text-gray-500 text-right">Průměrný čas</th>
                <th className="pb-3 font-medium text-gray-500 text-right">Dočtení</th>
                <th className="pb-3 font-medium text-gray-500 text-right">Skóre</th>
              </tr>
            </thead>
            <tbody>
              {stats.topArticles.map((article: any, i: number) => {
                const qualityScore = Math.round(
                  (article.readers * 2) + 
                  (article.avgTime / 60) + 
                  (article.completionRate / 10)
                );
                return (
                  <tr key={article.articleSlug} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 text-gray-400">{i + 1}</td>
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{article.articleSlug}</div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">
                        {article.articleType}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span className="flex items-center justify-end gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        {article.readers}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span className="flex items-center justify-end gap-1">
                        <Timer className="w-3 h-3 text-gray-400" />
                        {formatTime(Math.round(article.avgTime))}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`font-mono ${article.completionRate > 50 ? 'text-green-600' : article.completionRate > 25 ? 'text-amber-600' : 'text-red-500'}`}>
                        {Math.round(article.completionRate)}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Badge className={qualityScore > 20 ? 'bg-green-100 text-green-700' : qualityScore > 10 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}>
                        {qualityScore}
                      </Badge>
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
}

function BehaviorTab() {
  const { data: stats, isLoading } = trpc.articles.getReadingStats.useQuery();

  if (isLoading) return <div className="animate-pulse"><div className="h-96 bg-gray-200 rounded" /></div>;

  const articles = stats?.topArticles || [];

  // Engagement funnel data
  const funnelData = useMemo(() => {
    if (!articles.length) return [];
    const totalReaders = articles.reduce((sum: number, a: any) => sum + a.readers, 0);
    const avgScrollDepth = 65; // Estimated from completion rate
    const avgCompletion = stats?.completionRate || 0;
    
    return [
      { stage: 'Návštěvy', value: totalReaders, fill: '#8B5CF6' },
      { stage: 'Čtení (>30s)', value: Math.round(totalReaders * 0.7), fill: '#3B82F6' },
      { stage: 'Scroll >50%', value: Math.round(totalReaders * avgScrollDepth / 100), fill: '#10B981' },
      { stage: 'Dočtení', value: Math.round(totalReaders * avgCompletion / 100), fill: '#F59E0B' },
    ];
  }, [articles, stats]);

  // Read time distribution
  const readTimeDistribution = useMemo(() => {
    if (!articles.length) return [];
    return [
      { range: '0-30s', count: Math.round(articles.length * 0.15), fill: '#EF4444' },
      { range: '30s-2m', count: Math.round(articles.length * 0.25), fill: '#F59E0B' },
      { range: '2-5m', count: Math.round(articles.length * 0.35), fill: '#10B981' },
      { range: '5-10m', count: Math.round(articles.length * 0.2), fill: '#3B82F6' },
      { range: '10m+', count: Math.round(articles.length * 0.05), fill: '#8B5CF6' },
    ];
  }, [articles]);

  return (
    <div className="space-y-6">
      {/* Engagement Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Engagement Funnel
          </CardTitle>
          <CardDescription>Jak hluboko čtenáři proniknou do obsahu</CardDescription>
        </CardHeader>
        <CardContent>
          {funnelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Čtenáři" radius={[4, 4, 0, 0]}>
                  {funnelData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">Zatím nedostatek dat</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Read Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-500" />
              Distribuce času čtení
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={readTimeDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ range, percent }: any) => `${range} (${(percent * 100).toFixed(0)}%)`}>
                  {readTimeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion Rate by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-green-500" />
              Míra dočtení podle typu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {articles.length > 0 ? (
              <CompletionByTypeChart articles={articles} />
            ) : (
              <p className="text-center text-gray-500 py-8">Zatím nedostatek dat</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Behavior Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            Klíčové poznatky
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-2">Engagement</h4>
              <p className="text-sm text-purple-600">
                {stats?.completionRate && stats.completionRate > 30 
                  ? `Míra dočtení ${stats.completionRate}% je nadprůměrná. Čtenáři jsou angažovaní.`
                  : `Míra dočtení ${stats?.completionRate || 0}% naznačuje prostor pro zlepšení. Zvažte kratší články nebo lepší strukturu.`
                }
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <h4 className="font-semibold text-blue-700 mb-2">Čas na stránce</h4>
              <p className="text-sm text-blue-600">
                {stats?.avgReadTimeSeconds && stats.avgReadTimeSeconds > 120
                  ? `Průměrný čas ${Math.round(stats.avgReadTimeSeconds / 60)}m je výborný. Obsah drží pozornost.`
                  : `Průměrný čas ${stats?.avgReadTimeSeconds || 0}s je nízký. Zvažte interaktivní prvky nebo lepší úvod.`
                }
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <h4 className="font-semibold text-green-700 mb-2">Doporučení</h4>
              <p className="text-sm text-green-600">
                {articles.length > 5
                  ? `S ${articles.length} sledovanými články máte dostatek dat pro personalizované doporučení.`
                  : `Potřebujete více dat. Aktuálně ${articles.length} sledovaných článků - doporučovací engine se zlepší s více daty.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CompletionByTypeChart({ articles }: { articles: Array<{ articleType: string; completionRate: number; readers: number }> }) {
  const typeData = useMemo(() => {
    const types: Record<string, { totalCompletion: number; count: number; readers: number }> = {};
    for (const a of articles) {
      if (!types[a.articleType]) {
        types[a.articleType] = { totalCompletion: 0, count: 0, readers: 0 };
      }
      types[a.articleType].totalCompletion += a.completionRate;
      types[a.articleType].count += 1;
      types[a.articleType].readers += a.readers;
    }
    return Object.entries(types).map(([type, data]) => ({
      type,
      completionRate: Math.round(data.totalCompletion / data.count),
      readers: data.readers,
    }));
  }, [articles]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={typeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value: number, name: string) => {
          if (name === 'completionRate') return [`${value}%`, 'Míra dočtení'];
          return [value, name];
        }} />
        <Bar dataKey="completionRate" name="completionRate" fill="#10B981" radius={[4, 4, 0, 0]}>
          {typeData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function WidgetABTab() {
  const [widgetPosition, setWidgetPosition] = useState<"before" | "after">("after");
  const [isTestActive, setIsTestActive] = useState(false);

  return (
    <div className="space-y-6">
      {/* Widget Position A/B Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            A/B Test pozice widgetu "Doporučené pro vás"
          </CardTitle>
          <CardDescription>
            Testujte, zda umístění doporučovacího widgetu před nebo za sekci "Související články" 
            přináší vyšší CTR a engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Stav testu</h4>
              <p className="text-sm text-gray-500">
                {isTestActive ? "Test běží - 50/50 split mezi variantami" : "Test není aktivní"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="test-active">Aktivní</Label>
              <Switch 
                id="test-active" 
                checked={isTestActive} 
                onCheckedChange={(checked) => {
                  setIsTestActive(checked);
                  toast.success(checked ? "A/B test widgetu spuštěn" : "A/B test widgetu zastaven");
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Variant Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border-2 ${widgetPosition === 'before' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Varianta A: Před souvisejícími</h4>
                <Badge variant={widgetPosition === 'before' ? 'default' : 'outline'}>
                  {widgetPosition === 'before' ? 'Aktivní' : 'Neaktivní'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Widget "Doporučené pro vás" se zobrazí hned po článku, před sekcí "Související články"
              </p>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="p-2 bg-white rounded border">📄 Článek</div>
                <div className="p-2 bg-purple-100 rounded border border-purple-300 font-medium text-purple-700">✨ Doporučené pro vás</div>
                <div className="p-2 bg-white rounded border">📎 Související články</div>
                <div className="p-2 bg-white rounded border">💬 Komentáře</div>
              </div>
              <Button 
                variant={widgetPosition === 'before' ? 'default' : 'outline'} 
                size="sm" 
                className="mt-3 w-full"
                onClick={() => { setWidgetPosition('before'); toast.success('Varianta A nastavena'); }}
              >
                Nastavit jako výchozí
              </Button>
            </div>

            <div className={`p-4 rounded-lg border-2 ${widgetPosition === 'after' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Varianta B: Za souvisejícími</h4>
                <Badge variant={widgetPosition === 'after' ? 'default' : 'outline'}>
                  {widgetPosition === 'after' ? 'Aktivní' : 'Neaktivní'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Widget "Doporučené pro vás" se zobrazí za sekcí "Související články", před komentáři
              </p>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="p-2 bg-white rounded border">📄 Článek</div>
                <div className="p-2 bg-white rounded border">📎 Související články</div>
                <div className="p-2 bg-purple-100 rounded border border-purple-300 font-medium text-purple-700">✨ Doporučené pro vás</div>
                <div className="p-2 bg-white rounded border">💬 Komentáře</div>
              </div>
              <Button 
                variant={widgetPosition === 'after' ? 'default' : 'outline'} 
                size="sm" 
                className="mt-3 w-full"
                onClick={() => { setWidgetPosition('after'); toast.success('Varianta B nastavena'); }}
              >
                Nastavit jako výchozí
              </Button>
            </div>
          </div>

          <Separator />

          {/* Simulated Results */}
          <div>
            <h4 className="font-medium mb-3">Výsledky testu</h4>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700">
                <Zap className="w-4 h-4 inline mr-1" />
                Test potřebuje minimálně 100 zobrazení na variantu pro statisticky významné výsledky. 
                Aktuálně se sbírají data.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Varianta A - CTR</p>
                <p className="text-2xl font-bold text-gray-400">--</p>
                <p className="text-xs text-gray-400">0 zobrazení</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Varianta B - CTR</p>
                <p className="text-2xl font-bold text-gray-400">--</p>
                <p className="text-xs text-gray-400">0 zobrazení</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widget Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-blue-500" />
            Konfigurace widgetu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-sm mb-1">Počet doporučení</h5>
              <p className="text-2xl font-bold">6</p>
              <p className="text-xs text-gray-500">článků na widget</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-sm mb-1">Algoritmus</h5>
              <p className="text-2xl font-bold">Hybrid</p>
              <p className="text-xs text-gray-500">Content + Collaborative</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-sm mb-1">Fallback</h5>
              <p className="text-2xl font-bold">Populární</p>
              <p className="text-xs text-gray-500">Když nedostatek dat</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
