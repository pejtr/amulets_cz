import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqData } from "@/data/faqData";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Často kladené otázky
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Odpovědi na nejčastější dotazy o amuletů, pyramidách a esencích
          </p>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-accent/20 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">Máte další otázky?</h3>
            <p className="text-muted-foreground mb-4">
              Rádi vám poradíme s výběrem amuletu nebo esence
            </p>
            <a
              href="https://www.ohorai.cz/kontakt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#E85A9F] text-white px-6 py-3 rounded-md hover:bg-[#E85A9F]/90 transition-colors font-semibold"
            >
              Kontaktujte nás
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
