import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { setOpenGraphTags } from "@/lib/seo";

export default function AboutNatalie() {
  useEffect(() => {
    document.title = "O Natálii | Amulets.cz";
    
    setOpenGraphTags({
      title: "O Natálii Ohorai - Zakladatelka Amulets.cz",
      description: "Poznejte příběh Natálie Ohorai, zakladatelky Amulets.cz a OHORAI. Rozhovor o spiritualitě, ručně vyráběných špercích a cestě k harmonii.",
      url: "https://amulets.cz/o-nas",
      type: "website",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                O Natálii Ohorai
              </h1>
              <p className="text-lg text-muted-foreground">
                Zakladatelka Amulets.cz a OHORAI, tvůrkyně ručně vyráběných spirituálních šperků
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
                    title="Rozhovor s Natálií Ohorai"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Rozhovor pro Rostečky.cz
                  </h2>
                  <p className="text-muted-foreground">
                    Poslechněte si rozhovor s Natálií o její cestě k tvorbě spirituálních šperků, 
                    významu symboliky a o tom, jak spojuje tradiční řemeslo s moderním designem.
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
                Můj příběh
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Vítejte v mém světě spirituálních šperků a symboliky. Jsem Natálie Ohorai, 
                  zakladatelka Amulets.cz a OHORAI, a mou vášní je vytvářet ručně vyráběné 
                  šperky, které nesou hlubší význam a pomáhají lidem na jejich cestě k harmonii.
                </p>

                <p className="text-lg leading-relaxed">
                  Každý šperk, který vytvářím, je jedinečný a nese v sobě energii posvátných 
                  symbolů. Od Květu života přes Merkábu až po tradiční talismany – každý kus 
                  je vyroben s láskou a úctou k tradici.
                </p>

                <p className="text-lg leading-relaxed">
                  Kromě šperků se věnuji také orgonitu, aromaterapii a práci s drahými kameny. 
                  Věřím, že správně zvolený symbol nebo kámen může být mocným pomocníkem v každodenním životě.
                </p>

                <div className="bg-card border border-border rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    ✨ Co dělám
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">💎</span>
                      <span>Ručně vyráběné šperky s posvátnou symbolikou</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">🔮</span>
                      <span>Orgonit pyramidy pro harmonizaci energie</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">🌿</span>
                      <span>Aromaterapeutické esence a aroma šperky</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">💫</span>
                      <span>Konzultace a výklad čínského horoskopu</span>
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
                Pojďme se poznat
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Máte dotaz nebo chcete konzultaci? Ráda vám pomohu najít správný symbol nebo kámen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:776041740"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  📞 Zavolat: 776 041 740
                </a>
                <a
                  href="mailto:info@amulets.cz"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors font-semibold"
                >
                  ✉️ Napsat email
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Můžete mě také navštívit osobně v{" "}
                <a
                  href="https://www.donuterie.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Donuterie Prague
                </a>
                {" "}– showroom a výdejna OHORAI
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
