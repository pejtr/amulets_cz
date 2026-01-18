# Sdílený mozek Natálie - Architektura "Propojených nádob"

## Koncept

Tři Natálie jako **propojené nádoby** - jedna duše, tři projevy:

```
                    ┌─────────────────┐
                    │   TELEGRAM BOT  │
                    │   (Centrála)    │
                    │   - Reporty     │
                    │   - Příkazy     │
                    │   - Správa      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌─────────────────┐            ┌─────────────────┐
    │   AMULETS.CZ    │◄──────────►│     OHORAI      │
    │   (Chatbot)     │  Sdílená   │   (Chatbot)     │
    │   - Amulety     │  osobnost  │   - Krystaly    │
    │   - Symboly     │  & data    │   - Marketplace │
    │   - Esence      │            │   - Akademie    │
    └─────────────────┘            └─────────────────┘
```

## Sdílené komponenty

### 1. Osobnost Natálie (`nataliePersonality.ts`)

Centrální definice osobnosti sdílená všemi platformami:

| Komponenta | Popis | Sdíleno |
|------------|-------|---------|
| Základní identita | Jméno, role, twin flame | ✅ Všechny |
| Osobnostní rysy | Vřelá, empatická, moudrá | ✅ Všechny |
| Oblíbená místa | Dobrá Čajovna, Hubert | ✅ Všechny |
| Oblíbené čaje | Jasmínový zelený/tmavý | ✅ Všechny |
| Koučing služby | WhatsApp konzultace | ✅ Všechny |
| Romantické odpovědi | Odbití nápadníků | ✅ Všechny |
| Kontextový prompt | Specifický pro platformu | ❌ Odlišný |

### 2. Databázové tabulky pro synchronizaci

```sql
-- Sdílená tabulka konverzací
CREATE TABLE shared_conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  platform ENUM('amulets', 'ohorai', 'telegram'),
  visitor_id VARCHAR(255),
  session_id VARCHAR(255),
  messages JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  synced_at TIMESTAMP
);

-- Denní statistiky pro reporty
CREATE TABLE daily_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  platform ENUM('amulets', 'ohorai'),
  date DATE,
  total_conversations INT,
  total_messages INT,
  unique_visitors INT,
  stream_selections JSON, -- {hmotne: X, etericke: Y, uzitecne: Z}
  popular_topics JSON,
  leads_collected INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fronta pro Telegram reporty
CREATE TABLE telegram_report_queue (
  id INT PRIMARY KEY AUTO_INCREMENT,
  report_type ENUM('daily', 'weekly', 'alert'),
  platform ENUM('amulets', 'ohorai', 'both'),
  content TEXT,
  sent BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP
);
```

## API Endpointy

### Amulets.cz poskytuje:

```typescript
// GET /api/shared/personality
// Vrátí aktuální osobnost Natálie
{
  basePersonality: string,
  traits: NatalieTraits,
  romanticResponses: RomanticResponses,
  favoriteSpots: FavoriteSpots,
  favoriteTeas: FavoriteTeas,
  services: Services,
  version: string,
  lastUpdated: string
}

// POST /api/shared/sync-stats
// Přijme statistiky z OHORAI pro agregaci
{
  platform: 'ohorai',
  date: '2026-01-18',
  stats: DailyStats
}

// GET /api/shared/daily-report
// Vrátí agregovaný denní report pro Telegram
{
  amulets: DailyStats,
  ohorai: DailyStats,
  combined: CombinedStats,
  highlights: string[]
}
```

### OHORAI volá:

```typescript
// Na startu aplikace nebo při změně
const personality = await fetch('https://amulets.cz/api/shared/personality');

// Každou půlnoc synchronizace
await fetch('https://amulets.cz/api/shared/sync-stats', {
  method: 'POST',
  body: JSON.stringify(dailyStats)
});
```

## Telegram Bot - Centrální řízení

