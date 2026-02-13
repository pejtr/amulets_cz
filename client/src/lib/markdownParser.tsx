import React from 'react';

/**
 * Parse markdown text and extract headings for Table of Contents
 */
export function extractHeadings(content: string): { id: string; title: string; level: number }[] {
  const headings: { id: string; title: string; level: number }[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // H2 with ## syntax
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^## /, '').replace(/\*\*/g, '');
      const id = generateSlug(title);
      headings.push({ id, title, level: 2 });
    }
    // H3 with ### syntax
    else if (trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^### /, '').replace(/\*\*/g, '');
      const id = generateSlug(title);
      headings.push({ id, title, level: 3 });
    }
    // H2 with ** syntax (legacy)
    else if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('.') && trimmed.length < 100) {
      const title = trimmed.replace(/\*\*/g, '');
      const id = generateSlug(title);
      headings.push({ id, title, level: 2 });
    }
  }
  
  return headings;
}

/**
 * Generate URL-friendly slug from text
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Parse inline markdown elements (bold, links, images)
 */
export function parseInlineMarkdown(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;
  
  while (remaining.length > 0) {
    // Check for image: ![alt](url)
    const imageMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      const [fullMatch, alt, url] = imageMatch;
      elements.push(
        <img
          key={`img-${keyIndex++}`}
          src={url}
          alt={alt}
          loading="lazy"
          className="rounded-lg shadow-md my-4 max-w-full h-auto"
        />
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }
    
    // Check for link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [fullMatch, linkText, url] = linkMatch;
      const isExternal = url.startsWith('http');
      elements.push(
        <a
          key={`link-${keyIndex++}`}
          href={url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-[#D4AF37] hover:underline font-medium"
        >
          {linkText}
        </a>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }
    
    // Check for bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      const [fullMatch, boldText] = boldMatch;
      elements.push(
        <strong key={`bold-${keyIndex++}`} className="text-foreground font-semibold">
          {boldText}
        </strong>
      );
      remaining = remaining.slice(fullMatch.length);
      continue;
    }
    
    // Find the next special character
    const nextSpecialIndex = remaining.search(/\[|\*\*|!\[/);
    if (nextSpecialIndex === -1) {
      // No more special characters, add the rest as text
      elements.push(remaining);
      break;
    } else if (nextSpecialIndex === 0) {
      // Special character at start but didn't match - add one character and continue
      elements.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      // Add text before the next special character
      elements.push(remaining.slice(0, nextSpecialIndex));
      remaining = remaining.slice(nextSpecialIndex);
    }
  }
  
  return elements;
}

/**
 * Table of Contents component
 */
interface TOCProps {
  headings: { id: string; title: string; level: number }[];
}

export function TableOfContents({ headings }: TOCProps) {
  if (headings.length < 2) return null;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };
  
  return (
    <nav className="bg-accent/10 rounded-lg p-6 mb-8 border border-accent/20">
      <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Obsah článku
      </h2>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li 
            key={index} 
            className={heading.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className="text-muted-foreground hover:text-[#D4AF37] transition-colors flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 group-hover:bg-[#D4AF37] transition-colors" />
              <span className={heading.level === 3 ? 'text-sm' : ''}>
                {heading.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Render a single paragraph with full markdown support
 */
interface RenderParagraphProps {
  paragraph: string;
  index: number;
}

export function renderParagraph({ paragraph, index }: RenderParagraphProps): React.ReactNode {
  const trimmed = paragraph.trim();
  
  // H2 with ## syntax
  if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
    const title = trimmed.replace(/^## /, '').replace(/\*\*/g, '');
    const id = generateSlug(title);
    return (
      <h2 key={index} id={id} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-foreground scroll-mt-24">
        {title}
      </h2>
    );
  }

  // H3 with ### syntax
  if (trimmed.startsWith('### ')) {
    const title = trimmed.replace(/^### /, '').replace(/\*\*/g, '');
    const id = generateSlug(title);
    return (
      <h3 key={index} id={id} className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-foreground scroll-mt-24">
        {title}
      </h3>
    );
  }

  // H2 with ** syntax (legacy)
  if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('.') && trimmed.length < 100) {
    const title = trimmed.replace(/\*\*/g, '');
    const id = generateSlug(title);
    return (
      <h2 key={index} id={id} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-foreground scroll-mt-24">
        {title}
      </h2>
    );
  }
  
  // Standalone image
  const imageOnlyMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (imageOnlyMatch) {
    const [, alt, url] = imageOnlyMatch;
    return (
      <figure key={index} className="my-8">
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="rounded-lg shadow-lg w-full max-w-2xl mx-auto"
        />
        {alt && (
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  }
  
  // List with bullet points
  if (paragraph.includes('\n-')) {
    const lines = paragraph.split('\n');
    const heading = lines[0];
    const items = lines.filter(line => line.trim().startsWith('-'));
    
    return (
      <div key={index} className="my-6">
        {heading && !heading.startsWith('-') && (
          <p className="font-semibold text-foreground mb-3">
            {parseInlineMarkdown(heading.replace(/\*\*/g, ''))}
          </p>
        )}
        <ul className="list-none space-y-2">
          {items.map((item, i) => {
            const text = item.replace(/^-\s*/, '');
            return (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#D4AF37] mt-1 text-xl">•</span>
                <span className="text-muted-foreground flex-1">
                  {parseInlineMarkdown(text)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Numbered list
  if (paragraph.match(/^\d+\./m)) {
    const lines = paragraph.split('\n');
    const items = lines.filter(line => /^\d+\./.test(line.trim()));
    
    return (
      <ol key={index} className="list-none space-y-3 my-6">
        {items.map((item, i) => {
          const text = item.replace(/^\d+\.\s*/, '');
          return (
            <li key={i} className="flex items-start gap-3">
              <span className="text-[#D4AF37] font-bold min-w-[24px]">{i + 1}.</span>
              <span className="text-muted-foreground flex-1">
                {parseInlineMarkdown(text)}
              </span>
            </li>
          );
        })}
      </ol>
    );
  }

  // Blockquote with > syntax
  if (trimmed.startsWith('> ')) {
    const quoteText = trimmed.replace(/^> /, '');
    return (
      <blockquote key={index} className="border-l-4 border-[#D4AF37] pl-6 py-2 my-6 italic text-muted-foreground bg-accent/5 rounded-r-lg">
        <p className="text-lg">
          {parseInlineMarkdown(quoteText)}
        </p>
      </blockquote>
    );
  }

  // Normal paragraph with inline markdown support
  return (
    <p key={index} className="text-muted-foreground leading-relaxed mb-6 text-lg">
      {parseInlineMarkdown(paragraph)}
    </p>
  );
}

/**
 * Full markdown content renderer with TOC
 */
interface MarkdownContentProps {
  content: string;
  showTOC?: boolean;
}

export function MarkdownContent({ content, showTOC = true }: MarkdownContentProps) {
  const headings = extractHeadings(content);
  const paragraphs = content.split('\n\n');
  
  return (
    <div className="prose prose-lg max-w-none">
      {showTOC && <TableOfContents headings={headings} />}
      {paragraphs.map((paragraph, index) => renderParagraph({ paragraph, index }))}
    </div>
  );
}
