import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { RefreshCw, TrendingUp, Users, Target, Zap, BarChart3, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AdminABTesting() {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Get optimization status
  const { data: optimizationStatus, isLoading, refetch } = trpc.chatbotAB.getOptimizationStatus.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Auto-optimize mutation
  const autoOptimizeMutation = trpc.chatbotAB.autoOptimize.useMutation({
    onSuccess: (result) => {
      if (result.optimized) {
        toast.success(`Optimalizace dokončena! ${result.reason}`);
      } else {
        toast.info(result.reason);
      }
      refetch();
    },
    onError: (error) => {
      toast.error(`Chyba při optimalizaci: ${error.message}`);
    },
  });

  // Get all variants for detailed view
  const { data: allVariants } = trpc.chatbotAB.getAllVariants.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">🔒 Přístup odepřen</CardTitle>
            <CardDescription className="text-center">
              Pro přístup k A/B testing dashboardu se musíte přihlásit.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">🔒 Pouze pro administrátory</CardTitle>
            <CardDescription className="text-center">
              Tento dashboard je dostupný pouze pro administrátory.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalConversions = optimizationStatus?.totalConversions || 0;
  const conversionsNeeded = optimizationStatus?.conversionsNeeded || 100;
  const isOptimized = optimizationStatus?.isOptimized || false;
  const variants = optimizationStatus?.variants || [];

  // Find best variant
  const bestVariant = variants.length > 0 
    ? variants.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                A/B Testing Dashboard
              </h1>
              <p className="text-gray-600">Chatbot persona optimization</p>
            </div>
          </div>
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Obnovit
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Celkem konverzí</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Target className="h-6 w-6 text-purple-600" />
                {totalConversions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(totalConversions / 100) * 100} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {conversionsNeeded > 0 ? `Zbývá ${conversionsNeeded} do optimalizace` : 'Připraveno k optimalizaci'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Aktivní varianty</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                {variants.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Phoebe, Piper, Prue (Síla Tří)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Nejlepší varianta</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                {bestVariant?.name || '-'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                {bestVariant ? `${bestVariant.conversionRate.toFixed(2)}% CR` : 'Čekám na data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Status optimalizace</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Zap className={`h-6 w-6 ${isOptimized ? 'text-amber-500' : 'text-gray-400'}`} />
                {isOptimized ? 'Aktivní' : 'Čeká'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isOptimized ? 'default' : 'secondary'}>
                {isOptimized ? 'Multi-Armed Bandit' : 'Equal Split'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Variants Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detailní přehled variant
            </CardTitle>
            <CardDescription>
              Konverzní poměry a rozdělení traffic pro každou personu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {variants.map((variant) => {
                const isBest = bestVariant?.variantId === variant.variantId;
                return (
                  <div key={variant.variantId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {variant.variantKey === 'phoebe' ? '🔥' : 
                           variant.variantKey === 'piper' ? '👑' : 
                           variant.variantKey === 'prue' ? '⚡' : '✨'}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{variant.name}</span>
                            {isBest && (
                              <Badge variant="default" className="bg-green-500">
                                Nejlepší
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {variant.variantKey === 'phoebe' ? 'Empatická, vizionářka' : 
                             variant.variantKey === 'piper' ? 'Moudrá, starostlivá' : 
                             variant.variantKey === 'prue' ? 'Silná vůdkyně' : 'Mystická'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {variant.conversionRate.toFixed(2)}% CR
                        </div>
                        <div className="text-sm text-gray-500">
                          {variant.totalConversions} / {variant.totalSessions} sessions
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress 
                          value={variant.conversionRate} 
                          className={`h-3 ${isBest ? '[&>div]:bg-green-500' : ''}`}
                        />
                      </div>
                      <div className="w-24 text-right">
                        <Badge variant="outline">
                          {variant.currentWeight}% traffic
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Manuální akce</CardTitle>
            <CardDescription>
              Spusťte optimalizaci manuálně nebo upravte nastavení
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={() => autoOptimizeMutation.mutate()}
              disabled={autoOptimizeMutation.isPending || conversionsNeeded > 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {autoOptimizeMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimalizuji...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Spustit optimalizaci
                </>
              )}
            </Button>
            
            {conversionsNeeded > 0 && (
              <p className="text-sm text-gray-500 flex items-center">
                ⚠️ Potřebujete ještě {conversionsNeeded} konverzí pro spuštění optimalizace
              </p>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">💡 Jak funguje Multi-Armed Bandit</CardTitle>
          </CardHeader>
          <CardContent className="text-purple-700 space-y-2">
            <p>
              <strong>Exploit:</strong> Po dosažení 100 konverzí automaticky zvýšíme traffic na nejlepší variantu na 50%.
            </p>
            <p>
              <strong>Explore:</strong> Zbylých 50% traffic je rozděleno mezi ostatní varianty pro kontinuální testování.
            </p>
            <p>
              <strong>Výsledek:</strong> Maximalizujeme konverze a zároveň stále hledáme lepší řešení.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
