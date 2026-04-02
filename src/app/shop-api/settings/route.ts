import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";
import { ADMIN_TOKEN } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    const result = await db.execute("SELECT key, value FROM settings");
    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      settings[row.key as string] = row.value as string;
    }
    return NextResponse.json({ settings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await initDb();
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updates = await req.json() as Record<string, string>;
    for (const [key, value] of Object.entries(updates)) {
      await db.execute({
        sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        args: [key, value],
      });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
