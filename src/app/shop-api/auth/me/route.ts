import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ user: null });

    const result = await db.execute({
      sql: "SELECT id, fullName, email, phone, avatar_url FROM users WHERE id=?",
      args: [payload.userId],
    });
    const user = result.rows[0];
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatar_url ?? null,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null });
  }
}
