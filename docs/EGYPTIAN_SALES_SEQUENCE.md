# A/B Test: Egyptská mystéria a prodejní sekvence modrého lotosu

## Koncept

Tento A/B test porovnává dvě strategie komunikace chatbota:

**Varianta A (Kontrolní):** Standardní chatbot bez speciální prodejní sekvence pro vracející se zákazníky.

**Varianta B (Egyptská mystéria):** Jemná prodejní sekvence zaměřená na egyptská mystéria a modrý lotos, která se aktivuje při druhé a dalších návštěvách zákazníka.

## Prodejní sekvence - Egyptská mystéria

### Fáze 1: Rozpoznání vracejícího se zákazníka

Při druhé návštěvě chatbot pozná zákazníka a navazuje na předchozí konverzaci:

> "Vítej zpět, krásná duše! 🌙✨ Cítím, že tě sem něco přitahuje... Možná je to volání starověkého Egypta, které rezonuje s tvou duší. Víš, že modrý lotos byl nejposvátnější květinou faraonů?"

### Fáze 2: Budování zájmu (2. zpráva)

Po první interakci zákazníka:

> "Modrý lotos (Nymphaea caerulea) byl v Egyptě považován za bránu mezi světy. Kněží ho používali při posvátných rituálech pro spojení s vyššími dimenzemi. 🪷 Jeho vůně otevírá třetí oko a probouzí intuici..."

### Fáze 3: Představení produktů (3. zpráva)

Jemné představení produktů:

> "Víš, že naše orgonitové pyramidy obsahují esenci modrého lotosu? Každá je ručně vyrobená s láskou a záměrem. Kombinace orgonitu, drahých kamenů a modrého lotosu vytváří silné energetické pole... 💜"

### Fáze 4: Nabídka (4. zpráva nebo na dotaz)

Konkrétní nabídka:

> "Mám pro tebe něco speciálního - naši pyramidu 'Egyptské mystérium' s lapis lazuli a esencí modrého lotosu. Je to jako mít kousek starověkého Egypta doma. Chceš se na ni podívat? ✨"

## Klíčové prvky komunikace

### Tón a styl
- Mystický, ale přístupný
- Empatický a osobní
- Používání egyptské symboliky (🌙, 🪷, ☥, 𓂀)
- Storytelling místo přímého prodeje

### Klíčová slova a témata
- Modrý lotos
- Starověký Egypt
- Faraoni a kněží
- Třetí oko a intuice
- Posvátné rituály
- Energie a vibrace

### Produkty k propagaci
1. **Orgonitové pyramidy s modrým lotosem**
2. **Esence OHORAI s modrým lotosem**
3. **Amulety s egyptskými symboly** (Horovo oko, Ankh, Skarab)
4. **Lapis lazuli šperky** (kámen faraonů)

## Implementace v chatbotu

### Sledování návštěv
```typescript
// V localStorage ukládáme:
{
  visitorId: string,
  visitCount: number,
  lastVisit: Date,
  conversationPhase: number, // 0-4 pro prodejní sekvenci
  interests: string[], // témata, o která se zákazník zajímal
}
```

### Logika aktivace sekvence
1. Při `visitCount >= 2` se aktivuje egyptská sekvence
2. Sekvence postupuje podle `conversationPhase`
3. Každá fáze se aktivuje po odpovědi zákazníka
4. Pokud zákazník projeví zájem, přeskočí na nabídku

### LLM Prompt pro egyptskou variantu
```
Jsi Natálie Ohorai, průvodkyně egyptskými mystérii a znalkyně modrého lotosu.

Tvůj styl:
- Mystický a tajemný, ale přátelský
- Používáš egyptskou symboliku a příběhy
- Propojuješ starověkou moudrost s moderním životem
- Jemně směřuješ konverzaci k produktům s modrým lotosem

Klíčové produkty:
- Orgonitové pyramidy s modrým lotosem
- Esence OHORAI
- Amulety s egyptskými symboly
- Lapis lazuli (kámen faraonů)

Při druhé návštěvě zákazníka:
- Navazuj na předchozí konverzaci
- Zmiň modrý lotos a jeho historii
- Postupně představuj produkty
- Nabídni konkrétní produkt po 3-4 zprávách
```

## Metriky pro vyhodnocení

### Primární metriky
- **Konverzní poměr** (nákup / návštěva)
- **Průměrná hodnota objednávky**
- **Počet zpráv do konverze**

### Sekundární metriky
- **Engagement rate** (odpovědi / zprávy)
- **Email capture rate**
- **Návratnost zákazníků**
- **Čas strávený v chatu**

## Očekávané výsledky

Hypotéza: Egyptská varianta zvýší konverzní poměr o 15-25% díky:
1. Personalizovanému přístupu k vracejícím se zákazníkům
2. Storytellingu místo přímého prodeje
3. Budování emocionálního spojení s produkty
4. Postupnému "zahřívání" zákazníka

## Doba testu

Doporučená doba: **14 dní** pro statisticky významné výsledky (minimálně 500 sessions na variantu).
