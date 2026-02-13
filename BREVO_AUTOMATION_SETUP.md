# Brevo Automation Workflows - Implementační Průvodce

## Přehled

Tento dokument popisuje, jak nastavit automatizované email kampaně v Brevo pro cross-promotion mezi Amulets.cz a OHORAI-MARKETPLACE.

## Workflow 1: Amulets → OHORAI (Nový zákazník)

**Trigger:** Nový kontakt přidaný do listu "Amulets Subscribers"

**Sekvence:**
1. **Email 1** (Den 0 - hned po přihlášení)
   - Předmět: "Objevte Prémiovou Kolekci OHORAI - Exkluzivní Nabídka"
   - Obsah: Představení OHORAI kolekce
   - CTA: "Prozkoumat OHORAI"
   - Sleva: 15% (kód: AMULETS15)

2. **Email 2** (Den 3)
   - Předmět: "Energetické pyramidy OHORAI - Vaše osobní harmonizace"
   - Obsah: Detaily o orgonitových pyramidách
   - CTA: "Koupit pyramidu"
   - Sleva: 15% (kód: AMULETS15)

3. **Email 3** (Den 7)
   - Předmět: "Poslední šance: 15% sleva na OHORAI skončí za 24 hodin"
   - Obsah: Urgency messaging
   - CTA: "Koupit nyní"
   - Sleva: 15% (kód: AMULETS15)

**Podmínky:**
- Pokud uživatel klikne na OHORAI link → Přidej tag "ohorai_interested"
- Pokud uživatel nakoupí na OHORAI → Přidej tag "ohorai_customer" a odeber z workflow

## Workflow 2: OHORAI → Amulets (Nový zákazník)

**Trigger:** Nový kontakt přidaný do listu "OHORAI Subscribers"

**Sekvence:**
1. **Email 1** (Den 0)
   - Předmět: "Objevte Spirituální Symboly - Nová Kolekce Amulets.cz"
   - Obsah: Představení Amulets.cz
   - CTA: "Prozkoumat Amulets.cz"
   - Sleva: 20% (kód: OHORAI20)

2. **Email 2** (Den 4)
   - Předmět: "Privěsky AMEN - Spojení s duchovnem"
   - Obsah: Detaily o privěscích AMEN
   - CTA: "Koupit privěsky"
   - Sleva: 20% (kód: OHORAI20)

3. **Email 3** (Den 7)
   - Předmět: "Poslední šance: 20% sleva na Amulets.cz"
   - Obsah: Urgency messaging
   - CTA: "Koupit nyní"
   - Sleva: 20% (kód: OHORAI20)

**Podmínky:**
- Pokud uživatel klikne na Amulets link → Přidej tag "amulets_interested"
- Pokud uživatel nakoupí na Amulets → Přidej tag "amulets_customer" a odeber z workflow

## Workflow 3: VIP Zákazníci (Speciální Nabídka)

**Trigger:** Kontakt s tagem "vip_customer" (oba weby)

**Sekvence:**
1. **Email 1** (Den 0)
   - Předmět: "🌟 VIP Exkluzivní Nabídka - 30% Sleva"
   - Obsah: VIP benefits
   - CTA: "Koupit nyní"
   - Sleva: 30% (kód: VIP30)
   - Trvání: 30 dní

**Podmínky:**
- Pokud uživatel nakoupí → Přidej tag "vip_converted"
- Pokud uživatel neklikne → Pošli reminder email na Den 15

## Workflow 4: Re-engagement (Neaktivní Zákazníci)

**Trigger:** Žádný klik na email za 30 dní

**Sekvence:**
1. **Email 1** (Den 30)
   - Předmět: "Vracíme se k vám: Speciální nabídka pro vás"
   - Obsah: Reminder o produktech
   - CTA: "Koupit nyní"
   - Sleva: 25% (kód: COMEBACK25)

**Podmínky:**
- Pokud uživatel klikne → Odeber tag "inactive"
- Pokud uživatel neklikne po 60 dnech → Přidej do "Unsubscribe" listu

## Brevo List Struktura

