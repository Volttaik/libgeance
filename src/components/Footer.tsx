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
          <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shadow-soft">
            <span className="font-display font-bold text-background text-sm leading-none">LG</span>
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
