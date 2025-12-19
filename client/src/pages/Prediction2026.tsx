import { useParams, Link } from "wouter";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuideSection from "@/components/GuideSection";
import { predictions2026, Prediction2026 as PredictionType } from "@/data/predictions2026";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createArticleSchema, createBreadcrumbSchema } from "@/lib/schema";
import { ChevronRight, Calendar, Heart, Briefcase, Activity, Coins } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { ImageLightbox } from "@/components/ImageLightbox";

export default function Prediction2026() {
  const { slug } = useParams<{ slug: string }>();
  const [prediction, setPrediction] = useState<PredictionType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = predictions2026.find((p) => p.slug === slug);
      setPrediction(found || null);
    }
  }, [slug]);

  useEffect(() => {
    if (prediction) {
      document.title = prediction.metaTitle;

      // Set meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", prediction.metaDescription);
      }

      // Set Open Graph tags
      setOpenGraphTags({
        title: prediction.metaTitle,
        description: prediction.metaDescription,
        url: `https://amulets.cz/predpoved-2026/${slug}`,
        type: "article",
        image: `https://amulets.cz${prediction.image}`,
        imageWidth: "1200",
        imageHeight: "630",
      });

      // Set Schema.org markup
      setSchemaMarkup([
        createArticleSchema({
          title: prediction.title,
          description: prediction.metaDescription,
          url: `https://amulets.cz/predpoved-2026/${slug}`,
          image: `https://amulets.cz${prediction.image}`,
          datePublished: "2024-12-19",
          dateModified: "2024-12-19",
        }),
        createBreadcrumbSchema([
          { name: "Domů", url: "https://amulets.cz/" },
          { name: "Čínský horoskop", url: "https://amulets.cz/cinsky-horoskop" },
          { name: "Předpovědi 2026", url: "https://amulets.cz/predpoved-2026" },
          { name: prediction.title, url: `https://amulets.cz/predpoved-2026/${slug}` },
        ]),
      ]);
    }
  }, [prediction, slug]);

  if (!prediction) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Předpověď nenalezena</h1>
            <Link href="/cinsky-horoskop" className="text-[#D4AF37] hover:underline">
              Zpět na Čínský horoskop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse markdown content
  const parseContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    lines.forEach((line, index) => {
      // Skip the first H1 as we render it separately
      if (line.startsWith("# ") && index === 0) {
        return;
      }

      // Table detection
      if (line.startsWith("|")) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        // Skip separator row
        if (!line.includes("---")) {
          const cells = line.split("|").filter((c) => c.trim());
          tableRows.push(cells.map((c) => c.trim()));
        }
        return;
      } else if (inTable) {
        // End of table
        inTable = false;
        elements.push(
          <div key={`table-${index}`} className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-pink-100 to-purple-100">
                  {tableRows[0]?.map((cell, i) => (
                    <th key={i} className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-700">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-200 px-4 py-2 text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }

      // H2 headers
      if (line.startsWith("## ")) {
        const text = line.replace("## ", "");
        let icon = null;
        if (text.includes("Láska")) icon = <Heart className="w-6 h-6 text-pink-500" />;
        else if (text.includes("Kariéra")) icon = <Briefcase className="w-6 h-6 text-blue-500" />;
        else if (text.includes("Zdraví")) icon = <Activity className="w-6 h-6 text-green-500" />;
        else if (text.includes("Šťastné")) icon = <Calendar className="w-6 h-6 text-yellow-500" />;
        else if (text.includes("Měsíční")) icon = <Calendar className="w-6 h-6 text-purple-500" />;
        else if (text.includes("Speciální")) icon = <Coins className="w-6 h-6 text-orange-500" />;

        elements.push(
          <h2 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2">
            {icon}
            {text}
          </h2>
        );
        return;
      }

      // H3 headers
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-700 mt-6 mb-3">
            {line.replace("### ", "")}
          </h3>
        );
        return;
      }

      // Bold paragraphs
      if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={index} className="font-semibold text-gray-800 my-3">
            {line.replace(/\*\*/g, "")}
          </p>
        );
        return;
      }

      // List items
      if (line.startsWith("• ") || line.startsWith("- ")) {
        const text = line.replace(/^[•-]\s*/, "");
        // Parse bold and links in list items
        const parsed = text
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#D4AF37] hover:underline">$1</a>');
        
        elements.push(
          <li key={index} className="ml-6 my-1 text-gray-600 list-disc" dangerouslySetInnerHTML={{ __html: parsed }} />
        );
        return;
      }

      // Links (➡️)
      if (line.startsWith("➡️")) {
        const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          elements.push(
            <p key={index} className="my-2">
              <Link href={match[2]} className="text-[#D4AF37] hover:underline font-medium">
                ➡️ {match[1]}
              </Link>
            </p>
          );
        }
        return;
      }

      // Regular paragraphs with markdown parsing
      if (line.trim()) {
        const parsed = line
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#D4AF37] hover:underline">$1</a>');
        
        elements.push(
          <p key={index} className="text-gray-600 my-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed }} />
        );
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgressBar />
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <nav className="bg-gray-50 py-3 px-4" aria-label="Breadcrumb">
          <div className="container max-w-4xl mx-auto">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">
                  Domů
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li>
                <Link href="/cinsky-horoskop" className="text-gray-500 hover:text-[#D4AF37]">
                  Čínský horoskop
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li className="font-semibold text-gray-700">{prediction.title}</li>
            </ol>
          </div>
        </nav>

        {/* Article content */}
        <article className="container max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {prediction.title}
              </h1>

              {/* Year badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full mb-6">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Rok Ohnivého Koně 2026</span>
              </div>

              <div className="prose prose-lg max-w-none">
                {parseContent(prediction.content)}
              </div>

              {/* Share buttons */}
              <div className="mt-8 pt-6 border-t">
                <ShareButtons
                  url={`https://amulets.cz/predpoved-2026/${slug}`}
                  title={prediction.title}
                />
              </div>
            </div>

            {/* Sidebar with image */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <div
                  className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={prediction.image}
                    alt={prediction.title}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Klikněte pro zvětšení
                </p>

                {/* Quick links */}
                <div className="mt-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Další předpovědi 2026</h3>
                  <ul className="space-y-2">
                    {predictions2026
                      .filter((p) => p.slug !== slug)
                      .slice(0, 5)
                      .map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/predpoved-2026/${p.slug}`}
                            className="text-[#D4AF37] hover:underline text-sm"
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                  <Link
                    href="/cinsky-horoskop"
                    className="block mt-4 text-center bg-[#D4AF37] text-white py-2 rounded-lg hover:bg-[#C4A030] transition-colors"
                  >
                    Všechna znamení
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Guide section */}
        <GuideSection />
      </main>
      <Footer />

      {/* Lightbox */}
      <ImageLightbox
          isOpen={lightboxOpen}
          src={prediction.image}
          alt={prediction.title}
          onClose={() => setLightboxOpen(false)}
        />
    </div>
  );
}
