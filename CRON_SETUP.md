# Nastavení automatických úloh (Cron Jobs)

Tento projekt obsahuje automatické úlohy které je potřeba spustit v pravidelných intervalech.

## Týdenní A/B test cleanup

**Účel:** Automaticky deaktivuje slabé varianty chatbota každé pondělí v 9:00

**Endpoint:** `POST /api/trpc/telegram.runWeeklyCleanup`

### Nastavení přes Manus Schedule

Pokud používáte Manus hosting, můžete nastavit automatické spouštění přímo v Manus UI:

1. Otevřete projekt v Manus
2. Přejděte do Settings → Scheduled Tasks
3. Přidejte novou úlohu:
   - **Název:** Weekly A/B Test Cleanup
   - **Cron výraz:** `0 9 * * 1` (každé pondělí v 9:00)
   - **Endpoint:** `/api/trpc/telegram.runWeeklyCleanup`
   - **Metoda:** POST

### Nastavení přes externí cron

Pokud chcete spustit úlohu z externího serveru, použijte curl:

```bash
# Přidejte do crontab (crontab -e)
0 9 * * 1 curl -X POST https://your-domain.com/api/trpc/telegram.runWeeklyCleanup
```

### Manuální spuštění

Pro testování můžete úlohu spustit manuálně:

```bash
curl -X POST https://your-domain.com/api/trpc/telegram.runWeeklyCleanup
```

Nebo z admin rozhraní na stránce `/admin/abtest` klikněte na tlačítko "Auto-deaktivovat slabé".

## Co se děje při spuštění?

1. Zkontroluje všechny aktivní varianty chatbota
2. Spočítá konverzní poměr za posledních 7 dní
3. Najde nejlepší variantu
4. Deaktivuje varianty které mají:
   - Konverzní poměr nižší než 70% nejlepší varianty
   - Alespoň 50 konverzací (statistická významnost)
5. Pošle notifikaci do Telegramu s výsledky

## Notifikace

Po každém spuštění dostanete Telegram notifikaci s informacemi:
- Počet deaktivovaných variant
- Seznam deaktivovaných variant s jejich konverzními poměry
- Seznam aktivních variant které zůstaly

## Troubleshooting

Pokud úloha nefunguje:

1. Zkontrolujte že máte správně nastavený `TELEGRAM_BOT_TOKEN` a `TELEGRAM_CHAT_ID`
2. Zkontrolujte logy serveru pro případné chyby
3. Spusťte úlohu manuálně pro testování
4. Zkontrolujte že máte alespoň 2 aktivní varianty (jinak se nic nedeaktivuje)
