import { useEffect } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  useEffect(() => {
    // Remove any existing FAQ schema
    const existingScript = document.querySelector('script[data-schema="faq"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create FAQ schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    // Add schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [faqs]);

  return null;
}

// Pre-defined FAQs for different symbol pages
export const symbolFAQs: Record<string, FAQItem[]> = {
  "egyptsky-symbol-lasky": [
    {
      question: "Jaký je nejsilnější egyptský symbol lásky?",
      answer: "Nejsilnějším egyptským symbolem lásky je Ankh - kříž života. Symbolizuje věčnou lásku a nesmrtelnost. Bohyně Isis, patronka lásky, byla často zobrazována s Ankh v ruce."
    },
    {
      question: "Co symbolizuje modrý lotos v egyptské kultuře?",
      answer: "Modrý lotos (Nymphaea caerulea) byl posvátnou květinou starověkého Egypta. Symbolizoval duchovní lásku, probuzení a spojení s božskou láskou. Používal se v chrámových rituálech pro spojení s vyššími sférami."
    },
    {
      question: "Jak používat egyptské symboly lásky?",
      answer: "Egyptské symboly lásky můžete nosit jako šperky nebo amulety, umístit v ložnici pro posílení vztahu, nebo používat při meditaci pro otevření srdeční čakry. Skarabeus se tradičně dával jako dárek lásky."
    }
  ],
  "symbol-ochrany": [
    {
      question: "Který symbol ochrany je nejsilnější?",
      answer: "Mezi nejsilnější ochranné symboly patří Metatronova krychle, Ruka Fatimy (Hamsa), Horovo oko a Pentagram. Každý má specifické vlastnosti - Metatronova krychle chrání na všech úrovních, Hamsa před zlým pohledem, Horovo oko podporuje uzdravení."
    },
    {
      question: "Jak správně používat ochranné symboly?",
      answer: "Ochranné symboly můžete nosit jako šperky, umístit u vchodu do domu, nebo používat při meditaci a vizualizaci. Důležité je symbol pravidelně čistit (kouřem šalvěje nebo měsíčním světlem) a nastavit mu ochranný záměr."
    },
    {
      question: "Mohu kombinovat více ochranných symbolů?",
      answer: "Ano, kombinace více ochranných symbolů zesiluje jejich účinek. Doporučujeme kombinovat osobní amulet (přívěsek), ochranu domova (pyramida nebo obraz) a ochranu u vchodu. Symboly se navzájem doplňují."
    }
  ],
  "nejsilnejsi-ochranny-symbol": [
    {
      question: "Jaký je nejsilnější ochranný symbol na světě?",
      answer: "Nejsilnějším ochranným symbolem je Metatronova krychle - obsahuje všech 5 platónských těles a chrání na všech úrovních existence. Dalšími velmi silnými symboly jsou Květ života, Pentagram a Horovo oko."
    },
    {
      question: "Jak vybrat správný ochranný symbol pro sebe?",
      answer: "Nejlepší ochranný symbol je ten, ke kterému cítíte nejsilnější přitahování. Meditujte nad různými symboly a všimněte si, který ve vás vyvolává největší pocit bezpečí a klidu. Vaše intuice vás povede ke správnému symbolu."
    },
    {
      question: "Fungují ochranné symboly opravdu?",
      answer: "Ochranné symboly fungují na principu energie a záměru. Tisíce let používání jim dalo silnou energetickou signaturu. Klíčem je vaše víra, záměr a pravidelná práce se symbolem. Mnoho lidí hlásí pozitivní změny po začátku používání ochranných symbolů."
    }
  ],
  "symbol-harmonie": [
    {
      question: "Jaký symbol přináší harmonii do života?",
      answer: "Nejznámějším symbolem harmonie je Jin a Jang - reprezentuje dokonalou rovnováhu protikladů. Dalšími symboly harmonie jsou Květ života (harmonizuje energii), Mandala (vesmírná harmonie) a Om (zvuk univerza)."
    },
    {
      question: "Jak používat symboly harmonie pro vnitřní klid?",
      answer: "Symboly harmonie používejte při meditaci, umístěte je do prostoru kde potřebujete uklidnit energii, nebo je noste jako připomínku rovnováhy. Jin a Jang je ideální do ložnice, Květ života do obývacího pokoje."
    },
    {
      question: "Mohou symboly harmonie pomoci ve vztazích?",
      answer: "Ano, symboly harmonie pomáhají vyvážit energie ve vztazích. Jin a Jang podporuje rovnováhu mezi partnery, Mandala harmonizuje rodinné vztahy. Umístěte symbol do společného prostoru pro posílení harmonie."
    }
  ],
  "keltsky-symbol-lasky": [
    {
      question: "Jaký je nejznámější keltský symbol lásky?",
      answer: "Nejznámějším keltským symbolem lásky je Triquetra - tři propojené smyčky symbolizující tělo, mysl a ducha v lásce. Dalším je Keltský uzel lásky - nekonečná linie bez začátku a konce reprezentující věčnou lásku."
    },
    {
      question: "Co znamená Triquetra ve vztahu?",
      answer: "Triquetra ve vztahu symbolizuje spojení tří aspektů: těla (fyzická přitažlivost), mysli (intelektuální spojení) a ducha (duchovní propojení). Když jsou všechny tři v harmonii, vzniká pravá, věčná láska."
    },
    {
      question: "Proč jsou keltské symboly lásky tak mocné?",
      answer: "Keltové věřili v nekonečnost duše a věčnost lásky. Jejich symboly nemají začátek ani konec, což reprezentuje nesmrtelnost pravé lásky. Tato symbolika dává keltským symbolům hluboký duchovní význam."
    }
  ],
  "znak-zivota": [
    {
      question: "Jaký je nejstarší znak života?",
      answer: "Nejstarším a nejznámějším znakem života je egyptský Ankh - kříž života. Je starý více než 5000 let a symbolizuje věčný život a nesmrtelnost. Dalšími znaky života jsou Strom života a Květ života."
    },
    {
      question: "Co symbolizuje Ankh?",
      answer: "Ankh symbolizuje věčný život, nesmrtelnost a klíč k tajemstvím existence. V rukou egyptských bohů představoval moc dávat a udržovat život. Dnes se používá jako symbol duchovního probuzení a věčnosti duše."
    },
    {
      question: "Jak používat znaky života pro vitalitu?",
      answer: "Znaky života noste jako amulety pro posílení vitality, umístěte je v domě pro podporu životní energie, nebo meditujte s nimi pro spojení s věčnou podstatou bytí. Ankh je ideální nosit blízko srdce."
    }
  ],
  "symbol-nesmrtelnosti": [
    {
      question: "Jaký symbol reprezentuje nesmrtelnost?",
      answer: "Nejsilnějším symbolem nesmrtelnosti je Ouroboros - had požírající svůj ocas. Reprezentuje věčný cyklus života, smrti a znovuzrození. Dalšími symboly jsou Ankh (egyptský klíč k věčnému životu) a Fénix (znovuzrození z popela)."
    },
    {
      question: "Co znamená Ouroboros?",
      answer: "Ouroboros (had požírající svůj ocas) symbolizuje věčný návrat, nekonečnost a cyklickou povahu existence. Ukazuje, že konec je vždy novým začátkem. Je to jeden z nejstarších mystických symbolů, nalezený v egyptské, řecké i nordické kultuře."
    },
    {
      question: "Jak symboly nesmrtelnosti pomáhají v duchovním růstu?",
      answer: "Symboly nesmrtelnosti nás učí, že smrt není konec, ale transformace. Pomáhají překonat strach ze smrti, připojit se k věčné podstatě bytí a pochopit cyklickou povahu života. Používejte je při meditaci o životě a smrti."
    }
  ],
  "jin-jang": [
    {
      question: "Co znamená jin a jang?",
      answer: "Jin a Jang (Yin Yang) je symbol dokonale rovnováhy z čínské filozofie. Jin (černá) představuje ženskou energii, tmu, chlad a pasivitu. Jang (bílá) představuje mužskou energii, světlo, teplo a aktivitu. Obě síly se navzájem doplňují."
    },
    {
      question: "Jaké jsou vlastnosti jin a jang?",
      answer: "Jin (Yin): ženská energie, tma, noc, měsíc, chlad, pasivita, klid, země, voda. Jang (Yang): mužská energie, světlo, den, slunce, teplo, aktivita, pohyb, nebe, oheň. Každá část obsahuje semínko té druhé."
    },
    {
      question: "Jak dosáhnout rovnováhy jin a jang v životě?",
      answer: "Rovnováhy dosáhnete vyvážením aktivity a odpočinku, práce a relaxace, dávání a přijímání. Symbol jin a jang používejte při meditaci, umístěte ho do prostoru pro harmonizaci energie, nebo ho noste jako připomínku rovnováhy."
    }
  ],
  "caduceus": [
    {
      question: "Co znamená caduceus?",
      answer: "Caduceus je starověký řecký symbol tvořený holí se dvěma propletenými hady a křídly. Patřil bohu Hermovi, poslovi bohů, a symbolizuje léčení, rovnováhu, hojnost a duchovní transformaci."
    },
    {
      question: "Jaký je rozdíl mezi caduceem a Asklépiovou holí?",
      answer: "Caduceus má dva hady a křídla, patřil Hermovi (boh obchodu a komunikace). Asklépiova hůl má jednoho hada bez křídel a patřila Asklépiovi (boh medicíny). Skutečným symbolem medicíny je Asklépiova hůl, ale caduceus je často používán omylem."
    },
    {
      question: "Proč je caduceus symbolem medicíny?",
      answer: "Caduceus se stal symbolem medicíny v USA na začátku 20. století, kdy byl omylem použit armádním zdravotnickým sborem. Tradičně je caduceus symbolem obchodu a komunikace, zatímco Asklépiova hůl je pravým symbolem léčení."
    }
  ],
  "vesica-piscis": [
    {
      question: "Co je vesica piscis?",
      answer: "Vesica Piscis (latinsky 'rybí měchýř') je základní tvar posvátné geometrie tvořený průnikem dvou kruhů stejné velikosti. Vytváří mandorlu - mandlový tvar v průsečíku."
    },
    {
      question: "Jaký je matematický význam vesica piscis?",
      answer: "Vesica Piscis obsahuje unikátní poměr √3:1 (1:1,732). Z tohoto tvaru lze odvodit rovnostranný trojúhelník a je základem pro konstrukci Květu života. Poměr √3 se objevuje v přírodě, architektuře i hudbě."
    },
    {
      question: "Jaký je duchovní význam vesica piscis?",
      answer: "Vesica Piscis symbolizuje stvoření - ze dvou (dualita) vzniká třetí (jednota). Je považována za bránu mezi světy. V křesťanství byla spojena s Kristem a rybou (ICHTHYS). Používá se pro harmonizaci protikladů."
    }
  ],
  "metatronova-krychle": [
    {
      question: "Co je Metatronova krychle?",
      answer: "Metatronova krychle je komplexní geometrický vzorec posvátné geometrie, který obsahuje všech pět platónských těles - základních stavebních kámenů vesmíru. Je pojmenována po archandělu Metatronovi."
    },
    {
      question: "Proč je Metatronova krychle tak silná?",
      answer: "Metatronova krychle obsahuje všech 5 platónských těles (tetraedr, hexaedr, oktaedr, dodekaedr, ikosaedr), což jsou základní tvary, ze kterých je vytvořena veškerá hmota. Proto chrání na všech úrovních existence."
    },
    {
      question: "Jak používat Metatronovu krychli pro ochranu?",
      answer: "Metatronovu krychli používejte při meditaci - vizualizujte ji kolem sebe jako ochranný štít. Umístěte ji v domě pro harmonizaci energie, nebo ji noste jako amulet. Je ideální pro duchovní transformaci a ochranu před negativními energiemi."
    }
  ],
  "ouroboros": [
    {
      question: "Co je ouroboros?",
      answer: "Ouroboros je starověký symbol hada nebo draka, který požírá svůj vlastní ocas. Tvoří tak dokonalě uzavřený kruh. Symbol byl nalezen v egyptských, řeckých i aztéckých kulturách."
    },
    {
      question: "Co symbolizuje had požírající svůj ocas?",
      answer: "Had požírající svůj ocas (ouroboros) symbolizuje věčný cyklus života, smrti a znovuzrození. Reprezentuje nekonečnost, sebeobnoveni, alchemickou transmutaci a jednotu všeho. Učí, že konec je zároveň začátkem."
    },
    {
      question: "Jaký je význam ourobora v alchymii?",
      answer: "V alchymii ouroboros symbolizuje prima materia - prvotní hmotu, ze které vzniká vše. Reprezentuje alchemickou transmutaci - přeměnu olova ve zlato, ale také duchovní transformaci člověka. Je klíčovým symbolem hermetické tradice."
    }
  ],
  "triskelion": [
    {
      question: "Co je triskelion?",
      answer: "Triskelion (tříramenná spirála) je starověký keltský symbol tvořený třemi propojenými spirálami. Pochází z doby bronzové a byl nalezen na megalitických stavbách jako Newgrange v Irsku."
    },
    {
      question: "Co symbolizuje triskelion?",
      answer: "Triskelion symbolizuje trojjedinost - tělo, mysl a ducha; minulost, přítomnost a budoucnost; zrození, život a smrt. Reprezentuje věčný pohyb, pokrok a osobní růst. Je také symbolem tří keltských světů."
    },
    {
      question: "Jaký je rozdíl mezi triskelionem a triquetrou?",
      answer: "Triskelion je tvořen třemi spirálami vycházejícími ze středu, zatímco triquetra je tvořena třemi propojenými oblouky. Oba symboly reprezentují trojjedinost, ale triskelion zdůrazňuje pohyb a cyklus, triquetra spíše jednotu."
    }
  ]
};

export default FAQSchema;
