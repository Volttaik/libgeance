import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { ADMIN_TOKEN } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDb();
    const { id } = await params;
    const result = await db.execute({ sql: "SELECT * FROM events WHERE id=?", args: [Number(id)] });
    if (!result.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ event: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDb();
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { title, subtitle, description, badge, ctaLabel, ctaLink, image, position, active } = await req.json();

    const result = await db.execute({
      sql: `UPDATE events SET title=?, subtitle=?, description=?, badge=?, ctaLabel=?, ctaLink=?, image=?, position=?, active=? WHERE id=? RETURNING *`,
      args: [title, subtitle || "", description || "", badge || "", ctaLabel || "Shop Now", ctaLink || "/", image || "", position || "inline", active ?? 1, Number(id)],
    });
    return NextResponse.json({ event: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDb();
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await db.execute({ sql: "DELETE FROM events WHERE id=?", args: [Number(id)] });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
