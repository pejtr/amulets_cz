import { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  permalink: string;
  timestamp: string;
  likes?: number;
  comments?: number;
}

/**
 * Instagram Feed Widget
 * Zobrazuje nejnovější příspěvky z Instagram účtu @amulets.cz
 * 
 * Pro produkční použití je potřeba:
 * 1. Instagram Business Account
 * 2. Facebook Developer App
 * 3. Instagram Basic Display API nebo Instagram Graph API
 * 4. Access Token s příslušnými oprávněními
 */
export default function InstagramFeed() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data pro development (nahradit skutečným API callem)
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      imageUrl: '/images/instagram/post1.webp',
      caption: '✨ Nová kolekce amuletů s křišťály právě dorazila! 💎',
      permalink: 'https://instagram.com/p/example1',
      timestamp: new Date().toISOString(),
      likes: 245,
      comments: 18,
    },
    {
      id: '2',
      imageUrl: '/images/instagram/post2.webp',
      caption: '🌙 Měsíční rituál s ametystem - jak na to? 🔮',
      permalink: 'https://instagram.com/p/example2',
      timestamp: new Date().toISOString(),
      likes: 189,
      comments: 12,
    },
    {
      id: '3',
      imageUrl: '/images/instagram/post3.webp',
      caption: '💜 Ruka Fatimy - symbol ochrany a štěstí ✋',
      permalink: 'https://instagram.com/p/example3',
      timestamp: new Date().toISOString(),
      likes: 312,
      comments: 24,
    },
    {
      id: '4',
      imageUrl: '/images/instagram/post4.webp',
      caption: '🌸 Jarní čištění energií - tipy a triky 🌿',
      permalink: 'https://instagram.com/p/example4',
      timestamp: new Date().toISOString(),
      likes: 156,
      comments: 9,
    },
  ];

  useEffect(() => {
    // Pro produkci: nahradit skutečným API callem
    // fetchInstagramPosts();
    
    // Mock data pro development
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 500);
  }, []);

  // Skutečná funkce pro načtení postů z Instagram API
  // const fetchInstagramPosts = async () => {
  //   try {
  //     const response = await fetch('/api/instagram/feed');
  //     const data = await response.json();
  //     setPosts(data.posts);
  //     setIsLoading(false);
  //   } catch (err) {
  //     setError('Nepodařilo se načíst Instagram příspěvky');
  //     setIsLoading(false);
  //   }
  // };

  if (error) {
    return null; // Tiše selhat - widget není kritický
  }

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Instagram className="w-8 h-8 text-pink-500" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {t('instagram.title', 'Sledujte nás na Instagramu')}
              </h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('instagram.subtitle', 'Inspirace, tipy a novinky ze světa amuletů a duchovního růstu')}
            </p>
            <a
              href="https://instagram.com/amulets.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-pink-500 hover:text-pink-600 font-semibold transition-colors"
            >
              @amulets.cz
              <span className="text-sm">→</span>
            </a>
          </motion.div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {posts.map((post, index) => (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Image */}
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-sm line-clamp-2 mb-2">{post.caption}</p>
                    <div className="flex items-center gap-4 text-xs">
                      {post.likes && (
                        <span className="flex items-center gap-1">
                          ❤️ {post.likes}
                        </span>
                      )}
                      {post.comments && (
                        <span className="flex items-center gap-1">
                          💬 {post.comments}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instagram icon overlay */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Instagram className="w-4 h-4 text-pink-500" />
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Follow CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="https://instagram.com/amulets.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Instagram className="w-5 h-5" />
            {t('instagram.followButton', 'Sledovat na Instagramu')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
