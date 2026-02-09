import { Home, Gift, BookOpen, Newspaper, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MobileBottomNav() {
  const [location] = useLocation();
  const [showQuizMenu, setShowQuizMenu] = useState(false);
  const { t } = useTranslation();

  const quizItems = [
    { label: `🎁 ${t('nav.symbol')}`, href: '/kviz' },
    { label: `🐯 ${t('nav.horoscope')}`, href: '/cinsky-horoskop-2026' },
    { label: `🌙 ${t('nav.lunar')}`, href: '/lunarni-cteni' },
  ];

  const navItems = [
    {
      icon: Home,
      label: t('mobileNav.home'),
      href: '/',
    },
    {
      icon: Sparkles,
      label: t('mobileNav.quizzes'),
      href: '#',
      hasSubmenu: true,
    },
    {
      icon: Gift,
      label: t('mobileNav.guide'),
      href: '/#pruvodce',
    },
    {
      icon: Newspaper,
      label: t('mobileNav.magazine'),
      href: '/magazin',
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.hasSubmenu) {
      setShowQuizMenu(!showQuizMenu);
    } else {
      setShowQuizMenu(false);
    }
  };

  return (
    <>
      {/* Rozbalovací menu pro Kvízy */}
      {showQuizMenu && (
        <>
          {/* Overlay pro zavření menu */}
          <div 
            className="fixed inset-0 bg-black/20 z-[70] md:hidden"
            onClick={() => setShowQuizMenu(false)}
          />
          
          {/* Quiz menu */}
          <div className="fixed bottom-16 left-0 right-0 z-[80] bg-white border-t-2 border-purple-100 shadow-2xl md:hidden animate-in slide-in-from-bottom duration-200">
            <div className="py-2">
              {quizItems.map((quiz) => (
                <Link key={quiz.href} href={quiz.href}>
                  <div
                    className="px-6 py-3 hover:bg-purple-50 active:bg-purple-100 transition-colors cursor-pointer"
                    onClick={() => setShowQuizMenu(false)}
                  >
                    <span className="text-sm font-medium text-gray-700">{quiz.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Dolní navigace */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-purple-100 shadow-2xl">
        <div className="flex items-center justify-evenly h-16">
          {navItems.map((item) => {
            const isActive = item.href === '#' ? false : location === item.href;

            if (item.hasSubmenu) {
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`flex flex-col items-center justify-center px-4 py-2 transition-all duration-200 ${
                    showQuizMenu
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:text-purple-500'
                  }`}
                >
                  {(() => {
                    const Icon = item.icon;
                    return (
                      <Icon
                        className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                          showQuizMenu ? 'scale-110' : ''
                        }`}
                      />
                    );
                  })()}
                  <span
                    className={`text-xs font-medium ${
                      showQuizMenu ? 'font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex flex-col items-center justify-center px-4 py-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:text-purple-500'
                  }`}
                  onClick={() => setShowQuizMenu(false)}
                >
                  {(() => {
                    const Icon = item.icon;
                    return (
                      <Icon
                        className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                          isActive ? 'scale-110' : ''
                        }`}
                      />
                    );
                  })()}
                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