Telegram bot slouží jako **centrála** pro:

1. **Agregované reporty** - denní shrnutí z obou webů
2. **Správa osobnosti** - úpravy se propagují do obou chatbotů
3. **Alerting** - upozornění na důležité události
4. **Příkazy** - ovládání obou chatbotů

### Příkazy pro Telegram:

```
/report - Denní report z obou webů
/stats amulets - Statistiky Amulets.cz
/stats ohorai - Statistiky OHORAI
/personality - Zobrazit aktuální osobnost
/update_personality - Aktualizovat osobnost (admin)
/leads - Seznam nových leadů
/conversations - Poslední konverzace
```

### Formát denního reportu:

```
📊 DENNÍ REPORT - 18. ledna 2026

💜 AMULETS.CZ
├─ Konverzace: 47
├─ Unikátní návštěvníci: 38
├─ Proudy: Spiritualita 45% | Produkty 35% | Služby 20%
├─ Leady: 5 nových e-mailů
└─ Top téma: "Jaký amulet pro ochranu?"

💎 OHORAI MARKETPLACE
├─ Konverzace: 23
├─ Unikátní návštěvníci: 19
├─ Top kategorie: Ametyst, Růženín
├─ Leady: 2 nové registrace
└─ Top téma: "Jak čistit krystaly?"

🔮 CELKEM
├─ Konverzace: 70
├─ Unikátní návštěvníci: 57
└─ Konverzní poměr: 10%

S láskou, tvoje Natálie 💜
```

## Hodinová synchronizace

Každou hodinu se weby synchronizují pro aktuální data:

1. **OHORAI** odešle aktuální statistiky na Amulets.cz API
2. **Amulets.cz** agreguje data z obou platforem
3. **Příkaz /report** v Telegramu vrátí vždy aktuální data

```typescript
// Cron job na OHORAI (každou hodinu)
async function hourlySync() {
  const stats = await getOhoraiStats();
  
  await fetch('https://amulets.cz/api/trpc/shared.syncStats', {
    method: 'POST',
    body: JSON.stringify({
      platform: 'ohorai',
      apiKey: process.env.SHARED_BRAIN_API_KEY,
      date: new Date().toISOString().split('T')[0],
      stats
    })
  });
}

// Spustit každou hodinu
setInterval(hourlySync, 60 * 60 * 1000);
```

## Implementační kroky

### Fáze 1: Amulets.cz (tento projekt)
1. ✅ Osobnost Natálie již existuje v `shared/nataliePersonality.ts`
2. [ ] Vytvořit API endpointy pro sdílení
3. [ ] Přidat tabulky pro synchronizaci
4. [ ] Implementovat půlnoční agregaci

### Fáze 2: OHORAI (druhý projekt)
1. [ ] Importovat osobnost z Amulets.cz API
2. [ ] Implementovat odesílání statistik
3. [ ] Aktualizovat chatbot prompt

### Fáze 3: Telegram Bot
1. [ ] Přidat příkazy pro agregované reporty
2. [ ] Implementovat příjem reportů z fronty
3. [ ] Přidat správu osobnosti

## Bezpečnost

- API endpointy chráněny API klíčem
- Pouze OHORAI a Telegram mají přístup
- Citlivá data (e-maily, konverzace) šifrována

```typescript
// Middleware pro ověření API klíče
const validateSharedApiKey = (req, res, next) => {
  const apiKey = req.headers['x-shared-api-key'];
  if (apiKey !== process.env.SHARED_BRAIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
```

## Výhody propojených nádob

1. **Konzistentní osobnost** - Natálie mluví stejně na všech platformách
2. **Centrální správa** - změny na jednom místě se propagují všude
3. **Agregované reporty** - celkový přehled v Telegramu
4. **Sdílené učení** - poznatky z jedné platformy obohacují druhou
5. **Efektivita** - jeden "mozek" místo tří oddělených
