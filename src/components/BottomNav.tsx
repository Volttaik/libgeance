"use client";

import { Home, Search, ShoppingBag, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const items = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Bag", icon: ShoppingBag, href: "/cart" },
  { label: "Menu", icon: Menu, href: "/menu" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/8 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          const isBag = label === "Bag";
          return (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${active ? "text-foreground" : "text-muted-foreground"}`}
                  strokeWidth={active ? 2.2 : 1.7}
                />
                {isBag && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
