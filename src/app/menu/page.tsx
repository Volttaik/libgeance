"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, LogOut, User } from "lucide-react";

const navLinks = [
  { label: "New In", href: "/" },
  { label: "Women", href: "/" },
  { label: "Men", href: "/" },
  { label: "Accessories", href: "/" },
  { label: "Sale", href: "/" },
];

export default function MenuPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      <div className="px-6 pt-14 pb-6 border-b border-black/6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Libgeance</p>
        <h1 className="font-display text-4xl font-light italic">Menu</h1>
      </div>

      <div className="flex flex-col divide-y divide-black/6">
        {navLinks.map((link) => (
          <a key={link.label} href={link.href}
            className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors">
            <span className="font-display text-xl font-medium">{link.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </a>
        ))}
      </div>

      <div className="mt-8 px-6 flex flex-col gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-3 bg-secondary/60 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <button onClick={async () => { await logout(); router.push("/"); }}
              className="flex items-center justify-center gap-2 w-full border border-border py-3.5 rounded-full text-sm font-semibold hover:bg-secondary transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => router.push("/login")}
              className="w-full bg-foreground text-background py-3.5 rounded-full font-semibold text-sm hover:bg-foreground/85 transition-colors">
              Login
            </button>
            <button onClick={() => router.push("/register")}
              className="w-full border border-foreground py-3.5 rounded-full font-semibold text-sm hover:bg-secondary transition-colors">
              Register
            </button>
          </>
        )}
      </div>

      <div className="mt-auto px-6 pt-8 pb-2">
        <p className="text-xs text-muted-foreground text-center">© 2025 Libgeance. All rights reserved.</p>
      </div>
    </div>
  );
}
