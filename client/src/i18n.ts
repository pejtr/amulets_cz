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
      
      // USP Section
      "usp.delivery.title": "Doprava zdarma nad 1 500 Kč",
      "usp.delivery.desc": "Pohodlné vyřízení a doručení na pobočku nebo domů",
      "usp.handmade.title": "Úpravy na míru",
      "usp.handmade.desc": "Můžeme nastavit horní a dolní čakry",
      "usp.handcraft.title": "Ruční výroba",
      "usp.handcraft.desc": "Špičky a pyramidy pro váš i lékáře výroba",
      "usp.gift.title": "Dárek pro každého",
      "usp.gift.desc": "Přiložíme malý přívěsek pro každý nákup",
      
      // Products
      "products.title": "Naše produkty",
      "products.viewAll": "Zobrazit vše",
      
      // Guide Section
      "guide.title": "Průvodce symboly",
      "guide.subtitle": "Objevte 33 posvátných symbolů a jejich význam",
      "guide.cta": "Zobrazit průvodce",
      
      // Magazine
      "magazine.title": "Magazín",
      "magazine.subtitle": "Objevte zajímavé články o duchovnosti, léčivých rostlinách a aromaterapii",
      "magazine.featured": "Doporučený článek",
      "magazine.readMore": "Číst více",
      "magazine.readArticle": "Číst článek",
      "magazine.showMore": "Zobrazit další články",
      
      // Testimonials
      "testimonials.title": "Co říkají naši zákazníci",
      
      // FAQ
      "faq.title": "Často kladené otázky",
      
      // Footer
      "footer.contact": "Kontakt",
      "footer.phone": "Telefon",
      "footer.email": "Email",
      "footer.followUs": "Sledujte nás",
      "footer.relatedProjects": "Spřízněné projekty",
      "footer.rights": "Všechna práva vyhrazena",
      "footer.needHelp": "Potřebujete poradit?",
      
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
      "quiz.title": "Kvíz: Zjisti svůj symbol",
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
      
      // Cookie Consent
      "cookie.title": "Používáme cookies",
      "cookie.description": "Tento web používá cookies pro zajištění funkčnosti Google Translate a analytiky. Kliknutím na \"Přijmout\" souhlasíte s používáním cookies v souladu s GDPR.",
      "cookie.accept": "Přijmout",
      "cookie.reject": "Odmítnout",
      
      // Comments
      "comments.title": "Komentáře",
      "comments.placeholder": "Napište komentář...",
      "comments.submit": "Odeslat",
      "comments.login": "Pro komentování se přihlaste",
      
      // Recommendations
      "recommendations.title": "Doporučené pro vás",
      "recommendations.based": "Na základě vaší historie čtení",
      
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
      
      // USP Section
      "usp.delivery.title": "Free Shipping over $60",
      "usp.delivery.desc": "Convenient delivery to your door or pickup point",
      "usp.handmade.title": "Custom Adjustments",
      "usp.handmade.desc": "We can adjust upper and lower chakras",
      "usp.handcraft.title": "Handcrafted",
      "usp.handcraft.desc": "Tips and pyramids handmade for you",
      "usp.gift.title": "Gift for Everyone",
      "usp.gift.desc": "We include a small pendant with every purchase",
      
      // Products
      "products.title": "Our Products",
      "products.viewAll": "View All",
      
      // Guide Section
      "guide.title": "Symbol Guide",
      "guide.subtitle": "Discover 33 sacred symbols and their meaning",
      "guide.cta": "View Guide",
      
      // Magazine
      "magazine.title": "Magazine",
      "magazine.subtitle": "Discover articles about spirituality, healing plants and aromatherapy",
      "magazine.featured": "Featured Article",
      "magazine.readMore": "Read More",
      "magazine.readArticle": "Read Article",
      "magazine.showMore": "Show More Articles",
      
      // Testimonials
      "testimonials.title": "What Our Customers Say",
      
      // FAQ
      "faq.title": "Frequently Asked Questions",
      
      // Footer
      "footer.contact": "Contact",
      "footer.phone": "Phone",
      "footer.email": "Email",
      "footer.followUs": "Follow Us",
      "footer.relatedProjects": "Related Projects",
      "footer.rights": "All rights reserved",
      "footer.needHelp": "Need help?",
      
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
      "quiz.title": "Quiz: Find Your Symbol",
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
      
      // USP Section
      "usp.delivery.title": "Spedizione gratuita oltre 60€",
      "usp.delivery.desc": "Consegna comoda a domicilio o punto di ritiro",
      "usp.handmade.title": "Personalizzazione",
      "usp.handmade.desc": "Possiamo regolare i chakra superiori e inferiori",
      "usp.handcraft.title": "Fatto a mano",
      "usp.handcraft.desc": "Punte e piramidi per te e per i medici",
      "usp.gift.title": "Regalo per tutti",
      "usp.gift.desc": "Includiamo un piccolo ciondolo con ogni acquisto",
      
      // Products
      "products.title": "I nostri prodotti",
      "products.viewAll": "Vedi tutto",
      
      // Guide Section
      "guide.title": "Guida ai simboli",
      "guide.subtitle": "Scopri 33 simboli sacri e il loro significato",
      "guide.cta": "Vedi la guida",
      
      // Magazine
      "magazine.title": "Rivista",
      "magazine.subtitle": "Scopri articoli sulla spiritualità, piante curative e aromaterapia",
      "magazine.featured": "Articolo in evidenza",
      "magazine.readMore": "Leggi di più",
      "magazine.readArticle": "Leggi l'articolo",
      "magazine.showMore": "Mostra altri articoli",
      
      // Testimonials
      "testimonials.title": "Cosa dicono i nostri clienti",
      
      // FAQ
      "faq.title": "Domande frequenti",
      
      // Footer
      "footer.contact": "Contatto",
      "footer.phone": "Telefono",
      "footer.email": "Email",
      "footer.followUs": "Seguici",
      "footer.relatedProjects": "Progetti correlati",
      "footer.rights": "Tutti i diritti riservati",
      "footer.needHelp": "Hai bisogno di aiuto?",
      
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
      "quiz.title": "Quiz: Scopri il tuo simbolo",
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
