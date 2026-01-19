import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Moon, Sparkles, Heart, Star, Zap } from "lucide-react";

/**
 * Lunární Reading - Personalizovaný měsíční profil
 * Inspirováno Moon Reading programem
 */

interface LunarProfile {
  birthDate: Date;
  moonPhase: string;
  moonPhaseEmoji: string;
  moonPhaseDescription: string;
  lifePathNumber: number;
  lifePathDescription: string;
  emotionalProfile: string;
  strengths: string[];
  challenges: string[];
  recommendedProducts: {
    name: string;
    reason: string;
    link: string;
  }[];
  rituals: string[];
}

// Výpočet měsíční fáze při narození
function getMoonPhase(date: Date): { phase: string; emoji: string; description: string } {
  // Známé nové měsíce (referenční body)
  const knownNewMoon = new Date('2000-01-06').getTime();
  const lunarCycle = 29.53059 * 24 * 60 * 60 * 1000; // Lunární cyklus v ms
  
  const daysSinceNewMoon = (date.getTime() - knownNewMoon) % lunarCycle;
  const phase = daysSinceNewMoon / lunarCycle;
  
  if (phase < 0.0625 || phase >= 0.9375) {
    return {
      phase: "Nov měsíc",
      emoji: "🌑",
      description: "Narození v novém měsíci znamená nové začátky a nekonečný potenciál. Jste průkopník s přirozenou schopností začínat nové projekty a inspirovat ostatní."
    };
  } else if (phase < 0.1875) {
    return {
      phase: "Dorůstající srpek",
      emoji: "🌒",
      description: "Narození v dorůstajícím srpku vás činí optimistou s touhou růst a učit se. Máte přirozenou schopnost překonávat překážky a budovat pevné základy."
    };
  } else if (phase < 0.3125) {
    return {
      phase: "První čtvrť",
      emoji: "🌓",
      description: "Narození v první čtvrti vás činí rozhodným a akčním člověkem. Máte silnou vůli a schopnost překonávat výzvy s odhodláním."
    };
  } else if (phase < 0.4375) {
    return {
      phase: "Dorůstající měsíc",
      emoji: "🌔",
      description: "Narození v dorůstajícím měsíci vás činí perfekcionistou s touhou zdokonalovat a vylepšovat. Máte přirozenou schopnost vidět detaily a vytvářet harmonii."
    };
  } else if (phase < 0.5625) {
    return {
      phase: "Úplněk",
      emoji: "🌕",
      description: "Narození v úplňku vás činí charismatickým a emočně intenzivním člověkem. Máte silnou intuici a schopnost vidět obě strany každé situace."
    };
  } else if (phase < 0.6875) {
    return {
      phase: "Couvající měsíc",
      emoji: "🌖",
      description: "Narození v couvajícím měsíci vás činí učitelem a sdílejícím člověkem. Máte přirozenou schopnost předávat moudrost a pomáhat ostatním růst."
    };
  } else if (phase < 0.8125) {
    return {
      phase: "Poslední čtvrť",
      emoji: "🌗",
      description: "Narození v poslední čtvrti vás činí transformačním člověkem. Máte schopnost pouštět staré vzorce a vytvářet prostor pro nové."
    };
  } else {
    return {
      phase: "Couvající srpek",
      emoji: "🌘",
      description: "Narození v couvajícím srpku vás činí mystickým a intuitivním člověkem. Máte hluboké spojení s nevědomím a schopnost vidět za oponu reality."
    };
  }
}

// Výpočet životního čísla (numerologie)
function getLifePathNumber(date: Date): { number: number; description: string } {
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  let sum = dateStr.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  // Redukce na jedno číslo (kromě master numbers 11, 22, 33)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  const descriptions: { [key: number]: string } = {
    1: "Lídr a průkopník. Máte přirozenou schopnost vést ostatní a vytvářet nové cesty.",
    2: "Diplomat a mírotvůrce. Máte dar pro harmonii a spolupráci.",
    3: "Kreativní duše. Máte přirozenou schopnost vyjadřovat se a inspirovat ostatní.",
    4: "Stavitel a organizátor. Máte talent pro vytváření pevných základů.",
    5: "Svobodomyslný dobrodruh. Máte touhu po změně a nových zkušenostech.",
    6: "Pečovatel a léčitel. Máte přirozenou schopnost starat se o ostatní.",
    7: "Mystik a hledač pravdy. Máte hluboké spojení s duchovnem.",
    8: "Manifestor a podnikatel. Máte schopnost materializovat své vize.",
    9: "Humanista a učitel. Máte touhu pomáhat lidstvu jako celku.",
    11: "Master number - Duchovní messenger. Máte silnou intuici a schopnost inspirovat.",
    22: "Master number - Master builder. Máte schopnost realizovat velké vize.",
    33: "Master number - Master teacher. Máte dar pro léčení a učení na nejvyšší úrovni."
  };
  
  return {
    number: sum,
    description: descriptions[sum] || "Jedinečná duchovní cesta."
  };
}

