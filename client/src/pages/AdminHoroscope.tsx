import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function AdminHoroscope() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const generateMutation = trpc.horoscope.generate.useMutation();
  const { data: latestHoroscopeData, refetch } = trpc.horoscope.getWeekly.useQuery({});

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const result = await generateMutation.mutateAsync({});
      
      setGenerationResult({
        success: true,
        message: "Horoskopy úspěšně vygenerovány!",
        count: 12
      });

      toast.success("Horoskopy vygenerovány", {
        description: "Všech 12 znamení bylo úspěšně vygenerováno."
      });

      // Refresh the latest horoscope data
      refetch();
    } catch (error: any) {
      setGenerationResult({
        success: false,
        message: error.message || "Chyba při generování horoskopů"
      });

      toast.error("Chyba při generování", {
        description: error.message || "Zkuste to prosím znovu."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Správa týdenních horoskopů
          </h1>
          <p className="text-gray-600">
            Manuální generování horoskopů pro všech 12 znamení zvěrokruhu
          </p>
        </div>

        {/* Latest Horoscope Info */}
        {latestHoroscopeData && latestHoroscopeData.horoscopes && latestHoroscopeData.horoscopes.length > 0 && (
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Poslední vygenerované horoskopy
                </h3>
                <p className="text-sm text-blue-700">
                  Týden: {formatDate(latestHoroscopeData.horoscopes[0].weekStart)} - {formatDate(latestHoroscopeData.horoscopes[0].weekEnd)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Počet znamení: {latestHoroscopeData.horoscopes.length}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Generation Card */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Generovat nové horoskopy
            </h2>
            <p className="text-gray-600">
              Vygeneruje horoskopy pro aktuální týden pro všech 12 znamení zvěrokruhu pomocí AI
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Co se vygeneruje:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Týdenní předpověď pro každé znamení</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Hodnocení lásky, kariéry, financí a zdraví (1-5 hvězdiček)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Rady a doporučení pro každou oblast</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Šťastná čísla, barvy a dny v týdnu</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Planetární události a jejich vliv</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Upozornění:</p>
                  <p>
                    Generování může trvat 30-60 sekund. Pokud již existují horoskopy pro aktuální týden,
                    budou přepsány novými.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generuji horoskopy...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Vygenerovat horoskopy
                </>
              )}
            </Button>
          </div>

          {/* Generation Result */}
          {generationResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              generationResult.success 
                ? "bg-green-50 border border-green-200" 
                : "bg-red-50 border border-red-200"
            }`}>
              <div className="flex items-start gap-3">
                {generationResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${
                    generationResult.success ? "text-green-900" : "text-red-900"
                  }`}>
                    {generationResult.message}
                  </p>
                  {generationResult.count && (
                    <p className="text-sm text-green-700 mt-1">
                      Vygenerováno {generationResult.count} horoskopů
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="p-6 mt-6 bg-purple-50 border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3">
            Automatické generování
          </h3>
          <p className="text-sm text-purple-700 mb-2">
            Horoskopy se automaticky generují každou neděli v 6:00 CET pomocí CRON jobu.
          </p>
          <p className="text-sm text-purple-700">
            Tuto stránku použijte pouze pro manuální vygenerování (např. při prvním spuštění nebo pro opravu).
          </p>
        </Card>
      </div>
    </div>
  );
}
