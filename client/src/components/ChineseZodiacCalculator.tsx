import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Čínská znamení s jejich vlastnostmi
const chineseZodiacSigns = [
  { name: "Krysa", emoji: "🐀", slug: "cinsky-horoskop-krysa", traits: "Chytrá, přizpůsobivá, ambiciózní" },
  { name: "Bůvol", emoji: "🐂", slug: "cinsky-horoskop-buvol", traits: "Pracovitý, spolehlivý, trpělivý" },
  { name: "Tygr", emoji: "🐅", slug: "cinsky-horoskop-tygr", traits: "Odvážný, sebevědomý, charismatický" },
  { name: "Králík", emoji: "🐇", slug: "cinsky-horoskop-kralik", traits: "Jemný, diplomatický, elegantní" },
  { name: "Drak", emoji: "🐉", slug: "cinsky-horoskop-drak", traits: "Mocný, štědrý, ambiciózní" },
  { name: "Had", emoji: "🐍", slug: "cinsky-horoskop-had", traits: "Moudrý, intuitivní, tajemný" },
  { name: "Kůň", emoji: "🐎", slug: "cinsky-horoskop-kun", traits: "Energický, nezávislý, dobrodružný" },
  { name: "Koza", emoji: "🐏", slug: "cinsky-horoskop-koza", traits: "Kreativní, jemná, empatická" },
  { name: "Opice", emoji: "🐒", slug: "cinsky-horoskop-opice", traits: "Chytrá, vtipná, přizpůsobivá" },
  { name: "Kohout", emoji: "🐓", slug: "cinsky-horoskop-kohout", traits: "Pracovitý, přesný, sebevědomý" },
  { name: "Pes", emoji: "🐕", slug: "cinsky-horoskop-pes", traits: "Loajální, čestný, ochránce" },
  { name: "Prase", emoji: "🐖", slug: "cinsky-horoskop-prase", traits: "Štědré, upřímné, tolerantní" },
];

// 5 elementů
const elements = [
  { name: "Dřevo", emoji: "🌳", color: "text-green-600", bgColor: "bg-green-100", slug: "element-drevo" },
  { name: "Oheň", emoji: "🔥", color: "text-red-600", bgColor: "bg-red-100", slug: "element-ohen" },
  { name: "Země", emoji: "🌍", color: "text-amber-700", bgColor: "bg-amber-100", slug: "element-zeme" },
  { name: "Kov", emoji: "⚙️", color: "text-gray-600", bgColor: "bg-gray-100", slug: "element-kov" },
  { name: "Voda", emoji: "💧", color: "text-blue-600", bgColor: "bg-blue-100", slug: "element-voda" },
];

// Data čínského nového roku (přibližná data)
const chineseNewYearDates: { [key: number]: string } = {
  1924: "02-05", 1925: "01-25", 1926: "02-13", 1927: "02-02", 1928: "01-23",
  1929: "02-10", 1930: "01-30", 1931: "02-17", 1932: "02-06", 1933: "01-26",
  1934: "02-14", 1935: "02-04", 1936: "01-24", 1937: "02-11", 1938: "01-31",
  1939: "02-19", 1940: "02-08", 1941: "01-27", 1942: "02-15", 1943: "02-05",
  1944: "01-25", 1945: "02-13", 1946: "02-02", 1947: "01-22", 1948: "02-10",
  1949: "01-29", 1950: "02-17", 1951: "02-06", 1952: "01-27", 1953: "02-14",
  1954: "02-03", 1955: "01-24", 1956: "02-12", 1957: "01-31", 1958: "02-18",
  1959: "02-08", 1960: "01-28", 1961: "02-15", 1962: "02-05", 1963: "01-25",
  1964: "02-13", 1965: "02-02", 1966: "01-21", 1967: "02-09", 1968: "01-30",
  1969: "02-17", 1970: "02-06", 1971: "01-27", 1972: "02-15", 1973: "02-03",
  1974: "01-23", 1975: "02-11", 1976: "01-31", 1977: "02-18", 1978: "02-07",
  1979: "01-28", 1980: "02-16", 1981: "02-05", 1982: "01-25", 1983: "02-13",
  1984: "02-02", 1985: "02-20", 1986: "02-09", 1987: "01-29", 1988: "02-17",
  1989: "02-06", 1990: "01-27", 1991: "02-15", 1992: "02-04", 1993: "01-23",
  1994: "02-10", 1995: "01-31", 1996: "02-19", 1997: "02-07", 1998: "01-28",
  1999: "02-16", 2000: "02-05", 2001: "01-24", 2002: "02-12", 2003: "02-01",
  2004: "01-22", 2005: "02-09", 2006: "01-29", 2007: "02-18", 2008: "02-07",
  2009: "01-26", 2010: "02-14", 2011: "02-03", 2012: "01-23", 2013: "02-10",
  2014: "01-31", 2015: "02-19", 2016: "02-08", 2017: "01-28", 2018: "02-16",
  2019: "02-05", 2020: "01-25", 2021: "02-12", 2022: "02-01", 2023: "01-22",
  2024: "02-10", 2025: "01-29", 2026: "02-17", 2027: "02-06", 2028: "01-26",
  2029: "02-13", 2030: "02-03",
};

