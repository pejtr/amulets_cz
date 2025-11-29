import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { quizQuestions, calculateQuizResult } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { track } from "@/lib/tracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  // Track quiz start
  useEffect(() => {
    track.quizStarted();
  }, []);

  // Track quiz progress
  useEffect(() => {
    if (currentQuestion > 0) {
      track.quizProgress(currentQuestion + 1, quizQuestions.length);
    }
  }, [currentQuestion]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, question.options[selectedOption].symbol];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      // Poslední otázka - vypočítáme výsledek
      const result = calculateQuizResult(newAnswers);
      setLocation(`/kviz/vysledek/${result}`);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
      setSelectedOption(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">
                Otázka {currentQuestion + 1} z {quizQuestions.length}
              </p>
              <p className="text-sm font-semibold text-primary">
                {Math.round(progress)}%
              </p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedOption === index
                      ? "border-primary bg-primary/5 shadow-lg scale-105"
                      : "border-border hover:border-primary/50 hover:shadow-md hover:scale-102"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-lg font-medium text-foreground">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            {currentQuestion > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Zpět
              </Button>
            )}
            <Button
              size="lg"
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`${currentQuestion === 0 ? "w-full" : "flex-1"} bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700`}
            >
              {currentQuestion < quizQuestions.length - 1 ? "Další" : "Zobrazit výsledek"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Hint */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Vyber odpověď, která tě nejvíce oslovuje
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
