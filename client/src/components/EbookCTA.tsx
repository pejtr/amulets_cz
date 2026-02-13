import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface EbookCTAProps {
  variant?: "banner" | "card" | "inline";
  ctaId?: string;
}

export default function EbookCTA({ variant = "banner", ctaId = "homepage-banner" }: EbookCTAProps) {
  const handleClick = () => {
    // Store CTA variant for exit-intent personalization
    sessionStorage.setItem("lastCTAVariant", ctaId);
    
    // Track click
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'EbookCTAClick', {
        cta_variant: ctaId,
        cta_type: variant,
      });
    }
  };

  if (variant === "card") {
    return (
      <Card className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 border-purple-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Download className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              Zdarma ke stažení
            </div>
            <h3 className="text-2xl font-bold mb-2">
              7 Kroků k Rovnováze
            </h3>
            <p className="text-muted-foreground mb-4">
              Praktický průvodce pro nalezení harmonie mezi prací, osobním životem a duchovním růstem
            </p>
            <Link href={`/ebook?cta=${ctaId}`} onClick={handleClick}>
              <Button size="lg" className="w-full md:w-auto">
                <Download className="mr-2 h-5 w-5" />
                Stáhnout e-book zdarma
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 rounded-lg p-6 border border-purple-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-lg mb-1">
              📖 Zdarma: 7 Kroků k Rovnováze
            </h4>
            <p className="text-sm text-muted-foreground">
              Praktický průvodce pro harmonický život
            </p>
          </div>
          <Link href={`/ebook?cta=${ctaId}`} onClick={handleClick}>
            <Button variant="default" className="whitespace-nowrap">
              <Download className="mr-2 h-4 w-4" />
              Stáhnout zdarma
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default: banner variant
  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Zdarma ke stažení
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            7 Kroků k Rovnováze
          </h2>
          
          <p className="text-lg md:text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Praktický průvodce pro nalezení harmonie mezi prací, osobním životem a duchovním růstem. 
            Včetně cvičení a rituálů pro každodenní klid.
          </p>
          
          <Link href={`/ebook?cta=${ctaId}`} onClick={handleClick}>
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Download className="mr-2 h-5 w-5" />
              Stáhnout e-book zdarma
            </Button>
          </Link>
          
          <p className="text-sm text-purple-200 mt-4">
            ✓ Žádný spam ✓ Okamžité stažení ✓ 100% zdarma
          </p>
        </div>
      </div>
    </div>
  );
}
