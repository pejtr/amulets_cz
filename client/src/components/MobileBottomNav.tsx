import { Gift, BookOpen, Newspaper, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { APP_LOGO } from '@/const';
import { useState } from 'react';

export default function MobileBottomNav() {
  const [location] = useLocation();
  const [showQuizMenu, setShowQuizMenu] = useState(false);

  const quizItems = [
    { label: '🎁 Kvíz: Tvůj symbol', href: '/kviz' },
    { label: '🐯 Čínský horoskop 2026', href: '/cinsky-horoskop-2026' },
    { label: '🌙 Lunární čtení', href: '/lunarni-cteni' },
  ];

  const navItems = [
    {
      icon: 'logo',
      label: 'Domů',
      href: '/',
    },
    {
      icon: Sparkles,
      label: 'Kvízy',
      href: '#',
      hasSubmenu: true,
    },
    {
      icon: Gift,
      label: 'Průvodce',
      href: '/pruvodce-amulety',
    },
    {
      icon: Newspaper,
      label: 'Magazín',
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
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setShowQuizMenu(false)}
          />
          
          {/* Quiz menu */}
          <div className="fixed bottom-20 left-0 right-0 z-50 bg-white border-t-2 border-purple-100 shadow-2xl md:hidden animate-in slide-in-from-bottom duration-200">
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
        <div className="flex items-center justify-evenly h-20">
          {navItems.map((item) => {
            const isActive = item.href === '#' ? false : location === item.href;

            if (item.hasSubmenu) {
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                    showQuizMenu
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:text-purple-500'
                  }`}
                >
                  {(() => {
                    const Icon = item.icon as typeof Sparkles;
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
                  {showQuizMenu && (
                    <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-full" />
                  )}
                </button>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:text-purple-500'
                  }`}
                  onClick={() => setShowQuizMenu(false)}
                >
                  {item.icon === 'logo' ? (
                    <img
                      src={APP_LOGO}
                      alt="Amulets"
                      className={`w-24 h-24 object-contain transition-transform duration-200 ${
                        isActive ? 'scale-110' : ''
                      }`}
                    />
                  ) : (
                    (() => {
                      const Icon = item.icon as typeof Gift;
                      return (
                        <Icon
                          className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                            isActive ? 'scale-110' : ''
                          }`}
                        />
                      );
                    })()
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
