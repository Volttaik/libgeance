"use client";

import { useRef, useState, useEffect } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  discount: number;
  image: string;
  description: string;
};

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/shop-api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const categoryMap = new Map<string, Product[]>();
  for (const product of products) {
    const cat = product.category || "Other";
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(product);
  }
  const categories = Array.from(categoryMap.entries());

  return (
    <section id="products" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 anim-fade-up flex flex-col items-start gap-4">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-foreground/40">Curated for you</p>
        <a
          href="#products"
          className="inline-flex flex-col items-center gap-1 group"
          onClick={(e) => { e.preventDefault(); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
        >
          <span className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3 rounded-full font-semibold text-sm hover:bg-foreground/85 transition-colors shadow-soft tracking-wide">
            Shop Now
          </span>
          <span className="flex flex-col items-center gap-0.5 mt-1" aria-hidden>
            <span className="block w-px h-3 bg-foreground/30 group-hover:bg-foreground/60 transition-colors" style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }}/>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 group-hover:opacity-80 transition-opacity" style={{ animation: "shopArrowBounce 1.6s ease-in-out infinite" }}>
              <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>
        <style>{`
          @keyframes shopArrowBounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(4px); opacity: 0.9; }
          }
        `}</style>
      </div>

      <div className="flex flex-col gap-12">
        {categories.map(([cat, catProducts], catIdx) => (
          <CategoryRow
            key={cat}
            category={cat}
            products={catProducts}
            delay={catIdx * 0.1}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}

type RowProps = {
  category: string;
  products: Product[];
  delay: number;
  addToCart: (item: { id: number; name: string; price: number; image: string; category: string }) => void;
};

const BG_SHADES = ["bg-zinc-100", "bg-neutral-200", "bg-stone-100", "bg-gray-100", "bg-slate-100", "bg-zinc-200", "bg-neutral-100", "bg-stone-200", "bg-gray-50", "bg-slate-200"];

function CategoryRow({ category, products, addToCart }: RowProps) {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const half = Math.ceil(products.length / 2);

  return (
    <div className="anim-fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center gap-4">
        <span className="font-display text-xl sm:text-2xl font-light italic text-foreground">{category}</span>
        <div className="flex-1 h-px bg-border" />
        <a href="#" className="text-xs font-medium text-foreground/45 hover:text-foreground tracking-wide transition-colors">View all</a>
      </div>
      <div className="flex flex-col gap-3">
        <ScrollRow
          products={products.slice(0, half)}
          liked={liked}
          onLike={(id) => setLiked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; })}
          onAdd={(p) => { addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category }); toast(`${p.name} added to your bag`); }}
          bgShades={BG_SHADES}
        />
        {products.length > half && (
          <ScrollRow
            products={products.slice(half)}
            liked={liked}
            onLike={(id) => setLiked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; })}
            onAdd={(p) => { addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category }); toast(`${p.name} added to your bag`); }}
            bgShades={BG_SHADES}
          />
        )}
      </div>
    </div>
  );
}

type ScrollRowProps = {
  products: Product[];
  liked: Set<number>;
  onLike: (id: number) => void;
  onAdd: (p: Product) => void;
  bgShades: string[];
};

function ScrollRow({ products, liked, onLike, onAdd, bgShades }: ScrollRowProps) {
  return (
    <div className="overflow-x-auto hide-scrollbar px-4 sm:px-6">
      <div className="flex gap-3" style={{ width: "max-content" }}>
        {products.map((p, i) => {
          const discountedPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : null;
          return (
            <div
              key={p.id}
              className="group relative bg-white rounded-2xl overflow-hidden flex flex-col border border-black/6 hover:shadow-lifted transition-all duration-300 shadow-soft"
              style={{ width: "190px", flexShrink: 0 }}
            >
              <div className={`relative overflow-hidden ${p.image ? "" : bgShades[i % bgShades.length]}`} style={{ height: "210px" }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
                )}
                {p.discount > 0 && (
                  <span className="absolute top-2 left-2 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full z-10 bg-foreground text-background">
                    Sale
                  </span>
                )}
                <button
                  onClick={() => onLike(p.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                >
                  <Heart className={`w-3 h-3 ${liked.has(p.id) ? "fill-foreground" : ""} text-foreground`} />
                </button>
              </div>

              {/* Card bottom — quality & comfort focus */}
              <div className="mx-2 mb-2 -mt-3 relative z-10 bg-white rounded-xl border border-black/6 shadow-sm px-2.5 py-2.5 flex flex-col gap-1">
                <p className="text-[11px] font-semibold leading-tight line-clamp-2 text-foreground">{p.name}</p>
                <p className="text-[9px] text-muted-foreground tracking-wide uppercase font-medium">{p.category}</p>
                <div className="flex flex-wrap gap-1 my-0.5">
                  <span className="text-[8px] font-medium text-foreground/45 border border-border/60 px-1.5 py-0.5 rounded-full">Quality</span>
                  <span className="text-[8px] font-medium text-foreground/45 border border-border/60 px-1.5 py-0.5 rounded-full">Comfort</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-foreground">₦{((discountedPrice ?? p.price) / 100).toLocaleString("en-NG")}</span>
                  {discountedPrice && <span className="text-[10px] text-muted-foreground line-through">₦{(p.price / 100).toLocaleString("en-NG")}</span>}
                </div>
                <button
                  onClick={() => onAdd(p)}
                  className="mt-1 w-full flex items-center justify-center gap-1 bg-foreground text-background rounded-lg py-1.5 text-[10px] font-semibold hover:bg-foreground/80 transition-colors"
                >
                  <ShoppingBag className="w-2.5 h-2.5" /> Add to Bag
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
