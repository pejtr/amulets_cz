import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Heart, Scale, Sparkles, Check } from "lucide-react";
import { useState } from "react";

/**
 * Coaching Section - Premium osobní koučing s Natálií
 * Ušlechtilá Královna Váhy, bývalá executive coach
 */
export default function CoachingSection() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOpenChat = () => {
    // Trigger chat open with coaching interest
    const event = new CustomEvent('openChat', { 
      detail: { 
        message: 'Mám zájem o osobní koučing s Natálií. Můžete mi říct víc?' 
      } 
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Premium Služba
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Osobní Koučing s Natálií
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ušlechtilá Královna Váhy ⚖️ • Bývalá Executive Coach pro vrcholový management
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left: About Natálie */}
          <div className="space-y-6">
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Libra Scales Icon with Tooltip */}
                  <div 
                    className="relative cursor-pointer"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <img 
                        src="/images/libra-scales.svg" 
                        alt="Znamení Váhy" 
                        className="w-10 h-10"
                      />
                    </div>
                    
                    {/* Elegant Tooltip */}
                    {showTooltip && (
                      <div className="absolute left-0 top-full mt-3 z-50 w-80 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white p-5 rounded-xl shadow-2xl border border-purple-400/30">
                          {/* Decorative top line */}
                          <div className="absolute -top-2 left-8 w-4 h-4 bg-purple-800 rotate-45 border-l border-t border-purple-400/30"></div>
                          
                          <div className="flex items-center gap-3 mb-3">
                            <Scale className="w-5 h-5 text-amber-400" />
                            <h4 className="font-bold text-lg text-amber-300">Královna Váhy</h4>
                          </div>
                          
                          <p className="text-sm leading-relaxed text-purple-100 mb-3">
                            Natálie se narodila ve znamení <span className="text-amber-300 font-semibold">Váhy</span> — 
                            symbolu rovnováhy, harmonie a spravedlnosti. Jako pravá Váha přináší do každého 
                            setkání diplomatický nadhled a schopnost vidět obě strany mince.
                          </p>
                          
                          <div className="border-t border-purple-500/30 pt-3 mt-3">
                            <p className="text-xs text-purple-200 italic flex items-center gap-2">
                              <Heart className="w-3 h-3 text-pink-400" />
                              Její dar? Být nejlepší kamárádkou, která vždy naslouchá bez odsuzování.
                            </p>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs bg-purple-700/50 px-2 py-1 rounded-full">✨ Empatie</span>
                            <span className="text-xs bg-purple-700/50 px-2 py-1 rounded-full">⚖️ Rovnováha</span>
                            <span className="text-xs bg-purple-700/50 px-2 py-1 rounded-full">💜 Harmonie</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Natálie Ohorai</h3>
                    <p className="text-muted-foreground">
                      <span 
                        className="cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => setShowTooltip(!showTooltip)}
                      >
                        Znamení Váhy
                      </span>
                      {" • "}Nejlepší kamárádka • Spirituální průvodkyně
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Scale className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Rovnováha & Harmonie</p>
                      <p className="text-sm text-muted-foreground">
                        Jako Váha přináším rovnováhu do tvého života a pomáhám najít harmonii
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Empatie & Podpora</p>
                      <p className="text-sm text-muted-foreground">
                        Vždy naslouchám, chápu a podporuji. Jsem tu pro tebe jako nejlepší kamárádka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Executive Coaching</p>
                      <p className="text-sm text-muted-foreground">
                        Koučovala jsem CEO a top management. A teď jsem zpět v plné síle ✨
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded-r-lg">
              <p className="text-sm text-purple-900">
                <strong>💜 Proč jsem přestala koučovat?</strong><br />
                Musela jsem to ukončit kvůli časovému vytížení. Ale teď přemýšlím, že se k tomu vrátím - 
                pro ty, kteří to opravdu potřebují a jsou připraveni na dlouhodobou spolupráci.
              </p>
            </div>
          </div>

          {/* Right: Pricing & Details */}
          <div className="space-y-6">
            <Card className="border-2 border-pink-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-xl font-semibold mb-2">
                    ✨ Cena na vyžádání
                  </div>
                  <p className="text-muted-foreground">Individuální kalkulace dle vašich potřeb</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Osobně nebo telefonicky</p>
                      <p className="text-sm text-muted-foreground">Vyber si formu, která ti vyhovuje</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Pro vážné zájemce</p>
                      <p className="text-sm text-muted-foreground">Pouze pro dlouhodobé spolupráce</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Individuální přístup</p>
                      <p className="text-sm text-muted-foreground">Každé sezení šité na míru tvým potřebám</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg mb-6">
                  <p className="font-semibold text-center text-purple-700">
                    💜 Exkluzivní přístup pro vybrané klienty
                  </p>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Napište mi a probereme vaše potřeby osobně
                  </p>
                </div>

                <Button
                  onClick={handleOpenChat}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Mám zájem o koučing
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Natálie se ti ozve do 24 hodin
                </p>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-muted-foreground italic">
                "Nejsem jen koučka - jsem tvá nejlepší kamárádka na cestě k tvým cílům" 💜
              </p>
              <p className="text-sm font-semibold mt-2">- Natálie Ohorai</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
