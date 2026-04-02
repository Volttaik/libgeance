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
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg width="28" height="38" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.18))" }}>
                <defs>
                  <linearGradient id="lg-t" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3a3a3a"/><stop offset="100%" stopColor="#1a1a1a"/></linearGradient>
                  <linearGradient id="lg-lc" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6a6a6a"/><stop offset="100%" stopColor="#4a4a4a"/></linearGradient>
                  <linearGradient id="lg-rc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#121212"/><stop offset="100%" stopColor="#0a0a0a"/></linearGradient>
                  <linearGradient id="lg-ll" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#888"/><stop offset="100%" stopColor="#666"/></linearGradient>
                  <linearGradient id="lg-lr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#444"/><stop offset="100%" stopColor="#2a2a2a"/></linearGradient>
                  <linearGradient id="lg-pl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#aaa"/><stop offset="100%" stopColor="#888"/></linearGradient>
                  <linearGradient id="lg-pr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#555"/><stop offset="100%" stopColor="#333"/></linearGradient>
                </defs>
                <polygon points="150,15 65,108 235,108" fill="url(#lg-t)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
                <polygon points="150,15 5,195 65,108" fill="url(#lg-lc)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
                <polygon points="150,15 235,108 295,195" fill="url(#lg-rc)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
                <polygon points="65,108 5,195 150,195" fill="url(#lg-ll)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
                <polygon points="235,108 150,195 295,195" fill="url(#lg-lr)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
                <polygon points="5,195 150,395 150,195" fill="url(#lg-pl)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
                <polygon points="150,195 150,395 295,195" fill="url(#lg-pr)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
                <polyline points="150,15 295,195 150,395" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="150" y1="15" x2="235" y2="108" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4"/>
              </svg>
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
