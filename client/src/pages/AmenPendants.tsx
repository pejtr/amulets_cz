import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Filter, Search, ShoppingCart, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AmenPendant {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  purpose: string;
  description: string;
  affiliation: string;
  url: string;
}

export default function AmenPendants() {
  const [pendants, setPendants] = useState<AmenPendant[]>([]);
  const [filteredPendants, setFilteredPendants] = useState<AmenPendant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Mock data - v produkci by se načítalo z Irisimo API
  useEffect(() => {
    const mockPendants: AmenPendant[] = [
      {
        id: "1",
        name: "Privěsek AMEN Květina Života",
        price: 299,
        image: "https://via.placeholder.com/300x300?text=Kvĕtina+Života",
        category: "Geometrické",
        purpose: "Ochrana",
        description: "Posvátný symbol Květiny života pro duchovní ochranu",
        affiliation: "Irisimo.cz",
        url: "https://irisimo.cz",
      },
      {
        id: "2",
        name: "Privěsek AMEN Metatronova Krychle",
        price: 349,
        image: "https://via.placeholder.com/300x300?text=Metatronova+Krychle",
        category: "Geometrické",
        purpose: "Harmonie",
        description: "Energetická krychle pro vnitřní harmonii",
        affiliation: "Irisimo.cz",
        url: "https://irisimo.cz",
      },
      {
        id: "3",
        name: "Privěsek AMEN Vesica Piscis",
        price: 279,
        image: "https://via.placeholder.com/300x300?text=Vesica+Piscis",
        category: "Geometrické",
        purpose: "Láska",
        description: "Symbol lásky a spirituálního spojení",
        affiliation: "Irisimo.cz",
        url: "https://irisimo.cz",
      },
    ];
    setPendants(mockPendants);
    setFilteredPendants(mockPendants);
    setLoading(false);
  }, []);



  useEffect(() => {
    let filtered = pendants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Purpose filter
    if (selectedPurpose) {
      filtered = filtered.filter((p) => p.purpose === selectedPurpose);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    setFilteredPendants(filtered);
  }, [searchTerm, selectedCategory, selectedPurpose, priceRange, pendants]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (pendant: AmenPendant) => {
    window.open(pendant.url, "_blank");
    toast.success(`Přesměrování na ${pendant.affiliation}...`);
  };

  const categories = Array.from(new Set(pendants.map((p) => p.category)));
  const purposes = Array.from(new Set(pendants.map((p) => p.purpose)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-pink-50/50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privěsky AMEN
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Objevte naši kolekci autentických privěsků AMEN s posvátnou symbolikou.
            Každý kus je vybrán s péčí pro jeho energetické vlastnosti a spirituální
            účinek.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900">Filtry</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Hledat
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Název, účel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Kategorie
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === null
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Všechny
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Účel
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPurpose(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedPurpose === null
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Všechny
                  </button>
                  {purposes.map((purpose) => (
                    <button
                      key={purpose}
                      onClick={() => setSelectedPurpose(purpose)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedPurpose === purpose
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Cena: {priceRange[0]} - {priceRange[1]} Kč
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                  setSelectedPurpose(null);
                  setPriceRange([0, 5000]);
                }}
                variant="outline"
                className="w-full"
              >
                Resetovat filtry
              </Button>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-80 bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : filteredPendants.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">
                  Žádné privěsky neodpovídají vašim kritériím. Zkuste změnit filtry.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPendants.map((pendant) => (
                  <Card
                    key={pendant.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                      <img
                        src={pendant.image}
                        alt={pendant.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <button
                        onClick={() => toggleFavorite(pendant.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.includes(pendant.id)
                              ? "fill-pink-500 text-pink-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {pendant.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {pendant.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {pendant.description}
                      </p>

                      {/* Purpose Badge */}
                      <div className="mb-3">
                        <span className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded">
                          {pendant.purpose}
                        </span>
                      </div>

                      {/* Price & Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-purple-600">
                          {pendant.price} Kč
                        </span>
                        <Button
                          onClick={() => handleAddToCart(pendant)}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Koupit
                        </Button>
                      </div>

                      {/* Affiliation */}
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Prodejce: {pendant.affiliation}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="mt-8 text-center text-gray-600">
              <p>
                Zobrazeno <strong>{filteredPendants.length}</strong> z{" "}
                <strong>{pendants.length}</strong> privěsků
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
