"use client";

export default function Hero() {
  return (
    <section className="relative pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-10 pb-16 flex flex-col gap-8">

        {/* Main row: image + brand text */}
        <div className="flex flex-row items-stretch gap-6 sm:gap-10">

          {/* Image card */}
          <div className="anim-slide-left delay-200 flex-shrink-0 w-[155px] sm:w-[200px] lg:w-[250px]">
            <div className="relative rounded-2xl overflow-hidden shadow-lifted aspect-[3/4]">
              <img
                src="/collection-hero.jpg"
                alt="Libgeance Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Brand text block */}
          <div className="flex flex-col justify-center gap-3">

            {/* "Welcome to" line */}
            <p className="anim-fade-up delay-200 text-[10px] font-medium text-foreground/40 tracking-[0.22em] uppercase">
              Welcome to
            </p>

            {/* "Libgeance" — unified font, large */}
            <h1
              className="anim-fade-up delay-300 font-display font-bold text-foreground leading-none"
              style={{ fontSize: "clamp(3.2rem, 11vw, 6rem)", letterSpacing: "-0.03em" }}
            >
              Libgeance
            </h1>

            {/* Divider */}
            <div
              className="anim-expand delay-500 h-px bg-foreground/20 w-10"
              style={{ transformOrigin: "left" }}
            />

            {/* Tagline */}
            <p className="anim-fade-up delay-400 font-display italic text-foreground/55 text-sm sm:text-base leading-snug">
              Wear your story.
            </p>

          </div>
        </div>

        {/* CTA Buttons */}
        <div className="anim-fade-up delay-600 flex flex-wrap gap-3">
          <a
            href="#products"
            className="inline-flex items-center bg-foreground text-background px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-foreground/85 transition-colors shadow-soft"
          >
            Shop Best Prices
          </a>
        </div>

      </div>
    </section>
  );
}
