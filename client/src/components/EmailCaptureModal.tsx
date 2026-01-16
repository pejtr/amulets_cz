import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Download, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface EmailCaptureModalProps {
  /** Znamení pro personalizaci (např. "krysa", "buvol") */
  zodiacSign: string;
  /** Název znamení pro zobrazení (např. "Krysa", "Bůvol") */
  zodiacName: string;
  /** Trigger: "scroll" | "time" | "exit" */
  trigger?: "scroll" | "time" | "exit";
  /** Delay v sekundách pro time trigger */
  delaySeconds?: number;
  /** Scroll % pro scroll trigger */
  scrollPercent?: number;
}

/**
 * Modal pro zachycení emailu s nabídkou PDF horoskopu
 * Zobrazuje se na základě triggeru (čas, scroll, exit-intent)
 */
export default function EmailCaptureModal({
  zodiacSign,
  zodiacName,
  trigger = "time",
  delaySeconds = 30,
  scrollPercent = 50,
}: EmailCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subscribeToNewsletter = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Děkujeme! PDF horoskop jsme vám poslali na email.");
      // Uložit do localStorage, aby se popup už nezobrazoval
      localStorage.setItem(`email-captured-${zodiacSign}`, "true");
      // Zavřít modal po 3 sekundách
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    },
    onError: (error: any) => {
      toast.error(error.message || "Něco se pokazilo. Zkuste to prosím znovu.");
    },
  });

  useEffect(() => {
    // Zkontrolovat, zda už uživatel zadal email
    const alreadyCaptured = localStorage.getItem(`email-captured-${zodiacSign}`);
    if (alreadyCaptured) return;

    // Zkontrolovat, zda už byl popup zobrazen v této session
    const shownInSession = sessionStorage.getItem(`modal-shown-${zodiacSign}`);
    if (shownInSession) return;

    if (trigger === "time") {
      // Zobrazit po X sekundách
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(`modal-shown-${zodiacSign}`, "true");
      }, delaySeconds * 1000);
      return () => clearTimeout(timer);
    }

    if (trigger === "scroll") {
      // Zobrazit při scroll X%
      const handleScroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= scrollPercent) {
          setIsOpen(true);
          sessionStorage.setItem(`modal-shown-${zodiacSign}`, "true");
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (trigger === "exit") {
      // Exit-intent detection
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsOpen(true);
          sessionStorage.setItem(`modal-shown-${zodiacSign}`, "true");
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [zodiacSign, trigger, delaySeconds, scrollPercent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !gdprConsent) {
      toast.error("Vyplňte prosím email a potvrďte souhlas se zpracováním údajů.");
      return;
    }

    subscribeToNewsletter.mutate({
      email,
      source: `horoskop-${zodiacSign}`,
      tags: ["horoskop", zodiacSign, "pdf-download"],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Zavřít</span>
        </button>

        {!isSubmitted ? (
          <>
            {/* Header s gradientem */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Download className="w-6 h-6" />
                  ZDARMA: Detailní PDF Horoskop
                </DialogTitle>
              </DialogHeader>
              <p className="mt-2 text-purple-100">
                Získejte kompletní předpověď pro rok 2026
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Preview image */}
              <div className="relative w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">📄</div>
                  <div className="font-bold text-lg text-gray-800">{zodiacName} - Horoskop 2026</div>
                  <div className="text-sm text-gray-600">Detailní PDF průvodce</div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Co získáte:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Měsíční předpovědi pro celý rok 2026</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Doporučené amulety a kameny pro vaše znamení</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Speciální rituály pro přilákání štěstí</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Tipy pro lásku, kariéru a zdraví</span>
                  </li>
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Váš email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="gdpr-consent"
                    checked={gdprConsent}
                    onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                    required
                  />
                  <label htmlFor="gdpr-consent" className="text-xs text-gray-600 leading-tight cursor-pointer">
                    Souhlasím se zpracováním osobních údajů a zasíláním newsletteru. Odhlásit se můžete kdykoli.{" "}
                    <a href="/zasady-ochrany-osobnich-udaju" className="underline" target="_blank">
                      Zásady ochrany údajů
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg"
                  disabled={subscribeToNewsletter.isPending}
                >
                  {subscribeToNewsletter.isPending ? "Odesílám..." : "Stáhnout ZDARMA"}
                </Button>
              </form>

              {/* Trust badge */}
              <p className="text-xs text-center text-gray-500">
                🔒 Žádný spam. Pouze hodnotný obsah o spiritualitě a ezoterice.
              </p>
            </div>
          </>
        ) : (
          // Success state
          <div className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Děkujeme!</h3>
            <p className="text-gray-700">
              PDF horoskop jsme vám poslali na email <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Pokud email nevidíte, zkontrolujte složku spam.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
