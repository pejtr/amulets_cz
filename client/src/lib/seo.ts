export function setOpenGraphTags(data: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
}) {
  const defaultImage = "https://amulets.cz/og-image.jpg";
  const siteName = "Amulets.cz";

  // Title
  setMetaTag("og:title", data.title);
  setMetaTag("twitter:title", data.title);

  // Description
  setMetaTag("og:description", data.description);
  setMetaTag("twitter:description", data.description);

  // URL
  setMetaTag("og:url", data.url);

  // Image
  setMetaTag("og:image", data.image || defaultImage);
  setMetaTag("twitter:image", data.image || defaultImage);

  // Type
  setMetaTag("og:type", data.type || "website");

  // Site name
  setMetaTag("og:site_name", siteName);

  // Twitter card
  setMetaTag("twitter:card", "summary_large_image");
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
