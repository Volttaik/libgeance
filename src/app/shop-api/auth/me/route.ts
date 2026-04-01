import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ user: null });

  const { data: user } = await supabase
    .from("users")
    .select("id, fullName, email, phone")
    .eq("id", payload.userId)
    .maybeSingle();

  return NextResponse.json({ user });
}
