import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_TOKEN } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", ADMIN_TOKEN, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
