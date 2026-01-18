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
  featured?: boolean; // Pro zvýraznění v bannerech
}

// Affiliate link generator - Irisimo kampaň
const AFFIAL_BASE_URL = 'https://login.affial.com/scripts/8m338kc';
const AFFIAL_AID = '5d5a767017fee';
const AFFIAL_BID = '057d884e';

export function generateAffiliateLink(productUrl: string): string {
  const encodedUrl = encodeURIComponent(productUrl);
  return `${AFFIAL_BASE_URL}?a_aid=${AFFIAL_AID}&a_bid=${AFFIAL_BID}&url=${encodedUrl}`;
}

// Statický katalog AMEN produktů - KOMPLETNÍ NABÍDKA z Irisimo
export const amenCatalog: AmenProduct[] = [
  // ===== ROSARY KOLEKCE - Náhrdelníky =====
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
    featured: true,
  },
  {
    id: 'CRORN4',
    name: 'AMEN Náhrdelník Rosary Classic Rhodium',
    description: 'Klasický růžencový náhrdelník s krystaly v černé a růžově zlaté barvě.',
    url: 'https://www.irisimo.cz/amen-crorn4',
    imageUrl: '/images/amen/rosary-necklace-classic.jpg',
    price: 1747,
    category: 'nahrdelnik',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, krystaly',
    availability: 'skladem',
  },
  {
    id: 'CRO30BBRGD',
    name: 'AMEN Náhrdelník Rosary Multi-Finish',
    description: 'Růžencový náhrdelník s korálky v kombinaci stříbrné, zlaté a růžově zlaté.',
    url: 'https://www.irisimo.cz/amen-cro30bbrgd',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1747,
    category: 'nahrdelnik',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, pozlacení',
    availability: 'skladem',
  },
  {
    id: 'CROGBL3',
    name: 'AMEN Náhrdelník Rosary Crystal Gold',
    description: 'Pozlacený růžencový náhrdelník s křišťálovými korálky.',
    url: 'https://www.irisimo.cz/amen-crogbl3',
    imageUrl: '/images/amen/pray-love-necklace.jpg',
    price: 1747,
    category: 'nahrdelnik',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },
  {
    id: 'CROBN3',
    name: 'AMEN Náhrdelník Rosary Black Crystal',
    description: 'Stříbrný růžencový náhrdelník s černými krystaly - elegantní a mystický.',
    url: 'https://www.irisimo.cz/amen-crobn3',
    imageUrl: '/images/amen/rosary-black.jpg',
    price: 1497,
    category: 'nahrdelnik',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, černé krystaly',
    availability: 'skladem',
  },
  {
    id: 'CLCRMIGNZ4',
    name: 'AMEN Náhrdelník Rosary Golden Black Tennis',
    description: 'Luxusní zlatý růžencový náhrdelník s černými zirkony.',
    url: 'https://www.irisimo.cz/amen-clcrmignz4',
    imageUrl: '/images/amen/heart-necklace.jpg',
    price: 2247,
    category: 'nahrdelnik',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, pozlacení, zirkony',
    availability: 'skladem',
    featured: true,
  },
  {
    id: 'CRO30R',
    name: 'AMEN Náhrdelník Rosary Classic Rose',
    description: 'Klasický růžencový náhrdelník v růžově zlatém provedení.',
    url: 'https://www.irisimo.cz/amen-cro30r',
    imageUrl: '/images/amen/angel-necklace.jpg',
    price: 1747,
    category: 'nahrdelnik',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },

  // ===== ROSARY KOLEKCE - Náramky =====
  {
    id: 'BROBZ3',
    name: 'AMEN Náramek Rosary se zirkony',
    description: 'Originální stříbrný náramek z kolekce Rosary zdobený zirkony.',
    url: 'https://www.irisimo.cz/amen-brobz3',
    imageUrl: '/images/amen/bracelet-rounded.jpg',
    price: 1247,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, zirkony',
    availability: 'skladem',
    featured: true,
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
    description: 'Stříbrný náramek s nebesky modrými krystaly - klid a harmonie.',
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
    description: 'Stříbrný náramek s tyrkysově zelenými krystaly - barva moře.',
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
    description: 'Stříbrný náramek s křišťálovými perlami - elegance a čistota.',
    url: 'https://www.irisimo.cz/amen-brobpsw3',
    imageUrl: '/images/amen/heart-necklace.jpg',
    price: 1247,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, perly',
    availability: 'skladem',
  },
  {
    id: 'BRCRMIBNZ3',
    name: 'AMEN Náramek Rosary Black Tennis',
    description: 'Růžencový náramek s černými zirkony - moderní elegance.',
    url: 'https://www.irisimo.cz/amen-brcrmibnz3',
    imageUrl: '/images/amen/rosary-black.jpg',
    price: 1497,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, černé zirkony',
    availability: 'skladem',
  },
  {
    id: 'BROGBL3',
    name: 'AMEN Náramek Rosary Gold Crystal',
    description: 'Pozlacený růžencový náramek s křišťálovými korálky.',
    url: 'https://www.irisimo.cz/amen-brogbl3',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1247,
    category: 'naramek',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },

  // ===== LOVE KOLEKCE - Náramky =====
  {
    id: 'BRSLOV3',
    name: 'AMEN Náramek LOVE Silver',
    description: 'Stříbrný náramek s nápisem LOVE - symbol lásky a přátelství.',
    url: 'https://www.irisimo.cz/amen-brslov3',
    imageUrl: '/images/amen/bracelet-rounded.jpg',
    price: 872,
    category: 'naramek',
    collection: 'Love',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
    featured: true,
  },
  {
    id: 'BRGLOV3',
    name: 'AMEN Náramek LOVE Gold',
    description: 'Pozlacený náramek s nápisem LOVE - elegantní dárek pro milované.',
    url: 'https://www.irisimo.cz/amen-brglov3',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 997,
    category: 'naramek',
    collection: 'Love',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },
  {
    id: 'BRRLOV3',
    name: 'AMEN Náramek LOVE Rose Gold',
    description: 'Růžově zlatý náramek s nápisem LOVE - romantický a jemný.',
    url: 'https://www.irisimo.cz/amen-brrlov3',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 997,
    category: 'naramek',
    collection: 'Love',
    material: 'Stříbro 925/1000, pozlacení růžové zlato',
    availability: 'skladem',
  },

  // ===== TENNIS KOLEKCE - Náramky =====
  {
    id: 'BT3BB17',
    name: 'AMEN Náramek Tennis White',
    description: 'Tenisový náramek s bílými zirkony - klasická elegance.',
    url: 'https://www.irisimo.cz/amen-bt3bb17',
    imageUrl: '/images/amen/bracelet-rounded.jpg',
    price: 1497,
    category: 'naramek',
    collection: 'Tennis',
    material: 'Stříbro 925/1000, rhodium, zirkony',
    availability: 'skladem',
    featured: true,
  },
  {
    id: 'BTRB16',
    name: 'AMEN Náramek Tennis Rose',
    description: 'Tenisový náramek v růžově zlatém provedení s bílými zirkony.',
    url: 'https://www.irisimo.cz/amen-btrb16',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1497,
    category: 'naramek',
    collection: 'Tennis',
    material: 'Stříbro 925/1000, pozlacení, zirkony',
    availability: 'skladem',
  },
  {
    id: 'BTGB16',
    name: 'AMEN Náramek Tennis Gold',
    description: 'Pozlacený tenisový náramek s bílými zirkony - luxusní šperk.',
    url: 'https://www.irisimo.cz/amen-btgb16',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1747,
    category: 'naramek',
    collection: 'Tennis',
    material: 'Stříbro 925/1000, pozlacení 18K, zirkony',
    availability: 'skladem',
  },
  {
    id: 'BTBB16',
    name: 'AMEN Náramek Tennis Rhodium',
    description: 'Rhodiovaný tenisový náramek s bílými zirkony.',
    url: 'https://www.irisimo.cz/amen-btbb16',
    imageUrl: '/images/amen/cross-bracelet.jpg',
    price: 1497,
    category: 'naramek',
    collection: 'Tennis',
    material: 'Stříbro 925/1000, rhodium, zirkony',
    availability: 'skladem',
  },
  {
    id: 'BT7BBN16',
    name: 'AMEN Náramek Tennis Black',
    description: 'Tenisový náramek s černými zirkony - moderní a výrazný.',
    url: 'https://www.irisimo.cz/amen-bt7bbn16',
    imageUrl: '/images/amen/rosary-black.jpg',
    price: 1747,
    category: 'naramek',
    collection: 'Tennis',
    material: 'Stříbro 925/1000, černé zirkony',
    availability: 'skladem',
  },
  {
    id: 'BT3GB17',
    name: 'AMEN Náramek Tennis Golden Unisex',
    description: 'Unisex pozlacený tenisový náramek s bílými zirkony.',
    url: 'https://www.irisimo.cz/amen-bt3gb17',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1747,
    category: 'naramek',
    collection: 'Tennis',
    material: 'Stříbro 925/1000, pozlacení 18K, zirkony',
    availability: 'skladem',
  },

  // ===== VITA CHRISTI ET MARIAE KOLEKCE - Náramky =====
  {
    id: 'BRVCMB3',
    name: 'AMEN Náramek Vita Christi Silver',
    description: 'Stříbrný náramek s medailonky Krista a Marie - duchovní ochrana.',
    url: 'https://www.irisimo.cz/amen-brvcmb3',
    imageUrl: '/images/amen/cross-bracelet.jpg',
    price: 1497,
    category: 'naramek',
    collection: 'Vita Christi et Mariae',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
    featured: true,
  },
  {
    id: 'BRVCMG3',
    name: 'AMEN Náramek Vita Christi Gold',
    description: 'Pozlacený náramek s medailonky Krista a Marie.',
    url: 'https://www.irisimo.cz/amen-brvcmg3',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1747,
    category: 'naramek',
    collection: 'Vita Christi et Mariae',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },

  // ===== PRSTENY - Různé kolekce =====
  {
    id: 'ACRB-14',
    name: 'AMEN Prsten Cross Rhodium',
    description: 'Stříbrný prsten s křížem - symbol víry a síly.',
    url: 'https://www.irisimo.cz/amen-acrb-14',
    imageUrl: '/images/amen/rings/cross-rhodium.jpg',
    price: 747,
    category: 'prsten',
    collection: 'Cross',
    material: 'Stříbro 925/1000, rhodium',
    availability: 'skladem',
    featured: true,
  },
  {
    id: 'ACRG-14',
    name: 'AMEN Prsten Cross Gold',
    description: 'Pozlacený prsten s křížem - elegantní a výrazný.',
    url: 'https://www.irisimo.cz/amen-acrg-14',
    imageUrl: '/images/amen/rings/cross-rhodium.jpg',
    price: 872,
    category: 'prsten',
    collection: 'Cross',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },
  {
    id: 'ACRR-14',
    name: 'AMEN Prsten Cross Rose Gold',
    description: 'Růžově zlatý prsten s křížem - jemný a romantický.',
    url: 'https://www.irisimo.cz/amen-acrr-14',
    imageUrl: '/images/amen/rings/cross-rhodium.jpg',
    price: 872,
    category: 'prsten',
    collection: 'Cross',
    material: 'Stříbro 925/1000, pozlacení růžové zlato',
    availability: 'skladem',
  },
  {
    id: 'ARORB-16',
    name: 'AMEN Prsten Rosary Rhodium',
    description: 'Stříbrný prsten ve stylu růžence s korálky.',
    url: 'https://www.irisimo.cz/amen-arorb-16',
    imageUrl: '/images/amen/rings/rosary-rhodium.jpg',
    price: 747,
    category: 'prsten',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, rhodium',
    availability: 'skladem',
  },
  {
    id: 'ARORG-16',
    name: 'AMEN Prsten Rosary Gold',
    description: 'Pozlacený prsten ve stylu růžence.',
    url: 'https://www.irisimo.cz/amen-arorg-16',
    imageUrl: '/images/amen/rings/rosary-gold.jpg',
    price: 872,
    category: 'prsten',
    collection: 'Rosary',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },

  // ===== NÁUŠNICE - Různé kolekce =====
  {
    id: 'ORECB',
    name: 'AMEN Náušnice Cross Rhodium',
    description: 'Stříbrné náušnice s křížkem - jemné a elegantní.',
    url: 'https://www.irisimo.cz/amen-orecb',
    imageUrl: '/images/amen/earrings/cross-rhodium.jpg',
    price: 747,
    category: 'nausnice',
    collection: 'Cross',
    material: 'Stříbro 925/1000, rhodium',
    availability: 'skladem',
    featured: true,
  },
  {
    id: 'ORECG',
    name: 'AMEN Náušnice Cross Gold',
    description: 'Pozlacené náušnice s křížkem - luxusní detail.',
    url: 'https://www.irisimo.cz/amen-orecg',
    imageUrl: '/images/amen/earrings/cross-gold.jpg',
    price: 872,
    category: 'nausnice',
    collection: 'Cross',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },
  {
    id: 'ORECR',
    name: 'AMEN Náušnice Cross Rose Gold',
    description: 'Růžově zlaté náušnice s křížkem - romantické a jemné.',
    url: 'https://www.irisimo.cz/amen-orecr',
    imageUrl: '/images/amen/earrings/cross-rose-gold.jpg',
    price: 872,
    category: 'nausnice',
    collection: 'Cross',
    material: 'Stříbro 925/1000, pozlacení růžové zlato',
    availability: 'skladem',
  },
  {
    id: 'ORHB',
    name: 'AMEN Náušnice Heart Rhodium',
    description: 'Stříbrné náušnice se srdíčkem - symbol lásky.',
    url: 'https://www.irisimo.cz/amen-orhb',
    imageUrl: '/images/amen/earrings/heart-rhodium.jpg',
    price: 747,
    category: 'nausnice',
    collection: 'Heart',
    material: 'Stříbro 925/1000, rhodium',
    availability: 'skladem',
  },
  {
    id: 'ORHG',
    name: 'AMEN Náušnice Heart Gold',
    description: 'Pozlacené náušnice se srdíčkem - elegantní dárek.',
    url: 'https://www.irisimo.cz/amen-orhg',
    imageUrl: '/images/amen/earrings/heart-gold.jpg',
    price: 872,
    category: 'nausnice',
    collection: 'Heart',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },
  {
    id: 'ORHRB',
    name: 'AMEN Náušnice Heart Rose Gold',
    description: 'Růžově zlaté náušnice se srdíčkem - romantické.',
    url: 'https://www.irisimo.cz/amen-orhrb',
    imageUrl: '/images/amen/earrings/heart-rose-gold.jpg',
    price: 872,
    category: 'nausnice',
    collection: 'Heart',
    material: 'Stříbro 925/1000, pozlacení růžové zlato',
    availability: 'skladem',
  },
  {
    id: 'ORAB',
    name: 'AMEN Náušnice Angel Rhodium',
    description: 'Stříbrné náušnice s andělem - ochrana a vedení.',
    url: 'https://www.irisimo.cz/amen-orab',
    imageUrl: '/images/amen/earrings/angel-rhodium.jpg',
    price: 747,
    category: 'nausnice',
    collection: 'Angels',
    material: 'Stříbro 925/1000, rhodium',
    availability: 'skladem',
  },
  {
    id: 'ORAG',
    name: 'AMEN Náušnice Angel Gold',
    description: 'Pozlacené náušnice s andělem - duchovní krása.',
    url: 'https://www.irisimo.cz/amen-orag',
    imageUrl: '/images/amen/earrings/angel-gold.jpg',
    price: 872,
    category: 'nausnice',
    collection: 'Angels',
    material: 'Stříbro 925/1000, pozlacení 18K',
    availability: 'skladem',
  },

  // ===== TREE OF LIFE KOLEKCE =====
  {
    id: 'BRAL3',
    name: 'AMEN Náramek Strom života',
    description: 'Náramek se symbolem stromu života - růst, síla a propojení.',
    url: 'https://www.irisimo.cz/amen-bral3',
    imageUrl: '/images/amen/angel-necklace.jpg',
    price: 1497,
    category: 'naramek',
    collection: 'Tree of Life',
    material: 'Stříbro 925/1000, pozlacení',
    availability: 'skladem',
    featured: true,
  },
  {
    id: 'CLALB',
    name: 'AMEN Náhrdelník Strom života Silver',
    description: 'Stříbrný náhrdelník se stromem života - symbol růstu a harmonie.',
    url: 'https://www.irisimo.cz/amen-clalb',
    imageUrl: '/images/amen/angel-necklace.jpg',
    price: 1497,
    category: 'nahrdelnik',
    collection: 'Tree of Life',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
  },

  // ===== HEART KOLEKCE =====
  {
    id: 'BRHHBBZ',
    name: 'AMEN Náramek Heart se zirkony',
    description: 'Stříbrný náramek se srdíčky a zirkony - symbol lásky.',
    url: 'https://www.irisimo.cz/amen-brhhbbz',
    imageUrl: '/images/amen/heart-necklace.jpg',
    price: 997,
    category: 'naramek',
    collection: 'Heart',
    material: 'Stříbro 925/1000, zirkony',
    availability: 'skladem',
  },
  {
    id: 'BRHIGBZ',
    name: 'AMEN Náramek Heart Golden',
    description: 'Pozlacený náramek se srdíčky a zirkony - elegantní dárek.',
    url: 'https://www.irisimo.cz/amen-brhigbz',
    imageUrl: '/images/amen/pray-love-necklace.jpg',
    price: 1247,
    category: 'naramek',
    collection: 'Heart',
    material: 'Stříbro 925/1000, pozlacení 18K, zirkony',
    availability: 'skladem',
  },

  // ===== QUADRICUORE KOLEKCE =====
  {
    id: 'CLPQUBB',
    name: 'AMEN Náhrdelník Quadricuore',
    description: 'Náhrdelník se čtyřlístkem a rubínovými zirkony - štěstí a ochrana.',
    url: 'https://www.irisimo.cz/amen-clpqubb',
    imageUrl: '/images/amen/angel-necklace.jpg',
    price: 1747,
    category: 'nahrdelnik',
    collection: 'Quadricuore',
    material: 'Stříbro 925/1000, zirkony',
    availability: 'skladem',
  },
  {
    id: 'EQUBB',
    name: 'AMEN Náušnice Quadricuore',
    description: 'Náušnice se čtyřlístkem - symbol štěstí.',
    url: 'https://www.irisimo.cz/amen-equbb',
    imageUrl: '/images/amen/rosary-necklace-classic.jpg',
    price: 997,
    category: 'nausnice',
    collection: 'Quadricuore',
    material: 'Stříbro 925/1000, zirkony',
    availability: 'skladem',
  },

  // ===== ANGELS & CROSSES =====
  {
    id: 'CLASB',
    name: 'AMEN Náhrdelník Angel + Star',
    description: 'Stříbrný náhrdelník s andělem a hvězdou - ochrana a vedení.',
    url: 'https://www.irisimo.cz/amen-clasb',
    imageUrl: '/images/amen/angel-necklace.jpg',
    price: 1497,
    category: 'nahrdelnik',
    collection: 'Angels',
    material: 'Stříbro 925/1000',
    availability: 'skladem',
    featured: true,
  },
  {
    id: 'CLASG',
    name: 'AMEN Náhrdelník Angel + Star Gold',
    description: 'Pozlacený náhrdelník s andělem a hvězdou.',
    url: 'https://www.irisimo.cz/amen-clasg',
    imageUrl: '/images/amen/rosary-gold.jpg',
    price: 1747,
    category: 'nahrdelnik',
    collection: 'Angels',
    material: 'Stříbro 925/1000, pozlacení 18K',
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
 * Get featured AMEN products for banners
 */
export function getFeaturedAmenProducts(): AmenProduct[] {
  return getAmenProducts().filter(p => p.featured);
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
    featuredProducts: products.filter(p => p.featured).length,
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
