import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { changeGallery } from "@/lib/gallery";
import { saveUpload, type GalleryItem } from "@/lib/store";
import { locales } from "@/lib/i18n";

export const runtime = "nodejs";

const MAX_FILES = 20;
const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Same-origin only (cookie is SameSite=Strict too)
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return NextResponse.json({ error: "No files selected." }, { status: 400 });
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Upload at most ${MAX_FILES} photos at a time.` }, { status: 400 });
  }

  const added: GalleryItem[] = [];
  const failed: string[] = [];

  for (const file of files) {
    try {
      if (file.size > MAX_BYTES) throw new Error("too large");
      const input = Buffer.from(await file.arrayBuffer());
      const id = crypto.randomBytes(6).toString("hex");
      const base = sharp(input, { failOn: "error" }).rotate();
      const main = await base.clone().resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
      const thumb = await base.clone().resize(640, 640, { fit: "inside", withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
      await saveUpload(`${id}.webp`, main.data);
      await saveUpload(`${id}-thumb.webp`, thumb);
      added.push({
        id,
        src: `/uploads/${id}.webp`,
        thumb: `/uploads/${id}-thumb.webp`,
        width: main.info.width,
        height: main.info.height,
        caption: { en: "", om: "" },
        visible: true,
        createdAt: new Date().toISOString(),
      });
    } catch {
      failed.push(file.name);
    }
  }

  if (added.length) {
    await changeGallery((items) => [...items, ...added]);
    for (const lang of locales) {
      revalidatePath(`/${lang}`);
      revalidatePath(`/${lang}/gallery`);
    }
    revalidatePath("/admin/gallery");
  }

  return NextResponse.json({ added: added.length, failed });
}
