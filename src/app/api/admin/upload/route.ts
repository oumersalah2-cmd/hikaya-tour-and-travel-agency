import crypto from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { saveUpload } from "@/lib/store";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;

/** Single-image upload used by the package / destination editors. Returns the public URL. */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file selected." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 15 MB." }, { status: 413 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const id = crypto.randomBytes(6).toString("hex");
    const base = sharp(input, { failOn: "error" }).rotate();
    const main = await base
      .clone()
      .resize(1800, 1800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const thumb = await base
      .clone()
      .resize(640, 640, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
    await saveUpload(`${id}.webp`, main.data);
    await saveUpload(`${id}-thumb.webp`, thumb);
    return NextResponse.json({
      src: `/uploads/${id}.webp`,
      thumb: `/uploads/${id}-thumb.webp`,
      width: main.info.width,
      height: main.info.height,
    });
  } catch {
    return NextResponse.json({ error: "That file isn’t a valid JPG, PNG or WebP image." }, { status: 422 });
  }
}
