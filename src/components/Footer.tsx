import { Instagram, Twitter, Youtube } from "lucide-react";

const socials = [
  { label: "@libgeance", handle: "Instagram", icon: Instagram, href: "#" },
  { label: "@libgeance", handle: "Twitter / X", icon: Twitter, href: "#" },
  { label: "Libgeance", handle: "YouTube", icon: Youtube, href: "#" },
];

const links = ["About", "Sustainability", "Careers", "Press", "Privacy", "Terms"];

export default function Footer() {
  return (
    <footer className="border-t border-black/6 bg-white/80 backdrop-blur-sm shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex flex-col items-center text-center gap-8">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.18))" }}>
            <svg width="24" height="32" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="fl-table" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3a3a3a"/><stop offset="100%" stopColor="#1a1a1a"/></linearGradient>
                <linearGradient id="fl-lc" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6a6a6a"/><stop offset="100%" stopColor="#4a4a4a"/></linearGradient>
                <linearGradient id="fl-rc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#121212"/><stop offset="100%" stopColor="#0a0a0a"/></linearGradient>
                <linearGradient id="fl-llc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#888888"/><stop offset="100%" stopColor="#666666"/></linearGradient>
                <linearGradient id="fl-lrc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#444444"/><stop offset="100%" stopColor="#2a2a2a"/></linearGradient>
                <linearGradient id="fl-pl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#aaaaaa"/><stop offset="100%" stopColor="#888888"/></linearGradient>
                <linearGradient id="fl-pr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#555555"/><stop offset="100%" stopColor="#333333"/></linearGradient>
              </defs>
              <polygon points="150,15 65,108 235,108" fill="url(#fl-table)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
              <polygon points="150,15 5,195 65,108" fill="url(#fl-lc)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
              <polygon points="150,15 235,108 295,195" fill="url(#fl-rc)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
              <polygon points="65,108 5,195 150,195" fill="url(#fl-llc)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
              <polygon points="235,108 150,195 295,195" fill="url(#fl-lrc)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
              <polygon points="5,195 150,395 150,195" fill="url(#fl-pl)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
              <polygon points="150,195 150,395 295,195" fill="url(#fl-pr)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
              <polyline points="150,15 295,195 150,395" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="150" y1="15" x2="235" y2="108" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4"/>
              <polygon points="150,15 295,195 150,395 5,195" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"/>
            </svg>
          </div>
          <span className="font-display font-bold text-foreground text-xl leading-none" style={{ letterSpacing: "-0.03em" }}>Libgeance</span>
        </div>

        <p className="font-display text-sm italic text-muted-foreground tracking-wide max-w-xs">
          Premium quality, everyday comfort. Designed for the life you live.
        </p>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <a key={l} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Socials */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-10">
          {socials.map(({ label, handle, icon: Icon, href }) => (
            <a key={handle} href={href} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-colors duration-200 shadow-sm">
                <Icon className="w-3.5 h-3.5 text-foreground group-hover:text-background transition-colors duration-200" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground group-hover:underline underline-offset-4">{label}</p>
                <p className="text-xs text-muted-foreground">{handle}</p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">© 2025 Libgeance. All rights reserved. Quality meets comfort.</p>
      </div>
    </footer>
  );
}
