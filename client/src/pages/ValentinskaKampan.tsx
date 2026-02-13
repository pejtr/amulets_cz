import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Gift, Star } from "lucide-react";
import { Link } from "wouter";

// Love amulets configuration
const LOVE_AMULETS = [
  {
    id: 1,
    name: "Růženín - Kámen lásky",
    emoji: "💗",
    description: "Otevírá srdce pro lásku a harmonii. Posiluje sebepřijetí a přitahuje romantické vztahy.",
    benefits: ["Přitahuje lásku", "Léčí zlomené srdce", "Posiluje sebevědomí"],
    price: "399 Kč",
    link: "/kamen/ruzenin",
    color: "from-pink-400 to-rose-400"
  },
  {
    id: 2,
    name: "Symbol Srdce",
    emoji: "❤️",
    description: "Univerzální symbol lásky a oddanosti. Chrání vztahy a posiluje emocionální pouta.",
    benefits: ["Chrání vztahy", "Posiluje oddanost", "Harmonizuje emoce"],
    price: "499 Kč",
    link: "/symbol/srdce",
    color: "from-red-400 to-pink-400"
  },
  {
    id: 3,
    name: "Květ života",
    emoji: "🌸",
    description: "Posvátný symbol harmonie a rovnováhy. Přitahuje lásku a duchovní spojení.",
    benefits: ["Duchovní spojení", "Harmonie v lásce", "Energetická ochrana"],
    price: "549 Kč",
    link: "/symbol/kvet-zivota",
    color: "from-purple-400 to-pink-400"
  },
  {
    id: 4,
    name: "Granát - Kámen vášně",
    emoji: "🔴",
    description: "Probouzí vášeň a touhu. Posiluje intimitu a přitahuje romantickou lásku.",
    benefits: ["Probouzí vášeň", "Posiluje intimitu", "Přitahuje partnera"],
    price: "449 Kč",
    link: "/kamen/granat",
    color: "from-red-600 to-rose-500"
  },
  {
    id: 5,
    name: "Andělská esence Láska",
    emoji: "👼",
    description: "100% čistá aromaterapeutická esence pro přitažení lásky a harmonie.",
    benefits: ["Přitahuje lásku", "Harmonizuje vztahy", "Otevírá srdce"],
    price: "299 Kč",
    link: "/aromaterapie/laska",
    color: "from-pink-300 to-purple-300"
  },
  {
    id: 6,
    name: "Orgonitová pyramida Růženín",
    emoji: "🔺",
    description: "Kombinace orgonitu a růženínu pro maximální energii lásky v domácnosti.",
    benefits: ["Čistí energii", "Harmonizuje prostor", "Přitahuje lásku"],
    price: "899 Kč",
    link: "/pyramidy/ruzenin",
    color: "from-pink-500 to-purple-500"
  },
];

// Zodiac compatibility tips
const ZODIAC_LOVE_TIPS = [
  { sign: "Beran", emoji: "♈", tip: "Růženín vám pomůže zklidnit vaši ohnivou povahu a otevřít srdce." },
  { sign: "Býk", emoji: "♉", tip: "Granát posílí vaši smyslnost a přitáhne stabilní vztah." },
  { sign: "Blíženci", emoji: "♊", tip: "Květ života harmonizuje vaše dvě stránky a přitahuje komunikativního partnera." },
  { sign: "Rak", emoji: "♋", tip: "Růženín léčí staré rány a otevírá vás pro novou lásku." },
  { sign: "Lev", emoji: "♌", tip: "Symbol srdce posiluje vaši velkorysost a přitahuje oddaného partnera." },
  { sign: "Panna", emoji: "♍", tip: "Andělská esence vám pomůže uvolnit kontrolu a otevřít se lásce." },
  { sign: "Váhy", emoji: "♎", tip: "Květ života podporuje vaši přirozenou harmonii ve vztazích." },
  { sign: "Štír", emoji: "♏", tip: "Granát probouzí vaši vášeň a přitahuje intenzivní vztah." },
  { sign: "Střelec", emoji: "♐", tip: "Růženín vás uzemní a pomůže najít lásku blízko domova." },
  { sign: "Kozoroh", emoji: "♑", tip: "Symbol srdce vás naučí vyjadřovat emoce a otevřít se." },
  { sign: "Vodnář", emoji: "♒", tip: "Květ života spojuje vaši duchovno s fyzickou láskou." },
  { sign: "Ryby", emoji: "♓", tip: "Růženín chrání vaše citlivé srdce a přitahuje pravou lásku." },
];

