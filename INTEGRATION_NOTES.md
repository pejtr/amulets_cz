# Integrace Manus vlákna do GitHub repozitáře

## Situace
- Uživatel požaduje převzetí projektu z Manus vlákna: https://manus.im/share/hSsYhUmDtW9ZMbM0jd2xaf
- GitHub repozitář `pejtr/amulets_cz` obsahuje pouze initial commit
- Manus API neumožňuje přímý export souborů ze sdíleného vlákna

## Možnosti řešení

### 1. Manuální export z Manus UI
- Uživatel může v Manus UI stáhnout všechny soubory z tasku
- Následně je nahrát jako ZIP nebo jednotlivě

### 2. Rebuild podle specifikace
- Vytvořit projekt od nuly podle detailní specifikace poskytnuté uživatelem
- Implementovat všechny popsané funkce:
  - A/B testovací infrastruktura
  - AI doporučovací systém
  - Admin dashboardy
  - Vícejazyčná podpora (cs/en/it)
  - Telegram notifikace
  - Weekly email digests
  - Instagram integrace

### 3. Požádat o přístup k původnímu projektu
- Uživatel může mít projekt lokálně
- Nebo v jiném repozitáři

## Doporučený postup
Požádat uživatele o:
1. ZIP archiv projektu z Manus tasku
2. Nebo odkaz na jiný GitHub repozitář s kódem
3. Nebo potvrzení, že mám začít rebuild od nuly
