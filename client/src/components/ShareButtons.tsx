import { Share2, Facebook, MessageCircle, Copy, Check, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const fullUrl = `https://amulets.cz${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing, opens profile
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-[#2C3E50]">
        <Share2 className="w-4 h-4" />
        <span>Sdílet článek</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Facebook */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open(shareLinks.facebook, '_blank', 'width=600,height=400')}
        >
          <Facebook className="w-4 h-4" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>

        {/* WhatsApp */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open(shareLinks.whatsapp, '_blank')}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </Button>

        {/* Instagram */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            // Instagram doesn't support direct URL sharing via web
            // Copy link to clipboard and show toast to share via Instagram app
            navigator.clipboard.writeText(fullUrl).then(() => {
              alert('Odkaz byl zkopírován! Otevřete Instagram a vložte odkaz do příběhu nebo příspěvku.');
            });
          }}
        >
          <Instagram className="w-4 h-4" />
          <span className="hidden sm:inline">Instagram</span>
        </Button>

        {/* Copy Link */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleCopyLink}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline text-green-600">Zkopírováno!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Kopírovat odkaz</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
