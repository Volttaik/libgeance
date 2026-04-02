import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { ADMIN_TOKEN } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDb();
    const { id } = await params;
    const result = await db.execute({ sql: "SELECT * FROM products WHERE id=?", args: [Number(id)] });
    if (!result.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const row = result.rows[0] as Record<string, unknown>;
    const product = { ...row, price: Number(row.price), discount: Number(row.discount) };
    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDb();
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, price, description, discount, image, category } = await req.json();

    const result = await db.execute({
      sql: "UPDATE products SET name=?, price=?, description=?, discount=?, image=?, category=? WHERE id=? RETURNING *",
      args: [name, Number(price) * 100, description || "", Number(discount) || 0, image || "", category || "General", Number(id)],
    });
    return NextResponse.json({ product: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDb();
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.execute({ sql: "DELETE FROM products WHERE id=?", args: [Number(id)] });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
