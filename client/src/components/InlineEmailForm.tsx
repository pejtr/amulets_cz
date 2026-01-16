import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface InlineEmailFormProps {
  /** Znamení pro personalizaci (např. "krysa", "buvol") */
  zodiacSign: string;
  /** Název znamení pro zobrazení (např. "Krysa", "Bůvol") */
  zodiacName: string;
}

/**
 * Inline formulář pro zachycení emailu - umístěný v obsahu článku
 * Méně invazivní než modal, vhodný pro konec článku
 */
export default function InlineEmailForm({ zodiacSign, zodiacName }: InlineEmailFormProps) {
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subscribeToNewsletter = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Děkujeme! PDF horoskop jsme vám poslali na email.");
      // Uložit do localStorage
      localStorage.setItem(`email-captured-${zodiacSign}`, "true");
    },
    onError: (error: any) => {
      toast.error(error.message || "Něco se pokazilo. Zkuste to prosím znovu.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !gdprConsent) {
      toast.error("Vyplňte prosím email a potvrďte souhlas se zpracováním údajů.");
      return;
    }

    subscribeToNewsletter.mutate({
      email,
      source: `horoskop-${zodiacSign}-inline`,
      tags: ["horoskop", zodiacSign, "pdf-download", "inline-form"],
    });
  };

  if (isSubmitted) {
    return (
      <div className="my-8 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-900">Děkujeme!</h3>
          <p className="text-gray-700">
            PDF horoskop jsme vám poslali na email <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Pokud email nevidíte, zkontrolujte složku spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 md:p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-200 shadow-xl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Chcete vědět víc?
          </h3>
          <p className="text-lg text-gray-700">
            Stáhněte si <strong>ZDARMA</strong> detailní PDF horoskop pro {zodiacName}
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white/70 rounded-xl p-4 mb-6">
          <p className="font-semibold text-gray-900 mb-3">Co získáte:</p>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Měsíční předpovědi pro celý rok</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Doporučené amulety a kameny</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Speciální rituály pro štěstí</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Tipy pro lásku a kariéru</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="email"
              placeholder="Váš email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 text-base"
            />
            <Button
              type="submit"
              className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base"
              disabled={subscribeToNewsletter.isPending}
            >
              {subscribeToNewsletter.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Odesílám...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Stáhnout ZDARMA
                </>
              )}
            </Button>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id={`gdpr-consent-inline-${zodiacSign}`}
              checked={gdprConsent}
              onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
              required
            />
            <label 
              htmlFor={`gdpr-consent-inline-${zodiacSign}`} 
              className="text-xs text-gray-600 leading-tight cursor-pointer"
            >
              Souhlasím se zpracováním osobních údajů a zasíláním newsletteru. Odhlásit se můžete kdykoli.{" "}
              <a href="/zasady-ochrany-osobnich-udaju" className="underline" target="_blank">
                Zásady ochrany údajů
              </a>
            </label>
          </div>
        </form>

        {/* Trust badge */}
        <p className="text-xs text-center text-gray-500 mt-4">
          🔒 Žádný spam. Pouze hodnotný obsah o spiritualitě a ezoterice.
        </p>
      </div>
    </div>
  );
}
