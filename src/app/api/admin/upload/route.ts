import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdmin } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/store";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;

/** Single-image upload used by the package / destination editors. Returns the public URL. */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
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
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, `${id}.webp`), main.data);
    await fs.writeFile(path.join(UPLOAD_DIR, `${id}-thumb.webp`), thumb);
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
