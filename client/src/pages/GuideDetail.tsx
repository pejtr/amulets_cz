import { useParams, Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuideSection from "@/components/GuideSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ShareButtons } from "@/components/ShareButtons";
import { symbolsData, stonesData, purposesData } from "@/data/guideContent";
import { useEffect } from "react";
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
const symbolNames = ["Ruka Fatimy", "Kv\u011bt \u017eivota v lotosu", "\u010c\u00ednsk\u00fd drak", "Davidova hv\u011bzda", "Strom \u017eivota", "Hv\u011bzda sjednocen\u00ed", "Kv\u011bt \u017eivota", "Metatronova krychle", "Choku Rei", "Buddha", "Jin Jang", "Horovo oko"];
const stoneNames = ["Lapis Lazuli", "Ametyst", "R\u016f\u017een\u00edn", "Tygr\u00ed oko", "K\u0159i\u0161\u0165\u00e1l", "Obsidi\u00e1n", "\u010caroit", "Turmal\u00edn"];

export default function GuideDetail() {
  const params = useParams();
  const [location] = useLocation();
  const slug = params.slug || "";
  
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
      <Header />
      <main className="flex-1">
        <article className="container py-8 md:py-16">
          <Breadcrumbs items={[
            { label: "Domů", href: "/" },
            { label: "Průvodce amulety", href: "/#pruvodce" },
            { label: content.title }
          ]} />

          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {content.title}
            </h1>

            <ShareButtons 
              url={location}
              title={content.title}
              description={content.metaDescription}
            />

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
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          {heading.replace(/\*\*/g, '')}
                        </h3>
                      )}
                      <ul className="list-none space-y-2">
                        {items.map((item, i) => {
                          const text = item.replace(/^-\s*/, '').replace(/\*\*/g, '');
                          
                          // Zkontrolujeme, jestli je to symbol nebo kámen
                          let linkElement = <span className="text-muted-foreground">{text}</span>;
                          
                          for (const symbolName of symbolNames) {
                            if (text.includes(symbolName)) {
                              const slug = nameToSlug(symbolName);
                              const parts = text.split(symbolName);
                              linkElement = (
                                <span className="text-muted-foreground">
                                  {parts[0]}
                                  <Link href={`/symbol/${slug}`} className="text-[#D4AF37] hover:underline font-semibold">
                                    {symbolName}
                                  </Link>
                                  {parts[1]}
                                </span>
                              );
                              break;
                            }
                          }
                          
                          for (const stoneName of stoneNames) {
                            if (text.includes(stoneName)) {
                              const slug = nameToSlug(stoneName);
                              const parts = text.split(stoneName);
                              linkElement = (
                                <span className="text-muted-foreground">
                                  {parts[0]}
                                  <Link href={`/kamen/${slug}`} className="text-[#D4AF37] hover:underline font-semibold">
                                    {stoneName}
                                  </Link>
                                  {parts[1]}
                                </span>
                              );
                              break;
                            }
                          }
                          
                          return (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#D4AF37] mt-1">•</span>
                              {linkElement}
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
        </article>
      </main>
      <GuideSection />
      <Footer />
    </div>
  );
}
