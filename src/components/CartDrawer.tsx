"use client";

import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useCart();
  const router = useRouter();

  const formatPrice = (p: number) => `₦${(p / 100).toLocaleString("en-NG")}`;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 backdrop-blur-[2px]"
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-md bg-white flex flex-col shadow-[−8px_0_40px_rgba(0,0,0,0.1)] border-l border-black/6"
          >
            <div className="flex items-center gap-2 px-6 pt-6 pb-4 border-b border-black/6">
              <ShoppingBag className="w-4.5 h-4.5 text-foreground" />
              <h2 className="text-base font-display font-semibold italic flex-1">Your Bag</h2>
              {cart.length > 0 && (
                <span className="text-xs font-semibold text-muted-foreground mr-2">
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                </span>
              )}
              <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-6">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-soft">
                  <ShoppingBag className="w-7 h-7 text-foreground/30" />
                </div>
                <p className="font-display font-semibold italic text-lg">Your bag is empty</p>
                <p className="text-sm text-muted-foreground">Discover something you love</p>
                <button onClick={() => setCartOpen(false)} className="border border-border px-6 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition-colors">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 px-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-secondary/50 rounded-2xl p-3 border border-black/4">
                      <div className="w-14 h-14 bg-white rounded-xl flex-shrink-0 overflow-hidden border border-black/6 shadow-sm">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🛍</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted bg-white shadow-sm">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted bg-white shadow-sm">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/6 pt-4 flex flex-col gap-3 px-6 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-lg font-bold text-foreground">{formatPrice(cartTotal)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout</p>
                  <button
                    onClick={() => { setCartOpen(false); router.push("/checkout"); }}
                    className="w-full bg-foreground text-background py-3 rounded-full font-semibold hover:bg-foreground/85 transition-colors shadow-soft"
                  >
                    Proceed to Checkout
                  </button>
                  <button onClick={() => setCartOpen(false)} className="w-full border border-border py-3 rounded-full font-semibold hover:bg-secondary transition-colors">
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
