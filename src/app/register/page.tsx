"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/shop-api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      setUser(data.user);
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
    { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
    { key: "phone", label: "Phone Number", type: "tel", placeholder: "+234 800 000 0000" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4 py-12">
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
            <h1 className="font-display text-3xl font-light italic">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join Libgeance and wear your story</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{label}</label>
                <input
                  type={type} required value={form[key as keyof typeof form]} onChange={handleChange(key)}
                  className="border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required value={form.password} onChange={handleChange("password")}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all pr-10"
                  placeholder="Min 6 characters"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Confirm Password</label>
              <input
                type="password" required value={form.confirmPassword} onChange={handleChange("confirmPassword")}
                className="border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                placeholder="Repeat your password"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="mt-2 w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold text-sm hover:bg-primary/85 transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-foreground hover:underline">Sign in</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
