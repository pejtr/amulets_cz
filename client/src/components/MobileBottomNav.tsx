import { Home, Package, HelpCircle, Phone } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function MobileBottomNav() {
  const [location] = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Domů',
      href: '/',
    },
    {
      icon: Package,
      label: 'Produkty',
      href: '/privěsky-amen',
    },
    {
      icon: HelpCircle,
      label: 'Kvíz',
      href: '/kviz',
    },
    {
      icon: Phone,
      label: 'Kontakt',
      href: '/kontakt',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-purple-100 shadow-2xl">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-purple-500'
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
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
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
