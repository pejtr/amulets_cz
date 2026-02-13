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

    // Přidání custom labelu "Select language" a úprava textu jazyků
    const checkAndUpdateLabels = () => {
      const selectElement = document.querySelector('.goog-te-menu-value span:first-child');
      const languageSpan = document.querySelector('.goog-te-menu-value span:last-child');
      
      if (selectElement && !selectElement.textContent?.includes('Select language')) {
        selectElement.textContent = 'Select language >';
      }
      
      // Změna textu jazyků na anglické názvy
      if (languageSpan) {
        const text = languageSpan.textContent || '';
        if (text.includes('čeština')) {
          languageSpan.textContent = text.replace('čeština', 'Czech');
        } else if (text.includes('angličtina')) {
          languageSpan.textContent = text.replace('angličtina', 'English');
        } else if (text.includes('italština')) {
          languageSpan.textContent = text.replace('italština', 'Italian');
        }
      }
    };

    // Opakované volání pro zachycení změn
    const interval = setInterval(checkAndUpdateLabels, 100);
    setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
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
          display: inline !important;
        }
        .goog-te-menu-value span:first-child::after {
          content: ' ' !important;
          white-space: pre !important;
        }
        /* Skrytí "Powered by" */
        .goog-te-gadget-simple .goog-te-menu-value span:last-child {
          display: inline !important;
        }
        #google_translate_element {
          display: inline-block;
          vertical-align: middle;
        }
        /* Dropdown menu */
        .goog-te-menu2 {
          max-width: 100% !important;
          overflow-x: auto !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          border: 1px solid #e5e7eb !important;
        }
        .goog-te-menu2-item {
          padding: 8px 12px !important;
        }
        .goog-te-menu2-item div {
          color: #2C3E50 !important;
        }
        /* Z-index pro dropdown */
        .goog-te-menu-frame {
          z-index: 9999 !important;
        }
      `}</style>
    </>
  );
}
