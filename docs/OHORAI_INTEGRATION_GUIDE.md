# Návod pro integraci sdíleného mozku Natálie do OHORAI

Tento dokument popisuje, jak propojit chatbot na OHORAI marketplace se sdíleným mozkem Natálie na Amulets.cz.

## Přehled

Amulets.cz nyní poskytuje API endpointy pro sdílení osobnosti Natálie a agregaci statistik. OHORAI může tyto endpointy využít pro:

1. **Načtení osobnosti** - konzistentní chování chatbota napříč platformami
2. **Synchronizaci statistik** - agregované reporty do Telegramu
3. **Health check** - ověření dostupnosti sdíleného mozku

## API Endpointy

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/trpc/shared.getPersonality` | GET | Získat osobnost Natálie pro OHORAI |
| `/api/trpc/shared.syncStats` | POST | Odeslat denní statistiky pro agregaci |
| `/api/trpc/shared.getDailyReport` | GET | Získat agregovaný report |
| `/api/trpc/shared.healthCheck` | GET | Ověřit dostupnost API |

## Krok 1: Nastavení API klíče

V OHORAI projektu přidejte environment proměnnou:

```env
SHARED_BRAIN_API_KEY=váš-sdílený-klíč
AMULETS_API_URL=https://amulets.cz
```

## Krok 2: Načtení osobnosti při startu chatbota

V OHORAI chatbotu nahraďte lokální definici osobnosti voláním API:

```typescript
// ohorai-marketplace/server/chatbot.ts

interface NataliePersonality {
  basePersonality: string;
  contextPrompt: string;
  identity: any;
  traits: any;
  romanticResponses: any;
  greetings: any;
  closings: any;
  version: string;
  lastUpdated: string;
}

let cachedPersonality: NataliePersonality | null = null;
let lastFetch = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hodina

async function getNataliePersonality(): Promise<NataliePersonality> {
  const now = Date.now();
  
  // Použít cache pokud je platná
  if (cachedPersonality && (now - lastFetch) < CACHE_TTL) {
    return cachedPersonality;
  }
  
  try {
    const apiUrl = process.env.AMULETS_API_URL || 'https://amulets.cz';
    const apiKey = process.env.SHARED_BRAIN_API_KEY;
    
    const response = await fetch(
      `${apiUrl}/api/trpc/shared.getPersonality?input=${encodeURIComponent(
        JSON.stringify({ platform: 'ohorai', apiKey })
      )}`
    );
    
    const data = await response.json();
    
    if (data.result?.data) {
      cachedPersonality = data.result.data;
      lastFetch = now;
      console.log('[SharedBrain] Personality loaded from Amulets.cz');
      return cachedPersonality;
    }
  } catch (error) {
    console.error('[SharedBrain] Failed to fetch personality:', error);
  }
  
  // Fallback na lokální definici
  return getLocalFallbackPersonality();
}

function getLocalFallbackPersonality(): NataliePersonality {
  return {
    basePersonality: `Jsi Natálie Ohorai, zakladatelka OHORAI marketplace...`,
    contextPrompt: `Pomáháš zákazníkům najít správné krystaly a kameny...`,
    identity: { name: 'Natálie Ohorai' },
    traits: {},
    romanticResponses: {},
    greetings: {},
    closings: {},
    version: 'fallback',
    lastUpdated: new Date().toISOString(),
  };
}
```

## Krok 3: Použití osobnosti v chatbotu

```typescript
// V handleru pro chat zprávy
async function handleChatMessage(message: string, context: any) {
  const personality = await getNataliePersonality();
  
  const systemPrompt = `${personality.contextPrompt}

**Speciální kontext - OHORAI Marketplace:**
Pomáháš zákazníkům s krystaly a drahými kameny.
- Doporučuj produkty z marketplace
- Vysvětluj vlastnosti kamenů
- Nabízej personalizované poradenství
`;

  const response = await invokeLLM({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
  });
  
  return response;
}
```

## Krok 4: Synchronizace denních statistik

Přidejte cron job pro půlnoční synchronizaci:

```typescript
// ohorai-marketplace/server/sync.ts

