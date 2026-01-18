import { ExternalLink, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface AmenProduct {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  price: number;
  category: string;
  collection: string;
  material: string;
  availability: string;
  featured?: boolean;
}

interface AmenCategorySectionsProps {
  products: AmenProduct[];
}

export default function AmenCategorySections({ products }: AmenCategorySectionsProps) {
  // Rozdělení produktů podle kategorií a kolekcí
  const rosaryBracelets = products.filter(p => p.collection === 'Rosary' && p.category === 'naramek');
  const rosaryNecklaces = products.filter(p => p.collection === 'Rosary' && p.category === 'nahrdelnik');
  const loveBracelets = products.filter(p => p.collection === 'Love');
  const tennisBracelets = products.filter(p => p.collection === 'Tennis');
  const vitaChristiBracelets = products.filter(p => p.collection === 'Vita Christi et Mariae');
  const earrings = products.filter(p => p.category === 'nausnice');
  const rings = products.filter(p => p.category === 'prsten');
  const heartCollection = products.filter(p => p.collection === 'Heart');
  const angelsCollection = products.filter(p => p.collection === 'Angels');

  return (
    <div className="space-y-16">
      {/* Rosary Náramky */}
      {rosaryBracelets.length > 0 && (
        <CategorySection
          title="Náramky Rosary"
          subtitle="Růžencové náramky s duchovním významem"
          products={rosaryBracelets}
          icon={<Sparkles className="w-6 h-6" />}
        />
      )}

      {/* Rosary Náhrdelníky */}
      {rosaryNecklaces.length > 0 && (
        <CategorySection
          title="Náhrdelníky Rosary"
          subtitle="Elegantní růžencové náhrdelníky"
          products={rosaryNecklaces}
          icon={<Sparkles className="w-6 h-6" />}
        />
      )}

      {/* Love Kolekce */}
      {loveBracelets.length > 0 && (
        <CategorySection
          title="Kolekce LOVE"
          subtitle="Náramky s nápisem LOVE - symbol lásky a přátelství"
          products={loveBracelets}
          icon={<Heart className="w-6 h-6" />}
        />
      )}

      {/* Tennis Kolekce */}
      {tennisBracelets.length > 0 && (
        <CategorySection
          title="Tenisové náramky"
          subtitle="Luxusní tenisové náramky se zirkony"
          products={tennisBracelets}
          icon={<Sparkles className="w-6 h-6" />}
        />
      )}

      {/* Vita Christi et Mariae */}
      {vitaChristiBracelets.length > 0 && (
        <CategorySection
          title="Vita Christi et Mariae"
          subtitle="Náramky s medailonky Krista a Marie"
          products={vitaChristiBracelets}
          icon={<Sparkles className="w-6 h-6" />}
        />
      )}

      {/* Náušnice */}
      {earrings.length > 0 && (
        <CategorySection
          title="Náušnice AMEN"
          subtitle="Elegantní náušnice z různých kolekcí"
          products={earrings}
          icon={<Sparkles className="w-6 h-6" />}
        />
      )}

      {/* Prsteny */}
      {rings.length > 0 && (
        <CategorySection
          title="Prsteny AMEN"
          subtitle="Stříbrné a pozlacené prsteny"
          products={rings}
          icon={<Sparkles className="w-6 h-6" />}
        />
      )}

      {/* Heart Kolekce */}
      {heartCollection.length > 0 && (
        <CategorySection
          title="Kolekce Heart"
          subtitle="Šperky se srdíčky - symbol lásky"
          products={heartCollection}
          icon={<Heart className="w-6 h-6" />}
        />
      )}

      {/* Angels Kolekce */}
      {angelsCollection.length > 0 && (
        <CategorySection
          title="Kolekce Angels"
          subtitle="Šperky s anděly - ochrana a vedení"
          products={angelsCollection}
          icon={<Sparkles className="w-6 h-6" />}
        />
      )}
    </div>
  );
}

interface CategorySectionProps {
  title: string;
  subtitle: string;
  products: AmenProduct[];
  icon: React.ReactNode;
}

function CategorySection({ title, subtitle, products, icon }: CategorySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 4;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const visibleProducts = products.slice(
    currentIndex * productsPerPage,
    (currentIndex + 1) * productsPerPage
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="text-pink-500">{icon}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h2>
            <div className="text-pink-500">{icon}</div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="hover:bg-pink-50"
            >
              ← Předchozí
            </Button>
            <span className="text-sm text-gray-600">
              {currentIndex + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="hover:bg-pink-50"
            >
              Další →
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: AmenProduct;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {product.featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            ⭐ Bestseller
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Collection Badge */}
        <div className="inline-block">
          <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
            {product.collection}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary whitespace-nowrap">
            {product.price.toLocaleString('cs-CZ')} Kč
          </span>
        </div>

        {/* Availability */}
        <p className="text-xs text-muted-foreground">
          {product.availability === 'skladem' ? '✓ Skladem' : '○ Na objednávku'}
        </p>

        {/* Material */}
        <p className="text-xs text-gray-500 line-clamp-1">
          {product.material}
        </p>

        {/* CTA Button */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            Koupit na Irisimo
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
