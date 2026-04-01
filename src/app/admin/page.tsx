"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, LogOut, Package, ShoppingBag,
  Eye, EyeOff, X, Check, ImagePlus, Tag,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  discount: number;
  image: string;
  category: string;
};

type Category = {
  id: number;
  name: string;
  image: string;
};

type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  total: number;
  status: string;
  paystackRef: string;
  createdAt: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
};

const emptyProductForm = { name: "", price: "", description: "", discount: "", image: "", category: "" };
const emptyCatForm = { name: "", image: "" };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [tab, setTab] = useState<"products" | "categories" | "orders">("products");

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyProductForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const productImgRef = useRef<HTMLInputElement>(null);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [catForm, setCatForm] = useState(emptyCatForm);
  const [showCatForm, setShowCatForm] = useState(false);
  const [savingCat, setSavingCat] = useState(false);
  const [catDeleteConfirm, setCatDeleteConfirm] = useState<number | null>(null);
  const [catError, setCatError] = useState("");
  const catImgRef = useRef<HTMLInputElement>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const adminRes = await fetch("/shop-api/orders");
    if (adminRes.ok) {
      setAuthed(true);
      loadData();
    }
  };

  const loadData = async () => {
    const [pRes, cRes, oRes] = await Promise.all([
      fetch("/shop-api/products"),
      fetch("/shop-api/categories"),
      fetch("/shop-api/orders"),
    ]);
    if (pRes.ok) setProducts((await pRes.json()).products || []);
    if (cRes.ok) setCategories((await cRes.json()).categories || []);
    if (oRes.ok) setOrders((await oRes.json()).orders || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/shop-api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    if (res.ok) { setAuthed(true); loadData(); }
    else setLoginError("Invalid credentials");
  };

  const handleLogout = async () => {
    await fetch("/shop-api/admin/logout", { method: "POST" });
    setAuthed(false);
    setProducts([]); setCategories([]); setOrders([]);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/shop-api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    return url;
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, image: url }));
    } finally { setUploading(false); }
  };

  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setCatForm(f => ({ ...f, image: url }));
    } finally { setUploading(false); }
  };

  // ── Products ──────────────────────────────────────────────────────────────
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      discount: Number(form.discount) || 0,
      image: form.image,
      category: form.category,
    };
    const res = editId
      ? await fetch(`/shop-api/products/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/shop-api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setShowForm(false); setForm(emptyProductForm); setEditId(null); loadData(); }
    setSaving(false);
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price / 100), description: p.description, discount: String(p.discount), image: p.image || "", category: p.category });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/shop-api/products/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    loadData();
  };

  // ── Categories ────────────────────────────────────────────────────────────
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCat(true);
    setCatError("");
    const res = await fetch("/shop-api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catForm.name, image: catForm.image }),
    });
    if (res.ok) {
      setShowCatForm(false);
      setCatForm(emptyCatForm);
      loadData();
    } else {
      const data = await res.json();
      setCatError(data.error || "Failed to save");
    }
    setSavingCat(false);
  };

  const handleDeleteCategory = async (id: number) => {
    await fetch(`/shop-api/categories/${id}`, { method: "DELETE" });
    setCatDeleteConfirm(null);
    loadData();
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <span className="font-display font-bold text-primary-foreground text-base leading-none">LG</span>
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>Libgeance</span>
            </div>
            <h1 className="font-display text-2xl font-light italic">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage your store</p>
          </div>
          <form onSubmit={handleLogin} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            {loginError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">{loginError}</div>}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Username</label>
              <input type="text" required value={loginForm.username} onChange={(e) => setLoginForm(f => ({ ...f, username: e.target.value }))}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20" placeholder="admin" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={loginForm.password} onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20 pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="mt-1 w-full bg-foreground text-background py-3 rounded-full font-semibold text-sm hover:bg-foreground/80 transition-colors">
              Sign in
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border h-14 flex items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="font-display font-bold text-primary-foreground text-xs leading-none">LG</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Libgeance Admin</span>
        </div>
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground mr-4 hidden sm:block">View Store</a>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {([
            ["products", Package, "Products"],
            ["categories", Tag, "Categories"],
            ["orders", ShoppingBag, "Orders"],
          ] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${tab === key ? "bg-foreground text-background" : "border border-border hover:bg-secondary"}`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        {/* ── Products tab ── */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-2xl font-light italic">Products</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{products.length} items in catalogue</p>
              </div>
              <button onClick={() => { setShowForm(!showForm); setForm(emptyProductForm); setEditId(null); }}
                className="flex items-center gap-2 bg-foreground text-background px-5 py-2 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSaveProduct}
                  className="bg-card border border-border rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <div className="sm:col-span-2 flex items-center justify-between">
                    <p className="text-xs font-bold tracking-widest uppercase">{editId ? "Edit Product" : "New Product"}</p>
                    <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="p-1 rounded-full hover:bg-muted">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Product Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="e.g. Slim Linen Shirt" required />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Price (₦)</label>
                    <input type="number" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="75000" required min="0" step="0.01" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Discount (%)</label>
                    <input type="number" value={form.discount} onChange={(e) => setForm(f => ({ ...f, discount: e.target.value }))}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="0" min="0" max="100" />
                  </div>

                  {/* Category — dropdown from DB */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Category</label>
                    {categories.length > 0 ? (
                      <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20">
                        <option value="">— Select a category —</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full border border-dashed border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground">
                        No categories yet — create one in the Categories tab first.
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Description</label>
                    <input type="text" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="Brief product description" />
                  </div>

                  {/* Product image upload */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Product Image</label>
                    <input ref={productImgRef} type="file" accept="image/*" className="hidden" onChange={handleProductImageUpload} />
                    <div className="flex gap-3 items-start">
                      <button type="button" onClick={() => productImgRef.current?.click()} disabled={uploading}
                        className="flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-60">
                        <ImagePlus className="w-4 h-4" />
                        {uploading ? "Uploading…" : form.image ? "Change Image" : "Upload Image"}
                      </button>
                      {form.image && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border flex-shrink-0">
                          <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setForm(f => ({ ...f, image: "" }))}
                            className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex gap-3 mt-1">
                    <button type="submit" disabled={saving || uploading}
                      className="flex items-center gap-2 bg-foreground text-background px-6 py-2 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors disabled:opacity-60">
                      <Check className="w-3.5 h-3.5" />{saving ? "Saving..." : editId ? "Save Changes" : "Add Product"}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                      className="border border-border px-6 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition-colors">
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {products.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold">No products yet</p>
                <p className="text-sm text-muted-foreground mt-1">Click "Add Product" to add your first item</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="h-36 bg-secondary flex items-center justify-center relative overflow-hidden">
                      {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-muted-foreground" />}
                      {p.discount > 0 && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-foreground text-background">
                          {p.discount}% off
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <p className="text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.category}</p>
                      <p className="text-xs font-bold">₦{(p.price / 100).toLocaleString("en-NG")}</p>
                      <div className="flex gap-1.5 mt-1">
                        <button onClick={() => handleEdit(p)} className="flex-1 flex items-center justify-center gap-1 border border-border py-1.5 rounded-lg text-[10px] font-semibold hover:bg-secondary transition-colors">
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        {deleteConfirm === p.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDelete(p.id)} className="px-2 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-semibold hover:bg-red-600 transition-colors">Confirm</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1.5 border border-border rounded-lg text-[10px] font-semibold hover:bg-secondary transition-colors">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 border border-border rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Categories tab ── */}
        {tab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-2xl font-light italic">Categories</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{categories.length} categories</p>
              </div>
              <button onClick={() => { setShowCatForm(!showCatForm); setCatForm(emptyCatForm); setCatError(""); }}
                className="flex items-center gap-2 bg-foreground text-background px-5 py-2 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            <AnimatePresence>
              {showCatForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSaveCategory}
                  className="bg-card border border-border rounded-2xl p-5 mb-6 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold tracking-widest uppercase">New Category</p>
                    <button type="button" onClick={() => setShowCatForm(false)} className="p-1 rounded-full hover:bg-muted">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {catError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">{catError}</div>}

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Category Name</label>
                    <input type="text" value={catForm.name} onChange={(e) => setCatForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="e.g. Women, Men, Accessories" required />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1">Category Image</label>
                    <input ref={catImgRef} type="file" accept="image/*" className="hidden" onChange={handleCatImageUpload} />
                    <div className="flex gap-3 items-start">
                      <button type="button" onClick={() => catImgRef.current?.click()} disabled={uploading}
                        className="flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-60">
                        <ImagePlus className="w-4 h-4" />
                        {uploading ? "Uploading…" : catForm.image ? "Change Image" : "Upload Image"}
                      </button>
                      {catForm.image && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border flex-shrink-0">
                          <img src={catForm.image} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setCatForm(f => ({ ...f, image: "" }))}
                            className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-1">
                    <button type="submit" disabled={savingCat || uploading}
                      className="flex items-center gap-2 bg-foreground text-background px-6 py-2 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors disabled:opacity-60">
                      <Check className="w-3.5 h-3.5" />{savingCat ? "Saving..." : "Create Category"}
                    </button>
                    <button type="button" onClick={() => setShowCatForm(false)}
                      className="border border-border px-6 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition-colors">
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {categories.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold">No categories yet</p>
                <p className="text-sm text-muted-foreground mt-1">Create categories to organise your products and display them on the home page</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="h-32 bg-secondary flex items-center justify-center relative overflow-hidden">
                      {cat.image
                        ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        : <Tag className="w-8 h-8 text-muted-foreground" />}
                    </div>
                    <div className="p-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold truncate">{cat.name}</p>
                      {catDeleteConfirm === cat.id ? (
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => handleDeleteCategory(cat.id)} className="px-2 py-1 bg-red-500 text-white rounded-lg text-[10px] font-semibold hover:bg-red-600 transition-colors">Delete</button>
                          <button onClick={() => setCatDeleteConfirm(null)} className="px-2 py-1 border border-border rounded-lg text-[10px] font-semibold hover:bg-secondary transition-colors">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setCatDeleteConfirm(cat.id)} className="p-1.5 flex-shrink-0 border border-border rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Orders tab ── */}
        {tab === "orders" && (
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl font-light italic">Orders</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{orders.length} total orders</p>
            </div>
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold">No orders yet</p>
                <p className="text-sm text-muted-foreground mt-1">Orders will appear here once customers complete checkout</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((o) => (
                  <div key={o.id} className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex flex-wrap items-start gap-3 justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold">Order #{o.id}</p>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider ${o.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {o.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{o.customerName} · {o.customerEmail}</p>
                        <p className="text-xs text-muted-foreground">{o.deliveryAddress}, {o.city}, {o.state}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Phone: {o.customerPhone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">₦{(o.total / 100).toLocaleString("en-NG")}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                        {o.paystackRef && <p className="text-[9px] text-muted-foreground font-mono mt-0.5">Ref: {o.paystackRef}</p>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {o.items?.map((item, i) => (
                        <span key={i} className="text-[9px] bg-secondary px-2 py-0.5 rounded-full font-medium">
                          {item.quantity}× {item.productName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
