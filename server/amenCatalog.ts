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

// Affiliate link generator - Irisimo kampaň
const AFFIAL_BASE_URL = 'https://login.affial.com/scripts/8m338kc';
const AFFIAL_AID = '5d5a767017fee';
const AFFIAL_BID = '057d884e';

export function generateAffiliateLink(productUrl: string): string {
  const encodedUrl = encodeURIComponent(productUrl);
  return `${AFFIAL_BASE_URL}?a_aid=${AFFIAL_AID}&a_bid=${AFFIAL_BID}&url=${encodedUrl}`;
}

// Statický katalog AMEN produktů - OVĚŘENÉ URL z Irisimo
export const amenCatalog: AmenProduct[] = [
  // Rosary kolekce - náhrdelníky
  {
    id: 'CROB3',
    name: 'AMEN Náhrdelník Rosary Round',
    description: 'Elegantní stříbrný náhrdelník z kolekce Rosary s kulatými korálky. Symbol víry a ochrany.',
    url: 'https://www.irisimo.cz/amen-crob3',
    imageUrl: '/images/amen/rosary-necklace-silver.jpg',
    price: 1497,
    category: 'nahrdelnik',
    collection: 'Rosary',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  {
    id: 'BROBZ3',
    name: 'AMEN Náramek Rosary se zirkony',
    description: 'Originální stříbrný náramek z kolekce Rosary zdobený zirkony. Symbol modlitby a ochrany.',
    url: 'https://www.irisimo.cz/amen-brobz3',
    imageUrl: '/images/amen/bracelet-rounded.jpg',
    price: 1247,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, zirkony',
    availability: 'skladem',
  },
  {
    id: 'BROB3',
    name: 'AMEN Náramek Rosary Rhodium',
    description: 'Elegantní stříbrný náramek s rhodiovaným povrchem ve stylu růžence.',
    url: 'https://www.irisimo.cz/amen-brob3',
    imageUrl: '/images/amen/cross-bracelet.jpg',
    price: 997,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, rhodium',
    availability: 'skladem',
  },
  {
    id: 'BROBC3',
    name: 'AMEN Náramek Rosary Skyblue',
    description: 'Stříbrný náramek s nebesky modrými krystaly. Symbolizuje klid a harmonii.',
    url: 'https://www.irisimo.cz/amen-brobc3',
    imageUrl: '/images/amen/rosary-turquoise.jpg',
    price: 997,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, krystaly',
    availability: 'skladem',
  },
  {
    id: 'BROBT3',
    name: 'AMEN Náramek Rosary Aqua Green',
    description: 'Stříbrný náramek s tyrkysově zelenými krystaly. Barva moře a přírody.',
    url: 'https://www.irisimo.cz/amen-brobt3',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 997,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, krystaly',
    availability: 'skladem',
  },
  {
    id: 'BROBPSW3',
    name: 'AMEN Náramek Rosary s perlami',
    description: 'Stříbrný náramek s křišťálovými perlami. Elegance a čistota.',
    url: 'https://www.irisimo.cz/amen-brobpsw3',
    imageUrl: '/images/amen/heart-necklace.jpg',
    price: 1247,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, perly',
    availability: 'skladem',
  },
  // Angels kolekce
  {
    id: 'CLASB',
    name: 'AMEN Náhrdelník Angel + Star',
    description: 'Stříbrný náhrdelník s andělem a hvězdou. Symbol ochrany a vedení.',
    url: 'https://www.irisimo.cz/amen-clasb',
    imageUrl: '/images/amen/angel-necklace.jpg',
    price: 1497,
    category: 'nahrdelnik',
    collection: 'Angels',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  // Přívěsky - obecná kategorie AMEN
  {
    id: 'AMEN-PRIVESEK-1',
    name: 'AMEN Přívěsek Madonna',
    description: 'Stříbrný přívěsek s vyobrazením Panny Marie. Symbol ochrany a mateřské lásky.',
    url: 'https://www.irisimo.cz/sperky/amen',
    imageUrl: '/images/amen/rosary-black.jpg',
    price: 747,
    category: 'privesek',
    collection: 'Madonna',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  {
    id: 'AMEN-PRIVESEK-2',
    name: 'AMEN Přívěsek Srdce',
    description: 'Stříbrný přívěsek ve tvaru srdce. Symbol lásky a oddanosti.',
    url: 'https://www.irisimo.cz/sperky/amen',
    imageUrl: '/images/amen/pray-love-necklace.jpg',
    price: 897,
    category: 'privesek',
    collection: 'Heart',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  // Náušnice
  {
    id: 'AMEN-NAUSNICE-1',
    name: 'AMEN Náušnice Cross',
    description: 'Stříbrné náušnice s křížky. Elegantní vyjádření víry.',
    url: 'https://www.irisimo.cz/sperky/amen',
    imageUrl: '/images/amen/rosary-necklace-classic.jpg',
    price: 997,
    category: 'nausnice',
    collection: 'Cross',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },
  // Prsteny
  {
    id: 'AMEN-PRSTEN-1',
    name: 'AMEN Prsten Rosary',
    description: 'Stříbrný prsten z kolekce Rosary s otočným kroužkem. Meditativní šperk.',
    url: 'https://www.irisimo.cz/sperky/amen',
    imageUrl: '/images/amen/bracelet-rounded.jpg',
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
