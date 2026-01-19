import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { PROJECTS, getOtherProjects } from "@shared/crossLinkProjects";
import ItalyFlag from "./icons/ItalyFlag";

/**
 * Cross-Link Banner - Vysouvací proužek nad headerem
 * Mobilní: Default zobrazuje jen OHORAI.cz, scroll nahoru přes limit → vysune všechny projekty + haptická odezva
 * Desktop: Zobrazuje 5 projektů, expandable na všechny
 */
export default function CrossLinkBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [overscrollCount, setOverscrollCount] = useState(0);

  // Check if user has dismissed the banner
  useEffect(() => {
    const dismissed = localStorage.getItem('crossLinkBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  // Haptic feedback helper
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration (50ms)
    }
  };

  // Handle scroll behavior with overscroll detection for mobile
  useEffect(() => {
    if (isDismissed) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;
      
      // Desktop behavior: Hide when scrolling down, show when scrolling up
      if (!isMobile) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
      } else {
        // Mobile behavior: Detect overscroll at top
        if (currentScrollY === 0 && lastScrollY > 0) {
          // User scrolled to top
          setOverscrollCount(prev => prev + 1);
          
          // After 2 consecutive "at top" detections, expand
          if (overscrollCount >= 1 && !isMobileExpanded) {
            setIsMobileExpanded(true);
            triggerHaptic();
          }
        } else if (currentScrollY > 50) {
          // User scrolled down, collapse
          if (isMobileExpanded) {
            setIsMobileExpanded(false);
            setOverscrollCount(0);
          }
        }
        
        // Always visible on mobile
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isDismissed, overscrollCount, isMobileExpanded]);

  // Reset overscroll count after timeout
  useEffect(() => {
    if (overscrollCount > 0) {
      const timeout = setTimeout(() => setOverscrollCount(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [overscrollCount]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('crossLinkBannerDismissed', 'true');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      triggerHaptic();
    }
  };

  if (isDismissed) return null;

  const otherProjects = getOtherProjects('amulets');
  
  // Find OHORAI project
  const ohoraiProject = PROJECTS.find(p => p.id === 'ohorai');
  
  // Group projects by category
  const travelProjects = otherProjects.filter(p => p.category === 'travel');
  const healthProjects = otherProjects.filter(p => p.category === 'health');
  const otherCategoryProjects = otherProjects.filter(
    p => p.category !== 'travel' && p.category !== 'health'
  );

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Mobile: Collapsed State (OHORAI.cz only) */}
      <div className="md:hidden">
        {!isMobileExpanded && ohoraiProject && (
          <div className="container py-2 px-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-semibold whitespace-nowrap">
                  🌟 Naše projekty:
                </span>
                <a
                  href="https://www.ohorai.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  <img src="/ohorai-logo.webp" alt="OHORAI" className="w-4 h-4 object-contain" />
                  <span>OHORAI</span>
                </a>
              </div>
              
              <button
                onClick={() => setIsMobileExpanded(true)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Zavřít banner"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-center text-white/70 mt-1">
              ↑ Potáhni nahoru pro více projektů
            </div>
          </div>
        )}

        {/* Mobile: Expanded State (All projects) */}
        {isMobileExpanded && (
          <div className="container py-3 px-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">🌟 Spřízněné projekty</span>
              <button
                onClick={() => setIsMobileExpanded(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Sbalit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Travel */}
              {travelProjects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 opacity-90">✈️ Cestování</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {travelProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {project.icon === 'italy-flag' ? (
                            <ItalyFlag size={16} />
                          ) : (
                            <span className="text-sm">{project.icon}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate">{project.name}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Health */}
              {healthProjects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 opacity-90">🌿 Zdraví & Wellness</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {healthProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{project.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate">{project.name}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Other */}
              {otherCategoryProjects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 opacity-90">💎 Další projekty</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {otherCategoryProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{project.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate">{project.name}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Original behavior */}
      <div className="hidden md:block">
        {/* Collapsed State */}
        {!isExpanded && (
          <div className="container py-2 px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-sm font-semibold whitespace-nowrap">
                  🌟 Naše další projekty:
                </span>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {otherProjects.slice(0, 5).map((project) => (
                    <a
                      key={project.id}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full whitespace-nowrap transition-colors flex items-center gap-1"
                      title={project.description}
                    >
                      {project.icon === 'italy-flag' ? (
                        <ItalyFlag size={16} className="inline-block" />
                      ) : (
                        <span>{project.icon}</span>
                      )}
                      {project.name}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleExpanded}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  Zobrazit všechny
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Zavřít banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {isExpanded && (
          <div className="container py-4 px-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">🌟 Spřízněné projekty</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleExpanded}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                >
                  Sbalit
                  <ChevronDown className="w-3 h-3 rotate-180" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Zavřít banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Travel */}
              {travelProjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 opacity-90">✈️ Cestování</h4>
                  <div className="space-y-2">
                    {travelProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {project.icon === 'italy-flag' ? (
                            <ItalyFlag size={20} />
                          ) : (
                            <span className="text-lg">{project.icon}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{project.name}</div>
                            <div className="text-xs opacity-80 truncate">{project.description}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Health */}
              {healthProjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 opacity-90">🌿 Zdraví & Wellness</h4>
                  <div className="space-y-2">
                    {healthProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {project.icon === 'italy-flag' ? (
                            <ItalyFlag size={20} />
                          ) : (
                            <span className="text-lg">{project.icon}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{project.name}</div>
                            <div className="text-xs opacity-80 truncate">{project.description}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Other */}
              {otherCategoryProjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 opacity-90">💎 Další projekty</h4>
                  <div className="space-y-2">
                    {otherCategoryProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {project.icon === 'italy-flag' ? (
                            <ItalyFlag size={20} />
                          ) : (
                            <span className="text-lg">{project.icon}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{project.name}</div>
                            <div className="text-xs opacity-80 truncate">{project.description}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
