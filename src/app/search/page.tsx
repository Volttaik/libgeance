"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const suggestions = ["New arrivals", "Women's dresses", "Men's jackets", "Accessories", "Sale items"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      <div className="px-6 pt-14 pb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Libgeance</p>
        <h1 className="font-display text-4xl font-light italic mb-6">Search</h1>
        <div className="flex items-center gap-3 border-b-2 border-foreground pb-3">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-xl font-display font-medium" />
          {query && (
            <button onClick={() => setQuery("")}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
          )}
        </div>
      </div>

      <div className="px-6">
        {!query ? (
          <>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Popular searches</p>
            <div className="flex flex-col divide-y divide-black/6">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQuery(s)}
                  className="flex items-center justify-between py-4 text-left hover:text-foreground/70 transition-colors">
                  <span className="font-display text-lg">{s}</span>
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <Search className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-display text-xl font-medium text-muted-foreground">Searching for "{query}"</p>
            <p className="text-sm text-muted-foreground">Full search coming soon.</p>
            <button onClick={() => router.push("/")}
              className="mt-2 bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground/85 transition-colors">
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
