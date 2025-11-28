import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Bóďa',
    rating: 5,
    text: 'Z tohoto obchodu jsem vysloveně nadšená! Skvělá komunikace, rychlost dodání a po rozbalení úžas :-)) Nádherný výrobek, který byl krásně zabalený, k tomu dárek v podobě kamínku a kartou s afirmací. Luxusní potěšení duše. Vřele doporučuji.',
    verified: true,
  },
  {
    id: 2,
    name: 'Sarri',
    rating: 5,
    text: 'Paní Natálie pracuje v napojení. Cokoli vytvoří, je úžasné ♥️ Mám ráda obchod Ohorai. Doporučuji každému, kdo by chtěl pro sebe něco udělat – osobní křišťály od paní Natálie mají sílu a krásnou energii…',
    verified: true,
  },
  {
    id: 3,
    name: 'Blanka',
    rating: 5,
    text: 'Natálku znám osobně, je moc milá vše vysvětlí a poradí. Doporučuji a děkuji ❤️ Jsem nadmíru spokojená, nemám žádnou nevýhodu.',
    verified: true,
  },
  {
    id: 4,
    name: 'Ověřený zákazník',
    rating: 5,
    text: 'Krásně a bezpečně zabaleno. Vše v kvalitě a množství jak obchod sliboval. Jsem moc spokojená.',
    verified: true,
  },
  {
    id: 5,
    name: 'Ověřený zákazník',
    rating: 5,
    text: 'Skvělá komunikace, nádherná práce, vřele doporučuji.',
    verified: true,
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-pink-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Co říkají zákazníci
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reálné recenze ověřených zákazníků z Heureka.cz
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-2 border-pink-100 shadow-lg">
                    <CardContent className="p-8">
                      {/* Stars */}
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review Text */}
                      <blockquote className="text-lg text-center mb-6 text-gray-700 italic leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>

                      {/* Author */}
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        {testimonial.verified && (
                          <p className="text-sm text-green-600 flex items-center justify-center gap-1 mt-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Ověřený zákazník Heureka.cz
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:bg-pink-50"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:bg-pink-50"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Přejít na recenzi ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Heureka Link */}
        <div className="text-center mt-8">
          <a
            href="https://obchody.heureka.cz/ohorai-cz/recenze/overene"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-pink-600 transition-colors"
          >
            Zobrazit všechny recenze na Heureka.cz
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
