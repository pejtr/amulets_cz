import { useEffect } from "react";

interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url: string;
  };
  url: string;
}

export default function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: ArticleSchemaProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: description,
      image: `https://amulets.cz${image}`,
      datePublished: datePublished,
      dateModified: dateModified,
      author: {
        "@type": "Organization",
        name: author.name,
        url: author.url,
      },
      publisher: {
        "@type": "Organization",
        name: "Amulets.cz",
        url: "https://amulets.cz",
        logo: {
          "@type": "ImageObject",
          url: "https://amulets.cz/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = "article-schema";
    
    // Remove existing schema if present
    const existing = document.getElementById("article-schema");
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("article-schema");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, image, datePublished, dateModified, author, url]);

  return null;
}
