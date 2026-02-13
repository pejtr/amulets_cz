# Brevo (Sendinblue) Email Marketing Setup

Tento dokument popisuje, jak nastavit Brevo integraci pro Amulets.cz.

## Proč Brevo?

- **Zdarma**: 300 emailů/den (9000/měsíc)
- **Profesionální**: Email marketing, automatizace, formuláře
- **Jednoduchá integrace**: REST API
- **Nejlevnější placená verze**: 25€/měsíc pro 20k emailů

## Krok 1: Vytvoření Brevo účtu

1. Jděte na [https://www.brevo.com/](https://www.brevo.com/)
2. Klikněte na **"Sign up free"**
3. Vyplňte registrační formulář
4. Ověřte email

## Krok 2: Získání API klíče

1. Přihlaste se do Brevo
2. Jděte na **Settings** (Nastavení) → **SMTP & API**
3. V sekci **API Keys** klikněte na **"Create a new API key"**
4. Pojmenujte klíč (např. "Amulets.cz Production")
5. Zkopírujte vygenerovaný API klíč (začíná `xkeysib-...`)

⚠️ **Důležité**: API klíč se zobrazí pouze jednou! Uložte si ho na bezpečné místo.

## Krok 3: Vytvoření email listu

1. V Brevo jděte na **Contacts** → **Lists**
2. Klikněte na **"Create a list"**
3. Pojmenujte list (např. "Exit Intent Subscribers")
4. Zkopírujte **List ID** (číslo vedle názvu listu)

## Krok 4: Konfigurace v Manus

1. Otevřete **Management UI** → **Settings** → **Secrets**
2. Přidejte novou env proměnnou:
   - **Key**: `BREVO_API_KEY`
   - **Value**: Váš API klíč z kroku 2

## Krok 5: Nastavení List ID v kódu

Otevřete soubor `server/routers.ts` a najděte řádek:

```ts
listIds: [2], // Replace with your Brevo list ID
```

Změňte `[2]` na vaše skutečné List ID z kroku 3, např.:

```ts
listIds: [5], // Váš List ID
```

## Krok 6: Ověření sender emailu

Brevo vyžaduje ověření odesílací email adresy:

1. V Brevo jděte na **Settings** → **Senders & IP**
2. Klikněte na **"Add a sender"**
3. Zadejte email (např. `info@amulets.cz`)
4. Ověřte email kliknutím na odkaz v potvrzovacím emailu

Pokud chcete změnit odesílací email, upravte v `server/brevo.ts`:

```ts
sender: params.sender || { name: "Amulets.cz", email: "info@amulets.cz" },
```

## Krok 7: Testování

1. Restartujte dev server: `pnpm dev`
2. Otevřete web a vyvolejte exit-intent popup (pohyb myši mimo viewport)
3. Zadejte testovací email
4. Zkontrolujte:
   - Email dorazil do schránky
   - Kontakt se přidal do Brevo listu
   - Slevový kód je správný

## Customizace welcome emailu

Chcete-li upravit vzhled welcome emailu, editujte funkci `sendDiscountWelcomeEmail` v souboru `server/brevo.ts`.

Email je HTML template s inline CSS pro maximální kompatibilitu s email klienty.

## Monitoring a statistiky

V Brevo můžete sledovat:

- **Contacts** → Počet odběratelů
- **Statistics** → Open rate, click rate
- **Campaigns** → Historie odeslaných emailů

## Troubleshooting

### Email nedorazil

1. Zkontrolujte spam složku
2. Ověřte, že sender email je ověřený v Brevo
3. Zkontrolujte Brevo logs: **Statistics** → **Transactional**

### API chyba "Invalid API key"

- Zkontrolujte, že `BREVO_API_KEY` je správně nastavený v Secrets
- API klíč musí začínat `xkeysib-`

### Kontakt se nepřidal do listu

- Zkontrolujte, že List ID v `server/routers.ts` je správné
- List ID je číslo, ne název listu

## Další kroky

### Automatizace

V Brevo můžete nastavit automatické email sekvence:

1. **Welcome series**: 3-5 emailů po registraci
2. **Abandoned cart**: Připomínka nedokončeného nákupu
3. **Re-engagement**: Email pro neaktivní odběratele

### Segmentace

Vytvořte segmenty podle:

- **Zdroj**: Exit intent vs. newsletter signup
- **Aktivita**: Otevřel email, klikl na odkaz
- **Nákup**: Použil slevový kód

## Ceny Brevo

| Plán | Cena | Emaily/měsíc | Kontakty |
|------|------|--------------|----------|
| Free | 0 Kč | 9,000 | Unlimited |
| Lite | 25€ | 20,000 | Unlimited |
| Premium | 65€ | 20,000 | Unlimited + Advanced features |

💡 **Tip**: Free plán je dostačující pro začátek. Upgrade až když budete posílat více než 300 emailů/den.

## Podpora

- **Brevo dokumentace**: [https://developers.brevo.com/](https://developers.brevo.com/)
- **Brevo support**: [https://help.brevo.com/](https://help.brevo.com/)
