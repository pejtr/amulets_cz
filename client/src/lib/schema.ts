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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "url": data.url,
    "datePublished": data.datePublished,
    "dateModified": data.dateModified,
    "image": data.image || "https://amulets.cz/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": "Natálie Ohorai",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Amulets.cz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://amulets.cz/logo.png",
      },
    },
  };
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
