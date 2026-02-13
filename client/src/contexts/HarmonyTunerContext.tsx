import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FrequencyInfo {
  hz: number;
  name: string;
  icon: string;
  description: string;
  meditationTip: string;
}

interface HarmonyTunerContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  currentFrequency: FrequencyInfo | null;
  setCurrentFrequency: (frequency: FrequencyInfo | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const HarmonyTunerContext = createContext<HarmonyTunerContextType | undefined>(undefined);

export function HarmonyTunerProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<FrequencyInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <HarmonyTunerContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        currentFrequency,
        setCurrentFrequency,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </HarmonyTunerContext.Provider>
  );
}

export function useHarmonyTuner() {
  const context = useContext(HarmonyTunerContext);
  if (context === undefined) {
    throw new Error('useHarmonyTuner must be used within a HarmonyTunerProvider');
  }
  return context;
}

// Meditation tips for each frequency
export const FREQUENCY_MEDITATION_TIPS: Record<number, string> = {
  174: "🔥 **Základní tón (174 Hz)** - Uzemňující frekvence\n\nZavřete oči a představte si, jak vaše kořeny pronikají hluboko do země. Cítíte stabilitu a bezpečí. Dýchejte zhluboka a nechte energii proudit skrz vás.",
  285: "🏺 **Obnova tkání (285 Hz)** - Regenerační frekvence\n\nPředstavte si zlaté světlo, které proniká každou buňkou vašeho těla. Cítíte, jak se vaše tělo obnovuje a léčí. Dýchejte pomalu a věnujte pozornost místům, která potřebují uzdravení.",
  396: "🔓 **Osvobození (396 Hz)** - Uvolnění strachu\n\nVydechněte všechny obavy a strach. Představte si, jak se těžké okovy rozpadají a vy jste svobodní. Cítíte lehkost a osvobození. Jste v bezpečí.",
  417: "💎 **Změna (417 Hz)** - Transformační frekvence\n\nPředstavte si, jak se vaše život mění k lepšímu. Staré vzorce mizí a nové možnosti se otevírají. Jste připraveni na pozitivní změnu. Důvěřujte procesu.",
  432: "✨ **Harmonie (432 Hz)** - Univerzální ladění\n\nCítíte, jak jste v harmonii s vesmírem. Vaše dech je v souladu s přírodou. Jste součástí něčeho většího. Nechte se unášet touto harmonickou frekvencí.",
  528: "💚 **Láska (528 Hz)** - Frekvence zázraků\n\nOtevřete své srdce lásce a zázrakům. Představte si, jak zelené světlo vyplňuje vaše srdce a šíří se do celého těla. Cítíte bezpodmínečnou lásku. Jste milováni.",
  639: "🧡 **Vztahy (639 Hz)** - Spojení duší\n\nPředstavte si lidi, které milujete. Cítíte spojení mezi vašimi srdci. Odpuštění a porozumění proudí mezi vámi. Vztahy se léčí a prohlubují.",
  741: "🌸 **Probuzení (741 Hz)** - Intuice\n\nVaše třetí oko se otevírá. Cítíte jasnost a vhled. Důvěřujte své intuici - ví, co je pro vás nejlepší. Jste vedeni vyšší moudrostí.",
  852: "🔮 **Duchovní řád (852 Hz)** - Třetí oko\n\nVaše vědomí se rozšiřuje. Vidíte za hranice hmotného světa. Jste spojeni s duchovními sférami. Nechte se vést světlem.",
  963: "🌀 **Jednota (963 Hz)** - Korunní čakra\n\nJste jedno s vesmírem. Cítíte dokonalou jednotu a spojení se vším, co existuje. Jste čisté vědomí, čistá láska, čisté světlo.",
};
