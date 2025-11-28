import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Funkce pro inicializaci Google Translate
    window.googleTranslateElementInit = () => {
      const googleTranslate = (window as any).google?.translate;
      if (googleTranslate) {
        new googleTranslate.TranslateElement(
          {
            pageLanguage: 'cs',
            includedLanguages: 'cs,en,it',
            layout: googleTranslate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Načtení Google Translate scriptu
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div id="google_translate_element" className="inline-block" />
  );
}
