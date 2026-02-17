import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Moon, Sparkles, Heart, Star, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

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
    nameKey: string;
    reasonKey: string;
    link: string;
  }[];
  rituals: string[];
}

function getMoonPhase(date: Date, t: (key: string) => string): { phase: string; emoji: string; description: string } {
  const knownNewMoon = new Date('2000-01-06').getTime();
  const lunarCycle = 29.53059 * 24 * 60 * 60 * 1000;
  
  const daysSinceNewMoon = (date.getTime() - knownNewMoon) % lunarCycle;
  const phase = daysSinceNewMoon / lunarCycle;
  
  if (phase < 0.0625 || phase >= 0.9375) {
    return { phase: t('content.lunar.phaseNew'), emoji: "🌑", description: t('content.lunar.phaseNewDesc') };
  } else if (phase < 0.1875) {
    return { phase: t('content.lunar.phaseWaxCrescent'), emoji: "🌒", description: t('content.lunar.phaseWaxCrescentDesc') };
  } else if (phase < 0.3125) {
    return { phase: t('content.lunar.phaseFirstQ'), emoji: "🌓", description: t('content.lunar.phaseFirstQDesc') };
  } else if (phase < 0.4375) {
    return { phase: t('content.lunar.phaseWaxGibbous'), emoji: "🌔", description: t('content.lunar.phaseWaxGibbousDesc') };
  } else if (phase < 0.5625) {
    return { phase: t('content.lunar.phaseFull'), emoji: "🌕", description: t('content.lunar.phaseFullDesc') };
  } else if (phase < 0.6875) {
    return { phase: t('content.lunar.phaseWanGibbous'), emoji: "🌖", description: t('content.lunar.phaseWanGibbousDesc') };
  } else if (phase < 0.8125) {
    return { phase: t('content.lunar.phaseLastQ'), emoji: "🌗", description: t('content.lunar.phaseLastQDesc') };
  } else {
    return { phase: t('content.lunar.phaseWanCrescent'), emoji: "🌘", description: t('content.lunar.phaseWanCrescentDesc') };
  }
}

function getLifePathNumber(date: Date, t: (key: string) => string): { number: number; description: string } {
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  let sum = dateStr.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  const key = `content.lunar.lifePath${sum}`;
  return {
    number: sum,
    description: t(key)
  };
}

function generateLunarProfile(birthDate: Date, t: (key: string) => string): LunarProfile {
  const moonPhaseData = getMoonPhase(birthDate, t);
  const lifePathData = getLifePathNumber(birthDate, t);
  
  return {
    birthDate,
    moonPhase: moonPhaseData.phase,
    moonPhaseEmoji: moonPhaseData.emoji,
    moonPhaseDescription: moonPhaseData.description,
    lifePathNumber: lifePathData.number,
    lifePathDescription: lifePathData.description,
    emotionalProfile: t('content.lunar.emotionalGeneric'),
    strengths: [
      t('content.lunar.strength1'),
      t('content.lunar.strength2'),
      t('content.lunar.strength3'),
    ],
    challenges: [
      t('content.lunar.challenge1'),
      t('content.lunar.challenge2'),
      t('content.lunar.challenge3'),
    ],
    recommendedProducts: [
      {
        nameKey: "content.lunar.recProduct1",
        reasonKey: "content.lunar.recReason1",
        link: "/ohorai#pyramidy"
      },
      {
        nameKey: "content.lunar.recProduct2",
        reasonKey: "content.lunar.recReason2",
        link: "/ohorai#esence"
      }
    ],
    rituals: [
      t('content.lunar.ritual1'),
      t('content.lunar.ritual2'),
      t('content.lunar.ritual3'),
    ]
  };
}

