# Další A/B Testovací Scénáře pro Chatbot

## Přehled

Po dokončení aktuálního A/B testu 4 verzí chatbota Natálie Ohorai navrhujeme dva další testovací scénáře, které pomohou dále optimalizovat konverze a zákaznickou zkušenost. Tyto scénáře jsou navrženy tak, aby testovaly specifické aspekty chatbota a přinesly měřitelná zlepšení.

---

## Scénář 1: Test Proaktivního vs. Reaktivního Chování

### Hypotéza

Proaktivní chatbot, který osloví návštěvníka na základě jeho chování na webu, dosáhne vyššího engagement a konverzního poměru než reaktivní chatbot, který čeká na iniciativu uživatele.

### Popis Variant

| Varianta | Název | Chování |
|----------|-------|---------|
| **A** | Reaktivní Natálie | Chatbot je viditelný, ale neoslovuje. Čeká na klik uživatele. |
| **B** | Proaktivní Natálie | Chatbot automaticky osloví uživatele po splnění triggeru. |

### Triggery pro Proaktivní Variantu

Chatbot se automaticky otevře nebo zobrazí zprávu při:

| Trigger | Podmínka | Zpráva |
|---------|----------|--------|
| **Čas na stránce** | > 60 sekund na produktové stránce | "Vidím, že si prohlížíš {produkt}. Mohu ti poradit?" |
| **Scroll depth** | > 70% stránky | "Máš nějaké otázky? Ráda ti pomohu!" |
| **Exit intent** | Kurzor směřuje k zavření | "Počkej! Než odejdeš, mám pro tebe tip..." |
| **Opakovaná návštěva** | 2+ návštěvy bez nákupu | "Ráda tě zase vidím! Mohu ti s něčím pomoci?" |
| **Košík abandonment** | Položky v košíku > 5 minut | "Vidím, že máš něco v košíku. Potřebuješ poradit?" |

### Implementace

```typescript
// Proaktivní trigger systém
interface ProactiveTrigger {
  name: string;
  condition: () => boolean;
  message: string;
  delay: number; // ms
  priority: number;
}

const triggers: ProactiveTrigger[] = [
  {
    name: 'time_on_product_page',
    condition: () => isProductPage() && timeOnPage > 60000,
    message: `Vidím, že si prohlížíš ${productName}. Mohu ti poradit?`,
    delay: 60000,
    priority: 1
  },
  {
    name: 'exit_intent',
    condition: () => detectExitIntent(),
    message: 'Počkej! Než odejdeš, mám pro tebe speciální tip...',
    delay: 0,
    priority: 2
  },
  // ... další triggery
];
```

### Metriky k Měření

| Metrika | Popis | Očekávaný výsledek |
|---------|-------|-------------------|
| **Open rate** | % návštěvníků, kteří otevřou chat | Proaktivní +50% |
| **Engagement rate** | % chatů s > 2 zprávami | Proaktivní +30% |
| **Konverzní poměr** | % chatů vedoucích ke konverzi | Proaktivní +25% |
| **Bounce rate** | % návštěvníků, kteří chat okamžitě zavřou | Proaktivní +20% (riziko) |
| **Sentiment** | Pozitivní vs. negativní reakce | Sledovat pečlivě |

### Rizika a Mitigace

| Riziko | Pravděpodobnost | Mitigace |
|--------|-----------------|----------|
| Obtěžování uživatelů | Vysoká | Omezit na 1 trigger za session |
| Negativní sentiment | Střední | Snadné zavření, pamatovat preferenci |
| Technická složitost | Nízká | Postupná implementace triggerů |

### Délka Testu

Doporučená délka: **3-4 týdny** s minimálně **2000 sessions na variantu**.

---

## Scénář 2: Test Komunikačního Stylu (Formální vs. Neformální)

### Hypotéza

Komunikační styl chatbota má významný vliv na důvěru a konverze. Testujeme, zda formálnější, expertní přístup nebo neformální, přátelský styl lépe rezonuje s cílovou skupinou Amulets.cz.

### Popis Variant

