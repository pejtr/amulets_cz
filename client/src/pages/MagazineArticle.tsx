import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuideSection from "@/components/GuideSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ShareButtons } from "@/components/ShareButtons";
import RelatedArticles from "@/components/RelatedArticles";
import ProductsStrip from "@/components/ProductsStrip";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { ImageLightbox } from "@/components/ImageLightbox";
import { magazineArticles } from "@/data/magazineContent";
import { tantraArticles } from "@/data/tantraArticles";

// Kombinovat všechny články
const allArticles = [...magazineArticles, ...tantraArticles];
import { useState } from "react";
import { getMixedRelatedArticles } from "@/lib/relatedArticles";
import { useEffect } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createArticleSchema, createBreadcrumbSchema, createHowToSchema } from "@/lib/schema";
import { MarkdownContent } from "@/lib/markdownParser";

export default function MagazineArticle() {
  const params = useParams();
  const slug = params.slug || "";
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const article = allArticles.find((item) => item.slug === slug);

  // SEO meta tagy
  useEffect(() => {
    if (article) {
      document.title = article.metaTitle;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', article.metaDescription);

      // Open Graph tags
      setOpenGraphTags({
        title: article.metaTitle,
        description: article.metaDescription,
        url: `https://amulets.cz/magazin/${slug}`,
        type: "article",
        image: article.image ? `https://amulets.cz${article.image}` : "https://amulets.cz/og-image.jpg",
        imageWidth: "1200",
        imageHeight: "630",
      });

      // Schema.org markup
      const breadcrumbs = createBreadcrumbSchema([
        { name: "Domů", url: "https://amulets.cz/" },
        { name: "Magazín", url: "https://amulets.cz/#magazin" },
        { name: article.title, url: `https://amulets.cz/magazin/${slug}` },
      ]);

      const articleSchema = createArticleSchema({
        title: article.metaTitle,
        description: article.metaDescription,
        url: `https://amulets.cz/magazin/${slug}`,
        datePublished: article.datePublished || "2024-11-01",
        dateModified: article.dateModified || article.datePublished || "2024-11-01",
        image: article.image,
        articleType: 'BlogPosting',
        articleSection: 'Magazín',
        keywords: [article.title, 'amulet', 'duchovní', 'energie', 'magazín']
      });

      // Check if article contains HowTo steps (cleaning/charging amulets)
      const schemas: object[] = [breadcrumbs, articleSchema];
      
      // Add HowTo schema for specific articles with step-by-step instructions
      if (slug === '10-nejsilnejsich-amuletu-pro-ochranu-2025') {
        const howToClean = createHowToSchema({
          name: 'Jak čistit a nabíjet amulety',
          description: 'Návod jak správně čistit a nabíjet amulety a ochranné symboly pro maximální účinnost.',
          image: 'https://amulets.cz/images/magazine/amulety-ochrana.webp',
          totalTime: 'PT30M',
          supply: ['Šalvěj nebo pálo santo', 'Křišťál', 'Čistá voda'],
          steps: [
            { name: 'Čištění kouřem šalvěje', text: 'Zapaľte šalvěj a nechte kouř oblévat amulet ze všech stran. Toto je nejjednodušší metoda čištění.' },
            { name: 'Čištění měsíčním světlem', text: 'Nechte amulet přes noc na okně, kde na něj dopadá měsíční světlo.' },
            { name: 'Čištění tekoucí vodou', text: 'Opláchněte amulet pod studenou tekoucí vodou.' },
            { name: 'Čištění krystalem', text: 'Položte amulet na velký křišťál nebo selenitovou desku.' },
            { name: 'Nabíjení slunečním světlem', text: 'Nechte amulet 1-2 hodiny na slunečním světle (pozor u citlivých kamenů jako ametyst).' },
            { name: 'Nabíjení měsíčním světlem', text: 'Nechte amulet celou noc na měsíčním světle, ideálně při úplněku.' },
            { name: 'Nabíjení záměrem', text: 'Držte amulet v rukou a nastavte svůj záměr - co má amulet pro vás dělat.' },
            { name: 'Nabíjení meditací', text: 'Meditujte s amuletem v rukou a vizualizujte, jak se plní energií.' }
          ]
        });
        schemas.push(howToClean);
      }
      
      if (slug === 'modry-lotos') {
        const howToUsePyramid = createHowToSchema({
          name: 'Jak používat orgonitovou pyramidu s modrým lotosem',
          description: 'Návod jak správně používat orgonitovou pyramidu s modrým lotosem pro maximální duchovní účinky.',
          image: 'https://amulets.cz/images/magazine/modry-lotos.webp',
          totalTime: 'PT20M',
          steps: [
            { name: 'Umístěte pyramidu', text: 'Umístěte pyramidu na místo, kde meditujete nebo odpočíváte.' },
            { name: 'Nastavte záměr', text: 'Při prvním použití sdělte pyramidě svůj záměr - co od ní očekáváte.' },
            { name: 'Pravidelně čistěte', text: 'Pyramidu lze čistit kouřem šalvěje nebo na měsíčním světle.' },
            { name: 'Meditujte s pyramidou', text: 'Držte pyramidu v rukou nebo ji umístěte před sebe během meditace.' }
          ]
        });
        schemas.push(howToUsePyramid);
      }

      setSchemaMarkup(schemas);
    }
  }, [article, slug]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <h1 className="text-3xl font-bold mb-4">Článek nenalezen</h1>
          <Link href="/" className="text-[#D4AF37] hover:underline">
            Zpět na hlavní stránku
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgressBar />
      <Header />
      <main className="flex-1">
        <article className="container py-8 md:py-16">
          <Breadcrumbs items={[
            { label: "Domů", href: "/" },
            { label: "Magazín", href: "/#magazin" },
            { label: article.title }
          ]} />

          {/* Responzivní layout - obrázek pod nadpisem na mobilu, vpravo na desktopu */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 max-w-6xl mx-auto">
            {/* Levý sloupec - text */}
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                <span>Magazín</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {article.title}
              </h1>

               <p className="text-lg text-muted-foreground italic">
                {article.excerpt}
              </p>

              {('externalUrl' in article && (article as any).externalUrl) && (
                <div className="mt-6">
                  <a
                    href={(article as any).externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E85A9F] text-white font-medium rounded-md hover:bg-[#E85A9F]/90 transition-colors"
                  >
                    Zobrazit produkty
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </a>
                </div>
              )}

              <div className="mt-6">
                <ShareButtons 
                  url={`/magazin/${slug}`}
                  title={article.title}
                  description={article.metaDescription}
                />
              </div>
            </div>

            {/* Pravý sloupec - obrázek (sticky na desktopu) */}
            {article.image && (
              <div className="lg:order-last order-first">
                <div className="lg:sticky lg:top-24">
                  <div 
                    className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Obsah článku s TOC, obrázky a odkazy */}
          <div className="max-w-4xl mx-auto mt-12">
            <MarkdownContent content={article.content} showTOC={true} />

            <div className="mt-16 p-8 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg border border-accent/20">
              <h3 className="text-2xl font-bold mb-4">Prozkoumejte naše produkty</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Objevte naši nabídku ručně vyráběných orgonitových pyramid s modrým lotosem a aromaterapeutických esencí z řady KORUNA.
              </p>
              <Link 
                href="/"
                onClick={() => {
                  setTimeout(() => {
                    const element = document.getElementById('produkty');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className="inline-block bg-[#E85A9F] text-white px-6 py-3 rounded-md hover:bg-[#E85A9F]/90 transition-colors font-semibold"
              >
                Zobrazit produkty
              </Link>
            </div>
          </div>
        </article>
      </main>
      <RelatedArticles articles={getMixedRelatedArticles(slug, 'magazine', 3)} />
      <GuideSection />
      <ProductsStrip />
      <Footer />
      
      {/* Lightbox pro zvětšení obrázku */}
      {article.image && (
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          src={article.image}
          alt={article.title}
        />
      )}
    </div>
  );
}
