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
    <>
      <div id="google_translate_element" className="inline-block" />
      <style>{`
        /* Skrytí Google Translate loga a textu */
        .goog-te-gadget {
          font-size: 0 !important;
          line-height: 1 !important;
        }
        .goog-te-gadget img {
          display: none !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          font-size: 13px !important;
          line-height: 1 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
        }
        .goog-te-menu-value {
          color: #2C3E50 !important;
          margin: 0 !important;
        }
        .goog-te-menu-value span {
          border: none !important;
          color: #2C3E50 !important;
        }
        .goog-te-menu-value span:first-child {
          display: none !important;
        }
        /* Skrytí "Powered by" */
        .goog-te-gadget-simple .goog-te-menu-value span:last-child {
          display: inline !important;
        }
        #google_translate_element {
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>
    </>
  );
}
