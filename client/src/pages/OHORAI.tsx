import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Heart, Leaf, Mountain } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function OHORAI() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('content.ohorai.metaTitle');
  }, [t]);

  const essences = [
    { nameKey: "content.ohorai.essLove", descKey: "content.ohorai.essLoveDesc", price: "590 Kč" },
    { nameKey: "content.ohorai.essProtection", descKey: "content.ohorai.essProtectionDesc", price: "590 Kč" },
    { nameKey: "content.ohorai.essProsperity", descKey: "content.ohorai.essProsperityDesc", price: "590 Kč" },
  ];

  const pyramids = [
    { nameKey: "content.ohorai.pyrLove", descKey: "content.ohorai.pyrLoveDesc", price: "1 290 Kč" },
    { nameKey: "content.ohorai.pyrProtection", descKey: "content.ohorai.pyrProtectionDesc", price: "1 290 Kč" },
    { nameKey: "content.ohorai.pyrProsperity", descKey: "content.ohorai.pyrProsperityDesc", price: "1 290 Kč" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-3xl">🪷</span>
            <span className="font-semibold text-purple-900">{t('content.ohorai.badge')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('content.ohorai.heroTitle1')}
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('content.ohorai.heroTitle2')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('content.ohorai.heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Sparkles className="mr-2 h-5 w-5" />
              {t('content.ohorai.showEssences')}
            </Button>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Mountain className="mr-2 h-5 w-5" />
              {t('content.ohorai.showPyramids')}
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('content.ohorai.storyTitle')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{t('content.ohorai.storyP1')}</p>
              <p className="text-gray-700 leading-relaxed">{t('content.ohorai.storyP2')}</p>
              <p className="text-gray-700 leading-relaxed">{t('content.ohorai.storyP3')}</p>
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

      {/* Philosophy */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('content.ohorai.philTitle')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('content.ohorai.phil1Title')}</h3>
              <p className="text-gray-600">{t('content.ohorai.phil1Desc')}</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('content.ohorai.phil2Title')}</h3>
              <p className="text-gray-600">{t('content.ohorai.phil2Desc')}</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('content.ohorai.phil3Title')}</h3>
              <p className="text-gray-600">{t('content.ohorai.phil3Desc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Essences */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('content.ohorai.essTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('content.ohorai.essSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {essences.map((essence, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-6xl">🧪</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(essence.nameKey)}</h3>
                  <p className="text-gray-600 mb-4">{t(essence.descKey)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">{essence.price}</span>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      {t('content.amen.buy')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pyramids */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('content.ohorai.pyrTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('content.ohorai.pyrSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pyramids.map((pyramid, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-6xl">🔺</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(pyramid.nameKey)}</h3>
                  <p className="text-gray-600 mb-4">{t(pyramid.descKey)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">{pyramid.price}</span>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      {t('content.amen.buy')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">{t('content.ohorai.ctaTitle')}</h2>
          <p className="text-xl mb-8 text-white/90">{t('content.ohorai.ctaDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                {t('content.ohorai.ctaChat')}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              {t('content.ohorai.ctaCall')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
