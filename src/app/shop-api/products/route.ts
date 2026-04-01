import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== "etii_admin_session_2025") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, price, description, discount, image, category } = await req.json();
    if (!name || !price) {
      return NextResponse.json({ error: "Name and price required" }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name,
        price: Number(price) * 100,
        description: description || "",
        discount: Number(discount) || 0,
        image: image || "",
        category: category || "General",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
