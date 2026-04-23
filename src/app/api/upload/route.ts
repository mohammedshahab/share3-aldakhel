import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {}
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق ملف" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "حجم الصورة كبير جداً (الحد 5 ميغا)" }, { status: 400 });
  }
  const mime = file.type || "image/png";
  if (!mime.startsWith("image/")) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
  }

  await ensureDir();
  const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : mime === "image/gif" ? "gif" : "jpg";
  const name = `${crypto.randomUUID()}.${ext}`;
  const target = path.join(UPLOAD_DIR, name);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(target, buf);

  return NextResponse.json({ url: `/uploads/${name}` });
}
