"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Search, X, ShoppingBag, Eye } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
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

const suggestions = ["New arrivals", "Women", "Men", "Accessories", "Sale"];

function ProductModal({ product, whatsappNumber, onClose }: { product: Product; whatsappNumber: string; onClose: () => void }) {
  const { addToCart } = useCart();
  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        {product.image && <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-2xl" />}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">{product.category}</p>
          <h2 className="font-display text-xl font-semibold">{product.name}</h2>
          {product.description && <p className="text-sm text-muted-foreground mt-1">{product.description}</p>}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold">₦{((discountedPrice ?? product.price) / 100).toLocaleString("en-NG")}</span>
            {discountedPrice && <span className="text-sm text-muted-foreground line-through">₦{(product.price / 100).toLocaleString("en-NG")}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category }); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background rounded-xl py-3 text-sm font-semibold hover:bg-foreground/80 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Bag
          </button>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-foreground/20 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-zinc-50 transition-colors"
            >
              Chat
            </a>
          )}
        </div>
        <button onClick={onClose} className="text-sm text-muted-foreground text-center hover:text-foreground transition-colors">Close</button>
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    fetch("/shop-api/settings")
      .then((r) => r.json())
      .then((data) => setWhatsappNumber(data.settings?.whatsapp_number || ""))
      .catch(() => {});
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/shop-api/products?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.products || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams?.get("q") || "";
    setQuery(q);
    if (q) doSearch(q);
  }, [searchParams, doSearch]);

  const handleSearch = (q: string) => {
    setQuery(q);
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
    doSearch(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      <div className="px-6 pt-14 pb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Libgeance</p>
        <h1 className="font-display text-4xl font-light italic mb-6">Search</h1>
        <div className="flex items-center gap-3 border-b-2 border-foreground pb-3">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-xl font-display font-medium"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); setSearched(false); router.replace("/search"); }}>
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors"
          >
            Go
          </button>
        </div>
      </div>

      <div className="px-6 flex-1">
        {!query && !searched ? (
          <>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Popular searches</p>
            <div className="flex flex-col divide-y divide-black/6">
              {suggestions.map((s) => (
                <button key={s} onClick={() => handleSearch(s)}
                  className="flex items-center justify-between py-4 text-left hover:text-foreground/70 transition-colors">
                  <span className="font-display text-lg">{s}</span>
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Searching for &ldquo;{query}&rdquo;</p>
          </div>
        ) : searched && results.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center gap-3">
            <Search className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-display text-xl font-medium">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-muted-foreground">Try a different search term or browse categories below.</p>
            <button onClick={() => router.push("/")}
              className="mt-2 bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground/85 transition-colors">
              Browse All Products
            </button>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="text-xs text-muted-foreground mb-4 font-semibold uppercase tracking-widest">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {results.map((p) => {
                const discountedPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : null;
                return (
                  <div key={p.id} className="group relative bg-white rounded-2xl overflow-hidden flex flex-col border border-black/6 hover:shadow-lg transition-all duration-300 shadow-sm">
                    <div className="relative overflow-hidden bg-zinc-100" style={{ height: "180px" }}>
                      {p.image
                        ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-zinc-300" /></div>}
                      {p.discount > 0 && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full z-10 bg-foreground text-background">Sale</span>
                      )}
                      <button
                        onClick={() => setModalProduct(p)}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                      >
                        <Eye className="w-3 h-3 text-foreground" />
                      </button>
                    </div>
                    <div className="p-2.5 flex flex-col gap-1 flex-1">
                      <p className="text-[11px] font-semibold leading-tight line-clamp-2">{p.name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{p.category}</p>
                      <div className="flex items-center gap-1.5 mt-auto pt-1">
                        <span className="text-[11px] font-bold">₦{((discountedPrice ?? p.price) / 100).toLocaleString("en-NG")}</span>
                        {discountedPrice && <span className="text-[10px] text-muted-foreground line-through">₦{(p.price / 100).toLocaleString("en-NG")}</span>}
                      </div>
                      <button
                        onClick={() => { addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category }); toast(`${p.name} added`); }}
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
        ) : null}
      </div>

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          whatsappNumber={whatsappNumber}
          onClose={() => setModalProduct(null)}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
