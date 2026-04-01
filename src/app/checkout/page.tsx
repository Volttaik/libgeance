"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShoppingBag, Lock, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

const PAYSTACK_KEY = "pk_test_REPLACE_WITH_YOUR_PAYSTACK_PUBLIC_KEY";
const STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nassarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
  });

  // Redirect to register if not logged in (wait for auth to load first)
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/register");
    }
  }, [authLoading, user, router]);

  // Pre-fill form with user data once loaded
  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, fullName: user.fullName, email: user.email, phone: user.phone }));
    }
  }, [user]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const formatPrice = (p: number) => `₦${(p / 100).toLocaleString("en-NG")}`;
  const deliveryFee = 1500 * 100;
  const grandTotal = cartTotal + deliveryFee;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.email || !form.phone || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }
    if (cart.length === 0) { setError("Your cart is empty."); return; }
    if (!paystackLoaded || !window.PaystackPop) {
      setError("Payment system not loaded. Please refresh and try again.");
      return;
    }

    const ref = `LBG-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: form.email,
      amount: grandTotal,
      currency: "NGN",
      ref,
      metadata: { fullName: form.fullName, phone: form.phone, address: form.address },
      callback: async (response) => {
        setLoading(true);
        try {
          const res = await fetch("/shop-api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName: form.fullName,
              customerEmail: form.email,
              customerPhone: form.phone,
              deliveryAddress: form.address,
              city: form.city,
              state: form.state,
              items: cart.map((i) => ({ productId: i.id, productName: i.name, quantity: i.quantity, price: i.price })),
              total: grandTotal,
              paystackRef: response.reference,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setOrderId(data.orderId);
            clearCart();
            setSuccess(true);
          } else {
            setError(data.error || "Failed to save order. Contact support with ref: " + ref);
          }
        } catch {
          setError("Network error saving order. Ref: " + ref);
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {},
    });
    handler.openIframe();
  };

  // Show nothing while auth loads to avoid flash
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16 flex-col gap-4">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          <p className="font-semibold">Your cart is empty</p>
          <a href="/" className="bg-foreground text-background px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-foreground/80 transition-colors">
            Shop Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Secure Checkout</p>
          <h1 className="font-display text-4xl sm:text-5xl font-light italic mb-8">Complete Your Order</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <form onSubmit={handlePayment} className="flex flex-col gap-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs font-bold tracking-widest uppercase mb-4">Delivery Information</p>
                <div className="flex flex-col gap-3.5">
                  {[
                    { k: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
                    { k: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                    { k: "phone", label: "Phone Number", type: "tel", placeholder: "+234 800 000 0000" },
                  ].map(({ k, label, type, placeholder }) => (
                    <div key={k}>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">{label}</label>
                      <input type={type} required value={form[k as keyof typeof form]} onChange={handleChange(k)}
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                        placeholder={placeholder} />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Delivery Address</label>
                    <textarea required value={form.address} onChange={handleChange("address")}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none"
                      placeholder="Street, house number, landmark..." rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">City</label>
                      <input type="text" value={form.city} onChange={handleChange("city")}
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                        placeholder="Lagos Island" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">State</label>
                      <select value={form.state} onChange={handleChange("state")}
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all">
                        {STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">{error}</div>}

              <button type="submit" disabled={loading || !paystackLoaded}
                className="w-full bg-foreground text-background py-4 rounded-full font-bold tracking-wide hover:bg-foreground/80 transition-colors disabled:opacity-60 text-sm">
                {loading ? "Processing..." : `Pay ${formatPrice(grandTotal)} with Paystack`}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" /> Secured by Paystack. Your payment is safe.
              </p>
            </form>

            <div className="bg-card border border-border rounded-2xl p-5 lg:sticky lg:top-24">
              <p className="text-xs font-bold tracking-widest uppercase mb-4">Order Summary</p>
              <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <Package className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex flex-col gap-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{formatPrice(cartTotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className="font-semibold">{formatPrice(deliveryFee)}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-1">
                  <span>Total</span><span className="text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="bg-background border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 18 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-9 h-9 text-green-600" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold mb-2">Order Confirmed!</h2>
              {orderId && <p className="text-sm text-muted-foreground mb-1">Order #{orderId}</p>}
              <p className="text-sm text-muted-foreground mb-6">
                Thank you, {form.fullName}! Your order has been placed and will be delivered to {form.address}, {form.state}.
              </p>
              <a href="/" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-full font-semibold hover:bg-foreground/80 transition-colors">
                Continue Shopping
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
