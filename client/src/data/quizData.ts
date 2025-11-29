// Kvíz "Zjisti svůj spirituální symbol"

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    symbol: string; // slug symbolu
    emoji: string;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Co je pro tebe v životě nejdůležitější?",
    options: [
      { text: "Ochrana a bezpečí", symbol: "ruka-fatimy", emoji: "🛡️" },
      { text: "Láska a vztahy", symbol: "jin-jang", emoji: "💕" },
      { text: "Duchovní růst", symbol: "kvet-zivota", emoji: "🌸" },
      { text: "Síla a odvaha", symbol: "cinsky-drak", emoji: "🐉" },
    ],
  },
  {
    id: 2,
    question: "Jak nejraději trávíš volný čas?",
    options: [
      { text: "Meditací a introspektivou", symbol: "buddha", emoji: "🧘" },
      { text: "V přírodě a s blízkými", symbol: "strom-zivota", emoji: "🌳" },
      { text: "Tvořivou prací", symbol: "om", emoji: "🎨" },
      { text: "Studiem a učením se", symbol: "horovo-oko", emoji: "📚" },
    ],
  },
  {
    id: 3,
    question: "Jakou energii chceš přitáhnout do svého života?",
    options: [
      { text: "Harmonii a rovnováhu", symbol: "jin-jang", emoji: "☯️" },
      { text: "Hojnost a prosperitu", symbol: "cinsky-drak", emoji: "💰" },
      { text: "Moudrost a intuici", symbol: "horovo-oko", emoji: "🔮" },
      { text: "Lásku a soucit", symbol: "kvet-zivota-v-lotosu", emoji: "💖" },
    ],
  },
  {
    id: 4,
    question: "Co tě nejvíce inspiruje?",
    options: [
      { text: "Starověké tradice a mystika", symbol: "ankh", emoji: "🏛️" },
      { text: "Příroda a její cykly", symbol: "strom-zivota", emoji: "🍃" },
      { text: "Geometrie a matematika", symbol: "metatronova-krychle", emoji: "📐" },
      { text: "Duchovní učitelé", symbol: "buddha", emoji: "🙏" },
    ],
  },
  {
    id: 5,
    question: "Jaký je tvůj životní cíl?",
    options: [
      { text: "Najít vnitřní klid", symbol: "om", emoji: "🕉️" },
      { text: "Chránit své blízké", symbol: "ruka-fatimy", emoji: "👨‍👩‍👧‍👦" },
      { text: "Dosáhnout osvícení", symbol: "kvet-zivota", emoji: "✨" },
      { text: "Transformovat se", symbol: "merkaba", emoji: "🔄" },
    ],
  },
];

// Mapování symbolů na jejich vlastnosti
export const symbolMapping: Record<string, {
  name: string;
  slug: string;
  description: string;
  traits: string[];
}> = {
  "ruka-fatimy": {
    name: "Ruka Fatimy",
    slug: "ruka-fatimy",
    description: "Jsi ochránce a pečovatel. Ruka Fatimy tě chrání před negativními energiemi a přináší ti klid.",
    traits: ["Ochranný", "Pečující", "Empatický", "Silný"],
  },
  "jin-jang": {
    name: "Jin Jang",
    slug: "jin-jang",
    description: "Hledáš harmonii a rovnováhu. Jin Jang ti pomůže najít střed mezi protiklady.",
    traits: ["Vyvážený", "Harmonický", "Klidný", "Moudrý"],
  },
  "kvet-zivota": {
    name: "Květ života",
    slug: "kvet-zivota",
    description: "Jsi duchovně probuzený. Květ života reprezentuje tvé spojení s univerzální energií.",
    traits: ["Duchovní", "Probuzený", "Spojený", "Osvícený"],
  },
  "cinsky-drak": {
    name: "Čínský drak",
    slug: "cinsky-drak",
    description: "Jsi silný a odvážný. Čínský drak ti přináší sílu, hojnost a ochranu.",
    traits: ["Silný", "Odvážný", "Prosperující", "Ochranný"],
  },
  "buddha": {
    name: "Buddha",
    slug: "buddha",
    description: "Hledáš osvícení a vnitřní klid. Buddha ti ukazuje cestu k probuzení.",
    traits: ["Klidný", "Meditativní", "Osvícený", "Soucitný"],
  },
  "strom-zivota": {
    name: "Strom života",
    slug: "strom-zivota",
    description: "Jsi propojený s přírodou a rodinou. Strom života reprezentuje tvé kořeny a růst.",
    traits: ["Propojený", "Rostoucí", "Zakořeněný", "Rodinný"],
  },
  "om": {
    name: "Om",
    slug: "om",
    description: "Jsi tvůrčí a duchovně naladěný. Om je posvátný zvuk stvoření a transformace.",
    traits: ["Tvůrčí", "Duchovní", "Transformující", "Vibrující"],
  },
  "horovo-oko": {
    name: "Horovo oko",
    slug: "horovo-oko",
    description: "Máš silnou intuici a duchovní vidění. Horovo oko tě chrání a zesiluje tvou moudrost.",
    traits: ["Intuitivní", "Moudrý", "Vidoucí", "Ochranný"],
  },
  "kvet-zivota-v-lotosu": {
    name: "Květ života v lotosu",
    slug: "kvet-zivota-v-lotosu",
    description: "Jsi láskyplný a soucitný. Květ života v lotosu reprezentuje čistotu a duchovní lásku.",
    traits: ["Láskyplný", "Soucitný", "Čistý", "Duchovní"],
  },
  "ankh": {
    name: "Ankh",
    slug: "ankh",
    description: "Jsi fascinován mystériem života. Ankh je starověký symbol věčného života a moudrosti.",
    traits: ["Mystický", "Věčný", "Moudrý", "Starověký"],
  },
  "metatronova-krychle": {
    name: "Metatronova krychle",
    slug: "metatronova-krychle",
    description: "Jsi analytický a duchovně vyspělý. Metatronova krychle reprezentuje dokonalost geometrie.",
    traits: ["Analytický", "Geometrický", "Dokonalý", "Vyspělý"],
  },
  "merkaba": {
    name: "Merkaba",
    slug: "merkaba",
    description: "Jsi transformující se bytost. Merkaba je vozidlo světla pro tvou duchovní cestu.",
    traits: ["Transformující", "Světelný", "Cestující", "Evoluční"],
  },
};

// Funkce pro výpočet výsledku kvízu
export function calculateQuizResult(answers: string[]): string {
  // Spočítáme výskyty jednotlivých symbolů
  const symbolCounts: Record<string, number> = {};
  
  answers.forEach(symbol => {
    symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
  });
  
  // Najdeme symbol s nejvíce výskyty
  let maxCount = 0;
  let resultSymbol = answers[0]; // fallback
  
  Object.entries(symbolCounts).forEach(([symbol, count]) => {
    if (count > maxCount) {
      maxCount = count;
      resultSymbol = symbol;
    }
  });
  
  return resultSymbol;
}
