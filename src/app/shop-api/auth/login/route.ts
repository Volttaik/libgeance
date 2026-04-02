import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, initDb } from "@/lib/turso";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await db.execute({
      sql: "SELECT id, fullName, email, phone, password FROM users WHERE email=?",
      args: [email],
    });
    const user = result.rows[0];
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password as string, user.password as string);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signToken({ userId: user.id as number, email: user.email as string });
    const response = NextResponse.json({
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone },
    });
    response.cookies.set("auth_token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
