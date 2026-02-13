export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  duration: string;
  capacity: string;
  icon: string;
  image: string;
  highlights: string[];
  includes: string[];
  schedule: CourseScheduleItem[];
  testimonials?: CourseTestimonial[];
  faq: CourseFAQ[];
}

export interface CourseScheduleItem {
  date: string;
  time: string;
  available: boolean;
}

export interface CourseTestimonial {
  name: string;
  text: string;
  rating: number;
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export const courses: Course[] = [
  {
    id: "tvorba-amuletu",
    slug: "tvorba-amuletu",
    title: "Stvoř svůj talisman",
    subtitle: "Workshop tvorby osobních amuletů",
    description: "Naučte se vytvořit vlastní ochranný amulet nebo talisman, který bude rezonovat s vaší osobní energií.",
    longDescription: `Během tohoto intenzivního workshopu se seznámíte s historií amuletů napříč kulturami, významem 33 posvátných symbolů a technikami jejich aktivace.

Naučíte se vybrat správný symbol podle vaší intuice i astrologického určení, pracovat s různými materiály (drahé kameny, kovy, přírodní materiály) a vložit do amuletu svůj osobní záměr.

Workshop je vhodný pro úplné začátečníky i pokročilé. Odejdete s vlastnoručně vytvořeným amuletem a znalostmi, jak ho správně aktivovat, nabíjet a pečovat o něj.`,
    price: 2490,
    duration: "6 hodin",
    capacity: "8-12 účastníků",
    icon: "💜",
    image: "/images/courses/tvorba-amuletu.webp",
    highlights: [
      "Historie amuletů napříč kulturami",
      "33 posvátných symbolů a jejich význam",
      "Práce s drahými kameny a kovy",
      "Techniky vázání a komponování",
      "Rituál aktivace amuletu",
    ],
    includes: [
      "Vlastnoručně vytvořený amulet",
      "Sada materiálů pro tvorbu",
      "Tištěný průvodce 33 symboly",
      "Certifikát o absolvování",
      "Občerstvení (bylinný čaj, zdravé svačiny)",
    ],
    schedule: [
      { date: "25. ledna 2026", time: "10:00 - 16:00", available: true },
      { date: "8. března 2026", time: "10:00 - 16:00", available: true },
      { date: "19. dubna 2026", time: "10:00 - 16:00", available: true },
    ],
    testimonials: [
      {
        name: "Petra K.",
        text: "Úžasný zážitek! Natálie má dar předávat znalosti s láskou a trpělivostí. Můj amulet nosím každý den.",
        rating: 5,
      },
      {
        name: "Martin V.",
        text: "Překvapilo mě, jak hluboký může být takový workshop. Odnesl jsem si nejen amulet, ale i nový pohled na život.",
        rating: 5,
      },
    ],
    faq: [
      {
        question: "Musím mít předchozí zkušenosti?",
        answer: "Ne, kurz je vhodný pro úplné začátečníky. Vše vám krok za krokem vysvětlíme.",
      },
      {
        question: "Co si mám vzít s sebou?",
        answer: "Pohodlné oblečení a otevřenou mysl. Vše ostatní je zahrnuto v ceně kurzu.",
      },
      {
        question: "Mohu si vybrat vlastní symbol?",
        answer: "Ano, během kurzu vám pomůžeme najít symbol, který nejvíce rezonuje s vaší energií.",
      },
    ],
  },
  {
    id: "michani-esenci",
    slug: "michani-esenci",
    title: "Alchymie vůní",
    subtitle: "Workshop míchání posvátných esencí se záměrem",
    description: "Objevte umění aromaterapie na duchovní úrovni. Naučte se míchat esenciální oleje s konkrétním záměrem.",
    longDescription: `Ponořte se do fascinujícího světa posvátných vůní. Od starověkého Egypta přes Indii až po Tibet - vůně vždy hrály klíčovou roli v duchovních praktikách.

Během workshopu se naučíte rozpoznávat jednotlivé esence a jejich vlastnosti, formulovat jasný záměr a vytvářet vlastní směsi pro ochranu, lásku, hojnost nebo duchovní růst.

Praktická část zahrnuje vytvoření osobního parfému a ochranného spreje pro domov. Odejdete s vlastními výtvory a sadou 12 základních esenciálních olejů.`,
    price: 1990,
    duration: "5 hodin",
    capacity: "6-10 účastníků",
    icon: "🌸",
    image: "/images/courses/michani-esenci.webp",
    highlights: [
      "Historie posvátných vůní",
      "Vlastnosti 20+ esenciálních olejů",
      "Práce se záměrem a meditace",
      "Techniky míchání a vrstvení",
      "Bezpečnost při práci s oleji",
    ],
    includes: [
      "2 vlastnoručně namíchané esence",
      "Sada 12 základních esenciálních olejů",
      "Prázdné lahvičky pro další tvorbu",
      "Tištěný průvodce esencemi",
      "Certifikát o absolvování",
      "Občerstvení",
    ],
    schedule: [
      { date: "8. února 2026", time: "10:00 - 15:00", available: true },
      { date: "22. března 2026", time: "10:00 - 15:00", available: true },
      { date: "3. května 2026", time: "10:00 - 15:00", available: true },
    ],
    testimonials: [
      {
        name: "Jana M.",
        text: "Vůně, které jsem vytvořila, mě provází každý den. Je to jako mít kousek magie v lahvičce.",
        rating: 5,
      },
    ],
    faq: [
      {
        question: "Jsou esenciální oleje bezpečné?",
        answer: "Ano, při správném použití. Během kurzu vás naučíme všechna bezpečnostní pravidla.",
      },
      {
        question: "Mohu si odnést vytvořené esence domů?",
        answer: "Samozřejmě! Vytvoříte si osobní parfém a ochranný sprej, které si odnesete.",
      },
    ],
  },
  {
    id: "prace-s-krystaly",
    slug: "prace-s-krystaly",
    title: "Krystalová magie",
    subtitle: "Workshop práce s drahými kameny",
    description: "Ponořte se do fascinujícího světa krystalů a drahých kamenů. Naučte se je vybírat, čistit, nabíjet a používat.",
    longDescription: `Krystaly a drahé kameny fascinují lidstvo od pradávna. Každý kámen má svou jedinečnou energii a vlastnosti, které můžeme využít pro léčení, meditaci i každodenní ochranu.

Během workshopu se naučíte rozpoznávat pravé kameny od napodobenin, vybírat krystaly podle intuice i astrologického určení, správně je čistit a nabíjet.

Praktická část zahrnuje meditaci s krystaly, vytvoření krystalové mřížky a osobního ochranného sáčku. Odejdete se sadou 7 základních krystalů (čakrová sada) a selenitovou destičkou pro čištění.`,
    price: 2290,
    duration: "6 hodin",
    capacity: "8-12 účastníků",
    icon: "💎",
    image: "/images/courses/prace-s-krystaly.webp",
    highlights: [
      "Jak krystaly vznikají a proč mají energii",
      "50 nejdůležitějších kamenů a jejich vlastnosti",
      "Kameny podle znamení zvěrokruhu a čaker",
      "Metody čištění a nabíjení",
      "Krystalové mřížky a léčení",
    ],
    includes: [
      "Sada 7 základních krystalů (čakrová sada)",
      "Selenitová destička pro čištění",
      "Sametový sáček na krystaly",
      "Tištěný průvodce 50 kameny",
      "Certifikát o absolvování",
      "Občerstvení",
    ],
    schedule: [
      { date: "22. února 2026", time: "10:00 - 16:00", available: true },
      { date: "5. dubna 2026", time: "10:00 - 16:00", available: true },
      { date: "17. května 2026", time: "10:00 - 16:00", available: true },
    ],
    testimonials: [
      {
        name: "Lucie H.",
        text: "Konečně rozumím, jak s krystaly pracovat. Čakrová sada je nádherná a používám ji každý den při meditaci.",
        rating: 5,
      },
      {
        name: "Tomáš R.",
        text: "Jako skeptik jsem přišel s pochybnostmi, ale odcházel jsem s novým pohledem. Doporučuji každému.",
        rating: 5,
      },
    ],
    faq: [
      {
        question: "Jak poznám pravý kámen od napodobeniny?",
        answer: "Během kurzu vás naučíme základní metody rozpoznávání pravých kamenů - teplota, váha, struktura.",
      },
      {
        question: "Jsou krystaly vhodné pro děti?",
        answer: "Ano, práce s krystaly je bezpečná pro všechny věkové kategorie. Kurz je však určen pro dospělé.",
      },
    ],
  },
];

export const courseBundle = {
  id: "tvurci-trojka",
  slug: "balicek-tvurci-trojka",
  title: "Tvůrčí trojka",
  subtitle: "Všechny 3 kurzy za zvýhodněnou cenu",
  description: "Kompletní balíček všech tří kurzů se slevou 19%. Ideální pro ty, kteří chtějí proniknout do světa amuletů, esencí i krystalů.",
  originalPrice: 6770,
  price: 5490,
  savings: 1280,
  courses: ["tvorba-amuletu", "michani-esenci", "prace-s-krystaly"],
};
