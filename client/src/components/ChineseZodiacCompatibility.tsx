import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const signs = [
  { name: "Krysa", emoji: "🐀", slug: "cinsky-horoskop-krysa" },
  { name: "Bůvol", emoji: "🐂", slug: "cinsky-horoskop-buvol" },
  { name: "Tygr", emoji: "🐅", slug: "cinsky-horoskop-tygr" },
  { name: "Králík", emoji: "🐇", slug: "cinsky-horoskop-kralik" },
  { name: "Drak", emoji: "🐉", slug: "cinsky-horoskop-drak" },
  { name: "Had", emoji: "🐍", slug: "cinsky-horoskop-had" },
  { name: "Kůň", emoji: "🐎", slug: "cinsky-horoskop-kun" },
  { name: "Koza", emoji: "🐏", slug: "cinsky-horoskop-koza" },
  { name: "Opice", emoji: "🐒", slug: "cinsky-horoskop-opice" },
  { name: "Kohout", emoji: "🐓", slug: "cinsky-horoskop-kohout" },
  { name: "Pes", emoji: "🐕", slug: "cinsky-horoskop-pes" },
  { name: "Prase", emoji: "🐖", slug: "cinsky-horoskop-prase" },
];

// Kompatibilita: 3 = výborná, 2 = dobrá, 1 = neutrální, 0 = špatná
// Matice kompatibility (symetrická)
const compatibilityMatrix: number[][] = [
  // Krysa, Bůvol, Tygr, Králík, Drak, Had, Kůň, Koza, Opice, Kohout, Pes, Prase
  [2, 3, 1, 1, 3, 1, 0, 1, 3, 1, 1, 2], // Krysa
  [3, 2, 0, 1, 1, 3, 1, 1, 1, 3, 1, 1], // Bůvol
  [1, 0, 2, 0, 3, 1, 3, 1, 1, 1, 3, 3], // Tygr
  [1, 1, 0, 2, 1, 1, 1, 3, 1, 0, 3, 3], // Králík
  [3, 1, 3, 1, 2, 1, 1, 1, 3, 3, 0, 1], // Drak
  [1, 3, 1, 1, 1, 2, 0, 1, 1, 3, 1, 1], // Had
  [0, 1, 3, 1, 1, 0, 2, 3, 1, 1, 3, 1], // Kůň
  [1, 1, 1, 3, 1, 1, 3, 2, 1, 1, 1, 3], // Koza
  [3, 1, 1, 1, 3, 1, 1, 1, 2, 1, 1, 1], // Opice
  [1, 3, 1, 0, 3, 3, 1, 1, 1, 2, 1, 1], // Kohout
  [1, 1, 3, 3, 0, 1, 3, 1, 1, 1, 2, 1], // Pes
  [2, 1, 3, 3, 1, 1, 1, 3, 1, 1, 1, 2], // Prase
];

const compatibilityLabels = [
  { value: 3, label: "Výborná", color: "bg-green-500", textColor: "text-green-700", emoji: "💚" },
  { value: 2, label: "Dobrá", color: "bg-blue-400", textColor: "text-blue-700", emoji: "💙" },
  { value: 1, label: "Neutrální", color: "bg-gray-300", textColor: "text-gray-600", emoji: "⚪" },
  { value: 0, label: "Náročná", color: "bg-red-400", textColor: "text-red-700", emoji: "❤️‍🔥" },
];

function getCompatibilityInfo(value: number) {
  return compatibilityLabels.find(l => l.value === value) || compatibilityLabels[2];
}

export default function ChineseZodiacCompatibility() {
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  return (
    <Card className="w-full bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl text-purple-800 flex items-center justify-center gap-2">
          💕 Partnerský čínský horoskop - Kompatibilita znamení
        </CardTitle>
        <CardDescription className="text-purple-700">
          Zjistěte kompatibilitu čínských znamení zvěrokruhu - jak se k sobě hodí jednotlivá čínská znamení v lásce a partnerském vztahu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {compatibilityLabels.map((item) => (
            <div key={item.value} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${item.color}`}></div>
              <span className={`text-sm ${item.textColor}`}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Výběr znamení */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 mb-6">
          {signs.map((sign, index) => (
            <button
              key={sign.name}
              onClick={() => setSelectedSign(selectedSign === index ? null : index)}
              className={`p-2 rounded-lg text-center transition-all ${
                selectedSign === index 
                  ? "bg-purple-600 text-white shadow-lg scale-105" 
                  : "bg-white hover:bg-purple-100 border border-purple-200"
              }`}
            >
              <div className="text-2xl">{sign.emoji}</div>
              <div className="text-xs mt-1 truncate">{sign.name}</div>
            </button>
          ))}
        </div>

        {/* Výsledky pro vybrané znamení */}
        {selectedSign !== null && (
          <div className="bg-white rounded-xl p-6 shadow-lg animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-center mb-4 text-purple-800">
              {signs[selectedSign].emoji} Kompatibilita pro {signs[selectedSign].name}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {signs.map((sign, index) => {
                if (index === selectedSign) return null;
                const compatibility = compatibilityMatrix[selectedSign][index];
                const info = getCompatibilityInfo(compatibility);
                
                return (
                  <Link 
                    key={sign.name}
                    href={`/symbol/${sign.slug}`}
                    className={`p-3 rounded-lg ${info.color} bg-opacity-20 hover:bg-opacity-40 transition-all border-2 border-transparent hover:border-purple-300`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sign.emoji}</span>
                      <div>
                        <div className="font-medium text-sm">{sign.name}</div>
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
                href={`/symbol/${signs[selectedSign].slug}`}
                className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
              >
                Více o znamení {signs[selectedSign].name} →
              </Link>
            </div>
          </div>
        )}

        {/* Kompletní tabulka (skrytá na mobilu) */}
        <div className="hidden lg:block overflow-x-auto">
          <h3 className="text-lg font-bold text-center mb-4 text-purple-800">
            Kompletní tabulka kompatibility
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2"></th>
                {signs.map((sign) => (
                  <th key={sign.name} className="p-1 text-center">
                    <div className="text-lg">{sign.emoji}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signs.map((rowSign, rowIndex) => (
                <tr key={rowSign.name}>
                  <td className="p-1 text-center">
                    <div className="text-lg">{rowSign.emoji}</div>
                  </td>
                  {signs.map((colSign, colIndex) => {
                    const compatibility = compatibilityMatrix[rowIndex][colIndex];
                    const info = getCompatibilityInfo(compatibility);
                    const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
                    
                    return (
                      <td 
                        key={colSign.name}
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
                          title={`${rowSign.name} + ${colSign.name}: ${info.label}`}
                        ></div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nejlepší páry */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-center mb-4 text-purple-800">
            🌟 Nejlepší páry
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { pair: [0, 1], desc: "Krysa & Bůvol - Stabilita a inteligence" },
              { pair: [2, 5], desc: "Tygr & Kůň - Dobrodružství a energie" },
              { pair: [3, 7], desc: "Králík & Koza - Harmonie a kreativita" },
              { pair: [4, 9], desc: "Drak & Kohout - Síla a ambice" },
              { pair: [6, 10], desc: "Kůň & Pes - Loajalita a svoboda" },
              { pair: [11, 2], desc: "Prase & Tygr - Štědrost a odvaha" },
            ].map(({ pair, desc }) => (
              <div key={desc} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">{signs[pair[0]].emoji}</span>
                <span className="text-pink-500">💕</span>
                <span className="text-2xl">{signs[pair[1]].emoji}</span>
                <span className="text-sm text-muted-foreground flex-1">{desc.split(" - ")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
