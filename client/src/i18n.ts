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
      "hero.title": "Otevřete své srdce zázrakům",
      "hero.subtitle": "Objevte sílu 33 posvátných symbolů a najděte svůj osobní talisman",
      "hero.cta": "Objevit svůj symbol",
      
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
      
      // Footer
      "footer.contact": "Kontakt",
      "footer.phone": "Telefon",
      "footer.email": "Email",
      "footer.followUs": "Sledujte nás",
      "footer.relatedProjects": "Spřízněné projekty",
      "footer.rights": "Všechna práva vyhrazena",
      
      // Chatbot
      "chat.greeting": "Dobrý den! 🌟 Právě odpovídám. Jsem tu denně 8:00-24:00. Napište mi na WhatsApp nebo zanechte dotaz!",
      "chat.offline": "Děkuji za vaši zprávu! 💜 Právě jsem mimo pracovní dobu, ale vaši zprávu jsem přijala a brzy vám odpovím.",
      "chat.placeholder": "Napište zprávu...",
      "chat.send": "Odeslat",
      
      // Music Player
      "music.title": "Gloria in Excelsis Deo",
      "music.meaning": "\"Sláva na výsostech Bohu\" - andělský hymnus z Bible (Lukáš 2:14), zpívaný anděly při narození Ježíše Krista.",
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
      "hero.title": "Apri il tuo cuore ai miracoli",
      "hero.subtitle": "Scopri il potere di 33 simboli sacri e trova il tuo talismano personale",
      "hero.cta": "Scopri il tuo simbolo",
      
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
      
      // Footer
      "footer.contact": "Contatto",
      "footer.phone": "Telefono",
      "footer.email": "Email",
      "footer.followUs": "Seguici",
      "footer.relatedProjects": "Progetti correlati",
      "footer.rights": "Tutti i diritti riservati",
      
      // Chatbot
      "chat.greeting": "Buongiorno! 🌟 Sto rispondendo. Sono qui ogni giorno 8:00-24:00. Scrivimi su WhatsApp o lascia una domanda!",
      "chat.offline": "Grazie per il tuo messaggio! 💜 Sono fuori dall'orario di lavoro, ma ho ricevuto il tuo messaggio e ti risponderò presto.",
      "chat.placeholder": "Scrivi un messaggio...",
      "chat.send": "Invia",
      
      // Music Player
      "music.title": "Gloria in Excelsis Deo",
      "music.meaning": "\"Gloria a Dio nell'alto dei cieli\" - inno angelico dalla Bibbia (Luca 2:14), cantato dagli angeli alla nascita di Gesù Cristo.",
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
