"use client";

import IntroAnimation from "@/components/IntroAnimation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductGrid from "@/components/ProductGrid";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <IntroAnimation />
      <Navbar />
      <Hero />
      <FeaturedCategories />
      <ProductGrid />
      <Banner />
      <Footer />
      <Toaster />
    </div>
  );
}
