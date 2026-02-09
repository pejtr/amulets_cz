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
