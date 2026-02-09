import { APP_LOGO } from "@/const";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { label: `🎁 ${t('nav.guides')}`, hasDropdown: false, url: "/#pruvodce-amulety", isInternal: true, featured: true },
    { label: `✨ ${t('nav.symbol')}`, hasDropdown: false, url: "/kviz", isInternal: true, featured: true },
    { label: `🐎 ${t('nav.horoscope')}`, hasDropdown: false, url: "/cinsky-horoskop", isInternal: true, featured: true, pulse: true },
    { label: `🌙 ${t('nav.lunar')}`, hasDropdown: false, url: "/moon-reading", isInternal: true, featured: true },
    { label: t('nav.pyramids'), hasDropdown: false, url: "https://www.ohorai.cz/autorske-tvorba/" },
    { label: t('nav.aromatherapy'), hasDropdown: true, url: "https://www.ohorai.cz/esence/" },
    { label: t('nav.prayers'), hasDropdown: false, url: "/privesky-amen", isInternal: true },
    { label: t('nav.magazine'), hasDropdown: false, url: "/magazin", isInternal: true },
    { label: t('nav.about'), hasDropdown: false, url: "/o-nas", isInternal: true },
    { label: t('nav.contact'), hasDropdown: false, url: "https://www.ohorai.cz/kontakt/" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      {/* Top bar - only on desktop */}
      <div className="hidden md:block bg-[#E8C4D8] py-1 overflow-visible">
        <div className="container flex justify-end items-center text-sm">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main header */}
      <div className="container py-0">
        <div className="flex items-center justify-between gap-4">
          {/* Logo + Chatbot */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Link 
              href="/" 
              className="flex-shrink-0"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <img src={APP_LOGO} alt="Amulets" className="h-20 md:h-24 w-auto cursor-pointer" />
            </Link>
            
            {/* Chatbot button */}
            <button
              onClick={() => {
                const chatWidget = document.querySelector('[data-chat-widget]') as HTMLElement;
                if (chatWidget) {
                  chatWidget.click();
                }
              }}
              className="relative p-2 md:p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
              title={t('header.chatbot')}
            >
              {/* Pulzující animace */}
              <span className="absolute inset-0 rounded-full animate-ping opacity-40 bg-pink-400" />
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 relative z-10" />
              
              {/* Notifikační badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-bold animate-bounce">
                !
              </span>
            </button>
          </div>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('header.search')}
                className="w-full px-4 py-2 pr-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Contact info - desktop only */}
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-primary">{t('header.needHelp')}</p>
              <p className="text-muted-foreground">
                📞 776 041 740{" "}
                <span className="text-xs">({t('footer.hours')})</span>
              </p>
            </div>
          </div>

          {/* Icons - always visible */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search icon - mobile only */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* User icon */}
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative bg-[#E8C4D8] hover:bg-[#E8C4D8]/80"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Hamburger menu - mobile only */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation - desktop only */}
      <nav className="hidden md:block border-t border-border bg-gray-50 py-0">
        <div className="container overflow-x-auto scrollbar-hide">
          <ul className="flex items-center justify-start gap-0.5 lg:gap-1 py-1 text-xs lg:text-sm whitespace-nowrap">
            {navItems.map((item, index) => (
              <li key={index} className="flex-shrink-0">
                <a
                  href={item.url}
                  target={(item as any).isInternal ? undefined : "_blank"}
                  rel={(item as any).isInternal ? undefined : "noopener noreferrer"}
                  onClick={(e) => {
                    if ((item as any).isInternal && item.url.startsWith('/#')) {
                      e.preventDefault();
                      const targetId = item.url.replace('/#', '');
                      const element = document.getElementById(targetId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.location.href = item.url;
                      }
                    } else if ((item as any).isInternal) {
                      e.preventDefault();
                      window.location.href = item.url;
                    }
                  }}
                  className={`inline-flex items-center gap-0.5 lg:gap-1 px-1.5 lg:px-3 py-1.5 lg:py-2 text-foreground hover:text-primary rounded-md transition-all ${
                    (item as any).featured 
                      ? 'border-2 border-purple-300 shadow-md hover:shadow-lg hover:scale-105 bg-white font-semibold' 
                      : 'hover:bg-transparent'
                  } ${
                    (item as any).pulse ? 'animate-pulse' : ''
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg max-h-[80vh] overflow-y-auto">
          <nav className="container py-4">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.url}
                    target={(item as any).isInternal ? undefined : "_blank"}
                    rel={(item as any).isInternal ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if ((item as any).isInternal) {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setTimeout(() => {
                          const targetId = item.url.replace('/#', '');
                          const element = document.getElementById(targetId);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          } else {
                            window.location.href = item.url;
                          }
                        }, 100);
                      }
                    }}
                    className="flex items-center justify-between w-full px-3 py-3 text-left text-base hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="h-5 w-5" />}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile contact info */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="font-semibold text-primary mb-2">
                {t('header.needHelp')}
              </p>
              <p className="text-sm text-muted-foreground">
                📞 776 041 740
                <br />
                <span className="text-xs">({t('footer.hours')})</span>
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
