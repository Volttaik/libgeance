import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: result, error } = await supabase
      .from("users")
      .insert({ fullName, email, phone, password: hashedPassword })
      .select("id")
      .single();

    if (error || !result) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const token = signToken({ userId: result.id, email });
    const response = NextResponse.json({
      user: { id: result.id, fullName, email, phone },
    });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
