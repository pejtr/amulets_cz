# Porovnání: Nový ZIP vs. GitHub Repozitář

**Datum**: 13. února 2026  
**Porovnání**: `amulets-web.zip` (nový) vs. `amulets_cz` (GitHub repo s mými změnami)

---

## 📊 Základní Statistiky

| Metrika | Nový ZIP | GitHub Repo | Rozdíl |
|---------|----------|-------------|--------|
| TypeScript soubory | 258 | 261 | +3 (GitHub) |
| Celková velikost | ~1.5 MB | ~23 MB | +21.5 MB (GitHub) |

---

## ❌ Moje Nové Soubory CHYBÍ v Novém ZIPu

Nový ZIP **NEOBSAHUJE** žádnou z mých implementací:

### 1. Widget A/B Testing System
- ❌ `/client/src/hooks/useWidgetABTest.ts`
- ❌ `/server/widgetABTestRouter.ts`
- ❌ `/server/seedWidgetVariants.ts`
- ❌ `/client/src/pages/admin/WidgetABTestDashboard.tsx`
- ❌ `/drizzle/widgetABTestSchema.ts`
- ❌ `/migrations/001_widget_ab_testing.sql`

### 2. Instagram Feed Widget
- ❌ `/client/src/components/InstagramFeed.tsx`

### 3. Překlady
- ❌ `/client/src/data/guideContent.i18n.ts`
- ❌ `/client/src/data/magazineContent.i18n.ts`

### 4. Dokumentace
- ❌ `WIDGET_AB_TESTING.md`
- ❌ `IMPLEMENTATION_SUMMARY.md`
- ❌ `NEXT_IMPROVEMENTS.md`
- ❌ `FINAL_REPORT.md`

### 5. Změny v Existujících Souborech
- ❌ `/drizzle/schema.ts` - Chybí 6 nových tabulek pro Widget A/B Testing
- ❌ `/server/routers.ts` - Chybí import a registrace `widgetABTestRouter`

---

## ✅ Co Nový ZIP Obsahuje (a GitHub Repo NE)

Nový ZIP obsahuje původní projekt BEZ mých změn. Má navíc:

### Dokumentační Soubory
- ✅ `BREVO_AUTOMATION_SETUP.md`
- ✅ `BREVO_SETUP.md`
- ✅ `CHATBOT_AB_TEST_PLAN.md`
- ✅ `CHATBOT_ANALYTICS_PACKAGE.md`
- ✅ `CRON_SETUP.md`
- ✅ `META_CUSTOM_CONVERSIONS_SETUP.md`
- ✅ `NATALIE_PERSONALITY.md`
- ✅ `TELEGRAM-VIP-SETUP.md`
- ✅ `TRACKING_SETUP.md`

### Research & Content Soubory
- ✅ `additional-essences.md`
- ✅ `backlink-registrace.md`
- ✅ `backlink-research.md`
- ✅ `boho-music-recommendations.md`
- ✅ `current-products-check.md`
- ✅ `ebook-content.md`
- ✅ `heureka-reviews.md`
- ✅ `natalie-personality-prompt.md`
- ✅ `pruvodce-amulety-research.md`
- ✅ `registrace-status.md`
- ✅ `status-notes.md`
- ✅ `strategie-zpetnych-odkazu.md`
- ✅ `todo.md` (130 KB - velmi rozsáhlý)

### Utility Skripty
- ✅ `fix-telegram-webhook.mjs`
- ✅ `send-test-message.mjs`

### Data & Assets
- ✅ `natalie-ref1.webp` (64 KB)
- ✅ `natalie-ref2.jpg` (136 KB)
- ✅ `ohorai-products.json`
- ✅ `produkty_data.json`

### Adresáře
- ✅ `/content-research/`
- ✅ `/historical-content/`
- ✅ `/patches/`

---

## 🔍 Detailní Analýza Rozdílů

### Database Schema (`drizzle/schema.ts`)

**Nový ZIP**: 1155 řádků  
**GitHub Repo**: 1349 řádků (+194 řádků)

**Rozdíl**: GitHub repo obsahuje 6 nových tabulek pro Widget A/B Testing:
1. `widget_variants`
2. `widget_impressions`
3. `widget_interactions`
4. `widget_conversions`
5. `widget_daily_stats`
6. `widget_ab_test_results`

### Server Routers (`server/routers.ts`)

**Nový ZIP**: Neobsahuje `widgetABTestRouter`  
**GitHub Repo**: Obsahuje import a registraci `widgetABTestRouter`

```typescript
// GitHub Repo má navíc:
import { widgetABTestRouter } from "./widgetABTestRouter";

export const appRouter = router({
  // ... existující routery
  widgetABTest: widgetABTestRouter, // NOVÝ
});
```

---

## 📋 Závěr

### Stav Projektu

1. **Nový ZIP** = Původní projekt z vlákna **BEZ mých změn**
2. **GitHub Repo** = Původní projekt **S mými změnami** (Widget A/B Testing, Instagram Feed, Překlady)

### Co To Znamená?

Nový ZIP je **starší verze** projektu, která neobsahuje:
- ❌ Widget A/B Testing System
- ❌ Instagram Feed Widget
- ❌ Překlady obsahových stránek (EN/IT)
- ❌ Moji dokumentaci

Ale obsahuje:
- ✅ Původní dokumentaci (Brevo, Chatbot, Telegram, atd.)
- ✅ Research soubory
- ✅ Utility skripty
- ✅ Rozsáhlý `todo.md` (130 KB)

---

## 🎯 Doporučení

### Možnost 1: Mergovat Změny
Vzít nový ZIP jako základ a přidat moje změny:
```bash
# 1. Zkopírovat dokumentaci z nového ZIPu
cp amulets-web-new/*.md amulets_cz/

# 2. Zkopírovat research soubory
cp -r amulets-web-new/content-research amulets_cz/
cp -r amulets-web-new/historical-content amulets_cz/

# 3. Zkopírovat utility skripty
cp amulets-web-new/*.mjs amulets_cz/

# 4. Moje změny už jsou v GitHub repo
```

### Možnost 2: Použít GitHub Repo
GitHub repo je **aktuálnější** a obsahuje všechny moje implementace. Stačí přidat chybějící dokumentaci z nového ZIPu.

### Možnost 3: Začít Znovu
Vzít nový ZIP jako základ a reimplementovat moje změny (nedoporučuji - zbytečná práce).

---

## 🚀 Akční Plán

### Doporučený Postup (Možnost 2)

1. **Přidat chybějící dokumentaci** z nového ZIPu do GitHub repo
2. **Přidat research soubory** z nového ZIPu
3. **Přidat utility skripty** z nového ZIPu
4. **Aktualizovat todo.md** (nový ZIP má rozsáhlejší verzi)
5. **Vytvořit finální commit** s mergnutými změnami
6. **Nasadit do produkce**

---

**Vytvořeno**: 13. února 2026  
**Autor**: Manus AI Assistant