| Varianta | Název | Styl | Příklad |
|----------|-------|------|---------|
| **A** | Expertní Natálie | Formální, odborný | "Dobrý den, ráda vám pomohu s výběrem. Ametyst je krystal s výjimečnými léčivými vlastnostmi..." |
| **B** | Přátelská Natálie | Neformální, kamarádský | "Ahoj! 💜 Super, že se ptáš na ametyst! Je to úplně magický kámen, který..." |
| **C** | Mystická Natálie | Spirituální, tajemný | "Vítej, duše hledající... Ametyst tě volá z dobrého důvodu. Cítím, že..." |
| **D** | Business Natálie | Profesionální, přímý | "Děkuji za dotaz. Ametyst nabízíme v několika variantách. Doporučuji..." |

### Detailní Charakteristiky

#### Varianta A: Expertní Natálie

**Tón:** Profesionální, vzdělaný, důvěryhodný

**Charakteristiky:**
- Vykání
- Odborná terminologie
- Citace zdrojů a studií
- Strukturované odpovědi

**Příklad dialogu:**
```
Uživatel: "Jaký kámen pomáhá na stres?"

Natálie: "Dobrý den, děkuji za váš dotaz. Pro zmírnění stresu doporučuji 
především ametyst nebo růženín. Ametyst je tradičně spojován s uklidněním 
mysli a podporou kvalitního spánku. Růženín pak podporuje emocionální 
rovnováhu a sebelásku. Mohu vám pomoci s výběrem konkrétního produktu?"
```

#### Varianta B: Přátelská Natálie

**Tón:** Kamarádský, vřelý, empatický

**Charakteristiky:**
- Tykání
- Emoji (střídmě)
- Osobní příběhy
- Neformální jazyk

**Příklad dialogu:**
```
Uživatel: "Jaký kámen pomáhá na stres?"

Natálie: "Ahoj! 💜 To znám moc dobře, stres je dneska všude. Víš co? 
Já sama nosím ametyst, když mám náročný den - fakt pomáhá! A růženín 
je taky super, hlavně když potřebuješ být k sobě hodná. Co myslíš, 
který by ti seděl víc?"
```

#### Varianta C: Mystická Natálie

**Tón:** Spirituální, tajemný, intuitivní

**Charakteristiky:**
- Poetický jazyk
- Reference na energie a intuici
- Mystické metafory
- Osobní "čtení"

**Příklad dialogu:**
```
Uživatel: "Jaký kámen pomáhá na stres?"

Natálie: "Cítím, že tvá duše hledá klid v bouři... ✨ Ametyst je strážce 
vnitřního míru - jeho fialová energie uklidňuje rozbouřenou mysl. Ale 
možná tě volá i růženín, kámen srdce, který ti připomene, že si zasloužíš 
lásku a péči. Zavři oči... který z nich cítíš silněji?"
```

#### Varianta D: Business Natálie

**Tón:** Profesionální, efektivní, orientovaný na řešení

**Charakteristiky:**
- Přímé odpovědi
- Zaměření na produkt a benefity
- Jasné CTA
- Minimum emocí

**Příklad dialogu:**
```
Uživatel: "Jaký kámen pomáhá na stres?"

Natálie: "Pro stres doporučuji ametyst nebo růženín. Ametyst - uklidnění, 
lepší spánek. Růženín - emocionální rovnováha. Máme je jako přívěsky 
(od 490 Kč) nebo náramky (od 690 Kč). Který formát preferujete?"
```

### Metriky k Měření

| Metrika | Popis | Cíl |
|---------|-------|-----|
| **Konverzní poměr** | % chatů s konverzí | Identifikovat nejlepší styl |
| **Průměrná délka konverzace** | Počet zpráv | Vyšší = lepší engagement |
| **Sentiment analýza** | Pozitivní/negativní reakce | > 80% pozitivní |
| **Email capture rate** | % zachycených emailů | > 5% |
| **Repeat engagement** | % uživatelů, kteří se vrátí | > 20% |
| **Time to conversion** | Čas od prvního kontaktu ke konverzi | Kratší = lepší |

### Segmentace Výsledků

Analyzovat výsledky podle:

