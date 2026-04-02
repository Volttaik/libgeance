"use client";

import { ShoppingBag, Minus, Plus, X, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart();
  const router = useRouter();
  const fmt = (p: number) => `₦${(p / 100).toLocaleString("en-NG")}`;

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32">
      <div className="px-6 pt-14 pb-6 border-b border-black/6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Libgeance</p>
        <h1 className="font-display text-4xl font-light italic">Your Bag</h1>
        {cart.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-20">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <ShoppingBag className="w-9 h-9 text-foreground/30" />
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-semibold italic mb-1">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">Discover something you love</p>
          </div>
          <button onClick={() => router.push("/")}
            className="bg-foreground text-background px-8 py-3 rounded-full font-semibold text-sm hover:bg-foreground/85 transition-colors">
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-0 divide-y divide-black/6 px-6 py-2">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex-shrink-0 overflow-hidden border border-black/6">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">🛍</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground mb-1">{item.category}</p>
                  <p className="text-sm font-bold">{fmt(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors bg-white shadow-sm">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors bg-white shadow-sm">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)}
                  className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-black/6 px-6 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-xl font-bold">{fmt(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout</p>
            <button onClick={() => router.push("/checkout")}
              className="w-full bg-foreground text-background py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-foreground/85 transition-colors">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
