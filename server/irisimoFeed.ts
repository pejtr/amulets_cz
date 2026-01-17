import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export interface IrisimoProduct {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  price: string;
  priceVat: string;
  manufacturer: string;
  category: string;
  availability: string;
}

const FEED_URL = 'https://www.irisimo.cz/export/heureka';
const AFFIAL_BASE_URL = 'https://login.affial.com/scripts/8m338kc';
const AFFIAL_AID = '5d5a767017fee';
const AFFIAL_BID = '057d884e';

/**
 * Generate Affial affiliate link for a product
 */
export function generateAffiliateLink(productUrl: string): string {
  const encodedUrl = encodeURIComponent(productUrl);
  return `${AFFIAL_BASE_URL}?a_aid=${AFFIAL_AID}&a_bid=${AFFIAL_BID}&url=${encodedUrl}`;
}

/**
 * Fetch and parse Irisimo Heureka XML feed
 */
export async function fetchIrisimoFeed(): Promise<IrisimoProduct[]> {
  try {
    const response = await axios.get(FEED_URL, {
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'Amulets.cz Feed Parser/1.0',
      },
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    const result = parser.parse(response.data);
    const items = result.SHOP?.SHOPITEM || [];

    // Ensure items is an array
    const itemsArray = Array.isArray(items) ? items : [items];

    // Parse products
    const products: IrisimoProduct[] = itemsArray.map((item: any) => ({
      id: item.ITEM_ID || '',
      name: item.PRODUCTNAME || '',
      description: item.DESCRIPTION || '',
      url: item.URL || '',
      imageUrl: item.IMGURL || '',
      price: item.PRICE_VAT || item.PRICE || '',
      priceVat: item.PRICE_VAT || '',
      manufacturer: item.MANUFACTURER || '',
      category: item.CATEGORYTEXT || '',
      availability: item.DELIVERY_DATE || 'Skladem',
    }));

    return products;
  } catch (error) {
    console.error('Error fetching Irisimo feed:', error);
    throw new Error('Failed to fetch Irisimo feed');
  }
}

/**
 * Filter only AMEN pendants from the feed
 */
export function filterAmenPendants(products: IrisimoProduct[]): IrisimoProduct[] {
  return products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes('amen');
    const categoryMatch = product.category.toLowerCase().includes('přívěs') || 
                          product.category.toLowerCase().includes('pendant');
    const manufacturerMatch = product.manufacturer.toLowerCase().includes('amen');

    return (nameMatch || manufacturerMatch) && (categoryMatch || product.name.toLowerCase().includes('přívěs'));
  });
}

/**
 * Get AMEN pendants with affiliate links
 */
export async function getAmenPendants(): Promise<IrisimoProduct[]> {
  const allProducts = await fetchIrisimoFeed();
  const amenPendants = filterAmenPendants(allProducts);

  // Add affiliate links
  return amenPendants.map((product) => ({
    ...product,
    url: generateAffiliateLink(product.url),
  }));
}
