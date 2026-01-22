import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from "react";

export default function AdminABTest() {
  const [days, setDays] = useState(7);
  
  // Get date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: stats, isLoading, refetch } = trpc.chatbotAB.getComparisonStats.useQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const { data: variants } = trpc.chatbotAB.getAllVariants.useQuery();

  const autoDeactivateMutation = trpc.telegram.autoDeactivateWeakVariants.useMutation({
    onSuccess: (data) => {
      if (data.deactivated.length > 0) {
        alert(`Deaktivováno ${data.deactivated.length} slabých variant:\n${data.deactivated.map(v => `- ${v.name} (${v.conversionRate.toFixed(2)}%)`).join('\n')}`);
      } else {
        alert('Všechny varianty mají dobrý výkon, žádná nebyla deaktivována.');
      }
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Calculate winner
  const winner = stats && stats.length > 0 
    ? stats.reduce((best: any, current: any) => {
        const bestRate = Number(best.conversionRate || 0);
        const currentRate = Number(current.conversionRate || 0);
        return currentRate > bestRate ? current : best;
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 A/B Test - Natálie Varianty
          </h1>
          <p className="text-gray-600">
            Porovnání výkonu různých verzí Natálie chatbota
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {[7, 14, 30].map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              onClick={() => setDays(d)}
              size="sm"
            >
              Posledních {d} dní
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => refetch()}
            size="sm"
          >
            Obnovit
          </Button>
          <Button
            variant="destructive"
            onClick={() => autoDeactivateMutation.mutate()}
            size="sm"
            disabled={autoDeactivateMutation.isPending}
            className="ml-auto"
          >
            {autoDeactivateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deaktivuji...
              </>
            ) : (
              'Auto-deaktivovat slabé'
            )}
          </Button>
        </div>

        {/* Winner Card */}
        {winner && (
          <Card className="mb-6 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Vítězná varianta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {variants?.find((v: any) => v.id === winner.variantId)?.name || winner.variantKey}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {variants?.find((v: any) => v.id === winner.variantId)?.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    {Number(winner.conversionRate || 0).toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-600">konverzní poměr</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversion Rate Chart */}
        {stats && stats.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Graf konverzních poměrů
              </CardTitle>
              <CardDescription>Vizuální porovnání výkonu jednotlivých variant</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.map((stat: any) => ({
                  name: variants?.find((v: any) => v.id === stat.variantId)?.name || stat.variantKey,
                  'Konverzní poměr (%)': Number(stat.conversionRate || 0).toFixed(2),
                  'Konverzace': Number(stat.totalSessions || 0),
                  'Konverze': Number(stat.totalConversions || 0),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Konverzní poměr (%)" stroke="#8b5cf6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Variants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats?.map((stat: any) => {
            const variant = variants?.find((v: any) => v.id === stat.variantId);
            const conversionRate = Number(stat.conversionRate || 0);
            const isWinner = winner && stat.variantId === winner.variantId;
            const winnerRate = winner ? Number(winner.conversionRate || 0) : 0;
            const diff = winnerRate > 0 ? ((conversionRate - winnerRate) / winnerRate) * 100 : 0;

            return (
              <Card key={stat.variantId} className={isWinner ? "border-2 border-yellow-400" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{variant?.name || stat.variantKey}</span>
                    {isWinner && <span className="text-yellow-500">👑</span>}
                  </CardTitle>
                  <CardDescription>{variant?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Conversion Rate */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Konverzní poměr</span>
                        {!isWinner && diff !== 0 && (
                          <span className={`text-xs flex items-center gap-1 ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {diff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(diff).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {conversionRate.toFixed(2)}%
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-600">Konverzace</p>
                        <p className="text-lg font-semibold">{stat.totalSessions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Zprávy</p>
                        <p className="text-lg font-semibold">{stat.totalMessages}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Konverze</p>
                        <p className="text-lg font-semibold">{stat.totalConversions}</p>
                      </div>
                    </div>

                    {/* Average Messages */}
                    <div className="pt-2">
                      <p className="text-xs text-gray-600">Průměr zpráv/konverzace</p>
                      <p className="text-sm font-medium">
                        {stat.totalSessions > 0 
                          ? (Number(stat.totalMessages) / Number(stat.totalSessions)).toFixed(1)
                          : '0'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        {stats && stats.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>📊 Celkový přehled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Celkem konverzací</p>
                  <p className="text-2xl font-bold">
                    {stats.reduce((sum: number, s: any) => sum + Number(s.totalSessions || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Celkem zpráv</p>
                  <p className="text-2xl font-bold">
                    {stats.reduce((sum: number, s: any) => sum + Number(s.totalMessages || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Celkem konverzí</p>
                  <p className="text-2xl font-bold">
                    {stats.reduce((sum: number, s: any) => sum + Number(s.totalConversions || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Průměrná konverze</p>
                  <p className="text-2xl font-bold">
                    {(stats.reduce((sum: number, s: any) => sum + Number(s.conversionRate || 0), 0) / stats.length).toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
