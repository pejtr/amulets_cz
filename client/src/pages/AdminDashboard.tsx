import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  BarChart3,
  Eye,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
  FileText,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Bot,
  Mail,
  FlaskConical,
  Activity,
  Percent,
  ScrollText,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [period, setPeriod] = useState(7);

  // Article metrics
  const { data: topArticles, isLoading: loadingArticles, refetch: refetchArticles } =
    trpc.articles.getTopArticles.useQuery(
      { days: period, limit: 5 },
      { enabled: !!user && user.role === "admin" }
    );

  const { data: heatmapData, isLoading: loadingHeatmap, refetch: refetchHeatmap } =
    trpc.articles.getEngagementHeatmap.useQuery(
      { days: period },
      { enabled: !!user && user.role === "admin" }
    );

  // Comments
  const { data: pendingComments, isLoading: loadingComments, refetch: refetchComments } =
    trpc.articles.getPendingComments.useQuery(undefined, {
      enabled: !!user && user.role === "admin",
    });

  // Headline A/B tests
  const { data: headlineResults, isLoading: loadingHeadlines, refetch: refetchHeadlines } =
    trpc.articles.getHeadlineTestResults.useQuery(undefined, {
      enabled: !!user && user.role === "admin",
    });

  // Chatbot stats
  const chatbotInput = {
    startDate: new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  };
  const { data: chatbotStats, isLoading: loadingChatbot, refetch: refetchChatbot } =
    trpc.chatbotAB.getComparisonStats.useQuery(chatbotInput, {
      enabled: !!user && user.role === "admin",
    });

  const conversionInput = {
    startDate: new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  };
  const { data: conversionStats, isLoading: loadingConversions, refetch: refetchConversions } =
    trpc.chatbotAB.getConversionStats.useQuery(conversionInput, {
      enabled: !!user && user.role === "admin",
    });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Přístup odepřen</h2>
            <p className="text-muted-foreground mb-4">Tato stránka je přístupná pouze pro administrátory.</p>
            <Link href="/">
              <Button>Zpět na hlavní stránku</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const refetchAll = () => {
    refetchArticles();
    refetchHeatmap();
    refetchComments();
    refetchHeadlines();
    refetchChatbot();
    refetchConversions();
  };

  // Compute summary metrics
  const totalViews = heatmapData?.reduce((sum: number, a: any) => sum + (a.totalViews || 0), 0) || 0;
  const totalArticles = heatmapData?.length || 0;
  const avgScrollDepth = heatmapData && heatmapData.length > 0
    ? Math.round(heatmapData.reduce((sum: number, a: any) => sum + (a.avgScrollDepth || 0), 0) / heatmapData.length)
    : 0;
  const avgReadTime = heatmapData && heatmapData.length > 0
    ? Math.round(heatmapData.reduce((sum: number, a: any) => sum + (a.avgReadTime || 0), 0) / heatmapData.length)
    : 0;
  const pendingCount = pendingComments?.length || 0;
  const activeTests = headlineResults?.filter((t: any) => t.isActive)?.length || 0;
  const totalChatSessions = chatbotStats?.reduce((sum: number, v: any) => sum + (v.totalSessions || 0), 0) || 0;
  const totalConversions = conversionStats?.reduce((sum: number, c: any) => sum + (c.count || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">← Zpět</Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Přehled klíčových metrik webu</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Period selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setPeriod(d)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      period === d ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={refetchAll}>
                <RefreshCw className="h-4 w-4 mr-1" /> Obnovit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            icon={<Eye className="h-5 w-5 text-blue-600" />}
            label="Zobrazení článků"
            value={totalViews.toLocaleString("cs-CZ")}
            subtitle={`${totalArticles} článků`}
            color="blue"
          />
          <KPICard
            icon={<ScrollText className="h-5 w-5 text-green-600" />}
            label="Průměrný scroll"
            value={`${avgScrollDepth}%`}
            subtitle={`Ø ${formatTime(avgReadTime)} čtení`}
            color="green"
          />
          <KPICard
            icon={<MessageCircle className="h-5 w-5 text-orange-600" />}
            label="Komentáře k moderaci"
            value={pendingCount.toString()}
            subtitle={pendingCount > 0 ? "Čekají na schválení" : "Vše schváleno"}
            color="orange"
            alert={pendingCount > 0}
          />
          <KPICard
            icon={<Bot className="h-5 w-5 text-purple-600" />}
            label="Chat sessions"
            value={totalChatSessions.toLocaleString("cs-CZ")}
            subtitle={`${totalConversions} konverzí`}
            color="purple"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Articles */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Nejčtenější články
                </CardTitle>
                <Link href="/admin/article-heatmap">
                  <Button variant="ghost" size="sm">
                    Heatmapa <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loadingArticles ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : topArticles && topArticles.length > 0 ? (
                <div className="space-y-3">
                  {topArticles.slice(0, 5).map((article: any, i: number) => (
                    <div key={article.slug || i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{article.slug}</p>
                          <p className="text-xs text-muted-foreground">{article.type || "article"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {article.views}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Žádná data za zvolené období</p>
              )}
            </CardContent>
          </Card>

          {/* Engagement Overview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Engagement přehled
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loadingHeatmap ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : heatmapData && heatmapData.length > 0 ? (
                <div className="space-y-3">
                  {heatmapData
                    .sort((a: any, b: any) => (b.avgScrollDepth || 0) - (a.avgScrollDepth || 0))
                    .slice(0, 5)
                    .map((article: any, i: number) => (
                      <div key={article.slug || i} className="py-2 border-b last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate max-w-[60%]">{article.slug}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{formatTime(article.avgReadTime || 0)}</span>
                            <span>{Math.round(article.completionRate || 0)}% dočtení</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, article.avgScrollDepth || 0)}%`,
                              backgroundColor: getScrollColor(article.avgScrollDepth || 0),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Žádná data za zvolené období</p>
              )}
            </CardContent>
          </Card>

          {/* Pending Comments */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-orange-600" />
                  Komentáře k moderaci
                  {pendingCount > 0 && (
                    <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>
                  )}
                </CardTitle>
                <Link href="/admin/comments">
                  <Button variant="ghost" size="sm">
                    Moderovat <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loadingComments ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : pendingComments && pendingComments.length > 0 ? (
                <div className="space-y-3">
                  {pendingComments.slice(0, 3).map((comment: any, i: number) => (
                    <div key={comment.id || i} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{comment.articleSlug}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {comment.authorName || "Anonym"}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{comment.content}</p>
                    </div>
                  ))}
                  {pendingComments.length > 3 && (
                    <p className="text-xs text-center text-muted-foreground">
                      + dalších {pendingComments.length - 3} komentářů
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Žádné komentáře k moderaci</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* A/B Tests */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-indigo-600" />
                  A/B testy titulků
                  {activeTests > 0 && (
                    <Badge className="ml-2 bg-indigo-100 text-indigo-700">{activeTests} aktivních</Badge>
                  )}
                </CardTitle>
                <Link href="/admin/headline-ab">
                  <Button variant="ghost" size="sm">
                    Detail <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loadingHeadlines ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : headlineResults && headlineResults.length > 0 ? (
                <div className="space-y-3">
                  {/* Group by article slug */}
                  {Object.entries(
                    headlineResults.reduce((acc: Record<string, any[]>, t: any) => {
                      if (!acc[t.articleSlug]) acc[t.articleSlug] = [];
                      acc[t.articleSlug].push(t);
                      return acc;
                    }, {})
                  )
                    .slice(0, 3)
                    .map(([slug, variants]: [string, any[]]) => {
                      const best = variants.reduce((a: any, b: any) => (a.ctr > b.ctr ? a : b));
                      return (
                        <div key={slug} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-xs">{slug}</Badge>
                            <span className="text-xs text-muted-foreground">{variants.length} variant</span>
                          </div>
                          <p className="text-sm font-medium truncate">{best.headline}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>CTR: {best.ctr.toFixed(1)}%</span>
                            <span>Impressions: {best.impressions}</span>
                            <span>Dočtení: {best.completionRate.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FlaskConical className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Žádné aktivní A/B testy</p>
                  <Link href="/admin/headline-ab">
                    <Button variant="outline" size="sm" className="mt-2">
                      Vytvořit test
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Rychlé akce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <QuickAction href="/admin/comments" icon={<MessageCircle className="h-5 w-5" />} label="Komentáře" count={pendingCount} />
              <QuickAction href="/admin/article-heatmap" icon={<BarChart3 className="h-5 w-5" />} label="Heatmapa" />
              <QuickAction href="/admin/headline-ab" icon={<FlaskConical className="h-5 w-5" />} label="A/B testy" />
              <QuickAction href="/admin/chatbot-ab" icon={<Bot className="h-5 w-5" />} label="Chatbot A/B" />
              <QuickAction href="/admin/tickets" icon={<FileText className="h-5 w-5" />} label="Tikety" />
              <QuickAction href="/admin/telegram" icon={<Mail className="h-5 w-5" />} label="Telegram" />
              <QuickAction href="/admin/campaigns" icon={<TrendingUp className="h-5 w-5" />} label="Kampaně" />
              <QuickAction href="/admin/ab-testing" icon={<Percent className="h-5 w-5" />} label="CTA testy" />
              <QuickAction href="/admin/horoscope" icon={<Star className="h-5 w-5" />} label="Horoskopy" />
              <QuickAction href="/admin/messages" icon={<Users className="h-5 w-5" />} label="Zprávy" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper components
function KPICard({
  icon,
  label,
  value,
  subtitle,
  color,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
  alert?: boolean;
}) {
  const bgColors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    orange: "bg-orange-50 border-orange-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <Card className={`${bgColors[color] || ""} ${alert ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}>
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  icon,
  label,
  count,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-white hover:bg-gray-50 hover:border-purple-300 transition-all cursor-pointer relative">
        {count !== undefined && count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
        <div className="text-gray-600">{icon}</div>
        <span className="text-xs font-medium text-center">{label}</span>
      </div>
    </Link>
  );
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

function getScrollColor(depth: number): string {
  if (depth >= 80) return "#22c55e"; // green
  if (depth >= 60) return "#84cc16"; // lime
  if (depth >= 40) return "#eab308"; // yellow
  if (depth >= 20) return "#f97316"; // orange
  return "#ef4444"; // red
}
