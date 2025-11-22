import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden">
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="relative z-10">
              {/* Placeholder for Natálie's photo */}
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-6xl">👤</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Fotografie Natálie Vachové
                    <br />
                    (bude nahrazena skutečnou fotografií)
                  </p>
                </div>
              </div>

              {/* Decorative element - product preview */}
              <div className="absolute -right-8 top-1/4 w-32 h-32 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🔺</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-6 text-center lg:text-left">
              <p className="font-semibold text-foreground">Natálie Vachová</p>
              <p className="text-sm text-muted-foreground">
                Zakladatelka Amulets.cz
              </p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                Otevřete své srdce
                <br />
                zázrakům
              </h1>
              <p className="text-lg text-muted-foreground">
                ...začněte s tím právě teď
              </p>
            </div>

            <Button size="lg" className="text-base px-8 py-6 rounded-lg">
              ZJISTIT VÍCE
            </Button>

            {/* Decorative golden symbol */}
            <div className="absolute bottom-8 right-8 w-24 h-24 opacity-20 hidden lg:block">
              <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-600">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="50" cy="50" r="5" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
