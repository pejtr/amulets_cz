import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { symbolsData, stonesData, purposesData } from "@/data/guideContent";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function GuideDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const type = params.type || "";

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
    }
  }, [content]);

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
          <Link 
            href={backLink}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#D4AF37] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {backText}
          </Link>

          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {content.title}
            </h1>

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
                  const items = lines.filter(line => line.trim().startsWith('-'));
                  return (
                    <ul key={index} className="list-none space-y-2 my-4">
                      {items.map((item, i) => {
                        const text = item.replace(/^-\s*/, '').replace(/\*\*/g, '');
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#D4AF37] mt-1">•</span>
                            <span className="text-muted-foreground">{text}</span>
                          </li>
                        );
                      })}
                    </ul>
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
                href="/#produkty"
                className="inline-block bg-[#E85A9F] text-white px-6 py-3 rounded-md hover:bg-[#E85A9F]/90 transition-colors font-semibold"
              >
                Zobrazit produkty
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
