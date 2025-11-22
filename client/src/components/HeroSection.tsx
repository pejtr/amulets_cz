import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-pink-50 via-pink-100/50 to-blue-50 overflow-hidden">
      {/* Background texture - white brick wall effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[600px] py-12">
          {/* Left side - Image with decorative elements */}
          <div className="relative flex items-center justify-center">
            {/* Main card with photo */}
            <div className="relative bg-gradient-to-br from-pink-200/60 to-pink-100/40 rounded-3xl p-8 shadow-2xl backdrop-blur-sm max-w-md">
              {/* Decorative pyramid icon */}
              <div className="absolute -top-6 right-12 bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-4xl">🔺</div>
              </div>

              {/* Photo placeholder */}
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-pink-200 to-blue-200 flex items-center justify-center overflow-hidden">
                  <div className="text-6xl">👤</div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4 italic">
                  Fotografie Natálie Vachové
                  <br />
                  (bude nahrazena skutečnou fotografií)
                </p>
              </div>

              {/* Signature */}
              <div className="text-center">
                <p className="font-semibold text-foreground">Natálie Vachová</p>
                <p className="text-sm text-muted-foreground">
                  Zakladatelka Amulets.cz
                </p>
              </div>
            </div>

            {/* Decorative circle in background */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-pink-200/30 to-transparent blur-2xl" />
          </div>

          {/* Right side - Content */}
          <div className="relative space-y-6 lg:pl-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Otevřete své srdce zázrakům
              </h1>
              <p className="text-lg text-muted-foreground">
                ...začněte s tím právě teď
              </p>
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
            >
              ZJISTIT VÍCE
            </Button>

            {/* Golden flower of life symbol */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-32 h-32 opacity-40 hidden xl:block">
              <img
                src="/flower-of-life-gold.png"
                alt="Flower of Life"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
