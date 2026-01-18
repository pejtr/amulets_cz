import { PROJECTS, getProjectsByCategory } from "@shared/crossLinkProjects";
import ItalyFlag from "./icons/ItalyFlag";

/**
 * Cross-Link Footer Section
 * SEO-optimalizovaná sekce s odkazy na všechny projekty
 */
export default function CrossLinkFooter() {
  const travelProjects = getProjectsByCategory('travel');
  const healthProjects = getProjectsByCategory('health');
  const spiritualityProjects = getProjectsByCategory('spirituality');
  const ecommerceProjects = getProjectsByCategory('ecommerce');
  const affiliateProjects = getProjectsByCategory('affiliate');

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-t border-purple-100">
      <div className="container py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🌟 Naše další projekty
          </h2>
          <p className="text-gray-600">
            Objevte další weby z naší rodiny projektů zaměřených na zdraví, cestování a spiritualitu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cestování */}
          {travelProjects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                ✈️ Cestování
              </h3>
              <ul className="space-y-2">
                {travelProjects.map((project) => (
                  <li key={project.id}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-purple-600 transition-colors flex items-start gap-2 group"
                    >
                      {project.icon === 'italy-flag' ? (
                        <ItalyFlag size={20} className="group-hover:scale-110 transition-transform" />
                      ) : (
                        <span className="text-lg group-hover:scale-110 transition-transform">
                          {project.icon}
                        </span>
                      )}
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.description}</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Zdraví & Wellness */}
          {healthProjects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                🌿 Zdraví & Wellness
              </h3>
              <ul className="space-y-2">
                {healthProjects.map((project) => (
                  <li key={project.id}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-purple-600 transition-colors flex items-start gap-2 group"
                    >
                      {project.icon === 'italy-flag' ? (
                        <ItalyFlag size={20} className="group-hover:scale-110 transition-transform" />
                      ) : (
                        <span className="text-lg group-hover:scale-110 transition-transform">
                          {project.icon}
                        </span>
                      )}
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.description}</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Spiritualita */}
          {spiritualityProjects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                🔮 Spiritualita
              </h3>
              <ul className="space-y-2">
                {spiritualityProjects.map((project) => (
                  <li key={project.id}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-purple-600 transition-colors flex items-start gap-2 group"
                    >
                      {project.icon === 'italy-flag' ? (
                        <ItalyFlag size={20} className="group-hover:scale-110 transition-transform" />
                      ) : (
                        <span className="text-lg group-hover:scale-110 transition-transform">
                          {project.icon}
                        </span>
                      )}
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.description}</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* E-commerce & Affiliate */}
          {(ecommerceProjects.length > 0 || affiliateProjects.length > 0) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                💎 E-shop & Další
              </h3>
              <ul className="space-y-2">
                {[...ecommerceProjects, ...affiliateProjects].map((project) => (
                  <li key={project.id}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-purple-600 transition-colors flex items-start gap-2 group"
                    >
                      {project.icon === 'italy-flag' ? (
                        <ItalyFlag size={20} className="group-hover:scale-110 transition-transform" />
                      ) : (
                        <span className="text-lg group-hover:scale-110 transition-transform">
                          {project.icon}
                        </span>
                      )}
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.description}</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* SEO-friendly text */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Naše projekty spojují zdravý životní styl, cestování a spiritualitu. 
            Od last minute dovolených a akčních letenek přes zdravé recepty a keto dietu 
            až po posvátné symboly a amulety - vše pro váš lepší život.
          </p>
        </div>
      </div>
    </div>
  );
}
