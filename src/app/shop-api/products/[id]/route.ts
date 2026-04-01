import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== "etii_admin_session_2025") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, price, description, discount, image, category } = await req.json();

    const { data: product, error } = await supabase
      .from("products")
      .update({
        name,
        price: Number(price) * 100,
        description: description || "",
        discount: Number(discount) || 0,
        image: image || "",
        category: category || "General",
      })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== "etii_admin_session_2025") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { error } = await supabase.from("products").delete().eq("id", Number(id));
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
