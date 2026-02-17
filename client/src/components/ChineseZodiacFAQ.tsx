import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export function ChineseZodiacFAQSchema() {
  const { t } = useTranslation();

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
      "mainEntity": FAQ_KEYS.map(key => ({
        "@type": "Question",
        "name": t(`zh.faq.${key}`),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t(`zh.faq.a${key.slice(1)}`)
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
  }, [t]);

  return null;
}

export default function ChineseZodiacFAQ() {
  const { t } = useTranslation();

  return (
    <section id="faq" className="mb-16">
      <ChineseZodiacFAQSchema />
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
        {t('zh.faq.title')}
      </h2>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        {t('zh.faq.subtitle')}
      </p>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {FAQ_KEYS.map((key, index) => (
          <details 
            key={index}
            className="group bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-orange-50 transition-colors list-none">
              <h3 className="font-semibold text-foreground pr-4">{t(`zh.faq.${key}`)}</h3>
              <ChevronDown className="w-5 h-5 text-orange-500 flex-shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 pt-0 text-muted-foreground border-t border-orange-100">
              <p className="pt-4">{t(`zh.faq.a${key.slice(1)}`)}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
