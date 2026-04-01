import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const adminToken = req.cookies.get("admin_token")?.value;
    if (adminToken !== "etii_admin_session_2025") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filename, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Storage error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
