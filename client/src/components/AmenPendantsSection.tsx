import { trpc } from "@/lib/trpc";
import { ExternalLink, Loader2, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AmenPendantsSection() {
  const { data: pendants, isLoading, error } = trpc.irisimo.getAmenPendants.useQuery();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !pendants || pendants.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm">
            Affiliate Partner
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Přívěšky AMEN
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Objevte kolekci elegantních přívěšků AMEN - italský design spojený s duchovní symbolikou.
            Každý kousek je vyroben s láskou a pozorností k detailu.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pendants.map((pendant) => (
            <Card key={pendant.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={pendant.imageUrl}
                    alt={pendant.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Affiliate Badge */}
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 text-xs"
                  >
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Irisimo.cz
                  </Badge>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                    {pendant.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {pendant.priceVat} Kč
                    </span>
                  </div>

                  {/* Availability */}
                  <p className="text-xs text-muted-foreground">
                    {pendant.availability}
                  </p>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className="w-full mt-4"
                    variant="default"
                  >
                    <a
                      href={pendant.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="flex items-center justify-center gap-2"
                    >
                      Zobrazit na Irisimo.cz
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            * Produkty jsou dostupné na Irisimo.cz. Amulets.cz může získat provizi z prodeje.
          </p>
        </div>
      </div>
    </section>
  );
}
