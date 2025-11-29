import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function QuizCTA() {
  return (
    <section className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 py-16 md:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-bounce">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Zjisti svůj spirituální symbol
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto">
            Odpověz na 5 jednoduchých otázek a objevíme tvůj osobní duchovní symbol, který odráží tvou duši a životní cestu
          </p>

          {/* CTA Button */}
          <Link href="/kviz">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 text-lg px-8 py-6 h-auto"
            >
              Začít kvíz zdarma
              <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
          </Link>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12 text-white/90">
            <div>
              <p className="text-3xl md:text-4xl font-bold">5</p>
              <p className="text-sm md:text-base">otázek</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">2</p>
              <p className="text-sm md:text-base">minuty</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">33</p>
              <p className="text-sm md:text-base">symbolů</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
