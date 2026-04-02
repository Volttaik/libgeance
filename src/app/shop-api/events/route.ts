import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { ADMIN_TOKEN } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    const result = await db.execute("SELECT * FROM events WHERE active=1 ORDER BY createdAt DESC");
    return NextResponse.json({ events: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, subtitle, description, badge, ctaLabel, ctaLink, image, position } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const result = await db.execute({
      sql: `INSERT INTO events (title, subtitle, description, badge, ctaLabel, ctaLink, image, position, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1) RETURNING *`,
      args: [title, subtitle || "", description || "", badge || "", ctaLabel || "Shop Now", ctaLink || "/", image || "", position || "inline"],
    });
    return NextResponse.json({ event: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
