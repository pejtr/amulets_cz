import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Target,
  Crown,
  Sparkles,
  Heart,
  Flame,
  RefreshCw
} from "lucide-react";

// Variant icons mapping
const variantIcons: Record<string, React.ReactNode> = {
  young_elegant: <Sparkles className="w-5 h-5 text-purple-500" />,
  young_mystic: <Crown className="w-5 h-5 text-indigo-500" />,
  current_passion: <Flame className="w-5 h-5 text-red-500" />,
  current_queen: <Heart className="w-5 h-5 text-pink-500" />,
};

// Color schemes for variants
const variantColors: Record<string, string> = {
  young_elegant: "bg-purple-100 border-purple-300 text-purple-800",
  young_mystic: "bg-indigo-100 border-indigo-300 text-indigo-800",
  current_passion: "bg-red-100 border-red-300 text-red-800",
  current_queen: "bg-pink-100 border-pink-300 text-pink-800",
};

export default function AdminChatbotAB() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch all variants
  const { data: variants, isLoading: variantsLoading, refetch: refetchVariants } = trpc.chatbotAB.getAllVariants.useQuery();

  // Fetch comparison stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.chatbotAB.getComparisonStats.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const handleRefresh = () => {
    refetchVariants();
    refetchStats();
  };

  // Calculate totals
  const totals = stats?.reduce((acc, s) => ({
    sessions: acc.sessions + Number(s.totalSessions || 0),
    messages: acc.messages + Number(s.totalMessages || 0),
    conversions: acc.conversions + Number(s.totalConversions || 0),
  }), { sessions: 0, messages: 0, conversions: 0 }) || { sessions: 0, messages: 0, conversions: 0 };

  const overallConversionRate = totals.sessions > 0 
    ? ((totals.conversions / totals.sessions) * 100).toFixed(2) 
    : "0.00";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🧪 Chatbot A/B Testing Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Porovnání 4 verzí chatbota Natálie Ohorai
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Obnovit data
          </Button>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Od:</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="ml-2 px-3 py-1.5 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Do:</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="ml-2 px-3 py-1.5 border rounded-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Celkem sessions</p>
                  <p className="text-2xl font-bold">{totals.sessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Celkem zpráv</p>
                  <p className="text-2xl font-bold">{totals.messages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Celkem konverzí</p>
                  <p className="text-2xl font-bold">{totals.conversions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Konverzní poměr</p>
                  <p className="text-2xl font-bold">{overallConversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variants Comparison */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Přehled variant</TabsTrigger>
            <TabsTrigger value="details">Detailní statistiky</TabsTrigger>
            <TabsTrigger value="variants">Konfigurace variant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variants?.map((variant) => {
                const variantStats = stats?.find(s => s.variantKey === variant.variantKey);
                const sessions = Number(variantStats?.totalSessions || 0);
                const conversions = Number(variantStats?.totalConversions || 0);
                const convRate = sessions > 0 ? ((conversions / sessions) * 100).toFixed(2) : "0.00";
                const avgDuration = Number(variantStats?.avgDuration || 0);
                const avgMessages = Number(variantStats?.avgMessages || 0);

                return (
                  <Card key={variant.id} className={`border-2 ${variantColors[variant.variantKey] || ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {variantIcons[variant.variantKey]}
                          <div>
                            <CardTitle className="text-lg">{variant.name}</CardTitle>
                            <CardDescription>{variant.targetAudience}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={variant.isActive ? "default" : "secondary"}>
                          {variant.isActive ? "Aktivní" : "Neaktivní"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <p className="text-2xl font-bold">{sessions}</p>
                          <p className="text-xs text-gray-600">Sessions</p>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{convRate}%</p>
                          <p className="text-xs text-gray-600">Konverze</p>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <p className="text-2xl font-bold">{avgMessages.toFixed(1)}</p>
                          <p className="text-xs text-gray-600">Ø zpráv</p>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <p className="text-2xl font-bold">{Math.round(avgDuration / 60)}m</p>
                          <p className="text-xs text-gray-600">Ø délka</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <img 
                          src={variant.avatarUrl || ''} 
                          alt={variant.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                        />
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {variant.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Detailní porovnání variant</CardTitle>
                <CardDescription>
                  Kompletní statistiky všech variant za vybrané období
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Varianta</th>
                        <th className="text-right py-3 px-4">Sessions</th>
                        <th className="text-right py-3 px-4">Zprávy</th>
                        <th className="text-right py-3 px-4">Ø zpráv</th>
                        <th className="text-right py-3 px-4">Ø délka</th>
                        <th className="text-right py-3 px-4">Konverze</th>
                        <th className="text-right py-3 px-4">Konv. %</th>
                        <th className="text-right py-3 px-4">Hodnota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.map((s) => (
                        <tr key={s.variantKey} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {variantIcons[s.variantKey || '']}
                              <span className="font-medium">{s.variantName}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">{s.totalSessions}</td>
                          <td className="text-right py-3 px-4">{s.totalMessages}</td>
                          <td className="text-right py-3 px-4">{Number(s.avgMessages || 0).toFixed(1)}</td>
                          <td className="text-right py-3 px-4">{Math.round(Number(s.avgDuration || 0) / 60)}m</td>
                          <td className="text-right py-3 px-4">{s.totalConversions}</td>
                          <td className="text-right py-3 px-4">
                            <Badge variant={Number(s.conversionRate) > 5 ? "default" : "secondary"}>
                              {s.conversionRate}%
                            </Badge>
                          </td>
                          <td className="text-right py-3 px-4">{s.totalConversionValue || 0} Kč</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants">
            <div className="space-y-4">
              {variants?.map((variant) => (
                <Card key={variant.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {variantIcons[variant.variantKey]}
                      <div>
                        <CardTitle>{variant.name}</CardTitle>
                        <CardDescription>
                          Klíč: {variant.variantKey} | Váha: {variant.weight}%
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={variant.avatarUrl || ''} 
                        alt={variant.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-200 shadow"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">{variant.description}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline">Cílová skupina: {variant.targetAudience}</Badge>
                          <Badge variant="outline">Barva: {variant.colorScheme}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Úvodní zpráva:</p>
                      <p className="text-sm text-gray-600 italic">"{variant.initialMessage}"</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-purple-700 mb-2">Osobnost (prompt):</p>
                      <pre className="text-xs text-purple-600 whitespace-pre-wrap font-mono">
                        {variant.personalityPrompt}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Loading states */}
        {(variantsLoading || statsLoading) && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
              <p className="mt-2 text-gray-600">Načítám data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
