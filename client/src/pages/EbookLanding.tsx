import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, Heart, Sparkles, Star, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useTranslation } from "react-i18next";

export default function EbookLanding() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const downloadMutation = trpc.ebook.requestDownload.useMutation({
    onSuccess: (data) => {
      setDownloadUrl(data.downloadUrl);
      toast.success(t('content.ebook.successToast'));
      
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: '7 Steps to Balance E-book',
          content_category: 'Lead Magnet',
          value: 0,
          currency: 'CZK'
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || t('content.ebook.errorToast'));
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error(t('content.ebook.fillAll'));
      return;
    }

    setIsSubmitting(true);
    
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
              <CardTitle className="text-3xl">{t('content.ebook.thankYou')}</CardTitle>
              <CardDescription className="text-lg">
                {t('content.ebook.sentToEmail')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                {t('content.ebook.checkInbox', { email })}
              </p>
              
              <Button size="lg" asChild className="w-full">
                <a href={downloadUrl} download>
                  <Download className="mr-2 h-5 w-5" />
                  {t('content.ebook.downloadNow')}
                </a>
              </Button>

              <div className="pt-6 border-t">
                <h3 className="font-semibold text-lg mb-3">{t('content.ebook.whatsNext')}</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3">
                    <Heart className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>{t('content.ebook.next1Title')}</strong> - {t('content.ebook.next1Desc')}
                      {" "}<a href="/pruvod" className="text-primary hover:underline">{t('content.ebook.next1Link')}</a>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>{t('content.ebook.next2Title')}</strong> - {t('content.ebook.next2Desc')}
                      {" "}<a href="/kviz" className="text-primary hover:underline">{t('content.ebook.next2Link')}</a>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>{t('content.ebook.next3Title')}</strong> - {t('content.ebook.next3Desc')}
                      {" "}<a href="/o-nas" className="text-primary hover:underline">{t('content.ebook.next3Link')}</a>
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

  const benefits = [
    t('content.ebook.benefit1'),
    t('content.ebook.benefit2'),
    t('content.ebook.benefit3'),
    t('content.ebook.benefit4'),
    t('content.ebook.benefit5'),
    t('content.ebook.benefit6'),
    t('content.ebook.benefit7'),
  ];

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
              {t('content.ebook.freeBadge')}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t('content.ebook.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground">
              {t('content.ebook.subtitle')}
            </p>

            <div className="flex items-center gap-2 text-amber-600">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="ml-2 text-sm font-medium">{t('content.ebook.rating')}</span>
            </div>

            {/* Benefits */}
            <div className="space-y-4 pt-4">
              <h3 className="font-semibold text-lg">{t('content.ebook.benefitsTitle')}</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Author */}
            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">{t('content.ebook.author')}:</p>
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
                    {t('content.ebook.authorRole')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">{t('content.ebook.formTitle')}</CardTitle>
              <CardDescription>
                {t('content.ebook.formDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('content.ebook.nameLabel')}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('content.ebook.namePlaceholder')}
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
                    placeholder={t('content.ebook.emailPlaceholder')}
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
                    <>{t('content.ebook.submitting')}</>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      {t('content.ebook.submitBtn')}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t('content.ebook.privacy')}
                </p>
              </form>

              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <p className="text-sm font-medium text-center">{t('content.ebook.socialProof')}</p>
                <div className="space-y-3">
                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-purple-300 pl-3">
                    {t('content.ebook.testimonial1')}
                    <footer className="text-xs mt-1 not-italic">— Petra K.</footer>
                  </blockquote>
                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-pink-300 pl-3">
                    {t('content.ebook.testimonial2')}
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
          <p>© 2026 {APP_TITLE} | {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