export default function LunarReading() {
  const { t } = useTranslation();
  const [birthDate, setBirthDate] = useState("");
  const [profile, setProfile] = useState<LunarProfile | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    
    const date = new Date(birthDate);
    const generatedProfile = generateLunarProfile(date, t);
    setProfile(generatedProfile);
    setShowResults(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-32 bg-gradient-to-b from-indigo-950 via-purple-950 to-violet-900 text-white overflow-hidden">
          <div className="absolute left-1/4 top-20 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-200/20 blur-3xl"></div>
          
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => {
              const size = Math.random() > 0.8 ? 'w-2 h-2' : Math.random() > 0.5 ? 'w-1.5 h-1.5' : 'w-1 h-1';
              const opacity = Math.random() > 0.5 ? 'opacity-70' : 'opacity-40';
              const duration = 2 + Math.random() * 4;
              const delay = Math.random() * 5;
              return (
                <div
                  key={i}
                  className={`absolute ${size} ${opacity} bg-white rounded-full animate-pulse`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}
          </div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-0 w-full h-32 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent blur-2xl"></div>
            <div className="absolute bottom-10 right-0 w-full h-32 bg-gradient-to-l from-transparent via-pink-300/30 to-transparent blur-2xl"></div>
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Moon className="w-24 h-24 md:w-32 md:h-32 text-yellow-200 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <Moon className="w-24 h-24 md:w-32 md:h-32 text-yellow-200" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
                {t('content.lunar.title')}
              </h1>
              
              <p className="text-xl md:text-2xl mb-6 text-purple-100 font-light">
                {t('content.lunar.subtitle')}
              </p>
              
              <p className="text-base md:text-lg text-purple-200/90 leading-relaxed max-w-2xl mx-auto">
                {t('content.lunar.heroDesc')}
              </p>
            </div>
          </div>
        </section>

        {!showResults ? (
          <section className="py-16">
            <div className="container">
              <Card className="max-w-md mx-auto p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="birthDate" className="text-lg font-semibold mb-2 block">
                      {t('content.lunar.birthDateLabel')}
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
                    {t('content.lunar.getProfile')}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    {t('content.lunar.freeNote')}
                  </p>
                </form>
              </Card>
            </div>
          </section>
        ) : profile && (
          <section className="py-16">
            <div className="container">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Moon Phase */}
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{profile.moonPhaseEmoji}</div>
                    <h2 className="text-3xl font-bold mb-2">{profile.moonPhase}</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {profile.moonPhaseDescription}
                    </p>
                  </div>
                </Card>

                {/* Life Path Number */}
                <Card className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.lifePathNumber}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{t('content.lunar.lifePathTitle')}</h3>
                      <p className="text-gray-600">{t('content.lunar.numerology')}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {profile.lifePathDescription}
                  </p>
                </Card>

                {/* Emotional Profile */}
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-pink-500" />
                    <h3 className="text-2xl font-bold">{t('content.lunar.emotionalTitle')}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {profile.emotionalProfile}
                  </p>
                </Card>

                {/* Strengths & Challenges */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <h3 className="text-xl font-bold">{t('content.lunar.strengthsTitle')}</h3>
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
                      <h3 className="text-xl font-bold">{t('content.lunar.challengesTitle')}</h3>
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

                {/* Recommended Products */}
                <Card className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <h3 className="text-2xl font-bold mb-4">{t('content.lunar.recTitle')}</h3>
                  <p className="mb-6 opacity-90">
                    {t('content.lunar.recDesc')}
                  </p>
                  <div className="space-y-4">
                    {profile.recommendedProducts.map((product, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{t(product.nameKey)}</h4>
                        <p className="text-sm opacity-90 mb-3">{t(product.reasonKey)}</p>
                        <a
                          href={product.link}
                          className="inline-block px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                          {t('content.lunar.viewProduct')}
                        </a>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Rituals */}
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{t('content.lunar.ritualsTitle')}</h3>
                  <ul className="space-y-3">
                    {profile.rituals.map((ritual, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-2xl">{profile.moonPhaseEmoji}</span>
                        <span className="text-gray-700 leading-relaxed">{ritual}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Premium CTA */}
                <Card className="p-8 text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    {t('content.lunar.premiumTitle')}
                  </h3>
                  <p className="text-lg mb-6 opacity-90">
                    {t('content.lunar.premiumDesc')}
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-gray-100"
                  >
                    {t('content.lunar.premiumBtn')}
                  </Button>
                </Card>

                {/* New Profile Button */}
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
                    {t('content.lunar.newProfile')}
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
