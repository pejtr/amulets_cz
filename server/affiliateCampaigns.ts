/**
 * Affiliate kampaně z Affial
 * Zdroj: https://login.affial.com
 * Aktualizováno: 18.1.2026
 */

export interface AffiliateCampaign {
  id: string;
  name: string;
  baseUrl: string;
  aAid: string;
  aBid: string;
  category: 'fashion' | 'jewelry' | 'lifestyle' | 'wellness' | 'food' | 'other';
  relevance: 'high' | 'medium' | 'low'; // Pro chatbot doporučení
  description?: string;
}

// Hlavní affiliate kampaně
export const affiliateCampaigns: AffiliateCampaign[] = [
  // IRISIMO - Šperky (VYSOKÁ RELEVANCE)
  {
    id: 'irisimo',
    name: 'Irisimo.cz',
    baseUrl: 'https://login.affial.com/scripts/8m338kc',
    aAid: '5d5a767017fee',
    aBid: '057d884e',
    category: 'jewelry',
    relevance: 'high',
    description: 'Luxusní šperky AMEN - náhrdelníky, náramky, přívěsky',
  },
  
  // FASHION & LIFESTYLE
  {
    id: 'answear',
    name: 'Answear.cz',
    baseUrl: 'https://www.answear.cz',
    aAid: '5d5a767017fee',
    aBid: '9b0f2a1e',
    category: 'fashion',
    relevance: 'medium',
    description: 'Módní oblečení a doplňky',
  },
  {
    id: 'astratex',
    name: 'Astratex.cz',
    baseUrl: 'https://www.astratex.cz',
    aAid: '5d5a767017fee',
    aBid: '8e7c3f4d',
    category: 'fashion',
    relevance: 'low',
    description: 'Spodní prádlo a pyžama',
  },
  {
    id: 'bonprix',
    name: 'Bonprix.cz',
    baseUrl: 'https://www.bonprix.cz',
    aAid: '5d5a767017fee',
    aBid: 'a4c7d9e2',
    category: 'fashion',
    relevance: 'low',
    description: 'Módní oblečení pro celou rodinu',
  },
  {
    id: 'designmagazin',
    name: 'DesignMagazin.cz',
    baseUrl: 'https://www.designmagazin.cz',
    aAid: '5d5a767017fee',
    aBid: 'e9f2a8d5',
    category: 'lifestyle',
    relevance: 'medium',
    description: 'Designové doplňky a dekorace',
  },
  {
    id: 'footshop',
    name: 'Footshop.cz',
    baseUrl: 'https://www.footshop.cz',
    aAid: '5d5a767017fee',
    aBid: 'c3e8b1f7',
    category: 'fashion',
    relevance: 'low',
    description: 'Sneakers a streetwear',
  },
  {
    id: 'glami',
    name: 'Glami.cz',
    baseUrl: 'https://www.glami.cz',
    aAid: '5d5a767017fee',
    aBid: 'f7a2c9d4',
    category: 'fashion',
    relevance: 'low',
    description: 'Srovnávač módy a oblečení',
  },
  {
    id: 'hm',
    name: 'HM.com',
    baseUrl: 'https://www2.hm.com',
    aAid: '5d5a767017fee',
    aBid: 'b8e4f1c6',
    category: 'fashion',
    relevance: 'low',
    description: 'Fast fashion oblečení',
  },
  {
    id: 'modivo',
    name: 'Modivo.cz',
    baseUrl: 'https://modivo.cz',
    aAid: '5d5a767017fee',
    aBid: 'd2f7a9c3',
    category: 'fashion',
    relevance: 'low',
    description: 'Prémiová móda a obuv',
  },
  {
    id: 'notino',
    name: 'Notino.cz',
    baseUrl: 'https://www.notino.cz',
    aAid: '5d5a767017fee',
    aBid: 'a9c3e7f2',
    category: 'wellness',
    relevance: 'medium',
    description: 'Parfémy a kosmetika',
  },
  {
    id: 'parfums',
    name: 'Parfums.cz',
    baseUrl: 'https://www.parfums.cz',
    aAid: '5d5a767017fee',
    aBid: 'e1f8c4a7',
    category: 'wellness',
    relevance: 'medium',
    description: 'Luxusní parfémy',
  },
  {
    id: 'vivantis',
    name: 'Vivantis.cz',
    baseUrl: 'https://www.vivantis.cz',
    aAid: '5d5a767017fee',
    aBid: 'c7a2f9d4',
    category: 'wellness',
    relevance: 'medium',
    description: 'Kosmetika a wellness',
  },
  
  // FOOD & BEVERAGE
  {
    id: 'cajovnacerny',
    name: 'CajovnaCerny.cz',
    baseUrl: 'https://www.cajovnacerny.cz',
    aAid: '5d5a767017fee',
    aBid: 'f3c8a1e7',
    category: 'food',
    relevance: 'high',
    description: 'Prémiové čaje - VYSOKÁ RELEVANCE pro Natálii',
  },
  {
    id: 'donuterie',
    name: 'Donuterie.cz',
    baseUrl: 'https://www.donuterie.cz',
    aAid: '5d5a767017fee',
    aBid: 'a7f2c9d3',
    category: 'food',
    relevance: 'medium',
    description: 'Donuty a sladkosti',
  },
  {
    id: 'rohlik',
    name: 'Rohlik.cz',
    baseUrl: 'https://www.rohlik.cz',
    aAid: '5d5a767017fee',
    aBid: 'e9a3f7c2',
    category: 'food',
    relevance: 'low',
    description: 'Online potraviny',
  },
  
  // OSTATNÍ
  {
    id: 'knihydobrovsky',
    name: 'KnihyDobrovsky.cz',
    baseUrl: 'https://www.knihydobrovsky.cz',
    aAid: '5d5a767017fee',
    aBid: 'c2f9a7e4',
    category: 'other',
    relevance: 'medium',
    description: 'Knihy o spiritualitě a osobním rozvoji',
  },
  {
    id: 'mall',
    name: 'Mall.cz',
    baseUrl: 'https://www.mall.cz',
    aAid: '5d5a767017fee',
    aBid: 'f7c3a9d2',
    category: 'other',
    relevance: 'low',
    description: 'Univerzální e-shop',
  },
];

