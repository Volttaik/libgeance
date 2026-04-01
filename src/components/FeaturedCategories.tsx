"use client";

import { useEffect, useState } from "react";
import { Layers } from "lucide-react";

type Category = {
  id: number;
  name: string;
  image: string;
};

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/shop-api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || categories.length === 0) return null;

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10 anim-fade-up">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-foreground/40 mb-2">Shop by style</p>
        <h2 className="font-display text-3xl sm:text-4xl font-light italic text-foreground">Our Collections</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <a
            key={cat.id}
            href="#products"
            className="anim-fade-up relative rounded-3xl overflow-hidden min-h-[180px] hover:scale-[1.02] transition-transform duration-200 cursor-pointer group shadow-soft hover:shadow-lifted"
            style={{ animationDelay: `${i * 0.08 + 0.2}s` }}
          >
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                <Layers className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-display font-semibold text-xl text-white drop-shadow italic">{cat.name}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