| List ID | Název | Popis |
|---------|-------|-------|
| 3 | Amulets Subscribers | Noví zákazníci z Amulets.cz |
| 4 | OHORAI Subscribers | Noví zákazníci z OHORAI |
| 5 | VIP Customers | VIP zákazníci obou webů |
| 6 | Inactive Users | Neaktivní uživatelé (30+ dní bez aktivity) |

## Custom Fields (Brevo)

| Pole | Typ | Popis |
|------|-----|-------|
| FIRST_NAME | Text | Jméno |
| EMAIL | Email | Email adresa |
| SOURCE | Text | Zdroj (amulets, ohorai, exit_intent) |
| PURCHASE_AMOUNT | Number | Celková výše nákupů |
| LAST_PURCHASE_DATE | Date | Datum posledního nákupu |
| DISCOUNT_CODE | Text | Aktuální slevový kód |
| CAMPAIGN_INTEREST | Text | Zainteresovanost (amulets, ohorai, both) |
| VIP_STATUS | Text | VIP status (yes/no) |
| TAGS | Text | Tagy (comma-separated) |

## Implementace v Kódu

### 1. Přidání kontaktu do Brevo

```typescript
import { addBrevoContact } from './server/brevo';

// Při přihlášení do newsletteru
await addBrevoContact({
  email: 'user@example.com',
  attributes: {
    FIRST_NAME: 'Jan',
    SOURCE: 'amulets',
    CAMPAIGN_INTEREST: 'amulets',
  },
  listIds: [3], // Amulets Subscribers
  updateEnabled: true,
});
```

### 2. Odeslání Kampanijního Emailu

```typescript
import { trpc } from '@/lib/trpc';

// Na frontend
const { mutate: sendCampaign } = trpc.email.sendCampaignEmail.useMutation();

sendCampaign({
  email: 'user@example.com',
  campaignType: 'amuletToOhorai',
  firstName: 'Jan',
});
```

### 3. Tagging Kontaktu

```typescript
import { tagContact } from './server/brevo';

// Po nákupu
await tagContact('user@example.com', ['amulets_customer', 'vip_customer']);
```

## Metriky a KPIs

| Metrika | Cíl | Očekávání |
|---------|-----|-----------|
| Open Rate | 25-35% | 2-3% conversion |
| Click Rate | 5-10% | 15-20% engagement |
| Conversion Rate | 2-3% | 8-12 objednávek/měsíc |
| Revenue | +680-910K Kč/rok | ROI 680-910% |

## Nastavení v Brevo UI

1. **Přihlášení do Brevo**: https://app.brevo.com
2. **Automation → Workflows**
3. **Create Workflow** → Vybrat trigger
4. **Add Emails** → Vybrat šablony
5. **Set Conditions** → Tagy, kliknutí, nákupy
6. **Activate** → Spustit workflow

## Testování

1. **Test Email**: Pošli si test email na svůj email
2. **Verify Links**: Zkontroluj, že všechny linky vedou na správná místa
3. **Check Tracking**: Ověř, že UTM parametry jsou správně nastaveny
4. **Monitor Performance**: Sleduj open rate, click rate, conversion rate

## Očekávané Výsledky (3 měsíce)

- **1,200 nových kontaktů** (400 z Amulets, 400 z OHORAI, 400 z exit intent)
- **240 otevření emailů** (20% open rate)
- **24 kliknutí** (10% click rate)
- **8-12 objednávek** (2-3% conversion rate)
- **Výtěžnost**: 15-20K Kč (privěsky AMEN) + 10-15K Kč (OHORAI produkty)

## Troubleshooting

### Nízký open rate
- Zkontroluj subject line
- Testuj A/B testing
- Zkus poslat v jiný čas

### Nízký click rate
- Zkontroluj CTA tlačítko
- Testuj různé texty
- Zkus lepší design

### Nízký conversion rate
- Zkontroluj landing page
- Testuj různé slevy
- Zkus urgency messaging

## Další Kroky

1. ✅ Nastavit Brevo API (hotovo)
2. ✅ Vytvořit email šablony (hotovo)
3. ⏳ Vytvořit workflows v Brevo UI
4. ⏳ Testovat workflows
5. ⏳ Aktivovat workflows
6. ⏳ Monitorovat metriky
