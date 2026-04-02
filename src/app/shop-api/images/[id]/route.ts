import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/turso";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();

    const { id } = await params;
    const result = await db.execute({
      sql: "SELECT mime_type, data FROM uploads WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const row = result.rows[0];
    const mimeType = row.mime_type as string;
    const raw = row.data as unknown;
    const buffer =
      raw instanceof Uint8Array
        ? raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength)
        : (raw as ArrayBuffer);

    return new NextResponse(buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
