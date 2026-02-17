import { useEffect, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { symbolMapping } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { Sparkles, Share2, RotateCcw, ArrowRight } from "lucide-react";
import { track } from "@/lib/tracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function QuizResult() {
  const { t } = useTranslation();
  const [, params] = useRoute("/kviz/vysledek/:symbol");
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  const symbolSlug = params?.symbol || "";
  const result = symbolMapping[symbolSlug];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    if (result) {
      document.title = `${t('quiz.result.title')}: ${result.name} | Amulets.cz`;
      
      track.quizCompleted(symbolSlug, result.name);
      track.resultViewed(symbolSlug, result.name);
    }
  }, [result, symbolSlug, t]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('quiz.result.notFound')}</h1>
            <Button onClick={() => setLocation("/kviz")}>
              {t('quiz.result.tryAgain')}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shareText = t('quiz.result.shareText', { name: result.name });
  const shareUrl = `https://amulets.cz/kviz/vysledek/${symbolSlug}`;

  const handleShare = async () => {
    track.resultShared(symbolSlug, result.name, (navigator as any).share ? "native_share" : "clipboard");
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('quiz.result.shareTitle', { name: result.name }),
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast.success(t('quiz.result.copied'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className={`w-full max-w-3xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {/* Confetti effect */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg animate-bounce">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">{t('quiz.result.yourSymbol')}</span>
            </div>
          </div>

          {/* Result card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Symbol image */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <img
                src={`/images/symbols/${symbolSlug}.png`}
                alt={result.name}
                loading="lazy"
                className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl animate-in zoom-in-50 duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/images/symbols/${symbolSlug}.jpg`;
                }}
              />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {result.name}
              </h1>

              <p className="text-lg md:text-xl text-center text-muted-foreground mb-8">
                {result.description}
              </p>

              {/* Traits */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {result.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setLocation("/kviz")}
                  className="w-full"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  {t('quiz.result.tryAgain')}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="w-full"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  {t('quiz.result.share')}
                </Button>

                <Link href={`/symbol/${symbolSlug}`}>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {t('quiz.result.learnMore')}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              {t('quiz.result.orderCta')}
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open("https://www.ohorai.cz/", "_blank")}
            >
              {t('quiz.result.browseAmulets')}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
