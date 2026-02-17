import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SIGN_KEYS = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"] as const;
const SIGN_EMOJIS = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐏", "🐒", "🐓", "🐕", "🐖"];
const SIGN_SLUGS = [
  "cinsky-horoskop-krysa", "cinsky-horoskop-buvol", "cinsky-horoskop-tygr", "cinsky-horoskop-kralik",
  "cinsky-horoskop-drak", "cinsky-horoskop-had", "cinsky-horoskop-kun", "cinsky-horoskop-koza",
  "cinsky-horoskop-opice", "cinsky-horoskop-kohout", "cinsky-horoskop-pes", "cinsky-horoskop-prase",
];

// Compatibility: 3 = excellent, 2 = good, 1 = neutral, 0 = challenging
const compatibilityMatrix: number[][] = [
  [2, 3, 1, 1, 3, 1, 0, 1, 3, 1, 1, 2], // Rat
  [3, 2, 0, 1, 1, 3, 1, 1, 1, 3, 1, 1], // Ox
  [1, 0, 2, 0, 3, 1, 3, 1, 1, 1, 3, 3], // Tiger
  [1, 1, 0, 2, 1, 1, 1, 3, 1, 0, 3, 3], // Rabbit
  [3, 1, 3, 1, 2, 1, 1, 1, 3, 3, 0, 1], // Dragon
  [1, 3, 1, 1, 1, 2, 0, 1, 1, 3, 1, 1], // Snake
  [0, 1, 3, 1, 1, 0, 2, 3, 1, 1, 3, 1], // Horse
  [1, 1, 1, 3, 1, 1, 3, 2, 1, 1, 1, 3], // Goat
  [3, 1, 1, 1, 3, 1, 1, 1, 2, 1, 1, 1], // Monkey
  [1, 3, 1, 0, 3, 3, 1, 1, 1, 2, 1, 1], // Rooster
  [1, 1, 3, 3, 0, 1, 3, 1, 1, 1, 2, 1], // Dog
  [2, 1, 3, 3, 1, 1, 1, 3, 1, 1, 1, 2], // Pig
];

const COMPAT_LEVEL_KEYS = ["challenging", "neutral", "good", "excellent"] as const;
const COMPAT_COLORS = ["bg-red-400", "bg-gray-300", "bg-blue-400", "bg-green-500"];
const COMPAT_TEXT_COLORS = ["text-red-700", "text-gray-600", "text-blue-700", "text-green-700"];
const COMPAT_EMOJIS = ["❤️‍🔥", "⚪", "💙", "💚"];

const BEST_PAIRS = [
  { pair: [0, 1], key: "ratOx" },
  { pair: [2, 5], key: "tigerHorse" },
  { pair: [3, 7], key: "rabbitGoat" },
  { pair: [4, 9], key: "dragonRooster" },
  { pair: [6, 10], key: "horseDog" },
  { pair: [11, 2], key: "pigTiger" },
];

