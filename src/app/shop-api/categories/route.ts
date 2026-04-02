import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { ADMIN_TOKEN } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    const result = await db.execute("SELECT * FROM categories ORDER BY createdAt ASC");
    return NextResponse.json({ categories: result.rows });
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

    const { name, image } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    try {
      const result = await db.execute({
        sql: "INSERT INTO categories (name, image) VALUES (?, ?) RETURNING *",
        args: [name.trim(), image || ""],
      });
      return NextResponse.json({ category: result.rows[0] }, { status: 201 });
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes("UNIQUE constraint")) {
        return NextResponse.json({ error: "Category already exists" }, { status: 409 });
      }
      throw e;
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
