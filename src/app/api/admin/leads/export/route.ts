import { isAdmin } from "@/lib/auth";
import { listLeads } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Neutralise spreadsheet formula injection and quote the cell. */
const cell = (value: string) => {
  const isPhone = /^\+?[\d\s()-]+$/.test(value); // keep +251… numbers intact
  const safe = !isPhone && /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const leads = await listLeads();
  const header = ["Date", "Type", "Status", "Name", "Email", "Phone", "Subject / Package", "Travelers", "Preferred dates", "Message", "Notes"];
  const rows = leads.map((l) =>
    [l.createdAt, l.type, l.status, l.name, l.email, l.phone, l.subject || l.package, l.travelers, l.preferredDates, l.message, l.notes].map(cell).join(",")
  );
  return new Response("\uFEFF" + [header.map(cell).join(","), ...rows].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hikaya-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
