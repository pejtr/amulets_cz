# Widget A/B Testing - Dokumentace

## 📋 Přehled

Kompletní systém pro A/B testování UI widgetů na webu amulets.cz. Umožňuje testovat různé varianty CTA tlačítek, doporučovacích widgetů a dalších UI elementů pro optimalizaci konverzí.

## 🎯 Funkce

- ✅ **Náhodný výběr variant** na základě vah
- ✅ **Tracking impressions** (zobrazení widgetu)
- ✅ **Tracking interactions** (kliknutí, hover, atd.)
- ✅ **Tracking conversions** (nákupy, registrace, atd.)
- ✅ **Statistická signifikance** (Z-test pro proporce)
- ✅ **Admin dashboard** s vizualizacemi
- ✅ **React hook** pro snadnou integraci
- ✅ **Denní statistiky** pro dlouhodobé sledování

## 🗄️ Database Schema

### Tabulky

1. **widget_variants** - Definice variant widgetů
2. **widget_impressions** - Zobrazení widgetů
3. **widget_interactions** - Interakce s widgety
4. **widget_conversions** - Konverze spojené s widgety
5. **widget_daily_stats** - Denní agregované statistiky
6. **widget_ab_test_results** - Výsledky A/B testů

### Migrace

```bash
# Spustit SQL migraci
mysql -u root -p amulets_db < migrations/001_widget_ab_testing.sql
```

### Seed Data

```bash
# Naplnit testovací varianty
tsx server/seedWidgetVariants.ts
```

## 🔧 Použití

### 1. React Hook - Základní použití

```tsx
import { useWidgetABTest } from '@/hooks/useWidgetABTest';

function MyComponent() {
  const { config, trackInteraction, trackConversion } = useWidgetABTest({
    widgetKey: 'hero_cta',
    defaultConfig: {
      buttonText: 'Klikni sem',
      buttonColor: '#8B5CF6',
    },
  });

  return (
    <button
      style={{ backgroundColor: config.buttonColor }}
      onClick={() => {
        trackInteraction('click', 'cta_button');
        // ... vaše logika
      }}
    >
      {config.buttonText}
    </button>
  );
}
```

### 2. Helper Hook - CTA Tlačítko

```tsx
import { useCTAButtonABTest } from '@/hooks/useWidgetABTest';

function HeroCTA() {
  const { buttonText, buttonColor, handleClick, trackConversion } = useCTAButtonABTest('hero_cta');

  return (
    <button
      style={{ backgroundColor: buttonColor }}
      onClick={handleClick(() => {
        // Navigace na produkty
        window.location.href = '/produkty';
        
        // Track konverzi pokud uživatel nakoupí
        trackConversion('product_view', 0);
      })}
    >
      {buttonText}
    </button>
  );
}
```

### 3. Helper Hook - Doporučovací Widget

```tsx
import { useRecommendationWidgetABTest } from '@/hooks/useWidgetABTest';

function RecommendationWidget() {
  const {
    title,
    layout,
    itemsCount,
    handleProductClick,
    handleAddToCart,
  } = useRecommendationWidgetABTest('recommendation_widget');

  return (
    <div>
      <h2>{title}</h2>
      <div className={layout === 'grid' ? 'grid' : 'flex'}>
        {products.slice(0, itemsCount).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product.id, product.name)}
            onAddToCart={() => handleAddToCart(product.id, product.price)}
          />
        ))}
      </div>
    </div>
  );
}
```

## 📊 Admin Dashboard

### Přístup

```
/admin/widget-ab
```

### Funkce

- **Přehled všech widgetů** - Výběr widgetu pro analýzu
- **Porovnání variant** - Zobrazení, interakce, konverze
- **Statistická signifikance** - P-value, confidence level
- **Grafy a vizualizace** - Sloupcové grafy pro srovnání
- **Konfigurace variant** - Náhled JSON konfigurace

## 🎨 Konfigurace Variant

### Struktura Config Objektu

```typescript
interface WidgetVariantConfig {
  // Text
  text?: string;
  buttonText?: string;
  title?: string;
  subtitle?: string;
  
  // Styling
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  borderColor?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  
  // Layout
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  alignment?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
  
  // Behavior
  showDelay?: number;
  autoHide?: boolean;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  
  // Custom
  [key: string]: any;
}
```

### Příklad Konfigurace

```json
{
  "buttonText": "Objevte amulety",
  "buttonIcon": "Sparkles",
  "backgroundColor": "linear-gradient(to right, #8b5cf6, #7c3aed)",
  "textColor": "#FFFFFF",
  "borderColor": "#D4AF37",
  "borderWidth": "2px",
  "fontSize": "14px",
  "fontWeight": "bold",
  "padding": "16px",
  "borderRadius": "8px",
  "hoverEffect": "glow"
}
```

## 📈 Statistická Signifikance

### Z-test pro Proporce

Systém automaticky vypočítává statistickou signifikanci mezi dvěma variantami pomocí Z-testu pro proporce.

**Vzorec:**

```
z = (p1 - p2) / SE
SE = sqrt(p_pool * (1 - p_pool) * (1/n1 + 1/n2))
p_pool = (x1 + x2) / (n1 + n2)
```

**Interpretace:**

- **p < 0.05** - Statisticky významný rozdíl (95% confidence)
- **p < 0.01** - Vysoce statisticky významný (99% confidence)
- **p ≥ 0.05** - Není statisticky významný, pokračujte v testování

### Doporučení

- **Minimální vzorek**: 100+ zobrazení na variantu
- **Minimální konverze**: 10+ konverzí na variantu
- **Délka testu**: 1-2 týdny pro stabilní výsledky
- **Confidence level**: 95% (p < 0.05)

## 🚀 Implementované Widgety

### 1. Hero CTA - Primární Tlačítko

