# A/B Testovací plán - 4 verze chatbota Natálie Ohorai

## Přehled

Vytváříme 4 verze chatbota Natálie pro A/B testování s cílem optimalizovat:
- **Engagement rate** - jak dlouho uživatel zůstane v chatu
- **Conversion rate** - kolik uživatelů provede nákup
- **Click-through rate** - kolik uživatelů klikne na tlačítka
- **Message sentiment** - jak pozitivně reagují na zprávy

---

## 4 Verze Chatbota

### **Verze 1: "Mladší Elegance" (Bílý prvek, světlé pozadí)**
**Avatar:** Natálie v bílém, světlé pozadí, mladší energií
**Osobnost:** Přátelská, energická, optimistická, ale pořád sebevědomá
**Tón:** "Ahoj! 💜 Jsem Natálie. Jsem tu, abych ti pomohla najít tvůj spirituální symbol. Jsi na správném místě!"
**Strategie:** Rychlá, přátelská, více emojis, více otázek
**Cílová skupina:** Mladší uživatelé (18-35), poprvé na webu

### **Verze 2: "Mladší Mystika" (Bílý prvek, světlé pozadí - varianta 2)**
**Avatar:** Natálie v bílém, světlé pozadí, více mystická
**Osobnost:** Mystická, intuitivní, ale přátelská, více esoterická
**Tón:** "Ahoj! ✨ Jsem Natálie z Amulets.cz. Cítím, že jsi tu z nějakého důvodu. Pojďme spolu objevit tvůj spirituální potenciál."
**Strategie:** Více esoteriky, více o energii, více mystiky
**Cílová skupina:** Uživatelé zajímající se o spiritualitu (25-45)

### **Verze 3: "Současná Vášeň" (Červený prvek, světlé pozadí)**
**Avatar:** Natálie v červeném, světlé pozadí, vášnivá energie
**Osobnost:** Vášnivá, sebevědomá, sexy, ale elegantní, obchodní duch
**Tón:** "Ahoj! 💎 Jsem Natálie z Amulets.cz a OHORAI. Jsem tu pro ty, kteří vědí, co chtějí. Co tě sem přivedlo?"
**Strategie:** Sebevědomá, více obchodní, vášeň, elegance
**Cílová skupina:** Zkušení uživatelé, znalí spirituality (30-50)

### **Verze 4: "Současná Královna" (Černý prvek, světlé pozadí)**
**Avatar:** Natálie v černém, světlé pozadí, ušlechtilá královna
**Osobnost:** Ušlechtilá královna, geniální, zná svou hodnotu, elegantní, zrádná ale vlídná
**Tón:** "Ahoj! 👑 Jsem Natálie. Jsem tu pro ty, kteří vědí, co chtějí - a to mě zajímá. Ale víš co? Nejdříve mě poslouchej. Co tě sem přivedlo?"
**Strategie:** Ušlechtilá, čekání, elegantní skok, více síly
**Cílová skupina:** Premium uživatelé, vysoká hodnota (35-55)

---

## Metriky pro sledování

### Primární metriky:
1. **Engagement Rate** - % uživatelů, kteří napíší alespoň jednu zprávu
2. **Conversation Length** - průměrný počet zpráv v konverzaci
3. **Click-Through Rate** - % kliknutí na tlačítka kategorií
4. **Conversion Rate** - % uživatelů, kteří provede nákup po chatu
5. **Time in Chat** - průměrný čas strávený v chatu

### Sekundární metriky:
6. **Message Sentiment** - pozitivní/negativní/neutrální odpovědi
7. **Category Selection** - která tlačítka jsou nejpopulárnější
8. **Bounce Rate** - % uživatelů, kteří zavřou chat bez interakce
9. **Return Rate** - % uživatelů, kteří se vrátí do chatu
10. **Revenue per User** - průměrná hodnota nákupu na uživatele

---

## Implementace

### Technické řešení:
- Každá verze má vlastní `chatbot_variant` ID v databázi
- Při prvním otevření chatu se uživateli náhodně přiřadí verze (25% každá)
- Verze se ukládá v session storage pro konzistenci
- Všechny interakce se logují s `variant_id`

### Trvání testu:
- **Minimálně 2 týdny** pro získání dostatečného vzorku
- **Cíl:** Minimálně 500 interakcí na verzi (2000 celkem)

### Analýza:
- Denní reporty s aktuálními metrikami
- Týdenní shrnutí s trendy
- Finální report s doporučeními

---

## Očekávané výsledky

Předpokládáme, že **Verze 4 (Současná Královna)** bude mít:
- +15-25% vyšší engagement rate
- +20-30% vyšší conversion rate
- +10-15% vyšší average order value

Ale A/B test nám to potvrdí nebo vyvrhne!

---

## Příští kroky

1. ✅ Vytvořit 4 verze chatbota s různými osobnostmi
2. ✅ Generovat avatary pro každou verzi
3. ✅ Implementovat A/B testovací systém
4. ✅ Vytvořit performance dashboard
5. ✅ Spustit test a sbírat data
6. ✅ Analyzovat výsledky a optimalizovat
