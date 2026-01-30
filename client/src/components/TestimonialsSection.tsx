import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: "Sarri",
    date: "2.10.2023",
    rating: 5,
    text: "Mám ráda obchod Amulets. Stejně tak mám ráda jejich krásné, silné produkty. Doporučuji každému, kdo by chtěl pro sebe něco udělat – osobní křišťály od paní Natálie mají sílu a krásnou energii…",
    verified: true,
  },
  {
    id: 2,
    name: "Bóďa",
    date: "26.8.2023",
    rating: 5,
    text: "Z tohoto obchodu jsem vysloveně nadšená! Skvělá komunikace, rychlost dodání a po rozbalení úžas :-)) Nádherný výrobek, který byl krásně zabalený, k tomu dárek v podobě kamínku a kartou s afirmací. Luxusní potěšení duše. Vřele doporučuji.",
    verified: true,
  },
  {
    id: 3,
    name: "Blanka",
    date: "7.4.2023",
    rating: 5,
    text: "Natálku znám osobně, je moc milá vše vysvětlí a poradí. Doporučuji a děkuji ❤️ Jsem nadmíru spokojená, nemám žádnou nevýhodu.",
    verified: true,
  },
  {
    id: 4,
    name: "Ověřený zákazník",
    date: "26.3.2025",
    rating: 5,
    text: "Krásně a bezpečně zabaleno. Vše v kvalitě a množství jak obchod sliboval. Jsem moc spokojená.",
    verified: true,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
            Co říkají zákazníci
          </h2>
          <p className="text-lg text-[#2C3E50]/70 max-w-2xl mx-auto">
            Recenze spokojených zákazníků z Heureky
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="p-6 md:p-8 bg-white border-pink-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <Quote className="w-8 h-8 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" 
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-[#2C3E50]/90 mb-4 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-[#2C3E50]">
                        {testimonial.name}
                      </p>
                      <p className="text-[#2C3E50]/60">
                        {testimonial.date}
                      </p>
                    </div>
                    {testimonial.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Ověřený zákazník
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Link to Heureka */}
        <div className="text-center mt-12">
          <a
            href="https://obchody.heureka.cz/ohorai-cz/recenze/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline font-medium"
          >
            Zobrazit všechny recenze na Heurece
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