**Widget Key:** `hero_cta_primary`

**Varianty:**
- `hero_cta_v1_control` - "Zobrazit produkty" (růžový gradient)
- `hero_cta_v2_discover` - "Objevte amulety" (fialový gradient)

### 2. Hero CTA - Sekundární Tlačítko (OHORAI)

**Widget Key:** `hero_cta_secondary`

**Varianty:**
- `hero_cta_sec_v1_control` - "Přejít na" + logo
- `hero_cta_sec_v2_nehtova` - "Nehtová móda" + logo

### 3. Hero CTA - Kvíz

**Widget Key:** `hero_cta_quiz`

**Varianty:**
- `hero_cta_quiz_v1_control` - "Zjisti svůj amulet"
- `hero_cta_quiz_v2_najdi` - "Najdi svůj ochranný symbol"

### 4. Doporučovací Widget

**Widget Key:** `recommendation_widget`

**Varianty:**
- `recommendation_v1_control` - "Doporučujeme pro vás" (4 produkty)
- `recommendation_v2_personalized` - "Vybrali jsme pro vás" (6 produktů)

## 🔄 API Endpointy

### tRPC Router: `widgetABTest`

#### `getVariant`

Získá náhodnou variantu widgetu na základě vah.

```typescript
const variant = await trpc.widgetABTest.getVariant.query({
  widgetKey: 'hero_cta',
});
```

#### `trackImpression`

Zaznamenává zobrazení widgetu.

```typescript
await trpc.widgetABTest.trackImpression.mutate({
  variantId: 1,
  widgetKey: 'hero_cta',
  variantKey: 'hero_cta_v1',
  visitorId: 'visitor_123',
  sessionId: 'session_456',
  page: '/homepage',
  device: 'desktop',
  browser: 'Chrome',
});
```

#### `trackInteraction`

Zaznamenává interakci s widgetem.

```typescript
await trpc.widgetABTest.trackInteraction.mutate({
  variantId: 1,
  widgetKey: 'hero_cta',
  variantKey: 'hero_cta_v1',
  visitorId: 'visitor_123',
  sessionId: 'session_456',
  interactionType: 'click',
  interactionTarget: 'cta_button',
});
```

#### `trackConversion`

Zaznamenává konverzi.

```typescript
await trpc.widgetABTest.trackConversion.mutate({
  variantId: 1,
  widgetKey: 'hero_cta',
  variantKey: 'hero_cta_v1',
  visitorId: 'visitor_123',
  sessionId: 'session_456',
  conversionType: 'purchase',
  conversionValue: 1500,
  currency: 'CZK',
});
```

#### `getWidgetStats`

Získá statistiky pro widget včetně statistické signifikance.

```typescript
const stats = await trpc.widgetABTest.getWidgetStats.query({
  widgetKey: 'hero_cta',
  startDate: '2026-01-01',
  endDate: '2026-02-13',
});
```

## 📝 Best Practices

### 1. Testování

- **Testujte jednu věc najednou** - Změňte pouze jeden element (text, barvu, atd.)
- **Dostatečný vzorek** - Minimálně 100 zobrazení na variantu
- **Časový rámec** - Testujte minimálně 1-2 týdny
- **Statistická signifikance** - Počkejte na p < 0.05

### 2. Konfigurace

- **Konzistentní naming** - Používejte jasné a popisné názvy variant
- **Dokumentujte změny** - Vždy vyplňte `description` a `notes`
- **Kontrolní varianta** - Vždy označte jednu variantu jako `isControl: true`

### 3. Tracking

- **Auto-tracking impressions** - Nechte hook automaticky trackovat zobrazení
- **Manuální tracking interakcí** - Trackujte pouze důležité interakce
- **Trackujte konverze** - Vždy trackujte finální konverze (nákup, registrace)

### 4. Optimalizace

- **Postupné nasazení** - Začněte s 50/50 split
- **Upravte váhy** - Po zjištění vítěze zvyšte jeho váhu
- **Archivujte testy** - Po dokončení označte test jako `completed`

## 🐛 Troubleshooting

### Žádná data v dashboardu

1. Zkontrolujte, zda jsou varianty aktivní (`isActive: true`)
2. Ověřte, že widget je implementován na webu
3. Zkontrolujte konzoli prohlížeče pro chyby

### Nízká míra interakce

1. Zkontrolujte, zda je widget viditelný
2. Ověřte, že tracking funguje správně
3. Zvažte změnu designu nebo umístění

### Statistická signifikance nedosažena

1. Pokračujte v testování (více dat)
2. Zvažte větší rozdíly mezi variantami
3. Zkontrolujte, zda je dostatečný traffic

## 📚 Další Kroky

### Plánované Funkce

- [ ] **Email notifikace** při dosažení statistické signifikance
- [ ] **Automatické nasazení** vítězné varianty
- [ ] **Multi-variate testing** (více než 2 varianty)
- [ ] **Segmentace** (testování pro různé segmenty uživatelů)
- [ ] **Časové plánování** (automatické spuštění/zastavení testů)
- [ ] **Export dat** (CSV, Excel)
- [ ] **Integrace s Google Analytics**

### Nápady na Další Testy

1. **Exit-intent popup** - Různé nabídky pro odcházející návštěvníky
2. **Product card design** - Různé layouty produktových karet
3. **Pricing display** - Různé způsoby zobrazení cen
4. **Social proof** - Různé typy sociálních důkazů
5. **Trust badges** - Různé bezpečnostní odznaky

## 📞 Podpora

Pro otázky nebo problémy kontaktujte:
- **Email**: dev@amulets.cz
- **Telegram**: @amulets_dev

---

**Vytvořeno**: 2026-02-13  
**Verze**: 1.0.0  
**Autor**: Manus AI Assistant
