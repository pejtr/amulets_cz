import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Star, Sparkles, Heart, Briefcase, DollarSign, Activity, Calendar } from "lucide-react";
import { useEffect } from "react";

// Zodiac signs configuration
const ZODIAC_SIGNS = [
  { key: "beran", name: "Beran", emoji: "♈", dates: "21.3 - 20.4", element: "Oheň", color: "from-red-500 to-orange-500" },
  { key: "byk", name: "Býk", emoji: "♉", dates: "21.4 - 21.5", element: "Země", color: "from-green-600 to-emerald-600" },
  { key: "blizenci", name: "Blíženci", emoji: "♊", dates: "22.5 - 21.6", element: "Vzduch", color: "from-yellow-400 to-amber-400" },
  { key: "rak", name: "Rak", emoji: "♋", dates: "22.6 - 22.7", element: "Voda", color: "from-blue-400 to-cyan-400" },
  { key: "lev", name: "Lev", emoji: "♌", dates: "23.7 - 23.8", element: "Oheň", color: "from-orange-500 to-red-500" },
  { key: "panna", name: "Panna", emoji: "♍", dates: "24.8 - 23.9", element: "Země", color: "from-green-500 to-teal-500" },
  { key: "vahy", name: "Váhy", emoji: "♎", dates: "24.9 - 23.10", element: "Vzduch", color: "from-pink-400 to-rose-400" },
  { key: "stir", name: "Štír", emoji: "♏", dates: "24.10 - 22.11", element: "Voda", color: "from-purple-600 to-indigo-600" },
  { key: "strelec", name: "Střelec", emoji: "♐", dates: "23.11 - 21.12", element: "Oheň", color: "from-violet-500 to-purple-500" },
  { key: "kozoroh", name: "Kozoroh", emoji: "♑", dates: "22.12 - 20.1", element: "Země", color: "from-gray-600 to-slate-600" },
  { key: "vodnar", name: "Vodnář", emoji: "♒", dates: "21.1 - 19.2", element: "Vzduch", color: "from-cyan-500 to-blue-500" },
  { key: "ryby", name: "Ryby", emoji: "♓", dates: "20.2 - 20.3", element: "Voda", color: "from-indigo-400 to-purple-400" },
];

// Rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function TydenníHoroskop() {
  // Fetch weekly horoscopes
  const { data: horoscopeData, isLoading, error } = trpc.horoscope.getWeekly.useQuery({});
  const horoscopes = horoscopeData?.horoscopes || [];

  // Get current week dates
  const getWeekDates = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    
    return {
      start: monday.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' }),
      end: sunday.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  const weekDates = getWeekDates();

  // Set page title
  useEffect(() => {
    document.title = "Týdenní horoskop | Amulets.cz";
  }, []);

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center gap-2 mb-4">
                <Sparkles className="h-8 w-8" />
                <Calendar className="h-8 w-8" />
                <Sparkles className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Týdenní horoskop
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-2">
                {weekDates.start} - {weekDates.end}
              </p>
              <p className="text-sm md:text-base opacity-80">
                Objevte, co vás čeká v lásce, kariéře, financích a zdraví tento týden
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Načítám horoskopy...</p>
            </div>
          )}

          {error && (
            <Card className="p-8 text-center bg-red-50 border-red-200">
              <p className="text-red-600 font-semibold mb-2">Nepodařilo se načíst horoskopy</p>
              <p className="text-sm text-gray-600">Zkuste to prosím později</p>
            </Card>
          )}

          {!isLoading && !error && (
            <>
              {/* Zodiac Signs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ZODIAC_SIGNS.map((sign) => {
                  const horoscope = horoscopes?.find((h) => h.zodiacSign === sign.key);
                  
                  return (
                    <Link key={sign.key} href={`/tydenni-horoskop/${sign.key}`}>
                      <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                        {/* Sign Header */}
                        <div className="text-center mb-4">
                          <div className={`inline-block p-4 rounded-full bg-gradient-to-br ${sign.color} mb-3 group-hover:scale-110 transition-transform`}>
                            <span className="text-4xl">{sign.emoji}</span>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-1">{sign.name}</h2>
                          <p className="text-sm text-gray-600">{sign.dates}</p>
                          <p className="text-xs text-gray-500 mt-1">Element: {sign.element}</p>
                        </div>

                        {/* Ratings */}
                        {horoscope ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-pink-500" />
                                <span className="text-sm text-gray-700">Láska</span>
                              </div>
                              <StarRating rating={horoscope.loveRating} />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-blue-500" />
                                <span className="text-sm text-gray-700">Kariéra</span>
                              </div>
                              <StarRating rating={horoscope.careerRating} />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-gray-700">Finance</span>
                              </div>
                              <StarRating rating={horoscope.financeRating} />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-700">Zdraví</span>
                              </div>
                              <StarRating rating={horoscope.healthRating} />
                            </div>

                            {/* Overall Preview */}
                            <div className="pt-3 border-t">
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {horoscope.overallText.substring(0, 100)}...
                              </p>
                            </div>

                            {/* CTA */}
                            <Button 
                              className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              size="sm"
                            >
                              Číst celý horoskop →
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">Horoskop se připravuje...</p>
                            <Button 
                              className="w-full mt-4 bg-gradient-to-r from-gray-400 to-gray-500"
                              size="sm"
                              disabled
                            >
                              Brzy k dispozici
                            </Button>
                          </div>
                        )}
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Newsletter CTA */}
              <Card className="mt-12 p-8 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
                <div className="text-center max-w-2xl mx-auto">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Chcete horoskop každý týden do emailu?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Přihlaste se k odběru a dostávejte týdenní horoskop přímo do vaší schránky každou neděli ráno
                  </p>
                  <Link href="/tydenni-horoskop/prihlasit">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      💜 Přihlásit se k odběru
                    </Button>
                  </Link>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}
