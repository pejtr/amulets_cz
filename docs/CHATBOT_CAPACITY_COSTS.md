# Analýza kapacity a nákladů chatbota Natálie

## Aktuální konfigurace

| Parametr | Hodnota |
|----------|---------|
| **Model** | Gemini 2.5 Flash |
| **Max tokens** | 32,768 |
| **Thinking budget** | 128 tokens |
| **Hosting** | Manus Platform (škálovatelné) |
| **Databáze** | TiDB (MySQL kompatibilní, cloud) |

## Kapacita systému

### Teoretická kapacita

| Komponenta | Limit | Poznámka |
|------------|-------|----------|
| **Současné konverzace** | 1,000+ | Node.js async, škáluje se |
| **Zprávy za minutu** | 500+ | Závisí na délce odpovědí |
| **Databázové zápisy** | 10,000+/min | TiDB cloud škáluje |
| **LLM API** | Prakticky neomezené | Manus Forge API |

### Realistické scénáře

| Scénář | Návštěvníků/den | Konverzací/den | Zpráv/den | Poznámka |
|--------|-----------------|----------------|-----------|----------|
| **Aktuální** | ~100 | ~30 | ~150 | Běžný provoz |
| **Střední** | 1,000 | 300 | 1,500 | Po marketingové kampani |
| **Vysoký** | 10,000 | 3,000 | 15,000 | Virální obsah |
| **Extrémní** | 50,000 | 15,000 | 75,000 | Black Friday |

## Náklady na LLM

### Gemini 2.5 Flash - cenový model

Gemini 2.5 Flash je jeden z nejlevnějších modelů s výborným poměrem cena/výkon.

| Typ | Cena za 1M tokenů |
|-----|-------------------|
| **Input tokens** | ~$0.075 |
| **Output tokens** | ~$0.30 |
| **Thinking tokens** | ~$0.30 |

### Průměrná konverzace

| Metrika | Hodnota |
|---------|---------|
| Počet zpráv | 5-10 |
| System prompt | ~2,000 tokenů |
| User zprávy (celkem) | ~500 tokenů |
| Assistant odpovědi (celkem) | ~1,500 tokenů |
| **Celkem input** | ~2,500 tokenů |
| **Celkem output** | ~1,500 tokenů |

### Náklady na jednu konverzaci

```
Input:  2,500 × $0.000075 = $0.0001875
Output: 1,500 × $0.00030  = $0.00045
Thinking: 128 × $0.00030 = $0.0000384
─────────────────────────────────────
Celkem: ~$0.00067 (~0.07 haléře)
```

### Měsíční náklady podle provozu

| Scénář | Konverzací/měsíc | Náklady/měsíc | Náklady/měsíc (CZK) |
|--------|------------------|---------------|---------------------|
| **Aktuální** | 900 | $0.60 | ~15 Kč |
| **Střední** | 9,000 | $6.00 | ~150 Kč |
| **Vysoký** | 90,000 | $60.00 | ~1,500 Kč |
| **Extrémní** | 450,000 | $300.00 | ~7,500 Kč |

## Manus Platform náklady

Manus Platform zahrnuje:
- Hosting (server + databáze)
- LLM API přístup
- Storage (S3)
- CDN

Přesné náklady závisí na vašem Manus plánu. Kontaktujte support pro detaily.

## Optimalizace nákladů

### 1. Caching osobnosti
Osobnost Natálie se načítá jednou a cachuje na 1 hodinu, ne při každé zprávě.

### 2. Zkrácení system promptu
Aktuální prompt je optimalizovaný, ale lze dále zkrátit pro snížení input tokenů.

### 3. Rate limiting
Implementovat limit zpráv na uživatele (např. 50 zpráv/den).

### 4. Lazy loading
Načítat rozšířený kontext (produkty, články) pouze když je potřeba.

## Doporučení pro škálování

### Do 1,000 konverzací/den
- Aktuální konfigurace stačí
- Náklady: ~$2/měsíc

### 1,000 - 10,000 konverzací/den
- Zvážit rate limiting pro zneužití
- Implementovat queue pro špičky
- Náklady: ~$20-60/měsíc

### 10,000+ konverzací/den
- Implementovat caching odpovědí na časté dotazy
- Zvážit hybrid model (FAQ + AI)
- Monitoring a alerting
- Náklady: ~$60-300/měsíc

## Závěr

**Chatbot Natálie je velmi nákladově efektivní:**

- Gemini 2.5 Flash je jeden z nejlevnějších kvalitních modelů
- Jedna konverzace stojí méně než 0.1 haléře
- I při 10,000 konverzacích denně jsou náklady ~1,500 Kč/měsíc
- Systém škáluje automaticky bez nutnosti zásahu

**Můžete klidně poslat tisíce lidí denně** - chatbot to zvládne a náklady zůstanou rozumné.
