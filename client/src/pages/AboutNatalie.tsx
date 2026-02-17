import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { setOpenGraphTags } from "@/lib/seo";
import { useTranslation } from "react-i18next";

export default function AboutNatalie() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('content.about.metaTitle');
    
    setOpenGraphTags({
      title: t('content.about.metaTitle'),
      description: t('content.about.metaDesc'),
      url: "https://amulets.cz/o-nas",
      type: "website",
    });
  }, [t]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {t('content.about.title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('content.about.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-video bg-accent/20 flex items-center justify-center">
                  <iframe
                    src="https://rostecky.cz/natalie-ohorai-amulets-t45227"
                    title={t('content.about.interviewTitle')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {t('content.about.interviewTitle')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('content.about.interviewDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-accent/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                {t('content.about.storyTitle')}
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  {t('content.about.storyP1')}
                </p>

                <p className="text-lg leading-relaxed">
                  {t('content.about.storyP2')}
                </p>

                <p className="text-lg leading-relaxed">
                  {t('content.about.storyP3')}
                </p>

                <div className="bg-card border border-border rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {t('content.about.whatIDo')}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">💎</span>
                      <span>{t('content.about.do1')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">🔮</span>
                      <span>{t('content.about.do2')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">🌿</span>
                      <span>{t('content.about.do3')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">💫</span>
                      <span>{t('content.about.do4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('content.about.contactTitle')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('content.about.contactDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:776041740"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  {t('content.about.callBtn')}
                </a>
                <a
                  href="mailto:info@amulets.cz"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors font-semibold"
                >
                  {t('content.about.emailBtn')}
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                {t('content.about.visitUs')}{" "}
                <a
                  href="https://www.donuterie.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Donuterie Prague
                </a>
                {" "}{t('content.about.showroom')}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
