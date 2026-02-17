import { useParams, Link } from "wouter";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuideSection from "@/components/GuideSection";
import { predictions2026, Prediction2026 as PredictionType } from "@/data/predictions2026";
import { setOpenGraphTags } from "@/lib/seo";
import { setSchemaMarkup, createArticleSchema, createBreadcrumbSchema } from "@/lib/schema";
import { ChevronRight, ChevronLeft, Calendar, Heart, Briefcase, Activity, Coins, Share2, Facebook, Twitter, Linkedin, Send, Mail } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { ImageLightbox } from "@/components/ImageLightbox";
import { SectionShareModal } from "@/components/SectionShareModal";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import InlineEmailForm from "@/components/InlineEmailForm";

interface SectionData {
  title: string;
  content: string;
}

export default function Prediction2026() {
  const { slug } = useParams<{ slug: string }>();
  const [prediction, setPrediction] = useState<PredictionType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { t } = useTranslation();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);

  // Find current prediction and calculate prev/next
  const { prevPrediction, nextPrediction } = useMemo(() => {
    const idx = predictions2026.findIndex((p) => p.slug === slug);
    return {
      prevPrediction: idx > 0 ? predictions2026[idx - 1] : predictions2026[predictions2026.length - 1],
      nextPrediction: idx < predictions2026.length - 1 ? predictions2026[idx + 1] : predictions2026[0],
    };
  }, [slug]);

  useEffect(() => {
    if (slug) {
      const found = predictions2026.find((p) => p.slug === slug);
      setPrediction(found || null);
    }
  }, [slug]);

  useEffect(() => {
    if (prediction) {
      document.title = prediction.metaTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", prediction.metaDescription);
      }

      setOpenGraphTags({
        title: prediction.metaTitle,
        description: prediction.metaDescription,
        url: `https://amulets.cz/predpoved-2026/${slug}`,
        type: "article",
        image: `https://amulets.cz${prediction.image}`,
        imageWidth: "1200",
        imageHeight: "630",
      });

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
          { name: t('content.home'), url: "https://amulets.cz/" },
          { name: t('zh.title'), url: "https://amulets.cz/cinsky-horoskop" },
          { name: t('zh.pred.predictions2026'), url: "https://amulets.cz/predpoved-2026" },
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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('content.pageNotFound')}</h1>
            <Link href="/cinsky-horoskop" className="text-[#D4AF37] hover:underline">
              {t('content.backHome')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getZodiacEmoji = (title: string) => {
    const emojiMap: Record<string, string> = {
      "Krysa": "🐀", "Bůvol": "🐂", "Tygr": "🐅", "Králík": "🐇",
      "Drak": "🐉", "Had": "🐍", "Kůň": "🐎", "Koza": "🐏",
      "Opice": "🐒", "Kohout": "🐓", "Pes": "🐕", "Prase": "🐖"
    };
    for (const [name, emoji] of Object.entries(emojiMap)) {
      if (title.includes(name)) return emoji;
    }
    return "🔮";
  };

  const getZodiacName = (title: string) => {
    const names = ["Krysa", "Bůvol", "Tygr", "Králík", "Drak", "Had", "Kůň", "Koza", "Opice", "Kohout", "Pes", "Prase"];
    for (const name of names) {
      if (title.includes(name)) return name;
    }
    return title;
  };

  // Extract sections from content
  const extractSections = (content: string): Record<string, SectionData> => {
    const sections: Record<string, SectionData> = {};
    const lines = content.split("\n");
    let currentSection = "";
    let currentContent: string[] = [];

    lines.forEach((line) => {
      if (line.startsWith("## ")) {
        if (currentSection && currentContent.length > 0) {
          sections[currentSection] = {
            title: currentSection,
            content: currentContent.join("\n"),
          };
        }
        currentSection = line.replace("## ", "").trim();
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    });

    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = {
        title: currentSection,
        content: currentContent.join("\n"),
      };
    }

    return sections;
  };

  const sections = extractSections(prediction.content);

  const handleShareSection = (sectionTitle: string) => {
    const section = sections[sectionTitle];
    if (section) {
      setSelectedSection(section);
      setShareModalOpen(true);
    }
  };

  // Parse markdown content with share buttons
  const parseContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    lines.forEach((line, index) => {
      if (line.startsWith("# ") && index === 0) {
        return;
      }

      if (line.startsWith("|")) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        if (!line.includes("---")) {
          const cells = line.split("|").filter((c) => c.trim());
          tableRows.push(cells.map((c) => c.trim()));
        }
        return;
      } else if (inTable) {
        inTable = false;
        elements.push(
          <div key={`table-${index}`} className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-orange-100 to-red-100">
                  {tableRows[0]?.map((cell, i) => (
                    <th key={i} className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-700">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-orange-50/50"}>
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

      // H2 headers with share button
      if (line.startsWith("## ")) {
        const text = line.replace("## ", "");
        let icon = null;
        let canShare = false;

        if (text.includes("Láska")) {
          icon = <Heart className="w-6 h-6 text-pink-500" />;
          canShare = true;
        } else if (text.includes("Kariéra")) {
          icon = <Briefcase className="w-6 h-6 text-blue-500" />;
          canShare = true;
        } else if (text.includes("Zdraví")) {
          icon = <Activity className="w-6 h-6 text-green-500" />;
          canShare = true;
        } else if (text.includes("Šťastné")) {
          icon = <Calendar className="w-6 h-6 text-yellow-500" />;
        } else if (text.includes("Měsíční")) {
          icon = <Calendar className="w-6 h-6 text-purple-500" />;
        } else if (text.includes("Speciální")) {
          icon = <Coins className="w-6 h-6 text-orange-500" />;
        }

        elements.push(
          <div key={index} className="flex items-center justify-between mt-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {icon}
              {text}
            </h2>
            {canShare && (
              <button
                onClick={() => handleShareSection(text)}
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors"
                title="Sdílet tuto sekci"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Sdílet</span>
              </button>
            )}
          </div>
        );
        return;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-700 mt-6 mb-3">
            {line.replace("### ", "")}
          </h3>
        );
        return;
      }

      if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={index} className="font-semibold text-gray-800 my-3">
            {line.replace(/\*\*/g, "")}
          </p>
        );
        return;
      }

      if (line.startsWith("• ") || line.startsWith("- ")) {
        const text = line.replace(/^[•-]\s*/, "");
        const parsed = text
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#D4AF37] hover:underline">$1</a>');
        
        elements.push(
          <li key={index} className="ml-6 my-1 text-gray-600 list-disc" dangerouslySetInnerHTML={{ __html: parsed }} />
        );
        return;
      }

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

  const shareUrl = `https://amulets.cz/predpoved-2026/${slug}`;
  const shareTitle = prediction.title;
  const zodiacEmoji = getZodiacEmoji(prediction.title);
  const zodiacName = getZodiacName(prediction.title);

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgressBar />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-orange-100">
                <li><Link href="/" className="hover:text-white transition-colors">{t('content.home')}</Link></li>
                <ChevronRight className="w-4 h-4" />
                <li><Link href="/cinsky-horoskop" className="hover:text-white transition-colors">{t('zh.title')}</Link></li>
                <ChevronRight className="w-4 h-4" />
                <li className="font-semibold text-white">{prediction.title}</li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <span className="text-2xl">{zodiacEmoji}</span>
                  <span className="font-semibold">{t('zh.pred.yearOfFireHorse')}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {prediction.title}
                </h1>
                
                <p className="text-lg md:text-xl text-orange-100 mb-6 max-w-xl">
                  {prediction.metaDescription}
                </p>

                {/* Extended Social Share Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-orange-200 flex items-center gap-1">
                    <Share2 className="w-4 h-4" /> {t('quiz.result.share')}:
                  </span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-blue-600 backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-sky-500 backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-blue-700 backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-sky-400 backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Share on Telegram"
                  >
                    <Send className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-green-500 backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(zodiacEmoji + " " + shareTitle + " - Předpověď 2026")}&body=${encodeURIComponent(`Ahoj!\n\nPodívej se na mou předpověď pro rok 2026:\n\n${shareTitle}\n${prediction.metaDescription}\n\nVíce na: ${shareUrl}\n\n🔮 Amulets.cz`)}`}
                    className="bg-white/20 hover:bg-red-500 backdrop-blur-sm p-2 rounded-full transition-colors"
                    aria-label="Share via email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert(t('quiz.result.copied'));
                    }}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-2 rounded-full transition-colors text-sm font-medium"
                  >
                    📋 {t('zh.pred.copy')}
                  </button>
                </div>
              </div>

              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative cursor-pointer group" onClick={() => setLightboxOpen(true)}>
                  <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl group-hover:bg-white/30 transition-colors" />
                  <img
                    src={prediction.image}
                    alt={prediction.title}
                    className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-2xl shadow-2xl ring-4 ring-white/30 group-hover:ring-white/50 transition-all transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    🔍 {t('zh.pred.clickToEnlarge')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation between signs */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 border-b border-orange-200">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/predpoved-2026/${prevPrediction.slug}`}
                className="flex items-center gap-2 text-orange-700 hover:text-orange-900 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-orange-500">{t('zh.pred.prevSign')}</div>
                  <div className="font-semibold">{prevPrediction.title.split(" - ")[0]}</div>
                </div>
              </Link>

              <Link
                href="/cinsky-horoskop#predpovedi-2026"
                className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors font-medium"
              >
                <Calendar className="w-4 h-4" />
                {t('zh.pred.allSigns')}
              </Link>

              <Link
                href={`/predpoved-2026/${nextPrediction.slug}`}
                className="flex items-center gap-2 text-orange-700 hover:text-orange-900 transition-colors group"
              >
                <div className="text-right">
                  <div className="text-xs text-orange-500">{t('zh.pred.nextSign')}</div>
                  <div className="font-semibold">{nextPrediction.title.split(" - ")[0]}</div>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Article content */}
        <article className="container max-w-4xl mx-auto px-4 py-8">
          <div className="prose prose-lg max-w-none">
            {parseContent(prediction.content)}
          </div>

          {/* Bottom Share buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium">{t('zh.pred.sharePrediction')}:</span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-400 hover:bg-sky-500 text-white p-2 rounded-lg transition-colors"
                  aria-label="Share on Telegram"
                >
                  <Send className="w-5 h-5" />
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                  aria-label="Sdílet na WhatsAppu"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(zodiacEmoji + " " + shareTitle + " - Předpověď 2026")}&body=${encodeURIComponent(`Ahoj!\n\nPodívej se na mou předpověď pro rok 2026:\n\n${shareTitle}\n${prediction.metaDescription}\n\nVíce na: ${shareUrl}\n\n🔮 Amulets.cz`)}`}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  aria-label="Share via email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              <ShareButtons
                url={shareUrl}
                title={shareTitle}
              />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/predpoved-2026/${prevPrediction.slug}`}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all group"
            >
              <img
                src={prevPrediction.image}
                alt={prevPrediction.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <div className="text-xs text-orange-500 mb-1">← {t('zh.pred.prevSign')}</div>
                <div className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {prevPrediction.title}
                </div>
              </div>
            </Link>

            <Link
              href={`/predpoved-2026/${nextPrediction.slug}`}
              className="flex items-center justify-end gap-4 p-4 bg-gradient-to-l from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all group text-right"
            >
              <div>
                <div className="text-xs text-orange-500 mb-1">{t('zh.pred.nextSign')} →</div>
                <div className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {nextPrediction.title}
                </div>
              </div>
              <img
                src={nextPrediction.image}
                alt={nextPrediction.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            </Link>
          </div>
        </article>

        {/* Email Capture - Inline Form */}
        <InlineEmailForm 
          zodiacSign={slug || ""}
          zodiacName={prediction.title.split(" - ")[0]}
        />

        <GuideSection />
      </main>
      <Footer />

      {/* Email Capture - Modal Popup (time-based trigger) */}
      <EmailCaptureModal
        zodiacSign={slug || ""}
        zodiacName={prediction.title.split(" - ")[0]}
        trigger="time"
        delaySeconds={30}
      />

      <ImageLightbox
        isOpen={lightboxOpen}
        src={prediction.image}
        alt={prediction.title}
        onClose={() => setLightboxOpen(false)}
      />

      {selectedSection && (
        <SectionShareModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedSection(null);
          }}
          sectionTitle={selectedSection.title}
          sectionContent={selectedSection.content}
          zodiacSign={zodiacName}
          zodiacEmoji={zodiacEmoji}
          zodiacImage={prediction.image}
          baseUrl={shareUrl}
        />
      )}
    </div>
  );
}
