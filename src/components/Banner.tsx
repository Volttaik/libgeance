"use client";

export default function Banner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-20">
      <div className="relative rounded-3xl overflow-hidden bg-foreground shadow-lifted">

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 border border-white/5 rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/3 rounded-full" />
          {/* Diamond watermark background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.07]">
            <svg width="500" height="660" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
              <polygon points="150,15 65,108 235,108" fill="white"/>
              <polygon points="150,15 5,195 65,108" fill="white"/>
              <polygon points="150,15 235,108 295,195" fill="white"/>
              <polygon points="65,108 5,195 150,195" fill="white"/>
              <polygon points="235,108 150,195 295,195" fill="white"/>
              <polygon points="5,195 150,395 150,195" fill="white"/>
              <polygon points="150,195 150,395 295,195" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="relative z-10 px-8 py-14 sm:px-14 flex flex-col sm:flex-row items-center justify-between gap-10">

          {/* Diamond SVG + Text */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 anim-fade-up">

            {/* Diamond */}
            <div className="flex-shrink-0" style={{ filter: "drop-shadow(0 4px 24px rgba(255,255,255,0.25))" }}>
              <svg
                width="72"
                height="96"
                viewBox="0 0 300 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="bn-table" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
                    <stop offset="100%" stopColor="#cccccc" stopOpacity="0.85"/>
                  </linearGradient>
                  <linearGradient id="bn-lc" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dddddd" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#aaaaaa" stopOpacity="0.8"/>
                  </linearGradient>
                  <linearGradient id="bn-rc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#888888" stopOpacity="0.85"/>
                    <stop offset="100%" stopColor="#555555" stopOpacity="0.75"/>
                  </linearGradient>
                  <linearGradient id="bn-llc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#cccccc" stopOpacity="0.6"/>
                  </linearGradient>
                  <linearGradient id="bn-lrc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#999999" stopOpacity="0.75"/>
                    <stop offset="100%" stopColor="#666666" stopOpacity="0.65"/>
                  </linearGradient>
                  <linearGradient id="bn-pl" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#eeeeee" stopOpacity="0.65"/>
                    <stop offset="100%" stopColor="#bbbbbb" stopOpacity="0.55"/>
                  </linearGradient>
                  <linearGradient id="bn-pr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#888888" stopOpacity="0.65"/>
                    <stop offset="100%" stopColor="#555555" stopOpacity="0.5"/>
                  </linearGradient>
                </defs>
                <polygon points="150,15 65,108 235,108" fill="url(#bn-table)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
                <polygon points="150,15 5,195 65,108" fill="url(#bn-lc)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/>
                <polygon points="150,15 235,108 295,195" fill="url(#bn-rc)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
                <polygon points="65,108 5,195 150,195" fill="url(#bn-llc)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <polygon points="235,108 150,195 295,195" fill="url(#bn-lrc)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                <polygon points="5,195 150,395 150,195" fill="url(#bn-pl)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                <polygon points="150,195 150,395 295,195" fill="url(#bn-pr)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <polyline points="150,15 295,195 150,395" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="150" y1="15" x2="235" y2="108" stroke="rgba(255,255,255,0.65)" strokeWidth="2"/>
                <polygon points="150,15 295,195 150,395 5,195" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
              </svg>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <p className="text-white/40 text-[10px] font-semibold tracking-[0.3em] uppercase">
                Quality · Comfort · Style
              </p>
              <h2 className="font-display leading-tight text-white">
                <span className="block font-light italic text-3xl sm:text-4xl">Crafted for</span>
                <span className="block font-bold text-3xl sm:text-4xl">Real Life.</span>
              </h2>
              <div className="h-px bg-white/15 w-10 mx-auto sm:mx-0" />
              <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                Every piece is built with premium fabric and thoughtful design — so you feel as good as you look, all day long.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="relative z-10 flex-shrink-0 anim-fade-up delay-200">
            <a
              href="#products"
              className="inline-flex items-center bg-white text-foreground px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-sm"
            >
              Explore Crafted Pieces
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
