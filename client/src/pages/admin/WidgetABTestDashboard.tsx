import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Eye, MousePointer, ShoppingCart, Percent } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface VariantStats {
  variant: any;
  totalImpressions: number;
  totalInteractions: number;
  totalConversions: number;
  interactionRate: number;
  conversionRate: number;
  totalValue: number;
  avgConversionValue: number;
}

export default function WidgetABTestDashboard() {
  const [selectedWidget, setSelectedWidget] = useState<string>('hero_cta_primary');

  // Fetch widget stats
  const { data: statsData, isLoading } = trpc.widgetABTest.getWidgetStats.useQuery({
    widgetKey: selectedWidget,
  });

  // Available widgets
  const widgets = [
    { key: 'hero_cta_primary', name: 'Hero CTA - Primární tlačítko', description: 'Hlavní CTA tlačítko na homepage' },
    { key: 'hero_cta_secondary', name: 'Hero CTA - Sekundární tlačítko', description: 'OHORAI cross-promotion tlačítko' },
    { key: 'hero_cta_quiz', name: 'Hero CTA - Kvíz', description: 'Tlačítko pro kvíz na amulety' },
    { key: 'recommendation_widget', name: 'Doporučovací widget', description: 'Widget s doporučenými produkty' },
  ];

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatNumber = (value: number) => value.toLocaleString('cs-CZ');
  const formatCurrency = (value: number) => `${value.toLocaleString('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Kč`;

  const getTrendIcon = (rate1: number, rate2: number) => {
    const diff = ((rate1 - rate2) / rate2) * 100;
    if (Math.abs(diff) < 5) return <Minus className="w-4 h-4 text-gray-500" />;
    return diff > 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getWinnerBadge = (variants: VariantStats[]) => {
    if (variants.length !== 2) return null;
    const [v1, v2] = variants;
    if (v1.conversionRate > v2.conversionRate * 1.1) return 0; // v1 wins
    if (v2.conversionRate > v1.conversionRate * 1.1) return 1; // v2 wins
    return null; // no clear winner
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Widget A/B Testing Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Sledujte výkonnost různých variant UI widgetů a optimalizujte konverze
          </p>
        </div>

        {/* Widget Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Vyberte widget</CardTitle>
            <CardDescription>Zvolte widget, jehož A/B test chcete analyzovat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {widgets.map((widget) => (
                <button
                  key={widget.key}
                  onClick={() => setSelectedWidget(widget.key)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedWidget === widget.key
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <h3 className="font-semibold text-lg">{widget.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Načítám data...</p>
          </div>
        ) : statsData && statsData.variants.length > 0 ? (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statsData.variants.map((variantData: VariantStats, index: number) => {
                const winnerIndex = getWinnerBadge(statsData.variants);
                const isWinner = winnerIndex === index;
                const isControl = variantData.variant.isControl;

                return (
                  <Card key={variantData.variant.id} className={isWinner ? 'border-2 border-green-500' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {variantData.variant.name}
                            {isControl && <Badge variant="outline">Kontrola</Badge>}
                            {isWinner && <Badge className="bg-green-500">🏆 Vítěz</Badge>}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {variantData.variant.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Impressions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Zobrazení</span>
                          </div>
                          <span className="font-semibold">{formatNumber(variantData.totalImpressions)}</span>
                        </div>

                        {/* Interactions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MousePointer className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Interakce</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{formatNumber(variantData.totalInteractions)}</span>
                            <Badge variant="secondary">{formatPercent(variantData.interactionRate)}</Badge>
                          </div>
                        </div>

                        {/* Conversions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Konverze</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{formatNumber(variantData.totalConversions)}</span>
                            <Badge variant="secondary">{formatPercent(variantData.conversionRate)}</Badge>
                          </div>
                        </div>

                        {/* Total Value */}
                        {variantData.totalValue > 0 && (
                          <div className="flex items-center justify-between pt-4 border-t">
                            <span className="text-sm text-gray-600">Celková hodnota</span>
                            <span className="font-bold text-lg">{formatCurrency(variantData.totalValue)}</span>
                          </div>
                        )}

                        {/* Config Preview */}
                        <div className="pt-4 border-t">
                          <p className="text-xs text-gray-500 mb-2">Konfigurace:</p>
                          <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                            {JSON.stringify(variantData.variant.config, null, 2).slice(0, 150)}...
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Statistical Significance */}
            {statsData.significance && (
              <Card>
                <CardHeader>
                  <CardTitle>Statistická signifikance</CardTitle>
                  <CardDescription>
                    Vyhodnocení, zda je rozdíl mezi variantami statisticky významný
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">P-value</span>
                      <span className="font-semibold">{statsData.significance.pValue.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="font-semibold">{formatPercent(statsData.significance.confidence)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Statisticky významné</span>
                      <Badge className={statsData.significance.isSignificant ? 'bg-green-500' : 'bg-gray-500'}>
                        {statsData.significance.isSignificant ? 'Ano (p < 0.05)' : 'Ne'}
                      </Badge>
                    </div>
                    {statsData.significance.isSignificant && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✅ Rozdíl mezi variantami je statisticky významný. Můžete s jistotou nasadit vítěznou variantu.
                        </p>
                      </div>
                    )}
                    {!statsData.significance.isSignificant && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Rozdíl mezi variantami není statisticky významný. Doporučujeme pokračovat v testování.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Porovnání variant</CardTitle>
                <CardDescription>Vizuální srovnání klíčových metrik</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData.variants.map((v: VariantStats) => ({
                    name: v.variant.isControl ? 'Kontrola' : 'Varianta',
                    'Míra interakce': v.interactionRate * 100,
                    'Míra konverze': v.conversionRate * 100,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Procenta (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                    <Legend />
                    <Bar dataKey="Míra interakce" fill="#8b5cf6" />
                    <Bar dataKey="Míra konverze" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Žádná data pro vybraný widget</p>
              <p className="text-sm text-gray-500 mt-2">
                Začněte testovat implementací widgetu na webu
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
