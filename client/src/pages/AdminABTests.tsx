import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useABTest, PREMIUM_BUTTON_TEST } from '@/contexts/ABTestContext';
import { BarChart3, TrendingUp, Users, Target, RefreshCw, Trophy } from 'lucide-react';

export default function AdminABTests() {
  const { tests, getConversions, getConversionRate, getImpressions, resetVariant } = useABTest();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Calculate stats for each variant
  const getVariantStats = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return [];

    return test.variants.map(variant => {
      const impressions = getImpressions(testId, variant.id);
      const conversions = getConversions(testId).filter(c => c.variantId === variant.id).length;
      const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;

      return {
        ...variant,
        impressions,
        conversions,
        conversionRate,
      };
    });
  };

  // Find winning variant
  const getWinningVariant = (testId: string) => {
    const stats = getVariantStats(testId);
    if (stats.length === 0) return null;

    // Need at least 100 impressions per variant for statistical significance
    const significantStats = stats.filter(s => s.impressions >= 100);
    if (significantStats.length < 2) return null;

    return significantStats.reduce((best, current) => 
      current.conversionRate > best.conversionRate ? current : best
    );
  };

  const premiumStats = getVariantStats(PREMIUM_BUTTON_TEST.id);
  const winner = getWinningVariant(PREMIUM_BUTTON_TEST.id);
  const totalImpressions = premiumStats.reduce((sum, s) => sum + s.impressions, 0);
  const totalConversions = premiumStats.reduce((sum, s) => sum + s.conversions, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-pink-500" />
              A/B Testování
            </h1>
            <p className="text-slate-600 mt-1">
              Sledujte výkon různých variant a optimalizujte konverze
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Obnovit data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-slate-600 text-sm">Celkem zobrazení</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalImpressions.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-slate-600 text-sm">Celkem konverzí</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalConversions.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-slate-600 text-sm">Průměrná konverze</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {totalImpressions > 0 ? ((totalConversions / totalImpressions) * 100).toFixed(2) : '0.00'}%
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-slate-600 text-sm">Vítězná varianta</span>
            </div>
            <p className="text-lg font-bold text-slate-800">
              {winner ? winner.name : 'Čeká na data...'}
            </p>
          </div>
        </div>

        {/* Premium Button Test */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">
              {PREMIUM_BUTTON_TEST.name}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Testování různých barev a textů pro Premium tlačítko
            </p>
          </div>

          {/* Variants Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Varianta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Náhled
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Zobrazení
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Konverze
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Konverzní poměr
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {premiumStats.map((variant, index) => {
                  const isWinner = winner?.id === variant.id;
                  const hasEnoughData = variant.impressions >= 100;

                  return (
                    <tr key={variant.id} className={isWinner ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800">{variant.name}</p>
                          <p className="text-sm text-slate-500">ID: {variant.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className={`
                            px-4 py-2 rounded-lg font-medium text-sm
                            bg-gradient-to-r ${variant.props.bgColor} ${variant.props.textColor}
                          `}
                        >
                          {variant.props.icon} {variant.props.text}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-slate-800">
                          {variant.impressions.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-slate-800">
                          {variant.conversions.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isWinner ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(variant.conversionRate * 10, 100)}%` }}
                            />
                          </div>
                          <span className={`font-bold ${isWinner ? 'text-green-600' : 'text-slate-800'}`}>
                            {variant.conversionRate.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isWinner ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <Trophy className="w-3 h-3" />
                            Vítěz
                          </span>
                        ) : hasEnoughData ? (
                          <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                            Aktivní
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                            Sbírá data ({variant.impressions}/100)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Pro statisticky významné výsledky je potřeba alespoň 100 zobrazení na variantu.
              </p>
              <button
                onClick={() => resetVariant(PREMIUM_BUTTON_TEST.id)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Resetovat mé přiřazení
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
          <h3 className="font-bold text-slate-800 mb-3">💡 Tipy pro A/B testování</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• <strong>Trpělivost:</strong> Nechte test běžet alespoň 2 týdny pro spolehlivé výsledky</li>
            <li>• <strong>Jedna změna:</strong> Testujte vždy pouze jednu proměnnou najednou</li>
            <li>• <strong>Statistická významnost:</strong> Potřebujete alespoň 100 konverzí pro spolehlivý závěr</li>
            <li>• <strong>Hormozi princip:</strong> Testujte různé value propositions, ne jen barvy</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
