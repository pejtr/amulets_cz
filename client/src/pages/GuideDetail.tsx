import { useParams, Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuideSection from "@/components/GuideSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ShareButtons } from "@/components/ShareButtons";
import { ImageLightbox } from "@/components/ImageLightbox";
import RelatedArticles from "@/components/RelatedArticles";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { symbolsData, stonesData, purposesData } from "@/data/guideContent";
import { getMixedRelatedArticles } from "@/lib/relatedArticles";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createArticleSchema, createBreadcrumbSchema } from "@/lib/schema";

// Funkce pro převod názvu na slug
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Odstranění diakritiky
    .replace(/\s+/g, "-") // Mezery na pomlčky
    .replace(/[^a-z0-9-]/g, ""); // Odstranění speciálních znaků
}

// Mapování názvů na typy URL
const symbolNames = ["Ruka Fatimy", "Květ života v lotosu", "Čínský drak", "Davidova hvězda", "Strom života", "Hvězda sjednocení", "Květ života", "Metatronova krychle", "Choku Rei", "Buddha", "Jin Jang", "Horovo oko"];
const stoneNames = ["Lapis Lazuli", "Ametyst", "Růženín", "Tygří oko", "Křišťál", "Obsidián", "Čaroit", "Turmalín"];

export default function GuideDetail() {
  const params = useParams();
  const [location] = useLocation();
  const slug = params.slug || "";
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Detekce typu z URL path
  let type = "";
  if (location.startsWith("/symbol/")) type = "symbol";
  else if (location.startsWith("/kamen/")) type = "kamen";
  else if (location.startsWith("/ucel/")) type = "ucel";

  // Najdeme správný obsah podle typu a slugu
  let content = null;
  let backLink = "/";
  let backText = "Zpět na hlavní stránku";

  if (type === "symbol") {
    content = symbolsData.find((item) => item.slug === slug);
    backLink = "/";
    backText = "Zpět na Průvodce amulety";
  } else if (type === "kamen") {
    content = stonesData.find((item) => item.slug === slug);
    backLink = "/";
    backText = "Zpět na Průvodce amulety";
  } else if (type === "ucel") {
    content = purposesData.find((item) => item.slug === slug);
    backLink = "/";
    backText = "Zpět na Průvodce amulety";
  }

  // SEO meta tagy
  useEffect(() => {
    if (content) {
      document.title = content.metaTitle;
      
      // Meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', content.metaDescription);

      // Open Graph tags
      setOpenGraphTags({
        title: content.metaTitle,
        description: content.metaDescription,
        url: `https://amulets.cz/${type}/${slug}`,
        type: "article",
        image: content.image ? `https://amulets.cz${content.image}` : "https://amulets.cz/images/amulets-og.png",
        imageWidth: "1200",
        imageHeight: "630",
      });

      // Schema.org markup
      const breadcrumbs = createBreadcrumbSchema([
        { name: "Domů", url: "https://amulets.cz/" },
        { name: "Průvodce amulety", url: "https://amulets.cz/#pruvodce" },
        { name: content.title, url: `https://amulets.cz/${type}/${slug}` },
      ]);

      const article = createArticleSchema({
        title: content.metaTitle,
        description: content.metaDescription,
        url: `https://amulets.cz/${type}/${slug}`,
        datePublished: "2025-11-28",
        dateModified: "2025-11-28",
      });

      setSchemaMarkup([breadcrumbs, article]);
    }
  }, [content, type, slug]);

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <h1 className="text-3xl font-bold mb-4">Stránka nenalezena</h1>
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
            { label: "Průvodce amulety", href: "/#pruvodce" },
            { label: content.title }
          ]} />

          <div className="max-w-6xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {content.title}
            </h1>

            {/* Obrázek pod nadpisem na mobilu */}
            {content.image && (
              <div className="lg:hidden mb-6">
                <div 
                  className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-4 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={content.image}
                    alt={content.title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <ShareButtons 
              url={location}
              title={content.title}
              description={content.metaDescription}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Levý sloupec - text */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  {content.content.split('\n\n').map((paragraph, index) => {
                    // Pokud odstavec začíná **text**, je to nadpis
                    if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                      const title = paragraph.replace(/\*\*/g, '').replace(':', '');
                      return (
                        <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                          {title}
                        </h2>
                      );
                    }
                    
                    // Pokud odstavec obsahuje seznam (začíná -)
                    if (paragraph.includes('\n-')) {
                      const lines = paragraph.split('\n');
                      const heading = lines[0];
                      const items = lines.filter(line => line.trim().startsWith('-'));
                      
                      return (
                        <div key={index} className="my-6">
                          {heading && !heading.startsWith('-') && (
                            <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
                              {heading.replace(/\*\*/g, '')}
                            </h3>
                          )}
                          <ul className="list-none space-y-3">
                            {items.map((item, i) => {
                              const text = item.replace(/^-\s*/, '').replace(/\*\*/g, '');
                              
                              // Rozdělíme text na název a popis (oddělené pomlčkou)
                              const dashIndex = text.indexOf(' - ');
                              let name = text;
                              let description = '';
                              
                              if (dashIndex > 0) {
                                name = text.substring(0, dashIndex).trim();
                                description = text.substring(dashIndex + 3).trim();
                              }
                              
                              // Zkontrolujeme, jestli je to symbol nebo kámen
                              let linkElement = null;
                              
                              for (const symbolName of symbolNames) {
                                if (name === symbolName || text.includes(symbolName)) {
                                  const slug = nameToSlug(symbolName);
                                  linkElement = (
                                    <Link href={`/symbol/${slug}`} className="text-[#D4AF37] hover:underline font-semibold">
                                      {symbolName}
                                    </Link>
                                  );
                                  break;
                                }
                              }
                              
                              if (!linkElement) {
                                for (const stoneName of stoneNames) {
                                  if (name === stoneName || text.includes(stoneName)) {
                                    const slug = nameToSlug(stoneName);
                                    linkElement = (
                                      <Link href={`/kamen/${slug}`} className="text-[#D4AF37] hover:underline font-semibold">
                                        {stoneName}
                                      </Link>
                                    );
                                    break;
                                  }
                                }
                              }
                              
                              return (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#D4AF37] mt-1.5 flex-shrink-0">•</span>
                                  <div className="flex-1">
                                    <div className="font-semibold text-foreground">
                                      {linkElement || name}
                                    </div>
                                    {description && (
                                      <div className="text-sm text-muted-foreground mt-0.5">
                                        {description}
                                      </div>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    }

                    // Normální odstavec
                    return (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph.split('**').map((part, i) => 
                          i % 2 === 0 ? part : <strong key={i} className="text-foreground font-semibold">{part}</strong>
                        )}
                      </p>
                    );
                  })}
                </div>

                <div className="mt-12 p-6 bg-accent/20 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">Objevte naše produkty</h3>
                  <p className="text-muted-foreground mb-4">
                    Prozkoumejte naši nabídku ručně vyráběných orgonitových pyramid a aromaterapeutických esencí.
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

              {/* Pravý sloupec - obrázek (pouze desktop) */}
              {content.image && (
                <div className="hidden lg:block lg:col-span-1">
                  <div 
                    className="sticky top-8 rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-4 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
      <RelatedArticles articles={getMixedRelatedArticles(params.slug || '', 'guide', 3)} />
      <GuideSection />
      <Footer />

      {/* Lightbox pro zvětšení obrázku */}
      {content.image && (
        <ImageLightbox
          src={content.image}
          alt={content.title}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
