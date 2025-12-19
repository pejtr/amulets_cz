import { useState, useRef, useEffect } from "react";
import { X, Facebook, Twitter, Linkedin, Send, Instagram, Download, Copy, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  sectionContent: string;
  zodiacSign: string;
  zodiacEmoji: string;
  zodiacImage: string;
  baseUrl: string;
}

export function SectionShareModal({
  isOpen,
  onClose,
  sectionTitle,
  sectionContent,
  zodiacSign,
  zodiacEmoji,
  zodiacImage,
  baseUrl,
}: SectionShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Clean section content for sharing (remove markdown)
  const cleanContent = sectionContent
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[•-]\s*/gm, "• ")
    .split("\n")
    .filter(line => line.trim())
    .slice(0, 5)
    .join("\n");

  const shareText = `${zodiacEmoji} ${zodiacSign} - ${sectionTitle} (2026)\n\n${cleanContent.slice(0, 200)}...\n\nVíce na:`;
  const shareUrl = `${baseUrl}#${sectionTitle.toLowerCase().replace(/\s+/g, "-")}`;

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText.slice(0, 200))}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(zodiacEmoji + " " + zodiacSign + " - " + sectionTitle + " (2026)")}&body=${encodeURIComponent(`Ahoj!\n\nPodívej se na tuto předpověď pro rok 2026:\n\n${zodiacEmoji} ${zodiacSign} - ${sectionTitle}\n\n${cleanContent.slice(0, 300)}...\n\nVíce na: ${shareUrl}\n\n🔮 Amulets.cz`)}`,
  };

  // Generate Instagram-ready image
  const generateInstagramImage = async () => {
    setGeneratingImage(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size for Instagram (1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#ea580c"); // orange-600
    gradient.addColorStop(0.5, "#dc2626"); // red-600
    gradient.addColorStop(1, "#db2777"); // pink-600
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern overlay
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    for (let i = 0; i < canvas.width; i += 30) {
      for (let j = 0; j < canvas.height; j += 30) {
        ctx.beginPath();
        ctx.arc(i, j, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Load and draw zodiac image
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = zodiacImage;
      });

      // Draw circular image
      const imgSize = 280;
      const imgX = (canvas.width - imgSize) / 2;
      const imgY = 100;

      ctx.save();
      ctx.beginPath();
      ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
      ctx.restore();

      // Add white border around image
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2 + 3, 0, Math.PI * 2);
      ctx.stroke();
    } catch (e) {
      // If image fails, draw emoji instead
      ctx.font = "200px serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText(zodiacEmoji, canvas.width / 2, 280);
    }

    // Draw zodiac sign name
    ctx.font = "bold 64px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.fillText(`${zodiacEmoji} ${zodiacSign}`, canvas.width / 2, 450);

    // Draw section title
    ctx.font = "bold 48px system-ui, sans-serif";
    ctx.fillText(sectionTitle, canvas.width / 2, 520);

    // Draw year badge
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText("Rok Ohnivého Koně 2026", canvas.width / 2, 580);

    // Draw content preview
    ctx.shadowBlur = 0;
    ctx.font = "28px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    
    const lines = cleanContent.split("\n").slice(0, 4);
    let y = 660;
    for (const line of lines) {
      const truncatedLine = line.length > 45 ? line.slice(0, 42) + "..." : line;
      ctx.fillText(truncatedLine, canvas.width / 2, y);
      y += 45;
    }

    // Draw website
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("🔮 amulets.cz", canvas.width / 2, 980);

    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setGeneratedImageUrl(url);
      }
      setGeneratingImage(false);
    }, "image/png");
  };

  const downloadImage = () => {
    if (!generatedImageUrl) return;
    
    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.download = `${zodiacSign.toLowerCase()}-${sectionTitle.toLowerCase().replace(/\s+/g, "-")}-2026.png`;
    link.click();
  };

  useEffect(() => {
    if (isOpen && !generatedImageUrl) {
      generateInstagramImage();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (generatedImageUrl) {
        URL.revokeObjectURL(generatedImageUrl);
      }
    };
  }, [generatedImageUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl">
          <div>
            <h3 className="font-bold text-lg">Sdílet sekci</h3>
            <p className="text-sm text-orange-100">{zodiacEmoji} {zodiacSign} - {sectionTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Social Share Buttons */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Sdílet na sociálních sítích</h4>
            <div className="grid grid-cols-6 gap-2">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                <Facebook className="w-6 h-6" />
                <span className="text-xs">Facebook</span>
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors"
              >
                <Twitter className="w-6 h-6" />
                <span className="text-xs">Twitter</span>
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition-colors"
              >
                <Linkedin className="w-6 h-6" />
                <span className="text-xs">LinkedIn</span>
              </a>
              <a
                href={shareLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 bg-sky-400 hover:bg-sky-500 text-white rounded-xl transition-colors"
              >
                <Send className="w-6 h-6" />
                <span className="text-xs">Telegram</span>
              </a>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-xs">WhatsApp</span>
              </a>
              <a
                href={shareLinks.email}
                className="flex flex-col items-center gap-1 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                <Mail className="w-6 h-6" />
                <span className="text-xs">Email</span>
              </a>
            </div>
          </div>

          {/* Copy Text */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Kopírovat text</h4>
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 max-h-32 overflow-y-auto">
              {shareText}
            </div>
            <Button
              onClick={handleCopyText}
              className="w-full mt-2 bg-gray-800 hover:bg-gray-900"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> Zkopírováno!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" /> Kopírovat text
                </>
              )}
            </Button>
          </div>

          {/* Instagram Image Generator */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500" />
              Obrázek pro Instagram
            </h4>
            
            <canvas ref={canvasRef} className="hidden" />
            
            {generatingImage ? (
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-gray-600">Generuji obrázek...</p>
              </div>
            ) : generatedImageUrl ? (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={generatedImageUrl}
                    alt="Instagram preview"
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={downloadImage}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Stáhnout pro Instagram
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Stáhněte obrázek a nahrajte ho na Instagram s hashtagem #horoskop2026
                </p>
              </div>
            ) : (
              <Button
                onClick={generateInstagramImage}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Vygenerovat obrázek
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
