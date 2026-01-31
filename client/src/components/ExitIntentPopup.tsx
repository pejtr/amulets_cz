import { useState, useEffect } from "react";
import { X, Gift, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [email, setEmail] = useState("");
  const [ctaVariant, setCtaVariant] = useState<string | null>(null);

  const subscribeDiscount = trpc.email.subscribeDiscount.useMutation({
    onSuccess: () => {
      setShowCode(true);
      toast.success("Email odeslán! Zkontrolujte svou schránku.");
    },
    onError: (error) => {
      toast.error("Nepodařilo se odeslat email. Zkuste to prosím znovu.");
      console.error("[ExitIntentPopup] Error:", error);
    },
  });

  useEffect(() => {
    // Check if popup was already shown
    const popupShown = localStorage.getItem("exitPopupShown");
    if (popupShown) {
      setHasShown(true);
      return;
    }

    // Get last CTA variant from sessionStorage for personalization
    const lastCTA = sessionStorage.getItem("lastCTAVariant");
    if (lastCTA) {
      setCtaVariant(lastCTA);
    }

    // Exit intent detection - mouse leaving viewport from top
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from top and moving upward
      if (e.clientY <= 0 && !hasShown && !isVisible) {
        setIsVisible(true);
        setHasShown(true);
        // Mark as shown in localStorage (expires after 7 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        localStorage.setItem("exitPopupShown", expiryDate.toISOString());
      }
    };

    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [hasShown, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes("@")) {
      toast.error("Zadejte prosím platný email");
      return;
    }

    // Get Facebook tracking parameters from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    const fbc = getCookie('_fbc'); // Facebook click ID
    const fbp = getCookie('_fbp'); // Facebook browser ID

    // Call backend API with tracking parameters
    subscribeDiscount.mutate({ email, fbc, fbp });
  };

  const handleClaim = () => {
    // Open Ohorai.cz in new tab
    window.open("https://www.ohorai.cz/?discount=OHORAI11", "_blank");
    setIsVisible(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("OHORAI11");
    toast.success("Kód zkopírován!");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
        <div className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-white rounded-2xl shadow-2xl p-8 border-2 border-purple-200">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Zavřít"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-4">
                <Gift className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {ctaVariant?.includes('ebook') ? '📖 Ještě jste si nestáhli e-book?' : 'Exkluzivní sleva na amulety 🎁'}
          </h2>

          {!showCode ? (
            <>
              {/* Email capture form */}
              <p className="text-center text-gray-600 mb-6">
                {ctaVariant?.includes('ebook') 
                  ? (<>Stáhněte si <span className="font-bold text-purple-600">"7 Kroků k Rovnováze"</span> zdarma</>) 
                  : (<>Získejte <span className="font-bold text-purple-600">11% slevu</span> na celý sortiment</>)
                }
              </p>

              <form onSubmit={handleSubmitEmail} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Váš email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={subscribeDiscount.isPending}
                    className="pl-10 py-6 text-base border-2 border-purple-200 focus:border-purple-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={subscribeDiscount.isPending}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {subscribeDiscount.isPending ? "Odesílám..." : "Zobrazit slevový kód"}
                </Button>
              </form>

              {/* Benefits */}
              <ul className="space-y-2 mt-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Platí na <strong>všechny produkty</strong> na Ohorai.cz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Orgonitové pyramidy, esence, amulety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Sleva platí <strong>7 dní</strong></span>
                </li>
              </ul>

              {/* Privacy note */}
              <p className="text-xs text-center text-gray-400 mt-4">
                Váš email nebudeme sdílet s třetími stranami
              </p>
            </>
          ) : (
            <>
              {/* Success message */}
              <p className="text-center text-gray-600 mb-6">
                Slevový kód byl odeslán na <span className="font-semibold">{email}</span>
              </p>

              {/* Discount code */}
              <div className="bg-white rounded-xl p-4 mb-6 border-2 border-dashed border-purple-300 shadow-inner">
                <p className="text-sm text-gray-500 text-center mb-2">
                  Váš slevový kód:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-2xl font-bold text-purple-600 tracking-wider">
                    OHORAI11
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                    aria-label="Kopírovat kód"
                  >
                    <Sparkles className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Platí na <strong>všechny produkty</strong> na Ohorai.cz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Orgonitové pyramidy, esence, amulety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Sleva platí <strong>7 dní</strong></span>
                </li>
              </ul>

              {/* CTA Button */}
              <Button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Uplatnit slevu na Ohorai.cz
              </Button>

              {/* Small print */}
              <p className="text-xs text-center text-gray-400 mt-4">
                Kód se automaticky aplikuje při přesměrování
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