// Generování lunárního profilu
function generateLunarProfile(birthDate: Date): LunarProfile {
  const moonPhaseData = getMoonPhase(birthDate);
  const lifePathData = getLifePathNumber(birthDate);
  
  // Emoční profil podle měsíční fáze
  const emotionalProfiles: { [key: string]: string } = {
    "Nový měsíc": "Jste introvertní a reflexivní. Potřebujete čas sami se sebou pro regeneraci.",
    "Dorůstající srpek": "Jste optimistický a energický. Milujete růst a nové příležitosti.",
    "První čtvrť": "Jste akční a rozhodný. Máte silnou vůli a nebojíte se výzev.",
    "Dorůstající měsíc": "Jste pečlivý a detailní. Milujete dokonalost a harmonii.",
    "Úplněk": "Jste emočně intenzivní a charismatický. Máte silnou intuici.",
    "Couvající měsíc": "Jste moudrý a sdílející. Milujete učit ostatní.",
    "Poslední čtvrť": "Jste transformační a odvážný. Nebojíte se změn.",
    "Couvající srpek": "Jste mystický a intuitivní. Máte hluboké duchovní spojení."
  };
  
  return {
    birthDate,
    moonPhase: moonPhaseData.phase,
    moonPhaseEmoji: moonPhaseData.emoji,
    moonPhaseDescription: moonPhaseData.description,
    lifePathNumber: lifePathData.number,
    lifePathDescription: lifePathData.description,
    emotionalProfile: emotionalProfiles[moonPhaseData.phase] || "Jedinečný emoční profil.",
    strengths: [
      "Silná intuice a spojení s měsíčními cykly",
      "Přirozená schopnost pracovat s energií",
      "Hluboké porozumění emocím"
    ],
    challenges: [
      "Citlivost na měsíční fáze",
      "Potřeba pravidelných rituálů",
      "Emoční intenzita"
    ],
    recommendedProducts: [
      {
        name: "Orgonitová pyramida - Měsíční energie",
        reason: "Harmonizuje vaši energii s měsíčními cykly",
        link: "/ohorai#pyramidy"
      },
      {
        name: "Esence - Lunární harmonie",
        reason: "Podporuje vaši intuici a emoční rovnováhu",
        link: "/ohorai#esence"
      }
    ],
    rituals: [
      "Meditace při úplňku pro uvolnění starých vzorců",
      "Zápisování záměrů při novém měsíci",
      "Měsíční koupel s esencemi pro očistu"
    ]
  };
}

export default function LunarReading() {
  const [birthDate, setBirthDate] = useState("");
  const [profile, setProfile] = useState<LunarProfile | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    
    const date = new Date(birthDate);
    const generatedProfile = generateLunarProfile(date);
    setProfile(generatedProfile);
    setShowResults(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero sekce */}
        <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
          {/* Hvězdy na pozadí */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Moon className="w-20 h-20 text-yellow-300" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Lunární Reading
              </h1>
              <p className="text-xl mb-4 opacity-90">
                Objevte svůj personalizovaný měsíční profil
              </p>
              <p className="text-lg opacity-75">
                Zjistěte, jak měsíční fáze při vašem narození ovlivňuje vaši osobnost, emoce a duchovní cestu
              </p>
            </div>
          </div>
        </section>

        {!showResults ? (
          /* Formulář */
          <section className="py-16">
            <div className="container">
              <Card className="max-w-md mx-auto p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="birthDate" className="text-lg font-semibold mb-2 block">
                      Datum narození
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="text-lg"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Získat můj lunární profil
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    Váš lunární profil je zcela zdarma a personalizovaný podle vašeho data narození
                  </p>
                </form>
              </Card>
            </div>
          </section>
        ) : profile && (
          /* Výsledky */
          <section className="py-16">
            <div className="container">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Měsíční fáze */}
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{profile.moonPhaseEmoji}</div>
                    <h2 className="text-3xl font-bold mb-2">{profile.moonPhase}</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {profile.moonPhaseDescription}
                    </p>
                  </div>
                </Card>

                {/* Životní číslo */}
                <Card className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.lifePathNumber}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Životní číslo</h3>
                      <p className="text-gray-600">Numerologie</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {profile.lifePathDescription}
                  </p>
                </Card>

                {/* Emoční profil */}
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-pink-500" />
                    <h3 className="text-2xl font-bold">Emoční profil</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {profile.emotionalProfile}
                  </p>
                </Card>

                {/* Silné stránky a výzvy */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <h3 className="text-xl font-bold">Silné stránky</h3>
                    </div>
                    <ul className="space-y-2">
                      {profile.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-6 h-6 text-orange-500" />
                      <h3 className="text-xl font-bold">Výzvy</h3>
                    </div>
                    <ul className="space-y-2">
                      {profile.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">!</span>
                          <span className="text-gray-700">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* Doporučené produkty */}
                <Card className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <h3 className="text-2xl font-bold mb-4">Doporučené produkty OHORAI</h3>
                  <p className="mb-6 opacity-90">
                    Na základě vašeho lunárního profilu jsme pro vás vybrali tyto produkty:
                  </p>
                  <div className="space-y-4">
                    {profile.recommendedProducts.map((product, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{product.name}</h4>
                        <p className="text-sm opacity-90 mb-3">{product.reason}</p>
                        <a
                          href={product.link}
                          className="inline-block px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                          Zobrazit produkt
                        </a>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Rituály */}
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Měsíční rituály pro vás</h3>
                  <ul className="space-y-3">
                    {profile.rituals.map((ritual, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-2xl">{profile.moonPhaseEmoji}</span>
                        <span className="text-gray-700 leading-relaxed">{ritual}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* CTA pro PREMIUM */}
                <Card className="p-8 text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Chcete hlubší analýzu?
                  </h3>
                  <p className="text-lg mb-6 opacity-90">
                    PREMIUM členství zahrnuje rozšířený lunární profil, měsíční předpovědi a exkluzivní rituály
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-gray-100"
                  >
                    Získat PREMIUM přístup
                  </Button>
                </Card>

                {/* Tlačítko pro nový výpočet */}
                <div className="text-center">
                  <Button
                    onClick={() => {
                      setShowResults(false);
                      setBirthDate("");
                      setProfile(null);
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Vytvořit nový profil
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
