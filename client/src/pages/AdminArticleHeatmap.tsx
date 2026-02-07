import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  BarChart3,
  Eye,
  Clock,
  MousePointerClick,
  Smartphone,
  Monitor,
  Tablet,
  Star,
  MessageCircle,
  ArrowLeft,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  Activity,
} from "lucide-react";
import { Link } from "wouter";

type SortField = "totalViews" | "avgScrollDepth" | "avgReadTime" | "completionRate" | "avgRating";

export default function AdminArticleHeatmap() {
  const { user, loading: authLoading } = useAuth();
  const [days, setDays] = useState(30);
  const [sortBy, setSortBy] = useState<SortField>("totalViews");

  const { data: heatmapData, refetch, isLoading } = trpc.articles.getEngagementHeatmap.useQuery(
    { days },
    { enabled: !!user && user.role === "admin" }
  );

  const sortedData = useMemo(() => {
    if (!heatmapData) return [];
    return [...heatmapData].sort((a: any, b: any) => {
      const aVal = Number(a[sortBy]) || 0;
      const bVal = Number(b[sortBy]) || 0;
      return bVal - aVal;
    });
  }, [heatmapData, sortBy]);

  // Calculate max values for relative heatmap coloring
  const maxValues = useMemo(() => {
    if (!sortedData.length) return { views: 1, scroll: 1, readTime: 1, completion: 1 };
    return {
      views: Math.max(...sortedData.map((d: any) => Number(d.totalViews) || 1)),
      scroll: Math.max(...sortedData.map((d: any) => Number(d.avgScrollDepth) || 1)),
      readTime: Math.max(...sortedData.map((d: any) => Number(d.avgReadTime) || 1)),
      completion: Math.max(...sortedData.map((d: any) => Number(d.completionRate) || 1)),
    };
  }, [sortedData]);

  // Color intensity based on value relative to max
  const getHeatColor = (value: number, max: number, type: "green" | "blue" | "purple" | "amber") => {
    const intensity = Math.min(value / max, 1);
    const alpha = 0.1 + intensity * 0.6;
    const colors = {
      green: `rgba(34, 197, 94, ${alpha})`,
      blue: `rgba(59, 130, 246, ${alpha})`,
      purple: `rgba(168, 85, 247, ${alpha})`,
      amber: `rgba(245, 158, 11, ${alpha})`,
    };
    return colors[type];
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 70) return "text-green-600 bg-green-50";
    if (rate >= 40) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "—";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-[#E85A9F]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Přístup odepřen</h2>
            <p className="text-muted-foreground">Tato stránka je dostupná pouze pro administrátory.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Summary stats
  const totalViews = sortedData.reduce((sum: number, d: any) => sum + (Number(d.totalViews) || 0), 0);
  const totalUniqueVisitors = sortedData.reduce((sum: number, d: any) => sum + (Number(d.uniqueVisitors) || 0), 0);
  const avgCompletion = sortedData.length
    ? Math.round(sortedData.reduce((sum: number, d: any) => sum + (Number(d.completionRate) || 0), 0) / sortedData.length)
    : 0;
  const avgScrollAll = sortedData.length
    ? Math.round(sortedData.reduce((sum: number, d: any) => sum + (Number(d.avgScrollDepth) || 0), 0) / sortedData.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container max-w-7xl py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#E85A9F]" />
                Heatmapa článků
              </h1>
              <p className="text-sm text-muted-foreground">
                Vizualizace engagementu a míry dočtení
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Posledních 7 dní</SelectItem>
                  <SelectItem value="14">Posledních 14 dní</SelectItem>
                  <SelectItem value="30">Posledních 30 dní</SelectItem>
                  <SelectItem value="90">Posledních 90 dní</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Celkem zobrazení</span>
              </div>
              <div className="text-2xl font-bold">{totalViews.toLocaleString("cs-CZ")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Unikátní čtenáři</span>
              </div>
              <div className="text-2xl font-bold">{totalUniqueVisitors.toLocaleString("cs-CZ")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-muted-foreground">Průměrná míra dočtení</span>
              </div>
              <div className="text-2xl font-bold">{avgCompletion}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Průměrný scroll</span>
              </div>
              <div className="text-2xl font-bold">{avgScrollAll}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Řadit dle:</span>
          <div className="flex gap-1 flex-wrap">
            {[
              { key: "totalViews" as SortField, label: "Zobrazení", icon: Eye },
              { key: "avgScrollDepth" as SortField, label: "Scroll", icon: TrendingUp },
              { key: "avgReadTime" as SortField, label: "Čas čtení", icon: Clock },
              { key: "completionRate" as SortField, label: "Dočtení", icon: CheckCircle },
              { key: "avgRating" as SortField, label: "Hodnocení", icon: Star },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                size="sm"
                variant={sortBy === key ? "default" : "outline"}
                className="gap-1.5 text-xs"
                onClick={() => setSortBy(key)}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Heatmap table */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E85A9F]" />
            <p className="text-sm text-muted-foreground">Načítám data...</p>
          </div>
        ) : !sortedData.length ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-1">Zatím žádná data</h3>
              <p className="text-muted-foreground">Data se zobrazí po prvních návštěvách článků.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white border-b-2 border-gray-200">
                  <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">Článek</th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Eye className="w-3 h-3" />Zobrazení</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Users className="w-3 h-3" />Unikátní</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Clock className="w-3 h-3" />Čas čtení</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Activity className="w-3 h-3" />Aktivní čas</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" />Scroll</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3" />Dočtení</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><MousePointerClick className="w-3 h-3" />Interakce</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Smartphone className="w-3 h-3" />Zařízení</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Star className="w-3 h-3" />Rating</div>
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><MessageCircle className="w-3 h-3" />Komentáře</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((article: any, index: number) => {
                  const views = Number(article.totalViews) || 0;
                  const unique = Number(article.uniqueVisitors) || 0;
                  const readTime = Number(article.avgReadTime) || 0;
                  const activeTime = Number(article.avgActiveReadTime) || 0;
                  const scroll = Number(article.avgScrollDepth) || 0;
                  const completion = Number(article.completionRate) || 0;
                  const interactions = Number(article.avgInteractions) || 0;
                  const mobile = Number(article.mobileViews) || 0;
                  const tablet = Number(article.tabletViews) || 0;
                  const desktop = Number(article.desktopViews) || 0;
                  const rating = Number(article.avgRating) || 0;
                  const totalRatings = Number(article.totalRatings) || 0;
                  const comments = Number(article.totalComments) || 0;

                  return (
                    <tr key={`${article.articleSlug}-${article.articleType}`} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      {/* Article name */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono w-5">{index + 1}.</span>
                          <div>
                            <div className="font-medium text-sm truncate max-w-[200px]" title={article.articleSlug}>
                              {article.articleSlug}
                            </div>
                            <Badge variant="outline" className="text-[10px] mt-0.5">
                              {article.articleType}
                            </Badge>
                          </div>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="p-3 text-center" style={{ backgroundColor: getHeatColor(views, maxValues.views, "blue") }}>
                        <span className="font-semibold text-sm">{views}</span>
                      </td>

                      {/* Unique visitors */}
                      <td className="p-3 text-center">
                        <span className="text-sm">{unique}</span>
                      </td>

                      {/* Read time */}
                      <td className="p-3 text-center" style={{ backgroundColor: getHeatColor(readTime, maxValues.readTime, "purple") }}>
                        <span className="text-sm">{formatTime(readTime)}</span>
                      </td>

                      {/* Active read time */}
                      <td className="p-3 text-center">
                        <span className="text-sm">{formatTime(activeTime)}</span>
                        {readTime > 0 && activeTime > 0 && (
                          <div className="text-[10px] text-muted-foreground">
                            {Math.round((activeTime / readTime) * 100)}% aktivní
                          </div>
                        )}
                      </td>

                      {/* Scroll depth */}
                      <td className="p-3 text-center" style={{ backgroundColor: getHeatColor(scroll, maxValues.scroll, "green") }}>
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all"
                              style={{ width: `${Math.min(scroll, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{scroll}%</span>
                        </div>
                      </td>

                      {/* Completion rate */}
                      <td className="p-3 text-center">
                        <Badge className={`${getCompletionColor(completion)} text-xs`}>
                          {completion}%
                        </Badge>
                      </td>

                      {/* Interactions */}
                      <td className="p-3 text-center">
                        <span className="text-sm">{interactions || "—"}</span>
                      </td>

                      {/* Device breakdown */}
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5 text-xs">
                          <span className="flex items-center gap-0.5" title="Mobil">
                            <Smartphone className="w-3 h-3 text-blue-500" />
                            {mobile}
                          </span>
                          <span className="flex items-center gap-0.5" title="Tablet">
                            <Tablet className="w-3 h-3 text-purple-500" />
                            {tablet}
                          </span>
                          <span className="flex items-center gap-0.5" title="Desktop">
                            <Monitor className="w-3 h-3 text-gray-500" />
                            {desktop}
                          </span>
                        </div>
                        {views > 0 && (
                          <div className="flex mt-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                            <div className="bg-blue-400" style={{ width: `${(mobile / views) * 100}%` }} />
                            <div className="bg-purple-400" style={{ width: `${(tablet / views) * 100}%` }} />
                            <div className="bg-gray-400" style={{ width: `${(desktop / views) * 100}%` }} />
                          </div>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="p-3 text-center">
                        {rating > 0 ? (
                          <div>
                            <div className="flex items-center justify-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">({totalRatings})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Comments */}
                      <td className="p-3 text-center">
                        {comments > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {comments}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 p-4 bg-white rounded-lg border">
          <h4 className="text-sm font-semibold mb-2">Legenda heatmapy</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(59, 130, 246, 0.4)" }} />
              <span>Zobrazení (modrá = více)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(168, 85, 247, 0.4)" }} />
              <span>Čas čtení (fialová = delší)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(34, 197, 94, 0.4)" }} />
              <span>Scroll hloubka (zelená = hlubší)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-50 text-green-600 text-[10px]">70%+</Badge>
              <Badge className="bg-amber-50 text-amber-600 text-[10px]">40-69%</Badge>
              <Badge className="bg-red-50 text-red-600 text-[10px]">&lt;40%</Badge>
              <span>Dočtení</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
