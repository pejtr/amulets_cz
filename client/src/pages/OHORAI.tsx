import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Heart, Leaf, Mountain } from "lucide-react";
import { Link } from "wouter";

export default function OHORAI() {
  useEffect(() => {
    document.title = "Autorská tvorba OHORAI | Amulets.cz";
  }, []);

  const essences = [
    {
      name: "Esence Lásky",
      description: "Otevírá srdce a přitahuje harmonické vztahy",
      image: "/ohorai/esence-lasky.jpg",
      price: "590 Kč",
    },
    {
      name: "Esence Ochrany",
      description: "Chrání před negativními energiemi a posiluje auru",
      image: "/ohorai/esence-ochrany.jpg",
      price: "590 Kč",
    },
    {
      name: "Esence Prosperity",
      description: "Přitahuje hojnost a finanční stabilitu",
      image: "/ohorai/esence-prosperity.jpg",
      price: "590 Kč",
    },
  ];

  const pyramids = [
    {
      name: "Orgonitová pyramida Lásky",
      description: "Harmonizuje energii v domácnosti a přitahuje lásku",
      image: "/ohorai/pyramida-lasky.jpg",
      price: "1 290 Kč",
    },
    {
      name: "Orgonitová pyramida Ochrany",
      description: "Neutralizuje elektrosmog a chrání prostor",
      image: "/ohorai/pyramida-ochrany.jpg",
      price: "1 290 Kč",
    },
    {
      name: "Orgonitová pyramida Prosperity",
      description: "Aktivuje energii hojnosti a úspěchu",
      image: "/ohorai/pyramida-prosperity.jpg",
      price: "1 290 Kč",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Hero sekce */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-3xl">🪷</span>
            <span className="font-semibold text-purple-900">Autorská tvorba OHORAI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ručně vyráběné
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              esence a pyramidy
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Každý kus je vytvořen s láskou a úmyslem přinést harmonii, ochranu a hojnost do vašeho života
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Sparkles className="mr-2 h-5 w-5" />
              Zobrazit esence
            </Button>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Mountain className="mr-2 h-5 w-5" />
              Zobrazit pyramidy
            </Button>
          </div>
        </div>
      </section>

      {/* Příběh značky */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Příběh značky OHORAI</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                OHORAI vzniklo z touhy přinést do světa produkty, které spojují krásu s duchovní silou. Každá esence a pyramida je vytvořena ručně s vědomým úmyslem a láskou.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Používám pouze přírodní materiály nejvyšší kvality - éterické oleje, drahé kameny, pryskyřici a měď. Při tvorbě pracuji s energií měsíčních fází a posvátnou geometrií.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Každý kus je jedinečný a nese v sobě specifický úmysl - lásku, ochranu nebo prosperitu. Mým přáním je, aby tyto produkty přinesly harmonii a pozitivní změnu do vašeho života.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 p-1">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                  <span className="text-8xl">🪷</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filozofie tvorby */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Filozofie tvorby</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Láska a úmysl</h3>
              <p className="text-gray-600">
                Každý produkt je vytvořen s čistým úmyslem a pozitivní energií. Pracuji s vědomím, že energie tvůrce se přenáší do výsledného díla.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Přírodní materiály</h3>
              <p className="text-gray-600">
                Používám pouze přírodní éterické oleje, drahé kameny a pryskyřici. Žádné syntetické přísady ani chemikálie.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Posvátná geometrie</h3>
              <p className="text-gray-600">
                Pyramidy jsou vytvořeny podle principů posvátné geometrie, která zesiluje a harmonizuje energii prostoru.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Esence */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Aromaterapeutické esence</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ručně vyráběné esence z přírodních éterických olejů a drahých kamenů.
              Každá esence dosáhla nejvyšší vibrační koherence pomocí křišťálových nástrojů a jejich vibračního působení.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {essences.map((essence, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-6xl">🧪</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{essence.name}</h3>
                  <p className="text-gray-600 mb-4">{essence.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">{essence.price}</span>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Koupit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pyramidy */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Orgonitové pyramidy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ručně vyráběné pyramidy s drahými kameny a mědí pro harmonizaci prostoru
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pyramids.map((pyramid, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-6xl">🔺</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pyramid.name}</h3>
                  <p className="text-gray-600 mb-4">{pyramid.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">{pyramid.price}</span>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Koupit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA sekce */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Máte dotaz k produktům OHORAI?</h2>
          <p className="text-xl mb-8 text-white/90">
            Ráda vám poradím s výběrem esence nebo pyramidy, která bude rezonovat s vaší energií
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Napište mi v chatu
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Zavolejte: 776 041 740
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