| Segment | Očekávání |
|---------|-----------|
| **Věk 18-30** | Preferuje Přátelskou nebo Mystickou |
| **Věk 30-50** | Preferuje Expertní nebo Business |
| **Věk 50+** | Preferuje Expertní |
| **Noví návštěvníci** | Preferuje Přátelskou |
| **Vracející se** | Preferuje konzistentní styl |
| **Mobilní zařízení** | Preferuje kratší odpovědi (Business) |

### Implementace

```typescript
// Personality prompts pro každou variantu
const personalityPrompts = {
  expert: `Jsi Natálie Ohorai, expertka na spirituální produkty. 
    Komunikuješ profesionálně, používáš vykání. Tvé odpovědi jsou 
    strukturované a odborné. Cituj zdroje, když je to relevantní.`,
  
  friendly: `Jsi Natálie, kamarádka a průvodkyně světem spirituality. 
    Tykáš, používáš emoji (střídmě). Sdílíš osobní zkušenosti. 
    Tvůj tón je vřelý a empatický.`,
  
  mystic: `Jsi Natálie, mystická průvodkyně. Tvůj jazyk je poetický 
    a spirituální. Mluvíš o energiích, intuici a hlubších významech. 
    Vytváříš atmosféru tajemna a moudrosti.`,
  
  business: `Jsi Natálie, profesionální poradkyně. Tvé odpovědi jsou 
    přímé a efektivní. Zaměřuješ se na produkty a jejich benefity. 
    Vždy nabízíš jasné další kroky.`
};
```

### Délka Testu

Doporučená délka: **4-6 týdnů** s minimálně **1500 sessions na variantu** (celkem 6000 sessions).

---

## Srovnání Scénářů

| Aspekt | Scénář 1 (Proaktivní) | Scénář 2 (Styl) |
|--------|----------------------|-----------------|
| **Složitost implementace** | Střední | Nízká |
| **Riziko negativního dopadu** | Vyšší | Nižší |
| **Potenciální uplift** | +25-50% | +15-30% |
| **Délka testu** | 3-4 týdny | 4-6 týdnů |
| **Počet variant** | 2 | 4 |
| **Priorita** | 1 (po aktuálním testu) | 2 |

---

## Doporučený Postup

### Fáze 1: Dokončení Aktuálního Testu (Týden 1-4)

Dokončit probíhající A/B test 4 avatarů a identifikovat vítěznou verzi.

### Fáze 2: Implementace Scénáře 1 (Týden 5-8)

Testovat proaktivní vs. reaktivní chování s vítězným avatarem z Fáze 1.

### Fáze 3: Implementace Scénáře 2 (Týden 9-14)

Testovat komunikační styly s vítěznou kombinací avatar + chování.

### Fáze 4: Finální Optimalizace (Týden 15+)

Kombinovat všechny poznatky do finální, plně optimalizované verze chatbota.

---

## Očekávané Výsledky

Po dokončení všech testů očekáváme:

| Metrika | Výchozí stav | Po všech testech | Zlepšení |
|---------|--------------|------------------|----------|
| Konverzní poměr | 5% | 12% | +140% |
| Email capture | 3% | 8% | +167% |
| Engagement (zprávy) | 4 | 8 | +100% |
| Affiliate kliky | 1% | 4% | +300% |
| Měsíční hodnota | 100K Kč | 300K Kč | +200% |

---

## Závěr

Navržené A/B testovací scénáře poskytují strukturovaný přístup k dalšímu vylepšení chatbota Natálie Ohorai. Scénář 1 (Proaktivní chování) má potenciál výrazně zvýšit engagement, zatímco Scénář 2 (Komunikační styl) pomůže najít optimální tón pro cílovou skupinu.

Klíčem k úspěchu je:

1. **Postupná implementace** - jeden test v čase
2. **Dostatečný vzorek** - statisticky významné výsledky
3. **Kontinuální měření** - sledování všech relevantních metrik
4. **Flexibilita** - připravenost upravit plán na základě výsledků

---

*Dokument vytvořen: 18. ledna 2026*
*Autor: Manus AI*
*Verze: 1.0*
