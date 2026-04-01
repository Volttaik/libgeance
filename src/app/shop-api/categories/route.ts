import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("createdAt", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ categories });
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

    const { name, image } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data: category, error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), image: image || "" })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Category already exists" }, { status: 409 });
      }
      throw error;
    }
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
