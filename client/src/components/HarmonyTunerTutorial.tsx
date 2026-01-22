import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Play, Volume2, Mic, Music, Sparkles } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ReactNode;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Vítejte v HarmonyTuneru! 🎵',
    description: 'Tento nástroj vám pomůže harmonizovat vaši energii pomocí posvátných Solfeggio frekvencí. Pojďme si projít všechny funkce.',
    targetSelector: '.harmony-tuner-panel',
    position: 'bottom',
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
  },
  {
    id: 'play-button',
    title: 'Tlačítko Play/Pause',
    description: 'Klikněte pro spuštění nebo pozastavení přehrávání vybraných frekvencí. Můžete přehrávat více frekvencí současně!',
    targetSelector: '.harmony-play-button',
    position: 'bottom',
    icon: <Play className="w-6 h-6 text-green-400" />,
  },
  {
    id: 'volume',
    title: 'Ovládání hlasitosti',
    description: 'Upravte hlasitost podle svých preferencí. Doporučujeme střední hlasitost pro relaxaci.',
    targetSelector: '.harmony-volume-control',
    position: 'bottom',
    icon: <Volume2 className="w-6 h-6 text-blue-400" />,
  },
  {
    id: 'frequencies',
    title: 'Solfeggio frekvence',
    description: 'Vyberte jednu nebo více frekvencí kliknutím na tlačítka. Každá frekvence má specifický účinek na vaši energii a čakry.',
    targetSelector: '.harmony-frequencies',
    position: 'top',
    icon: <Music className="w-6 h-6 text-purple-400" />,
  },
  {
    id: 'frequency-detail',
    title: 'Detail frekvence',
    description: 'Každé tlačítko zobrazuje frekvenci v Hz, její název a příslušnou čakru. Najeďte myší pro více informací.',
    targetSelector: '.harmony-frequency-button',
    position: 'top',
    icon: <Music className="w-6 h-6 text-amber-400" />,
  },
  {
    id: 'mic-analyzer',
    title: 'Audio Analyzér 🎤',
    description: 'Klikněte na zelené tlačítko s mikrofonem pro analýzu zvuku. Můžete nahrát vlastní zvuk a zjistit jeho frekvenci!',
    targetSelector: '.harmony-mic-button',
    position: 'bottom',
    icon: <Mic className="w-6 h-6 text-green-400" />,
  },
  {
    id: 'finish',
    title: 'Jste připraveni! ✨',
    description: 'Nyní znáte všechny funkce HarmonyTuneru. Začněte vybráním frekvence a stiskněte Play. Přejeme vám harmonickou cestu!',
    targetSelector: '.harmony-tuner-panel',
    position: 'bottom',
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
  },
];

const STORAGE_KEY = 'harmony-tuner-tutorial-completed';

interface HarmonyTunerTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function HarmonyTunerTutorial({ isOpen, onClose, onComplete }: HarmonyTunerTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const step = TUTORIAL_STEPS[currentStep];

  const updateHighlight = useCallback(() => {
    if (!step) return;
    
    const element = document.querySelector(step.targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);
    }
  }, [step]);

  useEffect(() => {
    if (isOpen) {
      updateHighlight();
      window.addEventListener('resize', updateHighlight);
      window.addEventListener('scroll', updateHighlight);
      
      return () => {
        window.removeEventListener('resize', updateHighlight);
        window.removeEventListener('scroll', updateHighlight);
      };
    }
  }, [isOpen, currentStep, updateHighlight]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onClose();
  };

  if (!isOpen) return null;

  const getTooltipPosition = () => {
    if (!highlightRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    switch (step.position) {
      case 'top':
        return {
          top: `${highlightRect.top - tooltipHeight - padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: `${highlightRect.bottom + padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          left: `${highlightRect.left - tooltipWidth - padding}px`,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          left: `${highlightRect.right + padding}px`,
          transform: 'translateY(-50%)',
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Highlight cutout */}
      {highlightRect && (
        <div
          className="absolute border-2 border-amber-400 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none animate-pulse"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-400/50 rounded-xl shadow-2xl p-5 max-w-xs w-80 z-[10000]"
        style={getTooltipPosition()}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Zavřít tutoriál"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-3">
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentStep
                  ? 'w-6 bg-amber-400'
                  : index < currentStep
                  ? 'w-3 bg-amber-400/50'
                  : 'w-3 bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center">
            {step.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">{step.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
              currentStep === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Zpět
          </button>

          <span className="text-gray-500 text-xs">
            {currentStep + 1} / {TUTORIAL_STEPS.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg text-sm transition-all"
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Dokončit' : 'Další'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook pro kontrolu, zda uživatel viděl tutoriál
export function useHarmonyTutorial() {
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true); // Default true to prevent flash
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY) === 'true';
    setHasSeenTutorial(seen);
    // Tutoriál se nespouští automaticky - pouze manuálně přes tlačítko
  }, []);

  const startTutorial = () => setShowTutorial(true);
  const closeTutorial = () => setShowTutorial(false);
  const completeTutorial = () => {
    setHasSeenTutorial(true);
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSeenTutorial(false);
  };

  return {
    hasSeenTutorial,
    showTutorial,
    startTutorial,
    closeTutorial,
    completeTutorial,
    resetTutorial,
  };
}
