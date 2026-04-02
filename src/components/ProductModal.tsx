"use client";

import { useEffect } from "react";
import { X, ShoppingBag, MessageCircle, Tag, Percent } from "lucide-react";
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

type Props = {
  product: Product;
  whatsappNumber: string;
  onClose: () => void;
};

export default function ProductModal({ product, whatsappNumber, onClose }: Props) {
  const { addToCart } = useCart();

  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : null;
  const displayPrice = discountedPrice ?? product.price;
  const formattedPrice = `₦${(displayPrice / 100).toLocaleString("en-NG")}`;
  const originalPrice = `₦${(product.price / 100).toLocaleString("en-NG")}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleWhatsApp = () => {
    const num = whatsappNumber.replace(/\D/g, "");
    if (!num) {
      toast.error("WhatsApp contact not set up yet");
      return;
    }
    const imageUrl = product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${window.location.origin}${product.image}`
      : "";
    const imageNote = imageUrl ? `\n\nView image: ${imageUrl}` : "";
    const discountNote = product.discount > 0 ? `\nDiscount: ${product.discount}% off (was ${originalPrice})` : "";
    const msg = encodeURIComponent(
      `Hi! I'm interested in this product:\n\n*${product.name}*\nCategory: ${product.category}\nPrice: ${formattedPrice}${discountNote}\n\n${product.description || ""}${imageNote}`
    );
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    toast(`${product.name} added to your bag`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="relative bg-zinc-100 flex-shrink-0" style={{ height: "240px" }}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-16 h-16 opacity-30" />
            </div>
          )}
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-foreground text-background px-3 py-1 rounded-full">
              <Percent className="w-3 h-3" />
              <span className="text-xs font-bold">{product.discount}% OFF</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 min-h-0 flex flex-col gap-4 p-5 pb-8" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{product.category}</span>
            </div>
            <h2 className="font-display text-2xl font-medium leading-tight">{product.name}</h2>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formattedPrice}</span>
            {discountedPrice && (
              <span className="text-base text-muted-foreground line-through">{originalPrice}</span>
            )}
            {discountedPrice && (
              <span className="text-sm font-semibold text-emerald-600">Save {product.discount}%</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Details</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] font-medium border border-border px-3 py-1 rounded-full text-foreground/60">Quality Assured</span>
            <span className="text-[11px] font-medium border border-border px-3 py-1 rounded-full text-foreground/60">Fast Delivery</span>
            <span className="text-[11px] font-medium border border-border px-3 py-1 rounded-full text-foreground/60">Comfort Fit</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-1">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-full font-semibold text-sm hover:bg-foreground/80 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Bag
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full font-semibold text-sm hover:bg-[#20b858] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