function getChineseYear(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  const newYearDate = chineseNewYearDates[year];
  if (!newYearDate) return year;
  
  const [newYearMonth, newYearDay] = newYearDate.split("-").map(Number);
  
  // Pokud je datum před čínským novým rokem, patří do předchozího roku
  if (month < newYearMonth || (month === newYearMonth && day < newYearDay)) {
    return year - 1;
  }
  return year;
}

function getZodiacSign(chineseYear: number): typeof chineseZodiacSigns[0] {
  // Krysa je rok 1924, 1936, 1948...
  const index = (chineseYear - 1924) % 12;
  const adjustedIndex = index < 0 ? index + 12 : index;
  return chineseZodiacSigns[adjustedIndex];
}

function getElement(chineseYear: number): typeof elements[0] {
  // Element se mění každé 2 roky
  // 1924-1925: Dřevo, 1926-1927: Oheň, 1928-1929: Země, 1930-1931: Kov, 1932-1933: Voda
  const cycle = Math.floor((chineseYear - 1924) / 2) % 5;
  const adjustedCycle = cycle < 0 ? cycle + 5 : cycle;
  return elements[adjustedCycle];
}

function getYinYang(chineseYear: number): { type: "Yin" | "Yang"; emoji: string } {
  // Sudé roky jsou Yang, liché jsou Yin
  return chineseYear % 2 === 0 
    ? { type: "Yang", emoji: "☯️" }
    : { type: "Yin", emoji: "☯️" };
}

export default function ChineseZodiacCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{
    sign: typeof chineseZodiacSigns[0];
    element: typeof elements[0];
    yinYang: { type: "Yin" | "Yang"; emoji: string };
    chineseYear: number;
  } | null>(null);
  const [error, setError] = useState("");

  const calculateZodiac = () => {
    if (!birthDate) {
      setError("Prosím zadejte datum narození");
      return;
    }

    const date = new Date(birthDate);
    const year = date.getFullYear();

    if (year < 1924 || year > 2030) {
      setError("Prosím zadejte rok mezi 1924 a 2030");
      return;
    }

    setError("");
    const chineseYear = getChineseYear(date);
    const sign = getZodiacSign(chineseYear);
    const element = getElement(chineseYear);
    const yinYang = getYinYang(chineseYear);

    setResult({ sign, element, yinYang, chineseYear });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-red-50 to-amber-50 border-red-200">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl text-red-800 flex items-center justify-center gap-2">
          🐉 Kalkulačka čínského horoskopu
        </CardTitle>
        <CardDescription className="text-red-700">
          Zjistěte své čínské znamení, element a polaritu Yin/Yang
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="flex-1 bg-white border-red-200 focus:border-red-400"
            placeholder="Datum narození"
          />
          <Button 
            onClick={calculateZodiac}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Zjistit znamení
          </Button>
        </div>

        {error && (
          <p className="text-red-600 text-center">{error}</p>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hlavní znamení */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">{result.sign.emoji}</div>
              <h3 className="text-2xl font-bold text-red-800 mb-2">
                {result.sign.name}
              </h3>
              <p className="text-muted-foreground mb-4">{result.sign.traits}</p>
              <Link 
                href={`/symbol/${result.sign.slug}`}
                className="inline-block text-red-600 hover:text-red-800 hover:underline font-medium"
              >
                Více o znamení {result.sign.name} →
              </Link>
            </div>

            {/* Element a Yin/Yang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${result.element.bgColor} text-center`}>
                <div className="text-4xl mb-2">{result.element.emoji}</div>
                <h4 className={`text-lg font-bold ${result.element.color}`}>
                  Element: {result.element.name}
                </h4>
                <Link 
                  href={`/symbol/${result.element.slug}`}
                  className={`text-sm ${result.element.color} hover:underline`}
                >
                  Více o elementu →
                </Link>
              </div>
              <div className="p-4 rounded-xl bg-purple-100 text-center">
                <div className="text-4xl mb-2">{result.yinYang.emoji}</div>
                <h4 className="text-lg font-bold text-purple-700">
                  Polarita: {result.yinYang.type}
                </h4>
                <p className="text-sm text-purple-600">
                  {result.yinYang.type === "Yang" ? "Aktivní, expanzivní energie" : "Receptivní, klidná energie"}
                </p>
              </div>
            </div>

            {/* Čínský rok */}
            <div className="text-center text-muted-foreground">
              <p>Čínský rok narození: <strong>{result.chineseYear}</strong></p>
              <p className="text-sm mt-1">
                Kombinace: {result.element.name}ový {result.sign.name} ({result.yinYang.type})
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
