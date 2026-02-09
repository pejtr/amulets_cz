import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function GuideCTA() {
  const { t } = useTranslation();

  const scrollToGuide = () => {
    const guideSection = document.getElementById('pruvodce-amulety');
    if (guideSection) {
      guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hidden md:block py-12 bg-gradient-to-b from-white to-pink-50">
      <div className="container">
        <div className="flex justify-center">
          <Button
            onClick={scrollToGuide}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {t('hero.findAmulet')}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
