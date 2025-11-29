# Tracking Setup - Facebook Pixel & Google Analytics 4

Tento dokument popisuje, jak nastavit Facebook Pixel a Google Analytics 4 pro remarketing uživatelů kvízu.

## 🎯 Co je implementováno

### Facebook Pixel Events
- **PageView** - Automaticky při načtení stránky
- **ViewContent** - Když uživatel začne kvíz
- **QuizProgress** (custom) - Při každé otázce
- **CompleteRegistration** - Když uživatel dokončí kvíz
- **ViewContent** - Když uživatel zobrazí výsledek
- **Share** (custom) - Když uživatel sdílí výsledek

### Google Analytics 4 Events
- **quiz_start** - Začátek kvízu
- **quiz_progress** - Postup v kvízu
- **quiz_complete** - Dokončení kvízu
- **view_item** - Zobrazení výsledku
- **share** - Sdílení výsledku

### Custom Parameters pro segmentaci
Každý event obsahuje:
- `result_symbol` - Slug symbolu (např. "ruka-fatimy")
- `result_name` - Název symbolu (např. "Ruka Fatimy")
- `question_number` - Číslo otázky
- `progress_percentage` - Procento dokončení
- `platform` - Platforma sdílení ("native_share" nebo "clipboard")

## 🔧 Nastavení

### 1. Získat Facebook Pixel ID

1. Přejděte na [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Vytvořte nový Pixel nebo použijte existující
3. Zkopírujte **Pixel ID** (15-16 místné číslo)

### 2. Získat Google Analytics 4 Measurement ID

1. Přejděte na [Google Analytics](https://analytics.google.com/)
2. Vytvořte nový GA4 property nebo použijte existující
3. V Admin → Data Streams → Web → zkopírujte **Measurement ID** (začíná "G-")

### 3. Nastavit env proměnné

V Manus Management UI → Settings → Secrets přidejte:

```
VITE_FACEBOOK_PIXEL_ID=your_pixel_id_here
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**Poznámka:** Tyto proměnné jsou volitelné. Pokud nejsou nastaveny, tracking nebude aktivní.

## 📊 Remarketing Audiences

### Facebook Custom Audiences

V Facebook Ads Manager vytvořte custom audiences:

1. **Quiz Starters** (Začali kvíz)
   - Event: ViewContent
   - content_category = "Quiz"
   - Časové okno: 30 dní

2. **Quiz Completers** (Dokončili kvíz)
   - Event: CompleteRegistration
   - status = "completed"
   - Časové okno: 30 dní

3. **Specific Symbol Results** (Podle výsledku)
   - Event: CompleteRegistration
   - result_symbol = "ruka-fatimy" (nebo jiný symbol)
   - Časové okno: 30 dní

4. **Quiz Sharers** (Sdíleli výsledek)
   - Custom Event: Share
   - content_category = "Quiz Result"
   - Časové okno: 7 dní

### Google Analytics 4 Audiences

V GA4 → Admin → Audiences vytvořte:

1. **Quiz Starters**
   - Event: quiz_start
   - Membership duration: 30 dní

2. **Quiz Completers**
   - Event: quiz_complete
   - Membership duration: 30 dní

3. **High Intent Users** (Dokončili + sdíleli)
   - Event: quiz_complete AND share
   - Membership duration: 60 dní

4. **Symbol-Specific Audiences**
   - Event: quiz_complete
   - result_symbol = "ruka-fatimy"
   - Membership duration: 30 dní

## 🎯 Remarketing Strategie

### 1. Quiz Abandoners (Začali, ale nedokončili)
- **Audience:** Quiz Starters MINUS Quiz Completers
- **Ads:** "Dokončete svůj kvíz a objevte svůj symbol!"
- **Offer:** Žádná, jen reminder

### 2. Quiz Completers (Dokončili kvíz)
- **Audience:** Quiz Completers
- **Ads:** Produkty s jejich symbolem (např. amulety, pyramidy)
- **Offer:** 10% sleva na první objednávku

### 3. Symbol-Specific Remarketing
- **Audience:** Podle result_symbol
- **Ads:** Personalizované podle symbolu
- **Example:** "Vaš symbol je Ruka Fatimy - Objevte amulety s ochrannou energií"

### 4. High Intent Users (Sdíleli výsledek)
- **Audience:** Quiz Sharers
- **Ads:** Premium produkty, balíčky
- **Offer:** 15% sleva + doprava zdarma

## 🧪 Testování

### Facebook Pixel Helper
1. Nainstalujte [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Otevřete web a projděte kvíz
3. Klikněte na extension a zkontrolujte, že se odesílají eventy

### Google Analytics DebugView
1. V GA4 → Admin → DebugView
2. Otevřete web s `?debug_mode=true` v URL
3. Projděte kvíz a sledujte eventy v real-time

### Test Events v konzoli
```javascript
// Otevřete DevTools Console a zkuste:
window.fbq('track', 'ViewContent', {test: true})
window.gtag('event', 'test_event', {test: true})
```

## 📈 Metriky k sledování

### Facebook Ads Manager
- **Quiz Start Rate** - Kolik lidí začalo kvíz
- **Quiz Completion Rate** - % dokončení
- **Share Rate** - % uživatelů, kteří sdíleli
- **ROAS** (Return on Ad Spend) - Návratnost investice

### Google Analytics 4
- **Conversion Rate** - quiz_complete / quiz_start
- **Drop-off Rate** - Kde uživatelé opouštějí kvíz
- **Symbol Distribution** - Které symboly jsou nejčastější
- **Share Rate** - % sdílení podle symbolu

## 🔒 GDPR Compliance

⚠️ **Důležité:** Tracking je aktivní pouze pokud:
1. Uživatel souhlasil s cookies (CookieConsent komponenta)
2. Env proměnné jsou nastaveny

Tracking respektuje cookie consent a nesbírá data bez souhlasu uživatele.

## 🆘 Troubleshooting

### Pixel se neinicializuje
- Zkontrolujte, že env proměnné jsou správně nastaveny
- Zkontrolujte konzoli pro chyby
- Ověřte, že uživatel souhlasil s cookies

### Eventy se neodesílají
- Zkontrolujte Facebook Pixel Helper / GA4 DebugView
- Ověřte, že tracking funkce jsou volány (console.log)
- Zkontrolujte network tab pro requests na facebook.com a google-analytics.com

### Custom audiences se nevytvářejí
- Počkejte 24-48 hodin na naplnění dat
- Ověřte, že máte dostatek uživatelů (min. 100 pro Facebook)
- Zkontrolujte, že event parametry jsou správně nastaveny
