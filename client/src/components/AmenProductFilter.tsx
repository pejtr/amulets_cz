import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
}

interface AmenProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
  availableCategories: string[];
  minPrice: number;
  maxPrice: number;
}

export default function AmenProductFilter({
  onFilterChange,
  availableCategories,
  minPrice,
  maxPrice,
}: AmenProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onFilterChange({
      categories: newCategories,
      priceRange,
    });
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    onFilterChange({
      categories: selectedCategories,
      priceRange: newRange,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    onFilterChange({
      categories: [],
      priceRange: [minPrice, maxPrice],
    });
  };

  const activeFiltersCount = selectedCategories.length + 
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Filter toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full md:w-auto flex items-center gap-2 bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filtrovat produkty</span>
        {activeFiltersCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filter panel */}
      {isOpen && (
        <div className="mt-4 p-6 bg-white rounded-lg shadow-lg border-2 border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtry</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Categories filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Kategorie</h4>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategories.includes(category)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Cenové rozpětí</h4>
            <div className="px-2">
              <Slider
                min={minPrice}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="font-medium">{priceRange[0].toLocaleString('cs-CZ')} Kč</span>
                <span className="text-gray-400">—</span>
                <span className="font-medium">{priceRange[1].toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>
          </div>

          {/* Clear filters button */}
          {activeFiltersCount > 0 && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              Vymazat filtry
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
