"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/shop-api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      setUser(data.user);
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <span className="font-display font-bold text-primary-foreground text-base leading-none">LG</span>
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>Libgeance</span>
            </div>
            <h1 className="font-display text-3xl font-light italic">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your Libgeance account</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="mt-2 w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold text-sm hover:bg-primary/85 transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-semibold text-foreground hover:underline">Create one</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
