/**
 * OHORAI Banner - Horizontální banner nad footerem
 * 
 * Propaguje OHORAI.cz - autorský e-shop Natálie s:
 * - 100% čistými aromaterapeutickými esencemi
 * - Ručně vyráběnými produkty s modrým lotosem
 * - Muzikoterapií
 */
export default function OhoraiBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-purple-900/95 to-pink-900/95">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/ohorai-banner.png"
          alt="OHORAI - Natálie s esencí modrého lotosu"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-900/60 to-purple-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left side - Text content */}
          <div className="text-white space-y-6 text-center lg:text-left">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <img
                src="/ohorai-logo.webp"
                alt="OHORAI"
                className="h-12 md:h-16 w-auto drop-shadow-2xl"
              />
            </div>

            {/* Main heading with text image */}
            <div className="space-y-4">
              <img
                src="/ohorai-text.png"
                alt="Vůně, která vám rozzáří život - 100% čisté aromaterapeutické esence, ruční tvorba & muzikoterapie"
                className="w-full max-w-2xl mx-auto lg:mx-0 drop-shadow-2xl"
              />
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Objevte autorský e-shop Natálie s{" "}
              <span className="font-bold text-yellow-300">
                ručně vyráběnými produkty
              </span>
              : čisté aromaterapeutické esence, posvátný modrý lotos, křišťálové
              nástroje a muzikoterapie.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <a
                href="https://ohorai.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 font-bold text-lg px-8 py-4 rounded-full transition-all shadow-2xl hover:shadow-yellow-500/50 hover:scale-105 group"
              >
                <span>Prohlédnout kolekci</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>100% čisté esence</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Ruční výroba</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Modrý lotos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Muzikoterapie</span>
              </div>
            </div>
          </div>

          {/* Right side - Video */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Video container with phone-like aspect ratio */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400/30">
                <video
                  src="/ohorai-promo.mp4"
                  className="w-full h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
