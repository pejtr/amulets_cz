/**
 * Cross-Linking Configuration
 * Centralizovaná konfigurace všech projektů v ekosystému
 */

export interface Project {
  id: string;
  name: string;
  url: string;
  category: 'travel' | 'health' | 'spirituality' | 'ecommerce' | 'affiliate';
  description: string;
  icon: string; // Emoji nebo icon name
  color: string; // Tailwind color class
}

export const PROJECTS: Project[] = [
  // Spiritualita & E-commerce (PRIORITY)
  {
    id: 'ohorai',
    name: 'OHORAI',
    url: 'https://www.ohorai.cz',
    category: 'ecommerce',
    description: 'Autorská tvorba - esence a pyramidy',
    icon: '🪷',
    color: 'purple',
  },
  {
    id: 'amulets',
    name: 'Amulets.cz',
    url: 'https://amulets.cz',
    category: 'spirituality',
    description: 'Posvátné symboly a amulety',
    icon: '🔮',
    color: 'purple',
  },
  
  // Cestování
  {
    id: 'last-minute',
    name: 'Last Minute Dovolené',
    url: 'https://lastminutedovolene.cz',
    category: 'travel',
    description: 'Nejlepší last minute nabídky dovolených',
    icon: '🏖️',
    color: 'blue',
  },
  {
    id: 'akcni-letenky',
    name: 'Akční Letenky',
    url: 'https://www.akcni-letenky.com',
    category: 'travel',
    description: 'Výhodné letenky do celého světa',
    icon: '✈️',
    color: 'sky',
  },
  {
    id: 'do-italie',
    name: 'Do Itálie',
    url: 'https://doitalie.cz',
    category: 'travel',
    description: 'Průvodce cestováním po Itálii',
    icon: 'italy-flag', // Special: use SVG component
    color: 'green',
  },
  
  // Zdraví & Wellness
  {
    id: 'recepty-zdravi',
    name: 'Recepty Zdraví',
    url: 'https://receptyzdravii.cz',
    category: 'health',
    description: 'Zdravé recepty pro lepší život',
    icon: '🥗',
    color: 'emerald',
  },
  {
    id: 'youketo',
    name: 'YouKeto',
    url: 'https://youketo.cz',
    category: 'health',
    description: 'Keto dieta a zdravý životní styl',
    icon: '🥑',
    color: 'lime',
  },
  {
    id: 'silne-libido',
    name: 'Silné Libido',
    url: 'https://silnelibido.cz',
    category: 'health',
    description: 'Podpora vitality a zdraví',
    icon: '💪',
    color: 'red',
  },
  {
    id: 'dobra-cajovna',
    name: 'Dobrá Čajovna Praha',
    url: 'https://www.dobracajovnapraha.cz',
    category: 'health',
    description: 'Prémiové čaje a čajové doplňky',
    icon: '🍵',
    color: 'amber',
  },
  {
    id: 'amarex',
    name: 'Amarex',
    url: 'https://amarex.cz',
    category: 'health',
    description: 'Přírodní produkt na podporu erekce',
    icon: '💊',
    color: 'red',
  },
];

/**
 * Get projects by category
 */
export function getProjectsByCategory(category: Project['category']): Project[] {
  return PROJECTS.filter(p => p.category === category);
}

/**
 * Get project by ID
 */
export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find(p => p.id === id);
}

/**
 * Get all projects except current
 */
export function getOtherProjects(currentProjectId: string): Project[] {
  return PROJECTS.filter(p => p.id !== currentProjectId);
}

/**
 * Get related projects (same category)
 */
export function getRelatedProjects(currentProjectId: string): Project[] {
  const currentProject = getProjectById(currentProjectId);
  if (!currentProject) return [];
  
  return PROJECTS.filter(
    p => p.id !== currentProjectId && p.category === currentProject.category
  );
}
