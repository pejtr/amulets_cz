import { createContext, useContext, useState, ReactNode } from "react";

interface MeditationState {
  // Harmony Tuner state
  isTunerFullscreen: boolean;
  setTunerFullscreen: (value: boolean) => void;
  currentFrequency: number;
  setCurrentFrequency: (hz: number) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  
  // Meditation mode state
  isMeditationMode: boolean;
  setMeditationMode: (value: boolean) => void;
  
  // Chatbot integration
  chatbotPosition: 'default' | 'top' | 'side';
  setChatbotPosition: (position: 'default' | 'top' | 'side') => void;
  chatbotExpanded: boolean;
  setChatbotExpanded: (value: boolean) => void;
}

const MeditationContext = createContext<MeditationState | undefined>(undefined);

export function MeditationProvider({ children }: { children: ReactNode }) {
  const [isTunerFullscreen, setTunerFullscreen] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(432);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMeditationMode, setMeditationMode] = useState(false);
  const [chatbotPosition, setChatbotPosition] = useState<'default' | 'top' | 'side'>('default');
  const [chatbotExpanded, setChatbotExpanded] = useState(false);

  return (
    <MeditationContext.Provider
      value={{
        isTunerFullscreen,
        setTunerFullscreen,
        currentFrequency,
        setCurrentFrequency,
        isPlaying,
        setIsPlaying,
        isMeditationMode,
        setMeditationMode,
        chatbotPosition,
        setChatbotPosition,
        chatbotExpanded,
        setChatbotExpanded,
      }}
    >
      {children}
    </MeditationContext.Provider>
  );
}

export function useMeditation() {
  const context = useContext(MeditationContext);
  if (context === undefined) {
    throw new Error("useMeditation must be used within a MeditationProvider");
  }
  return context;
}

// Frequency info helper
export const FREQUENCY_INFO: Record<number, { name: string; description: string; tip: string }> = {
  174: {
    name: "Základní tón",
    description: "Uzemňující energie pro stabilitu",
    tip: "Zavři oči a představ si kořeny rostoucí z tvých nohou hluboko do země...",
  },
  285: {
    name: "Obnova tkání",
    description: "Regenerace a léčení těla",
    tip: "Dýchej zhluboka a představ si zlaté světlo proudící tvým tělem...",
  },
  396: {
    name: "Osvobození",
    description: "Uvolnění strachu a viny",
    tip: "S každým výdechem pusť všechny obavy a negativní myšlenky...",
  },
  417: {
    name: "Změna",
    description: "Transformace a nové začátky",
    tip: "Představ si, jak se staré vzorce rozpouštějí a uvolňují místo novému...",
  },
  432: {
    name: "Harmonie",
    description: "Univerzální ladění s přírodou",
    tip: "Tato frekvence je v souladu s vibracemi vesmíru. Nech ji prostoupit celou tvou bytostí...",
  },
  528: {
    name: "Láska",
    description: "Frekvence zázraků a DNA opravy",
    tip: "Otevři své srdce a představ si smaragdově zelené světlo vyzařující z tvého srdce...",
  },
  639: {
    name: "Vztahy",
    description: "Spojení duší a harmonie vztahů",
    tip: "Mysli na lidi, které miluješ. Pošli jim lásku a světlo...",
  },
  741: {
    name: "Probuzení",
    description: "Intuice a vnitřní hlas",
    tip: "Zaměř se na oblast třetího oka. Nech intuici proudit...",
  },
  852: {
    name: "Duchovní řád",
    description: "Návrat k duchovnímu pořádku",
    tip: "Představ si indigově modré světlo aktivující tvé třetí oko...",
  },
  963: {
    name: "Jednota",
    description: "Spojení s vyšším vědomím",
    tip: "Představ si fialové světlo na temeni hlavy spojující tě s vesmírem...",
  },
};