interface DailyStats {
  totalConversations: number;
  totalMessages: number;
  uniqueVisitors: number;
  streamSelections?: {
    hmotne?: number;
    etericke?: number;
    uzitecne?: number;
  };
  popularTopics?: string[];
  leadsCollected?: number;
}

async function syncDailyStats(): Promise<boolean> {
  const apiUrl = process.env.AMULETS_API_URL || 'https://amulets.cz';
  const apiKey = process.env.SHARED_BRAIN_API_KEY;
  
  if (!apiKey) {
    console.warn('[SharedBrain] API key not configured');
    return false;
  }
  
  // Získat včerejší statistiky z OHORAI databáze
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  
  const stats = await getOhoraiDailyStats(dateStr);
  
  try {
    const response = await fetch(`${apiUrl}/api/trpc/shared.syncStats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: 'ohorai',
        apiKey,
        date: dateStr,
        stats,
      }),
    });
    
    const data = await response.json();
    
    if (data.result?.data?.success) {
      console.log(`[SharedBrain] Stats synced for ${dateStr}`);
      return true;
    }
  } catch (error) {
    console.error('[SharedBrain] Failed to sync stats:', error);
  }
  
  return false;
}

// Spustit každý den v 00:05
// V server/_core/index.ts přidejte:
// import { syncDailyStats } from '../sync';
// setInterval(syncDailyStats, 24 * 60 * 60 * 1000);
```

## Krok 5: Tři proudy vědomí v chatbotu

OHORAI chatbot by měl také nabízet tři proudy:

```typescript
const SUGGESTED_CATEGORIES = [
  {
    id: "ethereal",
    stream: "etericke",
    category: "Spiritualita",
    icon: "✨",
    description: "Pochop, co tvá duše hledá",
    questions: [
      "Jaký krystal rezonuje s mou energií?",
      "Jak vybrat kámen pro meditaci?",
      "Co mi pomohou čakrové kameny?",
    ],
  },
  {
    id: "material",
    stream: "hmotne",
    category: "Krystaly & Kameny",
    icon: "💎",
    description: "Najdi svůj dokonalý krystal",
    questions: [
      "Jaké máte ametysty?",
      "Hledám růženín pro lásku",
      "Co je to orgonit?",
    ],
  },
  {
    id: "useful",
    stream: "uzitecne",
    category: "Služby & Vzdělávání",
    icon: "🌟",
    description: "Kurzy, akademie, konzultace",
    questions: [
      "Jaké kurzy nabízíte?",
      "Chci se naučit o krystalech",
      "Nabízíte osobní konzultace?",
    ],
  },
];
```

## Krok 6: Tracking volby proudu

```typescript
// Při kliknutí na kategorii
function handleCategoryClick(category: typeof SUGGESTED_CATEGORIES[0]) {
  // Lokální tracking
  logEvent({
    eventType: 'stream_selected',
    eventData: JSON.stringify({ 
      stream: category.stream, 
      categoryId: category.id 
    }),
  });
  
  // Toto se pak agreguje při půlnoční synchronizaci
}
```

## Testování integrace

1. **Health check:**
```bash
curl "https://amulets.cz/api/trpc/shared.healthCheck"
```

2. **Načtení osobnosti:**
```bash
curl "https://amulets.cz/api/trpc/shared.getPersonality?input=%7B%22platform%22%3A%22ohorai%22%7D"
```

3. **Synchronizace statistik:**
```bash
curl -X POST "https://amulets.cz/api/trpc/shared.syncStats" \
  -H "Content-Type: application/json" \
  -d '{"platform":"ohorai","apiKey":"váš-klíč","date":"2026-01-18","stats":{"totalConversations":10}}'
```

## Výhody propojení

Po úspěšné integraci získáte:

1. **Konzistentní osobnost** - Natálie mluví stejně na obou platformách
2. **Centrální správa** - změny osobnosti na Amulets.cz se automaticky propagují
3. **Agregované reporty** - jeden Telegram report z obou platforem
4. **Sdílené učení** - poznatky z jedné platformy obohacují druhou

## Podpora

V případě problémů kontaktujte tým Amulets.cz nebo vytvořte issue v GitHub repozitáři.
