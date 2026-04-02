import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { ADMIN_TOKEN } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDb();
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.execute({ sql: "DELETE FROM categories WHERE id=?", args: [Number(id)] });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
