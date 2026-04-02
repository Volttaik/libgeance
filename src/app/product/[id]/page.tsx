"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBag, MessageCircle, Tag, Percent, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
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

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/shop-api/products/${id}`)
      .then((r) => r.json())
      .then((data) => { setProduct(data.product || null); setLoading(false); })
      .catch(() => setLoading(false));

    fetch("/shop-api/settings")
      .then((r) => r.json())
      .then((data) => setWhatsappNumber(data.settings?.whatsapp_number || ""));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-muted-foreground">Product not found.</p>
          <button onClick={() => router.back()} className="text-sm font-semibold underline">Go back</button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : null;
  const displayPrice = discountedPrice ?? product.price;
  const formattedPrice = `₦${(displayPrice / 100).toLocaleString("en-NG")}`;
  const originalPrice = `₦${(product.price / 100).toLocaleString("en-NG")}`;

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    toast(`${product.name} added to your bag`);
  };

  const handleWhatsApp = () => {
    const num = whatsappNumber.replace(/\D/g, "");
    if (!num) { toast.error("WhatsApp contact not set up yet"); return; }
    const discountNote = product.discount > 0 ? `\nDiscount: ${product.discount}% off (was ${originalPrice})` : "";
    const imageUrl = product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${window.location.origin}${product.image}`
      : "";
    const imageNote = imageUrl ? `\n\nView image: ${imageUrl}` : "";
    const msg = encodeURIComponent(
      `Hi! I'm interested in this product:\n\n*${product.name}*\nCategory: ${product.category}\nPrice: ${formattedPrice}${discountNote}\n\n${product.description || ""}${imageNote}`
    );
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Product image */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-100 mb-6" style={{ aspectRatio: "4/3" }}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-20 h-20 text-muted-foreground opacity-30" />
            </div>
          )}
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-foreground text-background px-3 py-1.5 rounded-full">
              <Percent className="w-3 h-3" />
              <span className="text-xs font-bold">{product.discount}% OFF</span>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{product.category}</span>
        </div>

        {/* Name */}
        <h1 className="font-display text-3xl font-medium leading-tight mb-4">{product.name}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold">{formattedPrice}</span>
          {discountedPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">{originalPrice}</span>
              <span className="text-sm font-semibold text-emerald-600">Save {product.discount}%</span>
            </>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Details</p>
            <p className="text-base text-foreground/80 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Badges */}
        <div className="flex gap-2 flex-wrap mb-8">
          <span className="text-xs font-medium border border-border px-3 py-1.5 rounded-full text-foreground/60">Quality Assured</span>
          <span className="text-xs font-medium border border-border px-3 py-1.5 rounded-full text-foreground/60">Fast Delivery</span>
          <span className="text-xs font-medium border border-border px-3 py-1.5 rounded-full text-foreground/60">Comfort Fit</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-full font-semibold text-sm hover:bg-foreground/80 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Bag
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-full font-semibold text-sm hover:bg-[#20b858] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
