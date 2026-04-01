export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  color: string;
};

export const products: Product[] = [
  // Women
  { id: 1, name: "Oversized Linen Shirt", category: "Women", price: 79, color: "bg-stone-200", tag: "New" },
  { id: 2, name: "Ribbed Midi Dress", category: "Women", price: 149, originalPrice: 189, color: "bg-neutral-800", tag: "Sale" },
  { id: 3, name: "Tailored Wide-Leg Trousers", category: "Women", price: 119, color: "bg-stone-300" },
  { id: 4, name: "Cropped Knit Cardigan", category: "Women", price: 99, color: "bg-zinc-200", tag: "Bestseller" },
  { id: 5, name: "Slip Maxi Skirt", category: "Women", price: 89, color: "bg-neutral-900" },
  { id: 6, name: "Structured Blazer", category: "Women", price: 229, color: "bg-stone-400", tag: "New" },

  // Men
  { id: 7, name: "Essential Crewneck Tee", category: "Men", price: 55, color: "bg-neutral-200", tag: "Bestseller" },
  { id: 8, name: "Slim Chino Pants", category: "Men", price: 129, color: "bg-stone-300" },
  { id: 9, name: "Merino Wool Sweater", category: "Men", price: 169, color: "bg-zinc-700", tag: "New" },
  { id: 10, name: "Relaxed Linen Shorts", category: "Men", price: 79, originalPrice: 99, color: "bg-stone-200", tag: "Sale" },
  { id: 11, name: "Classic Oxford Shirt", category: "Men", price: 109, color: "bg-neutral-100" },
  { id: 12, name: "Tailored Wool Coat", category: "Men", price: 289, color: "bg-neutral-900", tag: "New" },

  // Accessories
  { id: 13, name: "Leather Tote Bag", category: "Accessories", price: 199, color: "bg-stone-400", tag: "New" },
  { id: 14, name: "Cashmere Beanie", category: "Accessories", price: 69, color: "bg-neutral-800" },
  { id: 15, name: "Minimalist Watch", category: "Accessories", price: 249, color: "bg-zinc-200", tag: "Bestseller" },
  { id: 16, name: "Silk Neck Scarf", category: "Accessories", price: 59, originalPrice: 85, color: "bg-stone-300", tag: "Sale" },
  { id: 17, name: "Canvas Crossbody", category: "Accessories", price: 129, color: "bg-neutral-700" },
  { id: 18, name: "Leather Belt", category: "Accessories", price: 79, color: "bg-stone-500" },
];

export const categories = ["Women", "Men", "Accessories"];
