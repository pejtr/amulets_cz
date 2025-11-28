import { symbolsData, stonesData, purposesData } from "@/data/guideContent";
import { magazineArticles } from "@/data/magazineContent";

interface Article {
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  category: string;
}

export function getRelatedGuideArticles(currentSlug: string, limit: number = 3): Article[] {
  // Kombinujeme všechny průvodce články
  const allGuideArticles = [
    ...symbolsData.map(item => ({
      title: item.title,
      slug: item.slug,
      image: item.image,
      excerpt: item.metaDescription,
      category: 'guide' as const,
    })),
    ...stonesData.map(item => ({
      title: item.title,
      slug: item.slug,
      image: item.image,
      excerpt: item.metaDescription,
      category: 'guide' as const,
    })),
    ...purposesData.map(item => ({
      title: item.title,
      slug: item.slug,
      image: item.image,
      excerpt: item.metaDescription,
      category: 'guide' as const,
    })),
  ];

  // Odfiltrujeme aktuální článek
  const filtered = allGuideArticles.filter(article => article.slug !== currentSlug);
  
  // Náhodně vybereme články
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, limit);
}

export function getRelatedMagazineArticles(currentSlug: string, limit: number = 3): Article[] {
  // Odfiltrujeme aktuální článek
  const filtered = magazineArticles
    .filter(article => article.slug !== currentSlug)
    .map(article => ({
      title: article.title,
      slug: article.slug,
      image: article.image || '/images/magazine-placeholder.jpg',
      excerpt: article.excerpt,
      category: 'magazine' as const,
    }));
  
  // Náhodně vybereme články
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, limit);
}

export function getMixedRelatedArticles(currentSlug: string, currentCategory: 'guide' | 'magazine', limit: number = 3): Article[] {
  if (currentCategory === 'guide') {
    // Pro průvodce: 2 průvodce + 1 magazín
    const guideArticles = getRelatedGuideArticles(currentSlug, 2);
    const magazineArticles = getRelatedMagazineArticles('', 1);
    return [...guideArticles, ...magazineArticles].slice(0, limit);
  } else {
    // Pro magazín: 2 magazín + 1 průvodce
    const magazineArticles = getRelatedMagazineArticles(currentSlug, 2);
    const guideArticles = getRelatedGuideArticles('', 1);
    return [...magazineArticles, ...guideArticles].slice(0, limit);
  }
}
