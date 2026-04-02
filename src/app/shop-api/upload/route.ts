import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN } from "@/lib/auth";
import { db, initDb } from "@/lib/turso";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 413 });
    }

    await initDb();

    const bytes = await file.arrayBuffer();
    const data = new Uint8Array(bytes);
    const mimeType = file.type || "image/jpeg";

    const result = await db.execute({
      sql: "INSERT INTO uploads (filename, mime_type, data) VALUES (?, ?, ?) RETURNING id",
      args: [file.name, mimeType, data],
    });

    const id = result.rows[0].id;
    const url = `/shop-api/images/${id}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
