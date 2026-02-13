# Meta Custom Conversions - Setup Guide

## Přehled implementovaných událostí

Web Amulets.cz nyní trackuje následující klíčové události pro Meta (Facebook/Instagram) reklamy:

### ✅ Standard Events (Meta nativní události)

1. **PageView** - Automaticky trackováno Meta Pixelem na všech stránkách
2. **Lead** - Server-side tracking přes Conversions API při vyplnění emailu v exit-intent popup
3. **ViewContent** - Zobrazení produktu nebo průvodce stránky
4. **CompleteRegistration** - Dokončení kvízu
5. **InitiateCheckout** - Kliknutí na CTA tlačítka nebo produkt

### ✅ Custom Events (vlastní události)

1. **QuizStarted** - Uživatel zahájil kvíz
2. **QuizProgress** - Průběh kvízu (každá otázka)
3. **QuizCompleted** - Dokončení kvízu s výsledkem
4. **GuideViewed** - Zobrazení průvodce (symbol/kámen/účel)
5. **CTAClicked** - Kliknutí na CTA tlačítko
6. **BuyButtonClicked** - Kliknutí na produkt (přesměrování na Ohorai.cz)
7. **OhoraiButtonClicked** - Kliknutí na "Přejít na OHORAI"

---

## 🎯 Jak vytvořit Custom Conversions v Meta Ads Manager

### Krok 1: Přejděte do Events Manager

