"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = ["New In", "Women", "Men", "Accessories", "Sale"];

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 select-none group">
          <div className="group-hover:scale-105 transition-transform">
            <svg width="24" height="32" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.18))" }}>
              <defs>
                <linearGradient id="nl-table" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3a3a3a"/><stop offset="100%" stopColor="#1a1a1a"/></linearGradient>
                <linearGradient id="nl-lc" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6a6a6a"/><stop offset="100%" stopColor="#4a4a4a"/></linearGradient>
                <linearGradient id="nl-rc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#121212"/><stop offset="100%" stopColor="#0a0a0a"/></linearGradient>
                <linearGradient id="nl-llc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#888888"/><stop offset="100%" stopColor="#666666"/></linearGradient>
                <linearGradient id="nl-lrc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#444444"/><stop offset="100%" stopColor="#2a2a2a"/></linearGradient>
                <linearGradient id="nl-pl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#aaaaaa"/><stop offset="100%" stopColor="#888888"/></linearGradient>
                <linearGradient id="nl-pr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#555555"/><stop offset="100%" stopColor="#333333"/></linearGradient>
              </defs>
              <polygon points="150,15 65,108 235,108" fill="url(#nl-table)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
              <polygon points="150,15 5,195 65,108" fill="url(#nl-lc)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
              <polygon points="150,15 235,108 295,195" fill="url(#nl-rc)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
              <polygon points="65,108 5,195 150,195" fill="url(#nl-llc)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
              <polygon points="235,108 150,195 295,195" fill="url(#nl-lrc)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
              <polygon points="5,195 150,395 150,195" fill="url(#nl-pl)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
              <polygon points="150,195 150,395 295,195" fill="url(#nl-pr)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
              <polyline points="150,15 295,195 150,395" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="150" y1="15" x2="235" y2="108" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4"/>
              <polygon points="150,15 295,195 150,395 5,195" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"/>
            </svg>
          </div>
          <span className="font-display font-bold text-foreground text-xl leading-none" style={{ letterSpacing: "-0.03em" }}>Libgeance</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a key={l} href="#" className="text-sm font-medium text-foreground/55 hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-black/4">
              {l}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button onClick={() => router.push("/search")} className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
          <button onClick={() => router.push("/cart")} className="p-2 rounded-full hover:bg-secondary transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => router.push("/menu")} className="p-2 rounded-full hover:bg-secondary transition-colors md:hidden" aria-label="Menu">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
