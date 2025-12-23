export function setSchemaMarkup(schema: object | object[]) {
  // Odstraníme existující schema markup
  const existing = document.querySelectorAll('script[type="application/ld+json"][data-schema="true"]');
  existing.forEach(el => el.remove());

  // Vytvoříme nový script tag
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema', 'true');
  script.text = JSON.stringify(Array.isArray(schema) ? schema : [schema]);
  document.head.appendChild(script);
}

export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

export function createArticleSchema(data: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  articleSection?: string;
  keywords?: string[];
  wordCount?: number;
  articleType?: 'Article' | 'BlogPosting' | 'NewsArticle';
  about?: string;
  mentions?: string[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": data.articleType || "Article",
    "headline": data.title.substring(0, 110), // Google recommends max 110 chars
    "name": data.title,
    "description": data.description,
    "url": data.url,
    "datePublished": data.datePublished,
    "dateModified": data.dateModified,
    "image": {
      "@type": "ImageObject",
      "url": data.image || "https://amulets.cz/og-image.jpg",
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": "Natálie Ohorai",
      "url": "https://amulets.cz/o-nas",
      "jobTitle": "Zakladatelka Amulets.cz",
      "sameAs": [
        "https://www.ohorai.cz"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Amulets.cz",
      "url": "https://amulets.cz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://amulets.cz/logo.png",
        "width": 200,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    },
    "inLanguage": "cs-CZ",
    "isAccessibleForFree": true,
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Amulets.cz"
    }
  };

  // Add optional fields if provided
  if (data.articleSection) {
    schema.articleSection = data.articleSection;
  }
  if (data.keywords && data.keywords.length > 0) {
    schema.keywords = data.keywords.join(", ");
  }
  if (data.wordCount) {
    schema.wordCount = data.wordCount;
  }
  if (data.about) {
    schema.about = {
      "@type": "Thing",
      "name": data.about
    };
  }
  if (data.mentions && data.mentions.length > 0) {
    schema.mentions = data.mentions.map(mention => ({
      "@type": "Thing",
      "name": mention
    }));
  }

  return schema;
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Amulets.cz",
    "url": "https://amulets.cz",
    "description": "Ručně vyráběné orgonitové pyramidy s drahými krystaly a modrým lotosem. Aromaterapeutické esence ze 100% esenciálních olejů nejvyšší kvality.",
  };
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Amulets.cz",
    "url": "https://amulets.cz",
    "logo": "https://amulets.cz/logo.png",
    "description": "Ručně vyráběné orgonitové pyramidy a aromaterapeutické esence",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+420-774-091-740",
      "contactType": "Customer Service",
      "email": "info@amulets.cz",
    },
    "sameAs": [
      "https://instagram.com/amulets.cz",
    ],
  };
}

export function createFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function createProductSchema(data: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  url: string;
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "image": data.image,
    "url": data.url,
    "brand": {
      "@type": "Brand",
      "name": "OHORAI"
    },
    "offers": {
      "@type": "Offer",
      "price": data.price.replace(/[^\d]/g, ''),
      "priceCurrency": data.currency || "CZK",
      "availability": data.availability || "https://schema.org/InStock",
      "url": data.url,
      "seller": {
        "@type": "Organization",
        "name": "OHORAI"
      }
    }
  };

  // Add aggregate rating if available
  if (data.rating !== undefined && data.reviewCount !== undefined) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": data.rating.toString(),
      "reviewCount": data.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return schema;
}


export function createHowToSchema(data: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration format, e.g., "PT30M" for 30 minutes
  estimatedCost?: { currency: string; value: string };
  supply?: string[];
  tool?: string[];
  steps: { name: string; text: string; image?: string; url?: string }[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": data.name,
    "description": data.description,
    "step": data.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image }),
      ...(step.url && { "url": step.url })
    }))
  };

  if (data.image) {
    schema.image = {
      "@type": "ImageObject",
      "url": data.image
    };
  }

  if (data.totalTime) {
    schema.totalTime = data.totalTime;
  }

  if (data.estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      "currency": data.estimatedCost.currency,
      "value": data.estimatedCost.value
    };
  }

  if (data.supply && data.supply.length > 0) {
    schema.supply = data.supply.map(item => ({
      "@type": "HowToSupply",
      "name": item
    }));
  }

  if (data.tool && data.tool.length > 0) {
    schema.tool = data.tool.map(item => ({
      "@type": "HowToTool",
      "name": item
    }));
  }

  return schema;
}
