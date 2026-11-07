import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { backupSnapshot } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Downloads every saved list (settings, packages, FAQ, gallery, leads…) as one JSON file. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const snapshot = await backupSnapshot();
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify({ exportedAt: new Date().toISOString(), ...snapshot }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="hikaya-backup-${stamp}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
