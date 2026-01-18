/**
 * Statický katalog AMEN produktů z Irisimo
 * Aktualizováno: 18.1.2026
 * Zdroj: https://www.irisimo.cz/sperky/amen
 */

export interface AmenProduct {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  price: number;
  category: 'nahrdelnik' | 'naramek' | 'prsten' | 'nausnice' | 'privesek';
  collection: string;
  material: string;
  availability: 'skladem' | 'na_objednavku';
}

// Affiliate link generator
const AFFIAL_BASE_URL = 'https://login.affial.com/scripts/8m338kc';
const AFFIAL_AID = '5d5a767017fee';
const AFFIAL_BID = '057d884e';

export function generateAffiliateLink(productUrl: string): string {
  const encodedUrl = encodeURIComponent(productUrl);
  return `${AFFIAL_BASE_URL}?a_aid=${AFFIAL_AID}&a_bid=${AFFIAL_BID}&url=${encodedUrl}`;
}

// Statický katalog AMEN produktů
export const amenCatalog: AmenProduct[] = [
  // Rosary kolekce - náhrdelníky
  {
    id: 'CLHSBBZ',
    name: 'AMEN Náhrdelník Rosary černý',
    description: 'Elegantní stříbrný náhrdelník z kolekce Rosary s černými korálky. Symbol víry a ochrany.',
    url: 'https://www.irisimo.cz/amen-clhsbbz',
    imageUrl: '/images/amen/rosary-black.jpg',
    price: 997,
    category: 'nahrdelnik',
    collection: 'Rosary',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  {
    id: 'CLHSHBRBZ',
    name: 'AMEN Náhrdelník Ruby Heart',
    description: 'Stříbrný náhrdelník s rubínovým srdcem. Symbol lásky a vášně.',
    url: 'https://www.irisimo.cz/amen-clhshbrbz',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1247,
    category: 'nahrdelnik',
    collection: 'Heart',
    material: 'Stříbro 925/1000, rubín',
    availability: 'skladem',
  },
  {
    id: 'CLFECZ',
    name: 'AMEN Náhrdelník Faith Hope Charity',
    description: 'Stříbrný náhrdelník se třemi symboly: víra, naděje a láska. Tři významy v jednom šperku.',
    url: 'https://www.irisimo.cz/amen-clfecz',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1497,
    category: 'nahrdelnik',
    collection: 'Faith Hope Charity',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  // Rosary kolekce - náramky
  {
    id: 'BROBZ3',
    name: 'AMEN Náramek Rosary se zirkony',
    description: 'Originální stříbrný náramek z kolekce Rosary zdobený zirkony. Symbol modlitby a ochrany.',
    url: 'https://www.irisimo.cz/amen-brobz3',
    imageUrl: '/images/amen/bracelet-rosary.png',
    price: 1247,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, zirkony',
    availability: 'skladem',
  },
  {
    id: 'BROBN',
    name: 'AMEN Náramek Rosary černý',
    description: 'Elegantní stříbrný náramek s černými korálky ve stylu růžence.',
    url: 'https://www.irisimo.cz/amen-brobn',
    imageUrl: '/images/amen/bracelet-rosary.png',
    price: 997,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  // Elegance kolekce
  {
    id: 'CLTRE',
    name: 'AMEN Náhrdelník Tree of Life',
    description: 'Stříbrný náhrdelník se symbolem Stromu života. Představuje růst, sílu a propojení.',
    url: 'https://www.irisimo.cz/amen-cltre',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1497,
    category: 'nahrdelnik',
    collection: 'Elegance',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  {
    id: 'CLCRO',
    name: 'AMEN Náhrdelník Cross',
    description: 'Klasický stříbrný náhrdelník s křížkem. Nadčasový symbol víry.',
    url: 'https://www.irisimo.cz/amen-clcro',
    imageUrl: '/images/amen/rosary-black.jpg',
    price: 1247,
    category: 'nahrdelnik',
    collection: 'Cross',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  // Přívěsky
  {
    id: 'PNMADP',
    name: 'AMEN Přívěsek Madonna',
    description: 'Stříbrný přívěsek s vyobrazením Panny Marie. Symbol ochrany a mateřské lásky.',
    url: 'https://www.irisimo.cz/amen-pnmadp',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 747,
    category: 'privesek',
    collection: 'Madonna',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  {
    id: 'PNANG',
    name: 'AMEN Přívěsek Angel',
    description: 'Stříbrný přívěsek s andělem strážným. Symbol ochrany a vedení.',
    url: 'https://www.irisimo.cz/amen-pnang',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 747,
    category: 'privesek',
    collection: 'Angel',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  {
    id: 'PNHEART',
    name: 'AMEN Přívěsek Srdce',
    description: 'Stříbrný přívěsek ve tvaru srdce. Symbol lásky a oddanosti.',
    url: 'https://www.irisimo.cz/amen-pnheart',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 897,
    category: 'privesek',
    collection: 'Heart',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  // Náušnice
  {
    id: 'ORCRO',
    name: 'AMEN Náušnice Cross',
    description: 'Stříbrné náušnice s křížky. Elegantní vyjádření víry.',
    url: 'https://www.irisimo.cz/amen-orcro',
    imageUrl: '/images/amen/rosary-black.jpg',
    price: 997,
    category: 'nausnice',
    collection: 'Cross',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  {
    id: 'ORHEART',
    name: 'AMEN Náušnice Heart',
    description: 'Stříbrné náušnice ve tvaru srdíček. Symbol lásky.',
    url: 'https://www.irisimo.cz/amen-orheart',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 897,
    category: 'nausnice',
    collection: 'Heart',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  // Prsteny
  {
    id: 'FERO',
    name: 'AMEN Prsten Rosary',
    description: 'Stříbrný prsten z kolekce Rosary s otočným kroužkem. Meditativní šperk.',
    url: 'https://www.irisimo.cz/amen-fero',
    imageUrl: '/images/amen/bracelet-rosary.png',
    price: 1497,
    category: 'prsten',
    collection: 'Rosary',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
];

/**
 * Get all AMEN products with affiliate links
 */
export function getAmenProducts(): AmenProduct[] {
  return amenCatalog.map(product => ({
    ...product,
    url: generateAffiliateLink(product.url),
  }));
}

/**
 * Get AMEN products by category
 */
export function getAmenProductsByCategory(category: AmenProduct['category']): AmenProduct[] {
  return getAmenProducts().filter(p => p.category === category);
}

/**
 * Get AMEN products by collection
 */
export function getAmenProductsByCollection(collection: string): AmenProduct[] {
  return getAmenProducts().filter(p => p.collection.toLowerCase() === collection.toLowerCase());
}

/**
 * Get random AMEN products for recommendations
 */
export function getRandomAmenProducts(count: number = 3): AmenProduct[] {
  const products = getAmenProducts();
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Search AMEN products by keyword
 */
export function searchAmenProducts(keyword: string): AmenProduct[] {
  const lowerKeyword = keyword.toLowerCase();
  return getAmenProducts().filter(p => 
    p.name.toLowerCase().includes(lowerKeyword) ||
    p.description.toLowerCase().includes(lowerKeyword) ||
    p.collection.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Get catalog statistics
 */
export function getAmenCatalogStats() {
  const products = amenCatalog;
  return {
    totalProducts: products.length,
    categories: {
      nahrdelnik: products.filter(p => p.category === 'nahrdelnik').length,
      naramek: products.filter(p => p.category === 'naramek').length,
      prsten: products.filter(p => p.category === 'prsten').length,
      nausnice: products.filter(p => p.category === 'nausnice').length,
      privesek: products.filter(p => p.category === 'privesek').length,
    },
    priceRange: {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price)),
    },
    collections: Array.from(new Set(products.map(p => p.collection))),
    lastUpdated: '2026-01-18',
  };
}
