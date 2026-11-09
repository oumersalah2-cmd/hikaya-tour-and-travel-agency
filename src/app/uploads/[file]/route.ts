import { readUpload } from "@/lib/store";

export const runtime = "nodejs";

/** Serves admin-uploaded photos (from Redis on Vercel, from the data folder elsewhere). */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  try {
    const data = await readUpload(file);
    if (!data) return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[uploads] read failed", error);
    return new Response("Not found", { status: 404 });
  }
}
