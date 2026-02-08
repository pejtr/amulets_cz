export function setOpenGraphTags(data: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  imageWidth?: string;
  imageHeight?: string;
  locale?: string;
  siteName?: string;
  twitterSite?: string;
  twitterCreator?: string;
}) {
  const defaultImage = "https://amulets.cz/og-image.jpg";
  const defaultSiteName = "Amulets.cz";
  const defaultLocale = "cs_CZ";
  const defaultTwitterSite = "@amulets_cz";
  const defaultTwitterCreator = "@natalie_ohorai";

  // Open Graph - Basic
  setMetaTag("og:title", data.title);
  setMetaTag("og:description", data.description);
  setMetaTag("og:url", data.url);
  setMetaTag("og:type", data.type || "website");
  setMetaTag("og:site_name", data.siteName || defaultSiteName);
  setMetaTag("og:locale", data.locale || defaultLocale);

  // Open Graph - Image
  const imageUrl = data.image || defaultImage;
  setMetaTag("og:image", imageUrl);
  setMetaTag("og:image:alt", data.title);
  
  if (data.imageWidth) {
    setMetaTag("og:image:width", data.imageWidth);
  }
  if (data.imageHeight) {
    setMetaTag("og:image:height", data.imageHeight);
  }

  // Twitter Card
  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", data.title);
  setMetaTag("twitter:description", data.description);
  setMetaTag("twitter:image", imageUrl);
  setMetaTag("twitter:image:alt", data.title);
  setMetaTag("twitter:site", data.twitterSite || defaultTwitterSite);
  setMetaTag("twitter:creator", data.twitterCreator || defaultTwitterCreator);

  // Update document title
  document.title = data.title;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute("content", data.description);
}

/**
 * Set dynamic hreflang tags for the current page.
 * Call this in page components to update hreflang links based on current route.
 */
export function setHreflangTags(path: string) {
  const baseUrl = "https://amulets.cz";
  const languages = [
    { lang: "cs", href: `${baseUrl}${path}` },
    { lang: "en", href: `${baseUrl}${path}${path.includes("?") ? "&" : "?"}lang=en` },
    { lang: "it", href: `${baseUrl}${path}${path.includes("?") ? "&" : "?"}lang=it` },
    { lang: "x-default", href: `${baseUrl}${path}` },
  ];

  // Remove existing hreflang links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

  // Add new hreflang links
  for (const { lang, href } of languages) {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", lang);
    link.setAttribute("href", href);
    document.head.appendChild(link);
  }
}

function setMetaTag(property: string, content: string) {
  const isOg = property.startsWith("og:");
  const attr = isOg ? "property" : "name";
  
  let meta = document.querySelector(`meta[${attr}="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}