export default function ValentinskaKampan() {
  useEffect(() => {
    document.title = "Valentýnská kampaň - Amulety lásky | Amulets.cz";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white py-20">
        {/* Animated hearts background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-10 left-10 animate-pulse">❤️</div>
          <div className="absolute top-20 right-20 animate-pulse delay-100">💕</div>
          <div className="absolute bottom-10 left-1/4 animate-pulse delay-200">💗</div>
          <div className="absolute bottom-20 right-1/3 animate-pulse delay-300">💖</div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center gap-3 mb-6">
              <Heart className="h-12 w-12 animate-pulse" />
              <Sparkles className="h-12 w-12" />
              <Heart className="h-12 w-12 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Valentýnská kampaň 💕
            </h1>
            <p className="text-xl md:text-2xl mb-4">
              Objevte amulety, které přitáhnou lásku do vašeho života
            </p>
            <p className="text-lg opacity-90 mb-8">
              Speciální nabídka platí do 14. února 2026
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 text-lg px-8 py-6"
                onClick={() => document.getElementById('amulety')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Heart className="mr-2 h-5 w-5" />
                Prohlédnout amulety
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => document.getElementById('znameni')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Star className="mr-2 h-5 w-5" />
                Najít svůj amulet
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 text-center bg-white/80 backdrop-blur">
            <div className="text-4xl mb-4">💗</div>
            <h3 className="text-xl font-bold mb-2">Přitáhněte lásku</h3>
            <p className="text-gray-600">Amulety otevírají vaše srdce a přitahují romantické vztahy</p>
          </Card>
          <Card className="p-6 text-center bg-white/80 backdrop-blur">
            <div className="text-4xl mb-4">🌸</div>
            <h3 className="text-xl font-bold mb-2">Harmonizujte vztahy</h3>
            <p className="text-gray-600">Posilte existující vztahy a vytvořte harmonii</p>
          </Card>
          <Card className="p-6 text-center bg-white/80 backdrop-blur">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">Léčte zlomené srdce</h3>
            <p className="text-gray-600">Uvolněte staré rány a otevřete se nové lásce</p>
          </Card>
        </div>
      </div>

      {/* Amulets Section */}
      <div id="amulety" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Amulety lásky
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vyberte si amulet, který rezonuje s vaším srdcem a přitáhne lásku do vašeho života
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOVE_AMULETS.map((amulet) => (
            <Card key={amulet.id} className="p-6 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-center mb-4">
                <div className={`inline-block p-6 rounded-full bg-gradient-to-br ${amulet.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-5xl">{amulet.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{amulet.name}</h3>
                <p className="text-gray-600 mb-4">{amulet.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                {amulet.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-600">{amulet.price}</span>
                  <Gift className="h-6 w-6 text-pink-500" />
                </div>
                <Link href={amulet.link}>
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                    <Heart className="mr-2 h-4 w-4" />
                    Zobrazit detail
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Zodiac Tips Section */}
      <div id="znameni" className="bg-gradient-to-br from-purple-100 to-pink-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Amulet podle vašeho znamení
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Každé znamení zvěrokruhu má své specifické potřeby v lásce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {ZODIAC_LOVE_TIPS.map((zodiac) => (
              <Card key={zodiac.sign} className="p-5 bg-white/90 backdrop-blur hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{zodiac.emoji}</span>
                  <h3 className="text-lg font-bold text-gray-800">{zodiac.sign}</h3>
                </div>
                <p className="text-sm text-gray-600">{zodiac.tip}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 bg-gradient-to-br from-pink-600 to-rose-600 text-white text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Darujte lásku sobě i svým blízkým
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Valentýnská kampaň platí do 14. února 2026. Objednejte ještě dnes a získejte speciální dárek zdarma!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pruvodce-amulety">
              <Button 
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 text-lg px-8 py-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Prohlédnout všechny amulety
              </Button>
            </Link>
            <Link href="/kviz">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                <Star className="mr-2 h-5 w-5" />
                Zjistit svůj symbol
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
