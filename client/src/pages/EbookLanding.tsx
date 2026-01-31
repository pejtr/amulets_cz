import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, Heart, Sparkles, Star, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function EbookLanding() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const downloadMutation = trpc.ebook.requestDownload.useMutation({
    onSuccess: (data) => {
      setDownloadUrl(data.downloadUrl);
      toast.success("E-book byl odeslán na váš email!");
      
      // Track conversion
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: '7 Kroků k Rovnováze E-book',
          content_category: 'Lead Magnet',
          value: 0,
          currency: 'CZK'
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Něco se pokazilo. Zkuste to prosím znovu.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error("Prosím vyplňte všechna pole");
      return;
    }

    setIsSubmitting(true);
    
    // Get UTM parameters and CTA variant from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sourcePage = document.referrer || window.location.href;
    const ctaVariant = urlParams.get('cta') || undefined;

    downloadMutation.mutate({
      email,
      name,
      ebookType: "7-kroku-k-rovnovaze",
      sourcePage,
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      ctaVariant,
    });
  };

  if (downloadUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
        <div className="container py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Děkujeme!</CardTitle>
              <CardDescription className="text-lg">
                E-book "7 Kroků k Rovnováze" byl odeslán na váš email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Zkontrolujte prosím svou emailovou schránku <strong>{email}</strong>.
                Pokud email nevidíte, podívejte se do složky spam.
              </p>
              
              <Button size="lg" asChild className="w-full">
                <a href={downloadUrl} download>
                  <Download className="mr-2 h-5 w-5" />
                  Stáhnout e-book nyní
                </a>
              </Button>

              <div className="pt-6 border-t">
                <h3 className="font-semibold text-lg mb-3">Co dál?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3">
                    <Heart className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Prozkoumejte naše posvátné symboly</strong> - Najděte svůj osobní talisman
                      {" "}<a href="/pruvod" className="text-primary hover:underline">v průvodci</a>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Vyzkoušejte náš kvíz</strong> - Zjistěte, který spirituální symbol je pro vás
                      {" "}<a href="/kviz" className="text-primary hover:underline">začít kvíz</a>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Osobní koučink s Natálií</strong> - Hlubší podpora na vaší cestě
                      {" "}<a href="/o-nas" className="text-primary hover:underline">zjistit více</a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <a href="/" className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
            <span className="font-serif text-2xl text-primary">{APP_TITLE}</span>
          </a>
        </div>
      </header>

      <div className="container py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Value Proposition */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              ✨ Zdarma ke stažení
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              7 Kroků k Rovnováze
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Praktický průvodce pro nalezení harmonie mezi prací, osobním životem a duchovním růstem
            </p>

            <div className="flex items-center gap-2 text-amber-600">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="ml-2 text-sm font-medium">Hodnocení 4.9/5 od 127 čtenářů</span>
            </div>

            {/* Benefits */}
            <div className="space-y-4 pt-4">
              <h3 className="font-semibold text-lg">Co se v e-booku dozvíte:</h3>
              <ul className="space-y-3">
                {[
                  "Jak poznat sám sebe a žít autenticky podle svých hodnot",
                  "Techniky pro stanovení zdravých hranic v práci i osobním životě",
                  "Ranní a večerní rituály pro každodenní klid a energii",
                  "Strategie pro harmonickou integraci práce a života",
                  "Jak najít svou spirituální kotvu v moderním světě",
                  "Praktická cvičení pro budování podporujících vztahů",
                  "Systém pro neustálé přizpůsobování a udržení rovnováhy"
                ].map((benefit, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Author */}
            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">Autorka:</p>
              <div className="flex items-center gap-4">
                <img 
                  src="/natalie-avatar.jpg" 
                  alt="Natálie Ohorai" 
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Natalie+Ohorai&background=9333ea&color=fff&size=128";
                  }}
                />
                <div>
                  <p className="font-semibold">Natálie Ohorai</p>
                  <p className="text-sm text-muted-foreground">
                    Zakladatelka Amulets.cz & Executive Coach
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Stáhněte si e-book zdarma</CardTitle>
              <CardDescription>
                Zadejte svůj email a jméno a e-book vám okamžitě zašleme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Jméno</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Vaše jméno"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vas@email.cz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Odesílám...</>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Stáhnout e-book zdarma
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Odesláním souhlasíte s našimi{" "}
                  <a href="/ochrana-osobnich-udaju" className="underline hover:text-primary">
                    podmínkami ochrany osobních údajů
                  </a>
                  . Žádný spam, kdykoli se můžete odhlásit.
                </p>
              </form>

              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <p className="text-sm font-medium text-center">Co říkají naši čtenáři:</p>
                <div className="space-y-3">
                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-purple-300 pl-3">
                    "Konečně praktický průvodce, který skutečně funguje. Ranní rituály změnily můj život!"
                    <footer className="text-xs mt-1 not-italic">— Petra K.</footer>
                  </blockquote>
                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-pink-300 pl-3">
                    "Jako CEO jsem byl na pokraji vyhoření. Tento e-book mi pomohl najít rovnováhu."
                    <footer className="text-xs mt-1 not-italic">— Martin Š.</footer>
                  </blockquote>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 {APP_TITLE} | Všechna práva vyhrazena</p>
        </div>
      </footer>
    </div>
  );
}
