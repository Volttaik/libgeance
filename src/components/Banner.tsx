"use client";

export default function Banner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-20">
      <div className="relative rounded-3xl overflow-hidden px-8 py-14 sm:px-16 flex flex-col sm:flex-row items-center justify-between gap-8 bg-foreground shadow-lifted">
        {/* Decorative diagonal lines — matching background motif */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 border border-white/5 rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/3 rounded-full" />
        </div>

        <div className="relative z-10 anim-fade-up">
          <p className="text-white/40 text-[10px] font-semibold tracking-[0.25em] uppercase mb-3">Quality · Comfort · Style</p>
          <h2 className="font-display leading-tight text-white">
            <span className="block font-light italic text-3xl sm:text-4xl">Crafted for</span>
            <span className="block font-bold text-3xl sm:text-4xl">Real Life.</span>
          </h2>
          <p className="text-white/50 mt-4 text-sm max-w-xs leading-relaxed">
            Every piece is built with premium fabric and thoughtful design — so you feel as good as you look, all day long.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0 anim-fade-up delay-200">
          <a href="#products" className="inline-flex items-center bg-white text-foreground px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-sm">
            Explore Crafted Pieces
          </a>
        </div>
      </div>
    </section>
  );
}