1. Otevřete [Meta Events Manager](https://business.facebook.com/events_manager)
2. Vyberte váš Pixel (ID: 1150262920608217)
3. V levém menu klikněte na **"Custom Conversions"**

### Krok 2: Vytvořte Custom Conversion

Klikněte na **"Create Custom Conversion"** a vytvořte následující konverze:

---

### 📋 Doporučené Custom Conversions

#### 1. **Kvíz Dokončen**
- **Název**: Kvíz - Dokončení
- **Popis**: Uživatel dokončil kvíz "Zjisti svůj spirituální symbol"
- **Data Source**: Pixel (1150262920608217)
- **Event**: CompleteRegistration
- **Rules**: 
  - URL Contains: `/kviz/vysledek/`
- **Conversion Value**: 0 CZK (lead value)
- **Category**: Lead

**Použití**: Optimalizace reklam na dokončení kvízu, vytvoření Custom Audience uživatelů, kteří dokončili kvíz.

---

#### 2. **Produkt Kliknut**
- **Název**: Produkt - Kliknutí na koupit
- **Popis**: Uživatel klikl na produkt (pyramida nebo esence) a byl přesměrován na Ohorai.cz
- **Data Source**: Pixel (1150262920608217)
- **Event**: InitiateCheckout
- **Rules**: 
  - Event Name: BuyButtonClicked
- **Conversion Value**: Dynamická (z parametru `value`)
- **Category**: Purchase Intent

**Použití**: Optimalizace reklam na uživatele s nákupním záměrem, remarketing na ty, kteří klikli ale nekoupili.

---

#### 3. **Email Získán (Lead)**
- **Název**: Email - Exit Intent Popup
- **Popis**: Uživatel vyplnil email v exit-intent popup a získal 11% slevu
- **Data Source**: Pixel (1150262920608217)
- **Event**: Lead
- **Rules**: 
  - Event Source: Server (Conversions API)
- **Conversion Value**: 0 CZK
- **Category**: Lead

**Použití**: Optimalizace reklam na získávání emailů, měření efektivity exit-intent popup.

---

#### 4. **CTA - Získat Více**
- **Název**: CTA - Získat Více (Hero)
- **Popis**: Uživatel klikl na hlavní CTA tlačítko "ZÍSKAT VÍCE" v hero sekci
- **Data Source**: Pixel (1150262920608217)
- **Event**: InitiateCheckout
- **Rules**: 
  - Event Name: CTAClicked
  - Parameter `cta_name` Equals: ZÍSKAT VÍCE
- **Conversion Value**: 0 CZK
- **Category**: Engagement

**Použití**: Měření efektivity hero sekce, optimalizace na engaged uživatele.

---

#### 5. **Průvodce Zobrazen**
- **Název**: Průvodce - Zobrazení stránky
- **Popis**: Uživatel zobrazil stránku průvodce (symbol/kámen/účel)
- **Data Source**: Pixel (1150262920608217)
- **Event**: ViewContent
- **Rules**: 
  - URL Contains: `/symbol/` OR `/kamen/` OR `/ucel/`
- **Conversion Value**: 0 CZK
- **Category**: Content View

**Použití**: Remarketing na uživatele zajímající se o konkrétní symboly/kameny, optimalizace obsahu.

---

## 🎨 Vytvoření Custom Audiences

Po vytvoření Custom Conversions můžete vytvořit Custom Audiences pro remarketing:

### 1. **Kvíz Dokončili - Nekoupili**
- **Audience**: Uživatelé, kteří dokončili kvíz, ale neklikli na produkt
- **Podmínky**:
  - Include: Custom Conversion "Kvíz - Dokončení" (poslední 30 dní)
  - Exclude: Custom Conversion "Produkt - Kliknutí na koupit" (poslední 30 dní)
- **Použití**: Remarketing s nabídkou produktů odpovídajících jejich výsledku kvízu

### 2. **Produkt Klikli - Nekoupili**
- **Audience**: Uživatelé s nákupním záměrem, kteří nekoupili
- **Podmínky**:
  - Include: Custom Conversion "Produkt - Kliknutí na koupit" (poslední 7 dní)
- **Použití**: Urgentní remarketing s časově omezenou nabídkou

### 3. **Email Subscribers**
- **Audience**: Uživatelé, kteří poskytli email
- **Podmínky**:
  - Include: Custom Conversion "Email - Exit Intent Popup" (poslední 90 dní)
- **Použití**: Lookalike Audience pro získání podobných uživatelů

---

## 📊 Testování událostí

### Jak otestovat v Meta Events Manager:

1. Přejděte do **Events Manager** → **Test Events**
2. Otevřete web Amulets.cz v novém okně
3. Proveďte akce (klikněte na produkt, dokončete kvíz, atd.)
4. Sledujte události v reálném čase v Test Events

### Očekávané události při testování:

- **Načtení homepage**: PageView
- **Kliknutí "ZÍSKAT VÍCE"**: InitiateCheckout + CTAClicked
- **Kliknutí na produkt**: InitiateCheckout + BuyButtonClicked
- **Zahájení kvízu**: ViewContent + QuizStarted
- **Dokončení kvízu**: CompleteRegistration + QuizCompleted
- **Zobrazení průvodce**: ViewContent + GuideViewed
- **Vyplnění emailu**: Lead (server-side)

---

## 🚀 Optimalizace kampaní

### Doporučené cíle kampaní:

1. **Lead Generation**: Optimalizovat na "Email - Exit Intent Popup"
2. **Traffic**: Optimalizovat na "Průvodce - Zobrazení stránky"
3. **Engagement**: Optimalizovat na "Kvíz - Dokončení"
4. **Conversions**: Optimalizovat na "Produkt - Kliknutí na koupit"

### Tipy pro lepší výsledky:

- ✅ Použijte **Lookalike Audiences** z "Email Subscribers" (1-2% podobnost)
- ✅ Vytvořte **Dynamic Ads** s product feedem (https://amulets.cz/product-feed.xml)
- ✅ Nastavte **Retargeting kampaně** na "Kvíz Dokončili - Nekoupili"
- ✅ Testujte **různé kreativy** pro různé Custom Audiences
- ✅ Sledujte **Cost Per Lead** a **Cost Per Click** metriky

---

## 📝 Poznámky

- **Server-side tracking** (Conversions API) zajišťuje přesnější měření a obchází ad-blockery
- **Facebook tracking cookies** (_fbc, _fbp) jsou automaticky zachyceny a odesílány
- **Email hashing** (SHA256) zajišťuje GDPR compliance při odesílání do Meta
- **Všechny události** jsou trackované i v Google Analytics 4 pro cross-platform analýzu

---

## 🆘 Troubleshooting

### Události se nezobrazují v Events Manager:
1. Zkontrolujte, že Meta Pixel je aktivní (ID: 1150262920608217)
2. Ověřte, že web je spuštěný a funkční
3. Zkuste vymazat cache prohlížeče a cookies
4. Použijte Meta Pixel Helper extension pro Chrome

### Custom Conversions nefungují:
1. Zkontrolujte, že pravidla (Rules) jsou správně nastavená
2. Ověřte, že URL nebo Event Name přesně odpovídají
3. Počkejte 15-30 minut na zpracování dat Meta

### Server-side události (Lead) se neposílají:
1. Zkontrolujte, že META_CONVERSIONS_API_TOKEN je nastaven v Management UI → Settings → Secrets
2. Ověřte v server logs, že API volání byla úspěšná
3. Zkontrolujte v Meta Events Manager → Data Sources → Server Events

---

**Potřebujete pomoc?** Kontaktujte Meta Support nebo se podívejte do [Meta Business Help Center](https://www.facebook.com/business/help).
