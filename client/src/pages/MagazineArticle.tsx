import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuideSection from "@/components/GuideSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ShareButtons } from "@/components/ShareButtons";
import RelatedArticles from "@/components/RelatedArticles";
import { magazineArticles } from "@/data/magazineContent";
import { getMixedRelatedArticles } from "@/lib/relatedArticles";
import { useEffect } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createArticleSchema, createBreadcrumbSchema } from "@/lib/schema";

export default function MagazineArticle() {
  const params = useParams();
  const slug = params.slug || "";

  const article = magazineArticles.find((item) => item.slug === slug);

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
        datePublished: "2025-11-28",
        dateModified: "2025-11-28",
      });

      setSchemaMarkup([breadcrumbs, articleSchema]);
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
      <Header />
      <main className="flex-1">
        <article className="container py-8 md:py-16">
          <Breadcrumbs items={[
            { label: "Domů", href: "/" },
            { label: "Magazín", href: "/#magazin" },
            { label: article.title }
          ]} />

          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
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

              <div className="mt-6">
                <ShareButtons 
                  url={`/magazin/${slug}`}
                  title={article.title}
                  description={article.metaDescription}
                />
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => {
                // Nadpis H2
                if (paragraph.startsWith('**') && paragraph.endsWith('**') && !paragraph.includes('.')) {
                  const title = paragraph.replace(/\*\*/g, '');
                  return (
                    <h2 key={index} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-foreground">
                      {title}
                    </h2>
                  );
                }
                
                // Seznam s odrážkami
                if (paragraph.includes('\n-')) {
                  const lines = paragraph.split('\n');
                  const heading = lines[0];
                  const items = lines.filter(line => line.trim().startsWith('-'));
                  
                  return (
                    <div key={index} className="my-6">
                      {heading && !heading.startsWith('-') && (
                        <p className="font-semibold text-foreground mb-3">
                          {heading.replace(/\*\*/g, '')}
                        </p>
                      )}
                      <ul className="list-none space-y-2">
                        {items.map((item, i) => {
                          const text = item.replace(/^-\s*/, '');
                          const parts = text.split('**');
                          return (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-[#D4AF37] mt-1 text-xl">•</span>
                              <span className="text-muted-foreground flex-1">
                                {parts.map((part, j) => 
                                  j % 2 === 0 ? part : <strong key={j} className="text-foreground font-semibold">{part}</strong>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }

                // Číslovaný seznam
                if (paragraph.match(/^\d+\./m)) {
                  const lines = paragraph.split('\n');
                  const items = lines.filter(line => /^\d+\./.test(line.trim()));
                  
                  return (
                    <ol key={index} className="list-none space-y-3 my-6">
                      {items.map((item, i) => {
                        const text = item.replace(/^\d+\.\s*/, '');
                        const parts = text.split('**');
                        return (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-[#D4AF37] font-bold min-w-[24px]">{i + 1}.</span>
                            <span className="text-muted-foreground flex-1">
                              {parts.map((part, j) => 
                                j % 2 === 0 ? part : <strong key={j} className="text-foreground font-semibold">{part}</strong>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  );
                }

                // Normální odstavec
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-6 text-lg">
                    {paragraph.split('**').map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="text-foreground font-semibold">{part}</strong>
                    )}
                  </p>
                );
              })}
            </div>

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
      <Footer />
    </div>
  );
}
