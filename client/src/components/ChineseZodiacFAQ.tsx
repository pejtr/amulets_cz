import { useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const chineseZodiacFAQs: FAQItem[] = [
  {
    question: "Jak zjistit své čínské znamení podle data narození?",
    answer: "Čínské znamení zjistíte podle roku narození, ale musíte zohlednit datum čínského Nového roku. Čínský Nový rok začíná mezi 21. lednem a 20. únorem. Pokud jste se narodili před čínským Novým rokem, patříte do předchozího roku. Použijte naši kalkulačku výše pro přesné určení vašeho čínského znamení."
  },
  {
    question: "Kolik je čínských znamení zvěrokruhu?",
    answer: "Čínský zvěrokruh obsahuje 12 znamení: Krysa, Bůvol, Tygr, Králík, Drak, Had, Kůň, Koza, Opice, Kohout, Pes a Prase. Každé znamení se opakuje v 12letém cyklu a je kombinováno s jedním z 5 elementů (Dřevo, Oheň, Země, Kov, Voda)."
  },
  {
    question: "Jaký je rok 2026 v čínském horoskopu?",
    answer: "Rok 2026 je v čínském horoskopu Rokem Ohnivého Koně. Čínský Nový rok 2026 začíná 17. února 2026 a končí 5. února 2027. Kůň symbolizuje energii, svobodu a dobrodružství, zatímco ohnivý element přináší vášeň a dynamiku."
  },
  {
    question: "Jak funguje partnerský čínský horoskop?",
    answer: "Partnerský čínský horoskop hodnotí kompatibilitu mezi znameními na základě jejich elementů a charakteristik. Nejlepší kompatibilitu mají znamení ve stejném trojúhelníku (např. Krysa-Drak-Opice). Naopak protilehlá znamení (např. Krysa-Kůň) mohou mít náročnější vztah, ale mohou se navzájem doplňovat."
  },
  {
    question: "Co znamená element v čínském horoskopu?",
    answer: "Každý rok v čínském horoskopu je spojen s jedním z 5 elementů: Dřevo (růst, kreativita), Oheň (vášeň, energie), Země (stabilita, praktičnost), Kov (síla, rozhodnost) a Voda (moudrost, intuice). Element ovlivňuje vlastnosti vašeho znamení a mění se každé 2 roky."
  },
  {
    question: "Kdy začíná čínský Nový rok?",
    answer: "Čínský Nový rok začíná při novoluní mezi 21. lednem a 20. únorem. Datum se každý rok mění. V roce 2026 začíná čínský Nový rok 17. února, v roce 2027 to bude 6. února. Proto je důležité znát přesné datum při určování čínského znamení."
  }
];

export function ChineseZodiacFAQSchema() {
  useEffect(() => {
    // Remove any existing FAQ schema
    const existingScript = document.querySelector('script[data-schema="chinese-zodiac-faq"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create FAQ schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": chineseZodiacFAQs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    // Add schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'chinese-zodiac-faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

export default function ChineseZodiacFAQ() {
  return (
    <section id="faq" className="mb-16">
      <ChineseZodiacFAQSchema />
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
        ❓ Často kladené otázky o čínském horoskopu
      </h2>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Odpovědi na nejčastější otázky o čínském zvěrokruhu, znameních a kompatibilitě
      </p>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {chineseZodiacFAQs.map((faq, index) => (
          <details 
            key={index}
            className="group bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-orange-50 transition-colors list-none">
              <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
              <ChevronDown className="w-5 h-5 text-orange-500 flex-shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 pt-0 text-muted-foreground border-t border-orange-100">
              <p className="pt-4">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
