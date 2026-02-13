import { useState, useEffect } from "react";
import { X, Mail, Check, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * OHORAI Sticky Widget
 * 
 * Kompaktní sticky widget propagující novou esenci OHORAI
 * - Video: Promo video nové esence
 * - Email signup: Notifikace o dostupnosti
 * - Pozice: Levá strana (aby nepřekrýval chatbota vpravo)
 * - Mobilní optimalizace: Menší velikost, lepší pozicování
 */
export default function OhoraiWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-minimize on mobile after 5 seconds
  useEffect(() => {
    if (isMobile && !isMinimized) {
      const timer = setTimeout(() => setIsMinimized(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isMinimized]);

  // Check if already subscribed
  const alreadySubscribed = typeof window !== "undefined" 
    ? localStorage.getItem("ohorai_esence_subscribed") === "true"
    : false;

  const subscribeMutation = trpc.ebook.requestDownload.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      localStorage.setItem("ohorai_esence_subscribed", "true");
      toast.success("Skvěle! Dáme vám vědět, až bude esence skladem.");
    },
    onError: (error: { message: string }) => {
      if (error.message.includes("already subscribed")) {
        setIsSubmitted(true);
        localStorage.setItem("ohorai_esence_subscribed", "true");
        toast.info("Tento email již máme v databázi.");
      } else {
        toast.error("Něco se pokazilo. Zkuste to znovu.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Zadejte platný email");
      return;
    }
    subscribeMutation.mutate({
      email,
      name: "OHORAI Zájemce",
      ebookType: "ohorai-esence-notification",
      sourcePage: "ohorai_widget",
      utmSource: "amulets",
      utmMedium: "widget",
      utmCampaign: "ohorai_esence_launch",
    });
  };

  if (!isVisible) return null;

  // Mobile minimized position - above bottom nav, smaller
  const mobileMinimizedClass = isMobile 
    ? "bottom-24 left-2 w-10 h-10" 
    : "bottom-4 left-4 w-14 h-14";

  // Mobile expanded position - smaller, more compact
  const mobileExpandedClass = isMobile
    ? "bottom-24 left-2 w-[200px] max-w-[220px]"
    : "bottom-4 left-4 w-72 md:w-80";

  return (
    <div
      data-ohorai-widget
      className={`fixed z-40 transition-all duration-300 ${
        isMinimized ? mobileMinimizedClass : mobileExpandedClass
      }`}
    >
      {isMinimized ? (
        // Minimized state - just icon (smaller on mobile)
        <button
          onClick={() => setIsMinimized(false)}
          className={`w-full h-full rounded-full bg-gradient-to-br from-[#1a365d] to-[#2d4a6f] shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-amber-400 ${
            isMobile ? "w-12 h-12" : ""
          }`}
          title="Otevřít OHORAI"
        >
          <span className={isMobile ? "text-xl" : "text-2xl"}>🪷</span>
        </button>
      ) : (
        // Expanded state - compact widget with video
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-amber-300">
          {/* Header with logo and controls */}
          <div className="flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 bg-gradient-to-r from-[#1a365d] to-[#2d4a6f]">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className={isMobile ? "text-base" : "text-lg"}>🪷</span>
              <span className="text-amber-300 font-serif text-xs md:text-sm tracking-wide">OHORAI</span>
              <span className="bg-amber-400 text-[#1a365d] text-[8px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded font-bold">
                SOON
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
                title="Minimalizovat"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
                title="Zavřít"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>

          {/* Video - smaller on mobile */}
          <div className="relative">
            <video
              src="/ohorai-promo.mp4"
              className={`w-full ${isMobile ? "max-h-[100px] object-cover" : ""}`}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute bottom-0.5 md:bottom-2 right-0.5 md:right-2 bg-black/60 text-white text-[6px] md:text-[10px] px-1 md:px-2 py-0.5 md:py-1 rounded">
              THE ORIGIN
            </div>
          </div>

          {/* Email signup or CTA */}
          {isSubmitted || alreadySubscribed ? (
            // Already subscribed state
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 md:py-3 px-3 md:px-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">Dáme vám vědět!</span>
              </div>
              <p className="text-[10px] md:text-xs mt-1 opacity-90">Až bude esence skladem.</p>
            </div>
          ) : showEmailForm ? (
            // Email form
            <form onSubmit={handleSubmit} className="bg-gradient-to-r from-[#1a365d] to-[#2d4a6f] p-2 md:p-3">
              <p className="text-amber-300 text-[10px] md:text-xs mb-1.5 md:mb-2 text-center">
                Zadejte email pro notifikaci
              </p>
              <div className="flex gap-1.5 md:gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vas@email.cz"
                  className="flex-1 px-2 md:px-3 py-1.5 md:py-2 rounded text-xs md:text-sm border-0 focus:ring-2 focus:ring-amber-400"
                  disabled={subscribeMutation.isPending}
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="bg-amber-400 hover:bg-amber-500 text-[#1a365d] font-bold px-3 md:px-4 py-1.5 md:py-2 rounded transition-colors disabled:opacity-50"
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                  ) : (
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                </button>
              </div>
            </form>
          ) : (
            // CTA button
            <button
              onClick={() => setShowEmailForm(true)}
              className="block w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#1a365d] font-bold py-2 md:py-3 px-3 md:px-4 text-center text-xs md:text-sm transition-all"
            >
              <Mail className="w-3 h-3 md:w-4 md:h-4 inline mr-1.5 md:mr-2" />
              Dát vědět emailem ✨
            </button>
          )}
        </div>
      )}
    </div>
  );
}
