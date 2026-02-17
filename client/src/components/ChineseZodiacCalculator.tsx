import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SIGN_KEYS = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"] as const;
const SIGN_EMOJIS = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐏", "🐒", "🐓", "🐕", "🐖"];
const SIGN_SLUGS = [
  "cinsky-horoskop-krysa", "cinsky-horoskop-buvol", "cinsky-horoskop-tygr", "cinsky-horoskop-kralik",
  "cinsky-horoskop-drak", "cinsky-horoskop-had", "cinsky-horoskop-kun", "cinsky-horoskop-koza",
  "cinsky-horoskop-opice", "cinsky-horoskop-kohout", "cinsky-horoskop-pes", "cinsky-horoskop-prase",
];

const ELEMENT_KEYS = ["wood", "fire", "earth", "metal", "water"] as const;
const ELEMENT_EMOJIS = ["🌳", "🔥", "🌍", "⚙️", "💧"];
const ELEMENT_COLORS = ["text-green-600", "text-red-600", "text-amber-700", "text-gray-600", "text-blue-600"];
const ELEMENT_BG_COLORS = ["bg-green-100", "bg-red-100", "bg-amber-100", "bg-gray-100", "bg-blue-100"];
const ELEMENT_SLUGS = ["element-drevo", "element-ohen", "element-zeme", "element-kov", "element-voda"];

// Chinese New Year dates
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
  if (month < newYearMonth || (month === newYearMonth && day < newYearDay)) {
    return year - 1;
  }
  return year;
}

function getZodiacIndex(chineseYear: number): number {
  const index = (chineseYear - 1924) % 12;
  return index < 0 ? index + 12 : index;
}

function getElementIndex(chineseYear: number): number {
  const cycle = Math.floor((chineseYear - 1924) / 2) % 5;
  return cycle < 0 ? cycle + 5 : cycle;
}

function getYinYang(chineseYear: number): "Yang" | "Yin" {
  return chineseYear % 2 === 0 ? "Yang" : "Yin";
}

export default function ChineseZodiacCalculator() {
  const { t } = useTranslation();
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{
    signIndex: number;
    elementIndex: number;
    yinYang: "Yang" | "Yin";
    chineseYear: number;
  } | null>(null);
  const [error, setError] = useState("");

  const calculateZodiac = () => {
    if (!birthDate) {
      setError(t('zh.calc.errorEmpty'));
      return;
    }

    const date = new Date(birthDate);
    const year = date.getFullYear();

    if (year < 1924 || year > 2030) {
      setError(t('zh.calc.errorRange'));
      return;
    }

    setError("");
    const chineseYear = getChineseYear(date);
    setResult({
      signIndex: getZodiacIndex(chineseYear),
      elementIndex: getElementIndex(chineseYear),
      yinYang: getYinYang(chineseYear),
      chineseYear,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-red-50 to-amber-50 border-red-200">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl text-red-800 flex items-center justify-center gap-2">
          {t('zh.calc.title')}
        </CardTitle>
        <CardDescription className="text-red-700">
          {t('zh.calc.desc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="flex-1 bg-white border-red-200 focus:border-red-400"
            placeholder={t('zh.calc.placeholder')}
          />
          <Button 
            onClick={calculateZodiac}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {t('zh.calc.button')}
          </Button>
        </div>

        {error && (
          <p className="text-red-600 text-center">{error}</p>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Main sign */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">{SIGN_EMOJIS[result.signIndex]}</div>
              <h3 className="text-2xl font-bold text-red-800 mb-2">
                {t(`zh.sign.${SIGN_KEYS[result.signIndex]}`)}
              </h3>
              <p className="text-muted-foreground mb-4">{t(`zh.traits.${SIGN_KEYS[result.signIndex]}`)}</p>
              <Link 
                href={`/symbol/${SIGN_SLUGS[result.signIndex]}`}
                className="inline-block text-red-600 hover:text-red-800 hover:underline font-medium"
              >
                {t('zh.calc.moreAbout', { sign: t(`zh.sign.${SIGN_KEYS[result.signIndex]}`) })}
              </Link>
            </div>

            {/* Element and Yin/Yang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${ELEMENT_BG_COLORS[result.elementIndex]} text-center`}>
                <div className="text-4xl mb-2">{ELEMENT_EMOJIS[result.elementIndex]}</div>
                <h4 className={`text-lg font-bold ${ELEMENT_COLORS[result.elementIndex]}`}>
                  {t('zh.calc.element', { name: t(`zh.el.${ELEMENT_KEYS[result.elementIndex]}`) })}
                </h4>
                <Link 
                  href={`/symbol/${ELEMENT_SLUGS[result.elementIndex]}`}
                  className={`text-sm ${ELEMENT_COLORS[result.elementIndex]} hover:underline`}
                >
                  {t('zh.calc.moreElement')}
                </Link>
              </div>
              <div className="p-4 rounded-xl bg-purple-100 text-center">
                <div className="text-4xl mb-2">☯️</div>
                <h4 className="text-lg font-bold text-purple-700">
                  {t('zh.calc.polarity', { type: result.yinYang })}
                </h4>
                <p className="text-sm text-purple-600">
                  {result.yinYang === "Yang" ? t('zh.calc.yang') : t('zh.calc.yin')}
                </p>
              </div>
            </div>

            {/* Chinese year */}
            <div className="text-center text-muted-foreground">
              <p>{t('zh.calc.chineseYear')} <strong>{result.chineseYear}</strong></p>
              <p className="text-sm mt-1">
                {t('zh.calc.combination')} {t(`zh.el.${ELEMENT_KEYS[result.elementIndex]}`)} {t(`zh.sign.${SIGN_KEYS[result.signIndex]}`)} ({result.yinYang})
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
