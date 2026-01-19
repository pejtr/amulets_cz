import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'cs' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  cs: {
    // Header
    'header.search': 'Co hledáte?',
    'header.need_help': 'Potřebujete poradit?',
    
    // Navigation
    'nav.guide': 'Průvodce amulety',
    'nav.quiz': 'Kvíz: Tvůj symbol',
    'nav.horoscope': 'Čínský horoskop 2026',
    'nav.lunar': 'Lunární Reading',
    'nav.pyramids': 'Orgonitové pyramidy',
    'nav.aromatherapy': 'Aromaterapie',
    'nav.about': 'O nás',
    'nav.magazine': 'Magazín',
    'nav.amen': 'Privěsky AMEN',
    'nav.contact': 'Kontakt',
    
    // Hero
    'hero.title': 'Posvátné symboly a amulety',
    'hero.subtitle': 'Objevte sílu drahých kamenů a talismanů',
    'hero.cta_products': 'Zobrazit produkty',
    'hero.cta_ohorai': 'Přejít na',
    'hero.founder': 'Zakladatelka Amulets.cz',
    
    // Common
    'common.loading': 'Načítání...',
    'common.error': 'Chyba',
    'common.read_more': 'Číst více',
    'common.learn_more': 'Zjistit více',
  },
  en: {
    // Header
    'header.search': 'What are you looking for?',
    'header.need_help': 'Need help?',
    
    // Navigation
    'nav.guide': 'Amulet Guide',
    'nav.quiz': 'Quiz: Your Symbol',
    'nav.horoscope': 'Chinese Horoscope 2026',
    'nav.lunar': 'Lunar Reading',
    'nav.pyramids': 'Orgonite Pyramids',
    'nav.aromatherapy': 'Aromatherapy',
    'nav.about': 'About Us',
    'nav.magazine': 'Magazine',
    'nav.amen': 'AMEN Pendants',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Sacred Symbols and Amulets',
    'hero.subtitle': 'Discover the power of gemstones and talismans',
    'hero.cta_products': 'View Products',
    'hero.cta_ohorai': 'Go to',
    'hero.founder': 'Founder of Amulets.cz',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.read_more': 'Read more',
    'common.learn_more': 'Learn more',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('cs');

  useEffect(() => {
    // Detect browser language on mount
    const browserLang = navigator.language.toLowerCase();
    
    // Check if English
    if (browserLang.startsWith('en')) {
      setLanguageState('en');
    }
    // Default to Czech for all other languages
    else {
      setLanguageState('cs');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Store in localStorage for persistence
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
