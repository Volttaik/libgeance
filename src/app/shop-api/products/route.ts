import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { ADMIN_TOKEN } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    let sql = "SELECT * FROM products";
    const args: string[] = [];
    const conditions: string[] = [];

    if (q) {
      conditions.push("(name LIKE ? OR description LIKE ? OR category LIKE ?)");
      args.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (category) {
      conditions.push("category = ?");
      args.push(category);
    }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY createdAt DESC";

    const result = await db.execute({ sql, args });
    const products = result.rows.map((r) => ({
      id: r.id,
      name: r.name,
      price: r.price,
      description: r.description,
      discount: r.discount,
      image: r.image,
      category: r.category,
      createdAt: r.createdAt,
    }));
    return NextResponse.json({ products });
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

    const { name, price, description, discount, image, category } = await req.json();
    if (!name || !price) {
      return NextResponse.json({ error: "Name and price required" }, { status: 400 });
    }

    const result = await db.execute({
      sql: "INSERT INTO products (name, price, description, discount, image, category) VALUES (?, ?, ?, ?, ?, ?) RETURNING *",
      args: [name, Number(price) * 100, description || "", Number(discount) || 0, image || "", category || "General"],
    });
    return NextResponse.json({ product: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
