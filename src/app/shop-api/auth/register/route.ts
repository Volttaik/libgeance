import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, initDb } from "@/lib/turso";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { fullName, email, phone, password, avatarUrl } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await db.execute({ sql: "SELECT id FROM users WHERE email=?", args: [email] });
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.execute({
      sql: "INSERT INTO users (fullName, email, phone, password, avatar_url) VALUES (?, ?, ?, ?, ?) RETURNING id",
      args: [fullName, email, phone, hashedPassword, avatarUrl || null],
    });
    const id = result.rows[0].id as number;

    const token = signToken({ userId: id, email });
    const response = NextResponse.json({
      user: { id, fullName, email, phone, avatarUrl: avatarUrl || null },
    });
    response.cookies.set("auth_token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