/**
 * Generate affiliate link for any campaign
 */
export function generateCampaignLink(campaignId: string, targetUrl: string): string {
  const campaign = affiliateCampaigns.find(c => c.id === campaignId);
  if (!campaign) {
    throw new Error(`Campaign ${campaignId} not found`);
  }
  
  const encodedUrl = encodeURIComponent(targetUrl);
  return `${campaign.baseUrl}?a_aid=${campaign.aAid}&a_bid=${campaign.aBid}&url=${encodedUrl}`;
}

/**
 * Get campaigns by relevance for chatbot recommendations
 */
export function getRelevantCampaigns(relevance: 'high' | 'medium' | 'low' = 'high'): AffiliateCampaign[] {
  return affiliateCampaigns.filter(c => c.relevance === relevance);
}

/**
 * Get campaigns by category
 */
export function getCampaignsByCategory(category: AffiliateCampaign['category']): AffiliateCampaign[] {
  return affiliateCampaigns.filter(c => c.category === category);
}

/**
 * Chatbot context-aware recommendations
 * Vrací relevantní kampaně na základě kontextu konverzace
 */
export function getChatbotRecommendations(context: {
  topic?: 'jewelry' | 'wellness' | 'tea' | 'spirituality' | 'fashion';
  userInterest?: string[];
}): AffiliateCampaign[] {
  const { topic, userInterest = [] } = context;
  
  // Vysoká relevance kampaně podle tématu
  const topicMap: Record<string, string[]> = {
    jewelry: ['irisimo'],
    wellness: ['notino', 'parfums', 'vivantis'],
    tea: ['cajovnacerny'],
    spirituality: ['knihydobrovsky', 'cajovnacerny'],
    fashion: ['answear', 'modivo'],
  };
  
  if (topic && topicMap[topic]) {
    const campaignIds = topicMap[topic];
    return affiliateCampaigns.filter(c => campaignIds.includes(c.id));
  }
  
  // Fallback: vrať jen high relevance kampaně
  return getRelevantCampaigns('high');
}
