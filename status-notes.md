# Stav webu Amulets.cz - 1. února 2026

## Provedené úpravy

### 1. Chatbot ikona (AIChatAssistant.tsx)
- ✅ Zmenšena z h-24 w-24 na h-16 w-16 (o 33%)
- ✅ Posunuta doprava (right-4) a nahoru (bottom-8)
- ✅ Menší online/offline indikátor (h-4 w-4)
- ✅ Menší chat ikona v rohu (h-3 w-3)

### 2. OHORAI Widget (OhoraiWidget.tsx)
- ✅ Mobilní minimalizovaná pozice: bottom-24 left-2 w-10 h-10
- ✅ Mobilní rozbalená pozice: bottom-24 left-2 w-[200px] max-w-[220px]
- ✅ Zmenšeno video na mobilu: max-h-[100px]
- ✅ Auto-minimalizace na mobilu po 5 sekundách

### 3. Footer - Spřízněné projekty
- ✅ Jan Kroča již přidán (https://www.jankroca.cz/)
- ✅ Popis: "Léčivá místa"
- ✅ Ikona: 🏛️

## Vizuální kontrola
- OHORAI widget je viditelný vlevo dole
- Chatbot ikona je viditelná vpravo dole (menší než dříve)
- Footer zobrazuje všech 8 spřízněných projektů včetně Jana Kroči
- Žádné překrývání UI prvků

## Testy
- TypeScript: bez chyb
- Dev server: běží na portu 3000
