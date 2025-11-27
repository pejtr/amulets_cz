import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Hero background image */}
      <div className="relative w-full min-h-[400px] md:min-h-[500px]">
        <img
          src="/hero-natalie-bg.jpg"
          alt="Natálie Vachová - Zakladatelka Amulets.cz"
          className="w-full h-full object-cover"
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left side - space for photo */}
              <div className="hidden lg:block" />

              {/* Right side - Text content */}
              <div className="relative space-y-6 px-4 py-8 lg:py-16">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2C3E50] leading-tight">
                    Otevřete své srdce zázrakům
                  </h1>
                  <p className="text-lg md:text-xl text-[#2C3E50]/80">
                    ...začněte s tím právě teď
                  </p>
                </div>

                <Button
                  size="lg"
                  className="bg-[#E85A9F] hover:bg-[#E85A9F]/90 text-white px-8 py-6 text-base md:text-lg font-semibold rounded-md shadow-lg"
                >
                  ZÍSKAT VÍCE
                </Button>

                {/* Signature - positioned at bottom left of photo area */}
                <div className="absolute bottom-8 left-4 lg:left-[-50%] text-sm text-[#2C3E50]/70">
                  <p className="font-semibold">Natálie Vachová</p>
                  <p className="italic">Zakladatelka Amulets.cz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