export default function ChineseZodiacCompatibility() {
  const { t } = useTranslation();
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const compatibilityLabels = [
    { value: 0, label: t('zh.compat.challenging'), color: COMPAT_COLORS[0], textColor: COMPAT_TEXT_COLORS[0], emoji: COMPAT_EMOJIS[0] },
    { value: 1, label: t('zh.compat.neutral'), color: COMPAT_COLORS[1], textColor: COMPAT_TEXT_COLORS[1], emoji: COMPAT_EMOJIS[1] },
    { value: 2, label: t('zh.compat.good'), color: COMPAT_COLORS[2], textColor: COMPAT_TEXT_COLORS[2], emoji: COMPAT_EMOJIS[2] },
    { value: 3, label: t('zh.compat.excellent'), color: COMPAT_COLORS[3], textColor: COMPAT_TEXT_COLORS[3], emoji: COMPAT_EMOJIS[3] },
  ];

  function getCompatibilityInfo(value: number) {
    return compatibilityLabels.find(l => l.value === value) || compatibilityLabels[1];
  }

  return (
    <Card className="w-full bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl text-purple-800 flex items-center justify-center gap-2">
          {t('zh.compat.title')}
        </CardTitle>
        <CardDescription className="text-purple-700">
          {t('zh.compat.desc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {compatibilityLabels.sort((a, b) => b.value - a.value).map((item) => (
            <div key={item.value} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${item.color}`}></div>
              <span className={`text-sm ${item.textColor}`}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Sign selection */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 mb-6">
          {SIGN_KEYS.map((key, index) => (
            <button
              key={key}
              onClick={() => setSelectedSign(selectedSign === index ? null : index)}
              className={`p-2 rounded-lg text-center transition-all ${
                selectedSign === index 
                  ? "bg-purple-600 text-white shadow-lg scale-105" 
                  : "bg-white hover:bg-purple-100 border border-purple-200"
              }`}
            >
              <div className="text-2xl">{SIGN_EMOJIS[index]}</div>
              <div className="text-xs mt-1 truncate">{t(`zh.sign.${key}`)}</div>
            </button>
          ))}
        </div>

        {/* Results for selected sign */}
        {selectedSign !== null && (
          <div className="bg-white rounded-xl p-6 shadow-lg animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-center mb-4 text-purple-800">
              {SIGN_EMOJIS[selectedSign]} {t('zh.compat.for', { sign: t(`zh.sign.${SIGN_KEYS[selectedSign]}`) })}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SIGN_KEYS.map((key, index) => {
                if (index === selectedSign) return null;
                const compatibility = compatibilityMatrix[selectedSign][index];
                const info = getCompatibilityInfo(compatibility);
                
                return (
                  <Link 
                    key={key}
                    href={`/symbol/${SIGN_SLUGS[index]}`}
                    className={`p-3 rounded-lg ${info.color} bg-opacity-20 hover:bg-opacity-40 transition-all border-2 border-transparent hover:border-purple-300`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{SIGN_EMOJIS[index]}</span>
                      <div>
                        <div className="font-medium text-sm">{t(`zh.sign.${key}`)}</div>
                        <div className={`text-xs ${info.textColor}`}>
                          {info.emoji} {info.label}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <Link 
                href={`/symbol/${SIGN_SLUGS[selectedSign]}`}
                className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
              >
                {t('zh.compat.moreAbout', { sign: t(`zh.sign.${SIGN_KEYS[selectedSign]}`) })}
              </Link>
            </div>
          </div>
        )}

        {/* Full table (hidden on mobile) */}
        <div className="hidden lg:block overflow-x-auto">
          <h3 className="text-lg font-bold text-center mb-4 text-purple-800">
            {t('zh.compat.fullTable')}
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2"></th>
                {SIGN_KEYS.map((key, i) => (
                  <th key={key} className="p-1 text-center">
                    <div className="text-lg">{SIGN_EMOJIS[i]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIGN_KEYS.map((rowKey, rowIndex) => (
                <tr key={rowKey}>
                  <td className="p-1 text-center">
                    <div className="text-lg">{SIGN_EMOJIS[rowIndex]}</div>
                  </td>
                  {SIGN_KEYS.map((colKey, colIndex) => {
                    const compatibility = compatibilityMatrix[rowIndex][colIndex];
                    const info = getCompatibilityInfo(compatibility);
                    const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
                    
                    return (
                      <td 
                        key={colKey}
                        className={`p-1 text-center cursor-pointer transition-all ${
                          isHovered ? "scale-150 z-10" : ""
                        }`}
                        onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div 
                          className={`w-6 h-6 mx-auto rounded ${info.color} ${
                            rowIndex === colIndex ? "opacity-50" : ""
                          }`}
                          title={`${t(`zh.sign.${rowKey}`)} + ${t(`zh.sign.${colKey}`)}: ${info.label}`}
                        ></div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Best pairs */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-center mb-4 text-purple-800">
            {t('zh.compat.bestPairs')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BEST_PAIRS.map(({ pair, key }) => {
              const pairDesc = t(`zh.compat.pair.${key}`);
              const descPart = pairDesc.includes(" - ") ? pairDesc.split(" - ")[1] : pairDesc;
              return (
                <div key={key} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">{SIGN_EMOJIS[pair[0]]}</span>
                  <span className="text-pink-500">💕</span>
                  <span className="text-2xl">{SIGN_EMOJIS[pair[1]]}</span>
                  <span className="text-sm text-muted-foreground flex-1">{descPart}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
