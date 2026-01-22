# 🪷 Telegram VIP Skupina - Setup Guide

**Datum:** 21. ledna 2026  
**Projekt:** Amulets.cz  
**Účel:** VIP komunita pro spirituální růst a harmonii  

---

## ✅ CO JE HOTOVÉ (Implementováno v kódu)

### 1. **Telegram Bot příkazy**
- ✅ `/vip` - Pošle invite link do VIP skupiny
- ✅ `/report` - Denní report (již existovalo)
- ✅ `/horoskop` - Denní horoskop (již existovalo)
- ✅ `/meditace` - Meditační tipy (již existovalo)
- ✅ `/frekvence [Hz]` - Konkrétní frekvence (již existovalo)

### 2. **Automatizace**
- ✅ **Denní report** - 8:00 ráno (již existovalo)
- ✅ **Meditační připomínky** - 19:45 večer (NOVÉ!)
- ✅ **Welcome message** - Pro nové členy skupiny

### 3. **Funkce v kódu**
- ✅ `generateVIPInviteMessage()` - Invite zpráva s linkem
- ✅ `generateVIPWelcomeMessage()` - Welcome zpráva pro nové členy
- ✅ `generateMeditationReminder()` - Denní připomínka na meditaci

---

## 📋 CO MUSÍTE UDĚLAT MANUÁLNĚ

### Krok 1: Vytvořit Telegram VIP skupinu

1. **Otevřete Telegram**
2. **Vytvořte novou skupinu:**
   - Klikněte na "New Group"
   - Název: **"🪷 Amulets VIP - Spirituální Harmonie"**
   - Přidejte sebe jako admina
3. **Změňte typ na Supergroup:**
   - Group Settings → "Convert to Supergroup"
4. **Zapněte Topics (kanály):**
   - Group Settings → "Topics" → Zapnout
5. **Vytvořte kanály (topics):**
   - 📢 **#oznámení** (pouze admin)
   - 💬 **#hlavní-chat** (všichni)
   - 🧘 **#meditace-frekvence** (všichni)
   - 🔮 **#symboly-rituály** (všichni)
   - 👑 **#vip-only** (pouze Premium členové)

---

### Krok 2: Získat Chat ID skupiny

1. **Přidejte bota do skupiny:**
   - Přidejte vašeho Telegram bota do VIP skupiny
   - Dejte mu admin práva
2. **Získejte Chat ID:**
   ```bash
   # Pošlete zprávu do skupiny (např. "test")
   # Pak zavolejte Telegram API:
   curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates"
   
   # Najděte "chat":{"id":-1001234567890, ...}
   # To je vaše TELEGRAM_VIP_GROUP_CHAT_ID
   ```

---

### Krok 3: Vytvořit Invite Link

1. **V Telegram skupině:**
   - Group Settings → "Invite Links"
   - Klikněte "Create a New Link"
2. **Nastavení linku:**
   - **Limit:** Unlimited
   - **Expiration:** Never
   - **Approval:** Required (nebo ne, podle vás)
3. **Zkopírujte link:**
   - Např: `https://t.me/+AbCdEfGhIjKlMnOp`

---

### Krok 4: Přidat ENV proměnné

Přidejte do vašeho `.env` souboru (nebo do Manus Secrets):

```bash
# Telegram VIP Group
TELEGRAM_VIP_GROUP_LINK=https://t.me/+AbCdEfGhIjKlMnOp
TELEGRAM_VIP_GROUP_CHAT_ID=-1001234567890
```

**Jak přidat v Manus:**
1. Otevřete Management UI → Settings → Secrets
2. Přidejte nové secrets:
   - `TELEGRAM_VIP_GROUP_LINK` = váš invite link
   - `TELEGRAM_VIP_GROUP_CHAT_ID` = chat ID skupiny

---

### Krok 5: Nastavit pravidla skupiny

1. **Vytvořte zprávu s pravidly:**
   ```
   🪷 PRAVIDLA AMULETS VIP KOMUNITY

   1. 💜 RESPEKT
      Buďte k sobě laskavé. Žádné urážky, hate speech nebo trolling.

   2. 🔒 SOUKROMÍ
      Co se děje v komunitě, zůstává v komunitě. Nesdílejte obsah ven bez svolení.

   3. 🚫 SPAM
      Žádná reklama, affiliate linky nebo self-promotion bez schválení admina.

   4. 🎯 ON-TOPIC
      Držte se témat: spiritualita, wellness, seberozvoj. Off-topic do #hlavní-chat.

   5. 💎 HODNOTA
      Sdílejte zkušenosti, tipy a podporu. Pomáhejte ostatním růst.

   6. 🙏 PODPORA
      Pokud máte problém, napište @NatalieOhorai nebo adminům.

   Porušení pravidel = varování → kick → ban.

   Vítejte v naší komunitě! 🪷✨
   ```

