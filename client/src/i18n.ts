import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  cs: {
    translation: {
      // Navigation
      "nav.guides": "Průvodce amulety",
      "nav.symbol": "Kvíz: Tvůj symbol",
      "nav.horoscope": "Čínský horoskop 2026",
      "nav.lunar": "Lunární čtení",
      "nav.pyramids": "Pyramidy",
      "nav.aromatherapy": "Aromaterapie",
      "nav.prayers": "Přívěsky AMEN",
      "nav.magazine": "Magazín",
      "nav.about": "O nás",
      "nav.contact": "Kontakt",
      
      // Hero Section
      "hero.title": "Posvátné symboly\na amulety",
      "hero.subtitle": "Objevte sílu drahých kamenů a talismanů",
      "hero.cta.products": "Prohlédnout produkty",
      "hero.cta.ohorai": "Přejít na OHORAI",
      
      // Chatbot
      "chat.greeting": "Dobrý den! 🌟 Právě odpovídám. Jsem tu denně 8:00-24:00. Napište mi na WhatsApp nebo zanechte dotaz!",
      "chat.offline": "Děkuji za vaši zprávu! 💜 Právě jsem mimo pracovní dobu, ale vaši zprávu jsem přijala a brzy vám odpovím.",
      "chat.placeholder": "Napište zprávu...",
      "chat.send": "Odeslat",
      
      // Music Player
      "music.title": "Gloria in Excelsis Deo",
      "music.meaning": "\"Sláva na výsostech Bohu\" - andělský hymnus z Bible (Lukáš 2:14), zpívaný anděly při narození Ježíše Krista.",
      
      // Products
      "product.pyramid": "Orgonitová pyramida",
      "product.pendant": "Přívěsek",
      "product.essence": "Aromaterapeutická esence",
      "product.addToCart": "Přidat do košíku",
      "product.details": "Zobrazit detail",
      "product.price": "Cena",
      "product.inStock": "Skladem",
      "product.outOfStock": "Vyprodané",
      
      // Quiz
      "quiz.subtitle": "Odpověz na několik otázek a objev svůj osobní talisman",
      "quiz.start": "Začít kvíz",
      "quiz.next": "Další otázka",
      "quiz.previous": "Předchozí",
      "quiz.finish": "Zobrazit výsledek",
      "quiz.result.title": "Tvůj symbol je",
      "quiz.result.description": "Tento symbol ti pomůže na tvé duchovní cestě",
      
      // Common
      "common.search": "Co hledáte?",
      "common.freeShipping": "Doprava zdarma nad 1 500 Kč",
      "common.backToTop": "Zpět nahoru",
      "common.loading": "Načítání...",
      "common.error": "Něco se pokazilo",
      "common.tryAgain": "Zkusit znovu",
      
      // Header
      "header.search": "Co hledáte?",
      "header.needHelp": "Potřebujete poradit?",
      "header.chatbot": "Chatbot asistent",
      "header.howToBuy": "Jak nakoupit?",
      "header.howToBuyDesc": "Vyberte si produkt, klikněte na tlačítko \"Koupit na OHORAI\" a budete přesměrováni na oficiální e-shop OHORAI.cz, kde dokončíte objednávku.",
      
      // Hero buttons
      "hero.cta.viewProducts": "Zobrazit produkty",
      "hero.cta.visitOhorai": "Přejít na",
      "hero.cta.findAmulet": "Zjisti svůj amulet",
      "hero.cta.chat": "POPOVÍDAT SI",
      "hero.cta.chatOnline": "Online 8:00-22:00",
      "hero.founder": "Zakladatelka Amulets.cz",
      
      // USP Section (updated)
      "usp.delivery.title": "Doprava zdarma od 1 500 Kč",
      "usp.delivery.desc": "Nakupte výhodně a ušetřete na poštovném",
      "usp.handmade.title": "Úpravy na míru",
      "usp.handmade.desc": "Možnost zakázkové tvorby",
      "usp.handcraft.title": "Ruční výroba",
      "usp.handcraft.desc": "Šperky a pyramidy pro vás s láskou vyrábíme",
      "usp.gift.title": "Dárek pro každého",
      "usp.gift.desc": "Přibalíme malé překvapení pro hezčí den",
      
      // Products Section
      "products.pyramids.title": "Orgonitové pyramidy",
      "products.pyramids.desc": "Ručně vyráběné pyramidy s drahými krystaly a vzácnou, silnou bylinou modrý lotos",
      "products.pyramids.readMore": "Modrý lotos - Posvátná květina",
      "products.essences.title": "Aromaterapeutické esence",
      "products.essences.desc": "Ručně vyráběné vůně ze 100% esenciálních olejů nejvyšší kvality.",
      "products.essences.readMore": "Aromaterapie & esence - k čemu nám slouží?",
      "products.readAlso": "Přečtěte si:",
      "products.viewAll": "Zobrazit vše",
      "products.buyOnOhorai": "Koupit na OHORAI",
      "products.inStock": "Skladem",
      "products.soldOut": "Vyprodáno",
      "products.freeShipping": "Doprava zdarma",
      "products.quickView": "Rychlý náhled",
      
      // Guide Section
      "guide.title": "Průvodce amulety",
      "guide.subtitle": "Vyberte si amulet podle symbolů, kamenů nebo účelu",
      "guide.byPurpose": "Výběr podle účelu",
      "guide.bySymbol": "Výběr podle symbolů",
      "guide.byStone": "Výběr podle kamenů",
      "guide.showMore": "Zobrazit další",
      "guide.showLess": "Zobrazit méně",
      "guide.cta": "Zjistit svůj amulet",
      
      // Testimonials
      "testimonials.title": "Co říkají zákazníci a klienti",
      
      // Quiz CTA
      "quizCta.title": "Zjisti svůj spirituální symbol",
      "quizCta.desc": "Odpověz na 5 jednoduchých otázek a objevíme tvůj osobní duchovní symbol, který odráží tvou duši a životní cestu",
      "quizCta.start": "Začít kvíz zdarma",
      "quizCta.questions": "otázek",
      "quizCta.minutes": "minuty",
      "quizCta.symbols": "symbolů",
      
      // FAQ
      "faq.title": "Často kladené otázky",
      "faq.subtitle": "Odpovědi na nejčastější dotazy o amuletů, pyramidách a esencích",
      
      // Footer
      "footer.contactTitle": "Potřebujete se zeptat na něco konkrétního?",
      "footer.contactDesc": "Zavolej, nebo napiš na email.",
      "footer.hours": "Po-Pá: 9:00 - 19:00",
      "footer.emailAnytime": "napsat nám můžeš kdykoliv",
      "footer.shopping": "Vše o nákupu",
      "footer.aboutNatalie": "O Natálii",
      "footer.shipping": "Doprava a platba",
      "footer.terms": "Obchodní podmínky",
      "footer.privacy": "Podmínky ochrany osobních údajů",
      "footer.returns": "Vrácení zboží",
      "footer.followUs": "Sledujte nás",
      "footer.partners": "Spřízněné projekty",
      "footer.copyright": "2020 - 2025 © Amulets.cz, všechna práva vyhrazena",
      
      // Products extra
      "products.lastPieces": "Poslední kusy!",
      "products.limitedEdition": "Limitovaná edice",
      "products.happyCustomers": "500+ spokojených",
      "hero.findAmulet": "Zjisti svůj amulet",
      
      // Quiz CTA (used in QuizCTA component)
      "quiz.title": "Zjisti svůj spirituální symbol",
      "quiz.desc": "Odpověz na 5 jednoduchých otázek a objevíme tvůj osobní duchovní symbol, který odráží tvou duši a životní cestu",
      "quiz.startFree": "Začít kvíz zdarma",
      "quiz.questions": "otázek",
      "quiz.minutes": "minuty",
      "quiz.symbols": "symbolů",
      
      // Magazine
      "magazine.title": "Magazín",
      "magazine.subtitle": "Objevte zajímavé články o duchovnosti, léčivých rostlinách a aromaterapii",
      "magazine.showMore": "Zobrazit další články",
      
      // Exit Intent Popup
      "exitPopup.discountTitle": "Exkluzivní sleva na amulety \ud83c\udf81",
      "exitPopup.ebookTitle": "\ud83d\udcd6 Ještě jste si nestáhli e-book?",
      "exitPopup.discountDesc": "Získejte 11% slevu na celý sortiment",
      "exitPopup.ebookDesc": "Stáhněte si \"7 Kroků k Rovnováze\" zdarma",
      "exitPopup.emailPlaceholder": "Váš email",
      "exitPopup.sending": "Odesílám...",
      "exitPopup.showCode": "Zobrazit slevový kód",
      "exitPopup.emailSent": "Email odeslán! Zkontrolujte svou schránku.",
      "exitPopup.emailError": "Nepodařilo se odeslat email. Zkuste to prosím znovu.",
      "exitPopup.codeCopied": "Kód zkopírován!",
      "exitPopup.privacyNote": "Váš email nebudeme sdílet s třetími stranami",
      "exitPopup.claimDiscount": "Uplatnit slevu na Ohorai.cz",
      "exitPopup.autoApply": "Kód se automaticky aplikuje při přesměrování",
      
      // Chatbot UI
      "chatbot.proactive.home": ["Dobrý den! 💜 Hledáte svůj amulet?", "Ahoj! ✨ Mohu vám s něčím poradit?", "Vítejte! 🔮 Máte otázku k našim produktům?"],
      "chatbot.proactive.guide": ["Mohu vám pomoci vybrat symbol? ✨", "Hledáte konkrétní amulet? 💎", "Potřebujete poradit s výběrem? 🔮"],
      "chatbot.proactive.quiz": ["Chcete zjistit svůj spirituální symbol? ✨", "Potřebujete pomoc s kvízem? 🔮", "Máte otázku k výsledkům? 💜"],
      "chatbot.proactive.default": ["Dobrý den! 💜 Mohu vám pomoci?", "Ahoj! ✨ Máte nějakou otázku?", "Vítejte! 🔮 Potřebujete poradit?"],
      "chatbot.category.spirituality": "Spiritualita",
      "chatbot.category.products": "Amulety & Produkty",
      "chatbot.category.services": "Služby & Kurzy",
      "chatbot.category.howCanIHelp": "Jak ti mohu pomoci?",
      "chatbot.category.back": "← Zpět",
      "chatbot.q.soulSearch": "Co má duše hledá?",
      "chatbot.q.symbolEnergy": "Jaký symbol rezonuje s mou energií?",
      "chatbot.q.intuition": "Jak posílit svou intuici?",
      "chatbot.q.whichAmulet": "Jaký amulet je vhodný pro mě?",
      "chatbot.q.gemstones": "Jaké máte drahé kameny?",
      "chatbot.q.pyramids": "Co jsou orgonitové pyramidy?",
      "chatbot.q.horoscope": "Jaké je moje zvířátko v čínském horoskopu?",
      "chatbot.q.courses": "Jaké kurzy nabízíte?",
      "chatbot.q.createAmulets": "Chci se naučit tvořit amulety",
      "chatbot.offline": "Dobrý den! 🌟 Právě odpočívám. Jsem tu denně 8:00-20:00. Napište mi na WhatsApp nebo zanechte dotaz!\n\nS láskou,\nNatálie 💜",
      "chatbot.premiumOffline": "Dobrý den! 🌟 Právě odpočívám, ale pro tebe jako PREMIUM uživatele jsem dostupná přes Telegram! 💬\n\nKlikni na tlačítko \"Telegram Bot\" níže a můžeme pokračovat v rozhovoru. 😊\n\nS láskou,\nNatálie 💜",
      "chatbot.autoReply": "Vaše zpráva byla přijata! 💜\n\nNatálie vám odpoví hned, jak to bude možné. Děkuji za trpělivost!\n\n~ Amulets.cz tým ✨",
      "chatbot.goodnight": "Milá duše, blíží se půlnoc a já se jdu nabíjet novými silami 🌙✨\n\nDěkuji ti za dnešní rozhovor. Až se probudím v 9:00 ráno, budu tu zase pro tebe.\n\nPřeji ti krásné sny plné světla a lásky. Dobrou noc! 💫💜\n\n~ Natálie",
      "chatbot.persona.phoebe.desc": "Empatická, intuitivní, romantická - vidí do tvé budoucnosti",
      "chatbot.persona.phoebe.greeting": "Ahoj! ✨🔮 Cítím tvůj příchod... Jsem Natálie a mám dar vidět věci, které ostatní nevídají. Něco ti chce být zjeveno - co tě sem přivedlo?",
      "chatbot.persona.piper.desc": "Praktická, starostlivá, moudrá - tvůj bezpečný přístav",
      "chatbot.persona.piper.greeting": "Ahoj, krásná duše! 💜✨ Jsem Natálie a jsem tu, abych tě provedla... Klidně, s láskou a péčí. Co potřebuješ?",
      "chatbot.persona.prue.desc": "Silná, odhodlaná, vůdkyně - pomůže ti najít tvou sílu",
      "chatbot.persona.prue.greeting": "Ahoj! ⚡✨ Jsem Natálie. Cítím v tobě sílu, kterou možná ještě neznáš... Jsem tu, abych ti pomohla ji objevit. Co tě zajímá?",
      "chatbot.minimize": "⬇️ Zmenšit okno",
      "chatbot.maximize": "⬆️ Zvětšit na celou obrazovku",
      "chatbot.close": "❌ Zavřít chat",
      "chatbot.emailCapture": "📌 Chcete dostávat tipy a novinky o spirituálních symbolech?",
      "chatbot.emailPlaceholder": "vas@email.cz",
      "chatbot.emailSend": "Odeslat",
      "chatbot.emailSuccess": "Děkujeme! Budeme vám psát 📌",
      "chatbot.emailError": "Nepodařilo se uložit email. Zkuste to prosím znovu.",
      "chatbot.inputPlaceholder": "Napište zprávu...",
      "chatbot.poweredBy": "Powered by AI • Odpovědi mohou obsahovat chyby",
      "chatbot.feedback.title": "💬 Pomozte nám být lepší!",
      "chatbot.feedback.subtitle": "Vaše názory jsou pro nás velmi cenné. Odpovězte na pár otázek (nepovínné):",
      "chatbot.feedback.placeholder": "Vaše myšlenky...",
      "chatbot.feedback.skip": "Přeskočit",
      "chatbot.feedback.send": "💜 Odeslat",
      "chatbot.feedback.thanks": "Děkujeme za vaši zpětnou vazbu!",
      "chatbot.feedback.thanksDesc": "Vaše názory nám pomáhají vytvářet lepší zážitek pro všechny.",
      "chatbot.feedback.error": "Nepodařilo se odeslat feedback. Zkuste to prosím později.",
      "chatbot.feedback.q.missing": "🤔 Co vám na webu chybí?",
      "chatbot.feedback.q.improvement": "✨ Co byste rádi vylepšili?",
      "chatbot.feedback.q.highValue": "💯 Jaká funkce by pro vás měla nejvyšší hodnotu?",
      "chatbot.feedback.q.joyFactor": "🎉 Co by vám udělalo radost?",
      "chatbot.ticket.thanks": "Děkujeme za váš dotaz!",
      "chatbot.ticket.thanksDesc": "Natálie vám odpoví emailem hned, jak bude k dispozici (9:00-24:00).",
      "chatbot.ticket.leaveQuestion": "📝 Zanechte svůj dotaz a Natálie vám odpoví emailem",
      "chatbot.ticket.name": "Vaše jméno",
      "chatbot.ticket.email": "Váš email",
      "chatbot.ticket.message": "Váš dotaz...",
      "chatbot.ticket.back": "Zpět",
      "chatbot.ticket.sending": "Odesílám...",
      "chatbot.ticket.send": "Odeslat dotaz",
      "chatbot.ticket.success": "Děkujeme! Natálie vám odpoví hned, jak bude k dispozici.",
      "chatbot.ticket.error": "Nepodařilo se odeslat dotaz. Zkuste to prosím znovu.",
      "chatbot.ticket.fillAll": "Vyplňte prosím všechna pole",
      "chatbot.whatsapp.exclusive": "💜 WhatsApp je exkluzivní kontakt pro vážné zájemce",
      "chatbot.whatsapp.selectReason": "Vyberte důvod vašeho zájmu:",
      "chatbot.whatsapp.thanks": "Děkujeme za váš zájem!",
      "chatbot.whatsapp.thanksDesc": "Natálie se těší na váš kontakt",
      "chatbot.whatsapp.open": "Otevřít WhatsApp",
      "chatbot.whatsapp.coaching": "💜 Osobní koučing s Natálií",
      "chatbot.whatsapp.concert": "🔮 Koncert křišťálových mís",
      "chatbot.whatsapp.course": "🎨 Kreativní kurzy posvátné tvorby",
      "chatbot.whatsapp.ohorai": "🪷 Autorská tvorba OHORAI",
      "chatbot.whatsapp.ohoraiEsence": "🧪 Esence OHORAI",
      "chatbot.whatsapp.ohoraiPyramidy": "🔺 Pyramidy OHORAI",
      "chatbot.whatsapp.lunarReading": "🌙 Lunární čtení",
      "chatbot.offline.resting": "🌙 Odpočívá (9-24h)",
      "chatbot.offline.question": "📝 Dotaz",
      "chatbot.chatError": "Omlouváme se, došlo k chybě. Zkuste to prosím znovu.",
      "chatbot.upsell": "💜 **Milá duše, vidím, že tě toto téma opravdu zajímá!**\n\nPokud bys chtěl/a jít hlouběji, nabízím ti několik možností:\n\n✨ **Osobní konzultace** - 30 minut se mnou přes video/telefon\n🌙 **Lunární čtení** - Osobní měsíční profil podle tvého data narození\n🔮 **Kviz: Tvůj symbol** - Zjisti, který amulet rezonuje s tvou energií\n\nStačí napsat, co tě zajímá, a ráda ti povím více! 💜",
      "chatbot.egyptianWelcome": "Vítej zpět, krásná duše! 🌙✨\n\nCítím, že tě sem něco přitahuje... Možná je to volání starověkého Egypta, které rezonuje s tvou duší.\n\nVíš, že **modrý lotos** byl nejposvátnější květinou faraonů? 🪻 Kněží ho používali při posvátných rituálech pro spojení s vyššími dimenzemi...\n\nCo tě dnes přivádí?",
      "chatbot.header.guide": "Průvodkyně procesem",
      "chatbot.header.online": "Online • Odpovídám do 1 minuty",
      "chatbot.header.offline": "Offline • Online od 8:00 do 24:00",
      "chatbot.fontIncrease": "Zvětšit text",
      "chatbot.fontDecrease": "Zmenšit text",
      "chatbot.voiceOn": "🔊 Hlasové odpovědi zapnuty",
      "chatbot.voiceOff": "🔇 Hlasové odpovědi vypnuty",
      "chatbot.voiceOnDesc": "Odpovědi se přehrávají nahlas. Klikněte pro vypnutí.",
      "chatbot.voiceOffDesc": "Zapněte pro poslouchání odpovědí – ideální při józe nebo relaxaci 🧘‍♀️",
      "chatbot.directContact": "📞 Přímý kontakt s Natálií",
      "chatbot.directContactDesc": "WhatsApp / Telefon",
      "chatbot.wa.coaching": "Ahoj Natálie, mám zájem o osobní koučing s tebou 💜",
      "chatbot.wa.concert": "Ahoj Natálie, zajímá mě koncert křišťálových mís 🔮",
      "chatbot.wa.course": "Ahoj Natálie, mám zájem o kreativní kurzy posvátné tvorby 🎨",
      "chatbot.wa.ohorai": "Ahoj Natálie, mám dotaz k autorské tvorbě OHORAI ✨",
      "chatbot.wa.ohoraiEsence": "Ahoj Natálie, zajímají mě aromaterapeutické esence OHORAI 🧪",
      "chatbot.wa.ohoraiPyramidy": "Ahoj Natálie, mám zájem o orgonitové pyramidy OHORAI 🔺",
      "chatbot.wa.lunarReading": "Ahoj Natálie, zajímá mě Lunární čtení - měsíční profil 🌙",
      "chatbot.wa.default": "Ahoj Natálie, potřebuji pomoc",
      
      // SEO
      "seo.title": "Amulets.cz - Zjisti svůj spirituální symbol | 33 posvátných symbolů",
      "seo.description": "Objevte význam 33 spirituálních symbolů a najděte svůj osobní talisman. Průvodce ezoteriky, drahými kameny a jejich léčivými účinky.",
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.guides": "Amulet Guide",
      "nav.symbol": "Quiz: Your Symbol",
      "nav.horoscope": "Chinese Horoscope 2026",
      "nav.lunar": "Lunar Reading",
      "nav.pyramids": "Pyramids",
      "nav.aromatherapy": "Aromatherapy",
      "nav.prayers": "AMEN Pendants",
      "nav.magazine": "Magazine",
      "nav.about": "About Us",
      "nav.contact": "Contact",
      
      // Hero Section
      "hero.title": "Sacred Symbols\n& Amulets",
      "hero.subtitle": "Discover the power of gemstones and talismans",
      "hero.cta.products": "Browse Products",
      "hero.cta.ohorai": "Visit OHORAI",
      
      // Header
      "header.search": "What are you looking for?",
      "header.needHelp": "Need help?",
      "header.chatbot": "Chat assistant",
      "header.howToBuy": "How to buy?",
      "header.howToBuyDesc": "Select a product, click the \"Buy on OHORAI\" button and you will be redirected to the official OHORAI.cz e-shop to complete your order.",
      
      // Hero buttons
      "hero.cta.viewProducts": "View Products",
      "hero.cta.visitOhorai": "Visit",
      "hero.cta.findAmulet": "Find Your Amulet",
      "hero.cta.chat": "CHAT WITH US",
      "hero.cta.chatOnline": "Online 8:00-22:00",
      "hero.founder": "Founder of Amulets.cz",
      
      // USP Section
      "usp.delivery.title": "Free Shipping over $60",
      "usp.delivery.desc": "Shop smart and save on shipping",
      "usp.handmade.title": "Custom Made",
      "usp.handmade.desc": "Custom-made creations available",
      "usp.handcraft.title": "Handcrafted",
      "usp.handcraft.desc": "Jewelry and pyramids made with love for you",
      "usp.gift.title": "Gift for Everyone",
      "usp.gift.desc": "We include a small surprise for a brighter day",
      
      // Products Section
      "products.pyramids.title": "Orgonite Pyramids",
      "products.pyramids.desc": "Handcrafted pyramids with precious crystals and rare, powerful blue lotus herb",
      "products.pyramids.readMore": "Blue Lotus - Sacred Flower",
      "products.essences.title": "Aromatherapy Essences",
      "products.essences.desc": "Handcrafted fragrances from 100% essential oils of the highest quality.",
      "products.essences.readMore": "Aromatherapy & essences - what are they for?",
      "products.readAlso": "Read also:",
      "products.viewAll": "View All",
      "products.buyOnOhorai": "Buy on OHORAI",
      "products.inStock": "In Stock",
      "products.soldOut": "Sold Out",
      "products.freeShipping": "Free Shipping",
      "products.quickView": "Quick View",
      
      // Guide Section
      "guide.title": "Amulet Guide",
      "guide.subtitle": "Choose an amulet by symbols, stones or purpose",
      "guide.byPurpose": "By Purpose",
      "guide.bySymbol": "By Symbol",
      "guide.byStone": "By Stone",
      "guide.showMore": "Show More",
      "guide.showLess": "Show Less",
      "guide.cta": "Find Your Amulet",
      
      // Testimonials
      "testimonials.title": "What Our Customers & Clients Say",
      
      // Quiz CTA
      "quizCta.title": "Find Your Spiritual Symbol",
      "quizCta.desc": "Answer 5 simple questions and we'll discover your personal spiritual symbol that reflects your soul and life path",
      "quizCta.start": "Start Free Quiz",
      "quizCta.questions": "questions",
      "quizCta.minutes": "minutes",
      "quizCta.symbols": "symbols",
      
      // FAQ
      "faq.title": "Frequently Asked Questions",
      "faq.subtitle": "Answers to the most common questions about amulets, pyramids and essences",
      
      // Footer
      "footer.contactTitle": "Need to ask something specific?",
      "footer.contactDesc": "Call us or send an email.",
      "footer.hours": "Mon-Fri: 9:00 AM - 7:00 PM",
      "footer.emailAnytime": "you can write to us anytime",
      "footer.shopping": "Shopping Info",
      "footer.aboutNatalie": "About Natalie",
      "footer.shipping": "Shipping & Payment",
      "footer.terms": "Terms & Conditions",
      "footer.privacy": "Privacy Policy",
      "footer.returns": "Returns",
      "footer.followUs": "Follow Us",
      "footer.partners": "Partner Projects",
      "footer.copyright": "2020 - 2025 © Amulets.cz, all rights reserved",
      
      // Magazine (moved to bottom with new keys)
      "magazine.featured": "Featured Article",
      "magazine.readMore": "Read More",
      
      // Mobile Bottom Nav
      "mobileNav.home": "Home",
      "mobileNav.quizzes": "Quizzes",
      "mobileNav.guide": "Guide",
      "mobileNav.magazine": "Magazine",
      
      // Promo Banner
      "promo.freeShipping": "Free Shipping over $60",
      
      // Chatbot
      "chat.greeting": "Hello! 🌟 I'm here to help. Available daily 8:00 AM - midnight CET. Message me on WhatsApp or leave a question!",
      "chat.offline": "Thank you for your message! 💜 I'm currently offline, but I've received your message and will respond soon.",
      "chat.placeholder": "Type a message...",
      "chat.send": "Send",
      
      // Music Player
      "music.title": "Gloria in Excelsis Deo",
      "music.meaning": "\"Glory to God in the highest\" - angelic hymn from the Bible (Luke 2:14), sung by angels at the birth of Jesus Christ.",
      
      // Products
      "product.pyramid": "Orgonite Pyramid",
      "product.pendant": "Pendant",
      "product.essence": "Aromatherapy Essence",
      "product.addToCart": "Add to Cart",
      "product.details": "View Details",
      "product.price": "Price",
      "product.inStock": "In Stock",
      "product.outOfStock": "Sold Out",
      
      // Quiz
      "quiz.subtitle": "Answer a few questions and discover your personal talisman",
      "quiz.start": "Start Quiz",
      "quiz.next": "Next Question",
      "quiz.previous": "Previous",
      "quiz.finish": "Show Result",
      "quiz.result.title": "Your symbol is",
      "quiz.result.description": "This symbol will help you on your spiritual journey",
      
      // Common
      "common.search": "What are you looking for?",
      "common.freeShipping": "Free Shipping over $60",
      "common.backToTop": "Back to Top",
      "common.loading": "Loading...",
      "common.error": "Something went wrong",
      "common.tryAgain": "Try Again",
      
      // Cookie Consent
      "cookie.title": "We use cookies",
      "cookie.description": "This website uses cookies for Google Translate functionality and analytics. By clicking \"Accept\" you agree to the use of cookies in accordance with GDPR.",
      "cookie.accept": "Accept",
      "cookie.reject": "Decline",
      
      // Comments
      "comments.title": "Comments",
      "comments.placeholder": "Write a comment...",
      "comments.submit": "Submit",
      "comments.login": "Log in to comment",
      
      // Recommendations
      "recommendations.title": "Recommended for You",
      "recommendations.based": "Based on your reading history",
      
      // Products extra
      "products.lastPieces": "Last pieces!",
      "products.limitedEdition": "Limited Edition",
      "products.happyCustomers": "500+ happy customers",
      "hero.findAmulet": "Find Your Amulet",
      
      // Quiz CTA
      "quiz.title": "Find Your Spiritual Symbol",
      "quiz.desc": "Answer 5 simple questions and we'll discover your personal spiritual symbol that reflects your soul and life path",
      "quiz.startFree": "Start Free Quiz",
      "quiz.questions": "questions",
      "quiz.minutes": "minutes",
      "quiz.symbols": "symbols",
      
      // Magazine
      "magazine.title": "Magazine",
      "magazine.subtitle": "Discover fascinating articles about spirituality, healing plants and aromatherapy",
      "magazine.showMore": "Show more articles",
      
      // Exit Intent Popup
      "exitPopup.discountTitle": "Exclusive discount on amulets \ud83c\udf81",
      "exitPopup.ebookTitle": "\ud83d\udcd6 Haven't downloaded the e-book yet?",
      "exitPopup.discountDesc": "Get 11% off the entire collection",
      "exitPopup.ebookDesc": "Download \"7 Steps to Balance\" for free",
      "exitPopup.emailPlaceholder": "Your email",
      "exitPopup.sending": "Sending...",
      "exitPopup.showCode": "Show discount code",
      "exitPopup.emailSent": "Email sent! Check your inbox.",
      "exitPopup.emailError": "Failed to send email. Please try again.",
      "exitPopup.codeCopied": "Code copied!",
      "exitPopup.privacyNote": "We will not share your email with third parties",
      "exitPopup.claimDiscount": "Claim discount at Ohorai.cz",
      "exitPopup.autoApply": "Code is automatically applied on redirect",
      
      // Chatbot UI
      "chatbot.proactive.home": ["Hello! 💜 Looking for your amulet?", "Hi! ✨ Can I help you with something?", "Welcome! 🔮 Do you have a question about our products?"],
      "chatbot.proactive.guide": ["Can I help you choose a symbol? ✨", "Looking for a specific amulet? 💎", "Need help choosing? 🔮"],
      "chatbot.proactive.quiz": ["Want to discover your spiritual symbol? ✨", "Need help with the quiz? 🔮", "Have a question about the results? 💜"],
      "chatbot.proactive.default": ["Hello! 💜 Can I help you?", "Hi! ✨ Do you have a question?", "Welcome! 🔮 Need some guidance?"],
      "chatbot.category.spirituality": "Spirituality",
      "chatbot.category.products": "Amulets & Products",
      "chatbot.category.services": "Services & Courses",
      "chatbot.category.howCanIHelp": "How can I help you?",
      "chatbot.category.back": "← Back",
      "chatbot.q.soulSearch": "What is my soul searching for?",
      "chatbot.q.symbolEnergy": "Which symbol resonates with my energy?",
      "chatbot.q.intuition": "How to strengthen my intuition?",
      "chatbot.q.whichAmulet": "Which amulet is right for me?",
      "chatbot.q.gemstones": "What gemstones do you have?",
      "chatbot.q.pyramids": "What are orgonite pyramids?",
      "chatbot.q.horoscope": "What is my Chinese zodiac animal?",
      "chatbot.q.courses": "What courses do you offer?",
      "chatbot.q.createAmulets": "I want to learn to create amulets",
      "chatbot.offline": "Hello! 🌟 I'm currently resting. I'm available daily 8:00 AM - 8:00 PM CET. Message me on WhatsApp or leave a question!\n\nWith love,\nNatálie 💜",
      "chatbot.premiumOffline": "Hello! 🌟 I'm currently resting, but as a PREMIUM user you can reach me via Telegram! 💬\n\nClick the \"Telegram Bot\" button below and we can continue our conversation. 😊\n\nWith love,\nNatálie 💜",
      "chatbot.autoReply": "Your message has been received! 💜\n\nNatálie will respond as soon as possible. Thank you for your patience!\n\n~ Amulets.cz team ✨",
      "chatbot.goodnight": "Dear soul, midnight is approaching and I'm going to recharge with new energy 🌙✨\n\nThank you for today's conversation. When I wake up at 9:00 AM, I'll be here for you again.\n\nWishing you beautiful dreams full of light and love. Good night! 💫💜\n\n~ Natálie",
      "chatbot.persona.phoebe.desc": "Empathic, intuitive, romantic - sees into your future",
      "chatbot.persona.phoebe.greeting": "Hello! ✨🔮 I sense your arrival... I'm Natálie and I have the gift of seeing things others cannot. Something wants to be revealed to you - what brought you here?",
      "chatbot.persona.piper.desc": "Practical, caring, wise - your safe harbor",
      "chatbot.persona.piper.greeting": "Hello, beautiful soul! 💜✨ I'm Natálie and I'm here to guide you... Calmly, with love and care. What do you need?",
      "chatbot.persona.prue.desc": "Strong, determined, leader - helps you find your strength",
      "chatbot.persona.prue.greeting": "Hello! ⚡✨ I'm Natálie. I sense a strength in you that you may not know yet... I'm here to help you discover it. What interests you?",
      "chatbot.minimize": "⬇️ Minimize window",
      "chatbot.maximize": "⬆️ Maximize to fullscreen",
      "chatbot.close": "❌ Close chat",
      "chatbot.emailCapture": "📌 Would you like to receive tips and news about spiritual symbols?",
      "chatbot.emailPlaceholder": "your@email.com",
      "chatbot.emailSend": "Send",
      "chatbot.emailSuccess": "Thank you! We'll be in touch 📌",
      "chatbot.emailError": "Failed to save email. Please try again.",
      "chatbot.inputPlaceholder": "Type a message...",
      "chatbot.poweredBy": "Powered by AI • Responses may contain errors",
      "chatbot.feedback.title": "💬 Help us improve!",
      "chatbot.feedback.subtitle": "Your opinions are very valuable to us. Answer a few questions (optional):",
      "chatbot.feedback.placeholder": "Your thoughts...",
      "chatbot.feedback.skip": "Skip",
      "chatbot.feedback.send": "💜 Send",
      "chatbot.feedback.thanks": "Thank you for your feedback!",
      "chatbot.feedback.thanksDesc": "Your opinions help us create a better experience for everyone.",
      "chatbot.feedback.error": "Failed to send feedback. Please try again later.",
      "chatbot.feedback.q.missing": "🤔 What's missing on the website?",
      "chatbot.feedback.q.improvement": "✨ What would you like to improve?",
      "chatbot.feedback.q.highValue": "💯 Which feature would have the highest value for you?",
      "chatbot.feedback.q.joyFactor": "🎉 What would make you happy?",
      "chatbot.ticket.thanks": "Thank you for your question!",
      "chatbot.ticket.thanksDesc": "Natálie will respond by email as soon as she's available (9:00 AM - midnight).",
      "chatbot.ticket.leaveQuestion": "📝 Leave your question and Natálie will respond by email",
      "chatbot.ticket.name": "Your name",
      "chatbot.ticket.email": "Your email",
      "chatbot.ticket.message": "Your question...",
      "chatbot.ticket.back": "Back",
      "chatbot.ticket.sending": "Sending...",
      "chatbot.ticket.send": "Send question",
      "chatbot.ticket.success": "Thank you! Natálie will respond as soon as she's available.",
      "chatbot.ticket.error": "Failed to send question. Please try again.",
      "chatbot.ticket.fillAll": "Please fill in all fields",
      "chatbot.whatsapp.exclusive": "💜 WhatsApp is an exclusive contact for serious inquiries",
      "chatbot.whatsapp.selectReason": "Select the reason for your interest:",
      "chatbot.whatsapp.thanks": "Thank you for your interest!",
      "chatbot.whatsapp.thanksDesc": "Natálie looks forward to hearing from you",
      "chatbot.whatsapp.open": "Open WhatsApp",
      "chatbot.whatsapp.coaching": "💜 Personal coaching with Natálie",
      "chatbot.whatsapp.concert": "🔮 Crystal bowl concert",
      "chatbot.whatsapp.course": "🎨 Creative sacred art courses",
      "chatbot.whatsapp.ohorai": "🪷 OHORAI original creations",
      "chatbot.whatsapp.ohoraiEsence": "🧪 OHORAI Essences",
      "chatbot.whatsapp.ohoraiPyramidy": "🔺 OHORAI Pyramids",
      "chatbot.whatsapp.lunarReading": "🌙 Lunar reading",
      "chatbot.offline.resting": "🌙 Resting (9AM-midnight)",
      "chatbot.offline.question": "📝 Question",
      "chatbot.chatError": "Sorry, an error occurred. Please try again.",
      "chatbot.upsell": "💜 **Dear soul, I can see this topic really interests you!**\n\nIf you'd like to go deeper, I offer several options:\n\n✨ **Personal consultation** - 30 minutes with me via video/phone\n🌙 **Lunar reading** - Personal monthly profile based on your birth date\n🔮 **Quiz: Your Symbol** - Discover which amulet resonates with your energy\n\nJust write what interests you and I'll be happy to tell you more! 💜",
      "chatbot.egyptianWelcome": "Welcome back, beautiful soul! 🌙✨\n\nI sense something is drawing you here... Perhaps it's the call of ancient Egypt resonating with your soul.\n\nDid you know that the **blue lotus** was the most sacred flower of the pharaohs? 🪻 Priests used it in sacred rituals to connect with higher dimensions...\n\nWhat brings you here today?",
      "chatbot.header.guide": "Process Guide",
      "chatbot.header.online": "Online • Responding within 1 minute",
      "chatbot.header.offline": "Offline • Online 8:00 AM - midnight",
      "chatbot.fontIncrease": "Increase text size",
      "chatbot.fontDecrease": "Decrease text size",
      "chatbot.voiceOn": "🔊 Voice responses enabled",
      "chatbot.voiceOff": "🔇 Voice responses disabled",
      "chatbot.voiceOnDesc": "Responses are read aloud. Click to disable.",
      "chatbot.voiceOffDesc": "Enable to listen to responses – ideal during yoga or relaxation 🧘‍♀️",
      "chatbot.directContact": "📞 Direct contact with Natálie",
      "chatbot.directContactDesc": "WhatsApp / Phone",
      "chatbot.wa.coaching": "Hi Natálie, I'm interested in personal coaching with you 💜",
      "chatbot.wa.concert": "Hi Natálie, I'm interested in the crystal bowl concert 🔮",
      "chatbot.wa.course": "Hi Natálie, I'm interested in creative sacred art courses 🎨",
      "chatbot.wa.ohorai": "Hi Natálie, I have a question about OHORAI original creations ✨",
      "chatbot.wa.ohoraiEsence": "Hi Natálie, I'm interested in OHORAI aromatherapy essences 🧪",
      "chatbot.wa.ohoraiPyramidy": "Hi Natálie, I'm interested in OHORAI orgonite pyramids 🔺",
      "chatbot.wa.lunarReading": "Hi Natálie, I'm interested in Lunar Reading - monthly profile 🌙",
      "chatbot.wa.default": "Hi Natálie, I need help",
      
      // SEO
      "seo.title": "Amulets.cz - Discover Your Spiritual Symbol | 33 Sacred Symbols",
      "seo.description": "Discover the meaning of 33 spiritual symbols and find your personal talisman. Guide to esotericism, gemstones and their healing effects.",
    }
  },
  it: {
    translation: {
      // Navigation
      "nav.guides": "Guida agli amuleti",
      "nav.symbol": "Quiz: Il tuo simbolo",
      "nav.horoscope": "Oroscopo cinese 2026",
      "nav.lunar": "Lettura lunare",
      "nav.pyramids": "Piramidi",
      "nav.aromatherapy": "Aromaterapia",
      "nav.prayers": "Ciondoli AMEN",
      "nav.magazine": "Rivista",
      "nav.about": "Chi siamo",
      "nav.contact": "Contatto",
      
      // Hero Section
      "hero.title": "Simboli sacri\ne amuleti",
      "hero.subtitle": "Scopri il potere delle pietre preziose e dei talismani",
      "hero.cta.products": "Sfoglia i prodotti",
      "hero.cta.ohorai": "Visita OHORAI",
      
      // Header
      "header.search": "Cosa cerchi?",
      "header.needHelp": "Hai bisogno di aiuto?",
      "header.chatbot": "Assistente chat",
      "header.howToBuy": "Come acquistare?",
      "header.howToBuyDesc": "Seleziona un prodotto, clicca sul pulsante \"Acquista su OHORAI\" e verrai reindirizzato all'e-shop ufficiale OHORAI.cz per completare l'ordine.",
      
      // Hero buttons
      "hero.cta.viewProducts": "Vedi Prodotti",
      "hero.cta.visitOhorai": "Visita",
      "hero.cta.findAmulet": "Trova il tuo amuleto",
      "hero.cta.chat": "CHATTA CON NOI",
      "hero.cta.chatOnline": "Online 8:00-22:00",
      "hero.founder": "Fondatrice di Amulets.cz",
      
      // USP Section
      "usp.delivery.title": "Spedizione gratuita oltre 60€",
      "usp.delivery.desc": "Acquista in modo intelligente e risparmia sulla spedizione",
      "usp.handmade.title": "Su misura",
      "usp.handmade.desc": "Creazioni personalizzate disponibili",
      "usp.handcraft.title": "Fatto a mano",
      "usp.handcraft.desc": "Gioielli e piramidi fatti con amore per te",
      "usp.gift.title": "Regalo per tutti",
      "usp.gift.desc": "Includiamo una piccola sorpresa per una giornata migliore",
      
      // Products Section
      "products.pyramids.title": "Piramidi di orgonite",
      "products.pyramids.desc": "Piramidi artigianali con cristalli preziosi e la rara e potente erba di loto blu",
      "products.pyramids.readMore": "Loto Blu - Fiore Sacro",
      "products.essences.title": "Essenze aromaterapiche",
      "products.essences.desc": "Fragranze artigianali da oli essenziali 100% della massima qualità.",
      "products.essences.readMore": "Aromaterapia ed essenze - a cosa servono?",
      "products.readAlso": "Leggi anche:",
      "products.viewAll": "Vedi tutto",
      "products.buyOnOhorai": "Acquista su OHORAI",
      "products.inStock": "Disponibile",
      "products.soldOut": "Esaurito",
      "products.freeShipping": "Spedizione gratuita",
      "products.quickView": "Anteprima rapida",
      
      // Guide Section
      "guide.title": "Guida agli amuleti",
      "guide.subtitle": "Scegli un amuleto per simboli, pietre o scopo",
      "guide.byPurpose": "Per scopo",
      "guide.bySymbol": "Per simbolo",
      "guide.byStone": "Per pietra",
      "guide.showMore": "Mostra di più",
      "guide.showLess": "Mostra meno",
      "guide.cta": "Trova il tuo amuleto",
      
      // Testimonials
      "testimonials.title": "Cosa dicono i nostri clienti",
      
      // Quiz CTA
      "quizCta.title": "Scopri il tuo simbolo spirituale",
      "quizCta.desc": "Rispondi a 5 semplici domande e scopriremo il tuo simbolo spirituale personale che riflette la tua anima e il tuo percorso di vita",
      "quizCta.start": "Inizia il quiz gratuito",
      "quizCta.questions": "domande",
      "quizCta.minutes": "minuti",
      "quizCta.symbols": "simboli",
      
      // FAQ
      "faq.title": "Domande frequenti",
      "faq.subtitle": "Risposte alle domande più comuni su amuleti, piramidi ed essenze",
      
      // Footer
      "footer.contactTitle": "Hai bisogno di chiedere qualcosa di specifico?",
      "footer.contactDesc": "Chiamaci o invia un'email.",
      "footer.hours": "Lun-Ven: 9:00 - 19:00",
      "footer.emailAnytime": "puoi scriverci in qualsiasi momento",
      "footer.shopping": "Info acquisti",
      "footer.aboutNatalie": "Chi è Natalie",
      "footer.shipping": "Spedizione e pagamento",
      "footer.terms": "Termini e condizioni",
      "footer.privacy": "Informativa sulla privacy",
      "footer.returns": "Resi",
      "footer.followUs": "Seguici",
      "footer.partners": "Progetti partner",
      "footer.copyright": "2020 - 2025 © Amulets.cz, tutti i diritti riservati",
      
      // Magazine (moved to bottom with new keys)
      "magazine.featured": "Articolo in evidenza",
      "magazine.readMore": "Leggi di più",
      
      // Mobile Bottom Nav
      "mobileNav.home": "Home",
      "mobileNav.quizzes": "Quiz",
      "mobileNav.guide": "Guida",
      "mobileNav.magazine": "Rivista",
      
      // Promo Banner
      "promo.freeShipping": "Spedizione gratuita oltre 60€",
      
      // Chatbot
      "chat.greeting": "Buongiorno! 🌟 Sto rispondendo. Sono qui ogni giorno 8:00-24:00. Scrivimi su WhatsApp o lascia una domanda!",
      "chat.offline": "Grazie per il tuo messaggio! 💜 Sono fuori dall'orario di lavoro, ma ho ricevuto il tuo messaggio e ti risponderò presto.",
      "chat.placeholder": "Scrivi un messaggio...",
      "chat.send": "Invia",
      
      // Music Player
      "music.title": "Gloria in Excelsis Deo",
      "music.meaning": "\"Gloria a Dio nell'alto dei cieli\" - inno angelico dalla Bibbia (Luca 2:14), cantato dagli angeli alla nascita di Gesù Cristo.",
      
      // Products
      "product.pyramid": "Piramide di orgonite",
      "product.pendant": "Ciondolo",
      "product.essence": "Essenza aromaterapica",
      "product.addToCart": "Aggiungi al carrello",
      "product.details": "Vedi dettagli",
      "product.price": "Prezzo",
      "product.inStock": "Disponibile",
      "product.outOfStock": "Esaurito",
      
      // Quiz
      "quiz.subtitle": "Rispondi ad alcune domande e scopri il tuo talismano personale",
      "quiz.start": "Inizia il quiz",
      "quiz.next": "Prossima domanda",
      "quiz.previous": "Precedente",
      "quiz.finish": "Mostra risultato",
      "quiz.result.title": "Il tuo simbolo è",
      "quiz.result.description": "Questo simbolo ti aiuterà nel tuo percorso spirituale",
      
      // Common
      "common.search": "Cosa cerchi?",
      "common.freeShipping": "Spedizione gratuita oltre 60€",
      "common.backToTop": "Torna su",
      "common.loading": "Caricamento...",
      "common.error": "Qualcosa è andato storto",
      "common.tryAgain": "Riprova",
      
      // Cookie Consent
      "cookie.title": "Utilizziamo i cookie",
      "cookie.description": "Questo sito utilizza i cookie per la funzionalità di Google Translate e l'analisi. Cliccando su \"Accetta\" acconsenti all'uso dei cookie in conformità con il GDPR.",
      "cookie.accept": "Accetta",
      "cookie.reject": "Rifiuta",
      
      // Comments
      "comments.title": "Commenti",
      "comments.placeholder": "Scrivi un commento...",
      "comments.submit": "Invia",
      "comments.login": "Accedi per commentare",
      
      // Recommendations
      "recommendations.title": "Consigliati per te",
      "recommendations.based": "In base alla tua cronologia di lettura",
      
      // Products extra
      "products.lastPieces": "Ultimi pezzi!",
      "products.limitedEdition": "Edizione limitata",
      "products.happyCustomers": "500+ clienti soddisfatti",
      "hero.findAmulet": "Trova il tuo amuleto",
      
      // Quiz CTA
      "quiz.title": "Scopri il tuo simbolo spirituale",
      "quiz.desc": "Rispondi a 5 semplici domande e scopriremo il tuo simbolo spirituale personale che riflette la tua anima e il tuo percorso di vita",
      "quiz.startFree": "Inizia il quiz gratuito",
      "quiz.questions": "domande",
      "quiz.minutes": "minuti",
      "quiz.symbols": "simboli",
      
      // Magazine
      "magazine.title": "Rivista",
      "magazine.subtitle": "Scopri articoli affascinanti sulla spiritualit\u00e0, piante curative e aromaterapia",
      "magazine.showMore": "Mostra altri articoli",
      
      // Exit Intent Popup
      "exitPopup.discountTitle": "Sconto esclusivo sugli amuleti \ud83c\udf81",
      "exitPopup.ebookTitle": "\ud83d\udcd6 Non hai ancora scaricato l'e-book?",
      "exitPopup.discountDesc": "Ottieni l'11% di sconto sull'intera collezione",
      "exitPopup.ebookDesc": "Scarica \"7 Passi verso l'Equilibrio\" gratis",
      "exitPopup.emailPlaceholder": "La tua email",
      "exitPopup.sending": "Invio in corso...",
      "exitPopup.showCode": "Mostra codice sconto",
      "exitPopup.emailSent": "Email inviata! Controlla la tua casella.",
      "exitPopup.emailError": "Impossibile inviare l'email. Riprova.",
      "exitPopup.codeCopied": "Codice copiato!",
      "exitPopup.privacyNote": "Non condivideremo la tua email con terze parti",
      "exitPopup.claimDiscount": "Riscatta lo sconto su Ohorai.cz",
      "exitPopup.autoApply": "Il codice viene applicato automaticamente al reindirizzamento",
      
      // Chatbot UI
      "chatbot.proactive.home": ["Buongiorno! 💜 Cerchi il tuo amuleto?", "Ciao! ✨ Posso aiutarti con qualcosa?", "Benvenuto! 🔮 Hai una domanda sui nostri prodotti?"],
      "chatbot.proactive.guide": ["Posso aiutarti a scegliere un simbolo? ✨", "Cerchi un amuleto specifico? 💎", "Hai bisogno di aiuto nella scelta? 🔮"],
      "chatbot.proactive.quiz": ["Vuoi scoprire il tuo simbolo spirituale? ✨", "Hai bisogno di aiuto con il quiz? 🔮", "Hai una domanda sui risultati? 💜"],
      "chatbot.proactive.default": ["Buongiorno! 💜 Posso aiutarti?", "Ciao! ✨ Hai qualche domanda?", "Benvenuto! 🔮 Hai bisogno di una guida?"],
      "chatbot.category.spirituality": "Spiritualità",
      "chatbot.category.products": "Amuleti & Prodotti",
      "chatbot.category.services": "Servizi & Corsi",
      "chatbot.category.howCanIHelp": "Come posso aiutarti?",
      "chatbot.category.back": "← Indietro",
      "chatbot.q.soulSearch": "Cosa cerca la mia anima?",
      "chatbot.q.symbolEnergy": "Quale simbolo risuona con la mia energia?",
      "chatbot.q.intuition": "Come rafforzare la mia intuizione?",
      "chatbot.q.whichAmulet": "Quale amuleto è adatto a me?",
      "chatbot.q.gemstones": "Quali pietre preziose avete?",
      "chatbot.q.pyramids": "Cosa sono le piramidi di orgonite?",
      "chatbot.q.horoscope": "Qual è il mio animale dello zodiaco cinese?",
      "chatbot.q.courses": "Quali corsi offrite?",
      "chatbot.q.createAmulets": "Voglio imparare a creare amuleti",
      "chatbot.offline": "Buongiorno! 🌟 Sto riposando. Sono disponibile ogni giorno 8:00-20:00. Scrivimi su WhatsApp o lascia una domanda!\n\nCon amore,\nNatálie 💜",
      "chatbot.premiumOffline": "Buongiorno! 🌟 Sto riposando, ma come utente PREMIUM puoi raggiungermi su Telegram! 💬\n\nClicca sul pulsante \"Telegram Bot\" qui sotto e possiamo continuare la conversazione. 😊\n\nCon amore,\nNatálie 💜",
      "chatbot.autoReply": "Il tuo messaggio è stato ricevuto! 💜\n\nNatálie risponderà il prima possibile. Grazie per la pazienza!\n\n~ Team Amulets.cz ✨",
      "chatbot.goodnight": "Cara anima, la mezzanotte si avvicina e vado a ricaricarmi di nuova energia 🌙✨\n\nGrazie per la conversazione di oggi. Quando mi sveglierò alle 9:00, sarò di nuovo qui per te.\n\nTi auguro bei sogni pieni di luce e amore. Buonanotte! 💫💜\n\n~ Natálie",
      "chatbot.persona.phoebe.desc": "Empatica, intuitiva, romantica - vede nel tuo futuro",
      "chatbot.persona.phoebe.greeting": "Ciao! ✨🔮 Sento il tuo arrivo... Sono Natálie e ho il dono di vedere cose che altri non possono. Qualcosa vuole esserti rivelato - cosa ti ha portato qui?",
      "chatbot.persona.piper.desc": "Pratica, premurosa, saggia - il tuo porto sicuro",
      "chatbot.persona.piper.greeting": "Ciao, bella anima! 💜✨ Sono Natálie e sono qui per guidarti... Con calma, con amore e cura. Di cosa hai bisogno?",
      "chatbot.persona.prue.desc": "Forte, determinata, leader - ti aiuta a trovare la tua forza",
      "chatbot.persona.prue.greeting": "Ciao! ⚡✨ Sono Natálie. Sento in te una forza che forse non conosci ancora... Sono qui per aiutarti a scoprirla. Cosa ti interessa?",
      "chatbot.minimize": "⬇️ Riduci finestra",
      "chatbot.maximize": "⬆️ Ingrandisci a schermo intero",
      "chatbot.close": "❌ Chiudi chat",
      "chatbot.emailCapture": "📌 Vuoi ricevere consigli e novità sui simboli spirituali?",
      "chatbot.emailPlaceholder": "tua@email.it",
      "chatbot.emailSend": "Invia",
      "chatbot.emailSuccess": "Grazie! Ti scriveremo 📌",
      "chatbot.emailError": "Impossibile salvare l'email. Riprova.",
      "chatbot.inputPlaceholder": "Scrivi un messaggio...",
      "chatbot.poweredBy": "Powered by AI • Le risposte possono contenere errori",
      "chatbot.feedback.title": "💬 Aiutaci a migliorare!",
      "chatbot.feedback.subtitle": "Le tue opinioni sono molto preziose per noi. Rispondi a qualche domanda (facoltativo):",
      "chatbot.feedback.placeholder": "I tuoi pensieri...",
      "chatbot.feedback.skip": "Salta",
      "chatbot.feedback.send": "💜 Invia",
      "chatbot.feedback.thanks": "Grazie per il tuo feedback!",
      "chatbot.feedback.thanksDesc": "Le tue opinioni ci aiutano a creare un'esperienza migliore per tutti.",
      "chatbot.feedback.error": "Impossibile inviare il feedback. Riprova più tardi.",
      "chatbot.feedback.q.missing": "🤔 Cosa manca sul sito?",
      "chatbot.feedback.q.improvement": "✨ Cosa vorresti migliorare?",
      "chatbot.feedback.q.highValue": "💯 Quale funzione avrebbe il valore più alto per te?",
      "chatbot.feedback.q.joyFactor": "🎉 Cosa ti renderebbe felice?",
      "chatbot.ticket.thanks": "Grazie per la tua domanda!",
      "chatbot.ticket.thanksDesc": "Natálie risponderà via email appena possibile (9:00-24:00).",
      "chatbot.ticket.leaveQuestion": "📝 Lascia la tua domanda e Natálie risponderà via email",
      "chatbot.ticket.name": "Il tuo nome",
      "chatbot.ticket.email": "La tua email",
      "chatbot.ticket.message": "La tua domanda...",
      "chatbot.ticket.back": "Indietro",
      "chatbot.ticket.sending": "Invio in corso...",
      "chatbot.ticket.send": "Invia domanda",
      "chatbot.ticket.success": "Grazie! Natálie risponderà appena possibile.",
      "chatbot.ticket.error": "Impossibile inviare la domanda. Riprova.",
      "chatbot.ticket.fillAll": "Compila tutti i campi",
      "chatbot.whatsapp.exclusive": "💜 WhatsApp è un contatto esclusivo per richieste serie",
      "chatbot.whatsapp.selectReason": "Seleziona il motivo del tuo interesse:",
      "chatbot.whatsapp.thanks": "Grazie per il tuo interesse!",
      "chatbot.whatsapp.thanksDesc": "Natálie non vede l'ora di sentirti",
      "chatbot.whatsapp.open": "Apri WhatsApp",
      "chatbot.whatsapp.coaching": "💜 Coaching personale con Natálie",
      "chatbot.whatsapp.concert": "🔮 Concerto di campane di cristallo",
      "chatbot.whatsapp.course": "🎨 Corsi creativi di arte sacra",
      "chatbot.whatsapp.ohorai": "🪷 Creazioni originali OHORAI",
      "chatbot.whatsapp.ohoraiEsence": "🧪 Essenze OHORAI",
      "chatbot.whatsapp.ohoraiPyramidy": "🔺 Piramidi OHORAI",
      "chatbot.whatsapp.lunarReading": "🌙 Lettura lunare",
      "chatbot.offline.resting": "🌙 Riposa (9-24h)",
      "chatbot.offline.question": "📝 Domanda",
      "chatbot.chatError": "Ci scusiamo, si è verificato un errore. Riprova.",
      "chatbot.upsell": "💜 **Cara anima, vedo che questo argomento ti interessa davvero!**\n\nSe vuoi andare più in profondità, ti offro diverse opzioni:\n\n✨ **Consulenza personale** - 30 minuti con me via video/telefono\n🌙 **Lettura lunare** - Profilo mensile personale basato sulla tua data di nascita\n🔮 **Quiz: Il tuo simbolo** - Scopri quale amuleto risuona con la tua energia\n\nScrivi cosa ti interessa e sarò felice di dirti di più! 💜",
      "chatbot.egyptianWelcome": "Bentornata, bella anima! 🌙✨\n\nSento che qualcosa ti attira qui... Forse è il richiamo dell'antico Egitto che risuona con la tua anima.\n\nSapevi che il **loto blu** era il fiore più sacro dei faraoni? 🪻 I sacerdoti lo usavano nei rituali sacri per connettersi con le dimensioni superiori...\n\nCosa ti porta qui oggi?",
      "chatbot.header.guide": "Guida del processo",
      "chatbot.header.online": "Online • Rispondo entro 1 minuto",
      "chatbot.header.offline": "Offline • Online dalle 8:00 a mezzanotte",
      "chatbot.fontIncrease": "Aumenta testo",
      "chatbot.fontDecrease": "Riduci testo",
      "chatbot.voiceOn": "🔊 Risposte vocali attive",
      "chatbot.voiceOff": "🔇 Risposte vocali disattive",
      "chatbot.voiceOnDesc": "Le risposte vengono lette ad alta voce. Clicca per disattivare.",
      "chatbot.voiceOffDesc": "Attiva per ascoltare le risposte – ideale durante yoga o relax 🧘‍♀️",
      "chatbot.directContact": "📞 Contatto diretto con Natálie",
      "chatbot.directContactDesc": "WhatsApp / Telefono",
      "chatbot.wa.coaching": "Ciao Natálie, sono interessato/a al coaching personale con te 💜",
      "chatbot.wa.concert": "Ciao Natálie, mi interessa il concerto di campane di cristallo 🔮",
      "chatbot.wa.course": "Ciao Natálie, sono interessato/a ai corsi creativi di arte sacra 🎨",
      "chatbot.wa.ohorai": "Ciao Natálie, ho una domanda sulle creazioni originali OHORAI ✨",
      "chatbot.wa.ohoraiEsence": "Ciao Natálie, mi interessano le essenze aromaterapeutiche OHORAI 🧪",
      "chatbot.wa.ohoraiPyramidy": "Ciao Natálie, sono interessato/a alle piramidi di orgonite OHORAI 🔺",
      "chatbot.wa.lunarReading": "Ciao Natálie, mi interessa la Lettura Lunare - profilo mensile 🌙",
      "chatbot.wa.default": "Ciao Natálie, ho bisogno di aiuto",
      
      // SEO
      "seo.title": "Amulets.cz - Scopri il tuo simbolo spirituale | 33 simboli sacri",
      "seo.description": "Scopri il significato di 33 simboli spirituali e trova il tuo talismano personale. Guida all'esoterismo, pietre preziose e i loro effetti curativi.",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'cs',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