2. **Připněte zprávu:**
   - Klikněte na zprávu → "Pin Message"

---

### Krok 6: Testovat bot příkazy

1. **Otevřete Telegram chat s botem** (ne skupinu, ale 1-on-1 chat)
2. **Testujte příkazy:**
   ```
   /vip
   → Měl by poslat invite link do VIP skupiny
   
   /meditace
   → Měl by poslat meditační tipy
   
   /report
   → Měl by poslat denní report
   ```

---

## 🤖 JAK TO FUNGUJE

### Automatické zprávy:

**1. Denní report (8:00 ráno):**
- Bot automaticky pošle report do vašeho hlavního chatu
- Obsahuje statistiky z Amulets.cz a OHORAI

**2. Meditační připomínka (19:45 večer):**
- Bot automaticky pošle připomínku do VIP skupiny (#meditace-frekvence)
- Připomene členy na večerní meditaci v 20:00
- Každý den jiná frekvence (rotace podle dne v týdnu)

**3. Welcome message (při vstupu):**
- Když někdo vstoupí do VIP skupiny, bot pošle welcome zprávu
- **POZNÁMKA:** Toto musíte nastavit manuálně přes Telegram Bot API webhook
- Nebo použít externího bota (např. @GroupHelpBot)

---

## 📊 MONITORING

### Jak sledovat aktivitu:

1. **Telegram Analytics:**
   - Group Settings → "Statistics"
   - Vidíte: počet členů, aktivitu, top posty

2. **Bot logy:**
   ```bash
   # V konzoli serveru uvidíte:
   [Telegram] Sending meditation reminder to VIP group...
   [Telegram] Sending scheduled daily report...
   ```

3. **Manuální příkazy:**
   ```
   /report - Získat aktuální statistiky
   /vip - Otestovat invite link
   ```

---

## 🎯 PRVNÍ TÝDEN OBSAHU

Máte připravený obsah na celý první týden v souboru:
**`telegram-skupina-amulets-setup.md`**

### Co dělat:

1. **Den 1 (Pondělí):**
   - Ráno (9:00): Pošlete úvodní zprávu do #oznámení
   - Večer (20:00): První společná meditace v #meditace-frekvence

2. **Den 2-7:**
   - Zkopírujte obsah z dokumentace
   - Pošlete v uvedených časech
   - Bot automaticky pošle připomínky v 19:45

3. **Tip:**
   - Použijte Telegram Scheduler pro naplánování postů dopředu
   - Nebo použijte nástroj jako Buffer/Hootsuite

---

## 💰 MONETIZACE

### Premium členství (88 Kč/měsíc):

**Co obsahuje:**
- Přístup do #vip-only kanálu
- Všechny meditace (20+)
- Měsíční live calls
- Early access k novým produktům

**Jak implementovat:**
1. Vytvořte Stripe předplatné (nebo Brevo)
2. Po platbě přidejte člena do #vip-only
3. Sledujte v databázi kdo má aktivní předplatné

**TODO:** Implementovat Premium check v databázi

---

## 🚀 LAUNCH CHECKLIST

- [ ] Vytvořit VIP skupinu v Telegramu
- [ ] Získat Chat ID skupiny
- [ ] Vytvořit invite link
- [ ] Přidat ENV proměnné (TELEGRAM_VIP_GROUP_LINK, TELEGRAM_VIP_GROUP_CHAT_ID)
- [ ] Nastavit pravidla a připnout je
- [ ] Otestovat `/vip` příkaz
- [ ] Otestovat automatické připomínky (počkat do 19:45)
- [ ] Poslat první týden obsahu
- [ ] Pozvat první členy (kamarádi, rodina)
- [ ] Spustit Telegram Ads (budget 2500 Kč/měsíc)

---

## 📞 PODPORA

Pokud máte problém:
1. Zkontrolujte logy serveru
2. Ověřte ENV proměnné
3. Testujte příkazy manuálně
4. Kontaktujte Manus support

---

**Vytvořil:** Manus AI  
**Datum:** 21. ledna 2026  
**Kontakt:** @NatalieOhorai  

🪷✨
