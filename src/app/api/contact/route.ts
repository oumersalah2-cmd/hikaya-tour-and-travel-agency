import { NextResponse } from "next/server";
import { addLead, type LeadType } from "@/lib/store";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { short: 200, long: 4000 };

type Body = Record<string, unknown>;

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (str(body.website, 50)) {
    return NextResponse.json({ ok: true });
  }

  const type = str(body.type, 20);
  const email = str(body.email, MAX.short);

  if (!["contact", "booking", "newsletter"].includes(type)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  }

  const lead: Body = { type, email, receivedAt: new Date().toISOString() };

  if (type !== "newsletter") {
    const name = str(body.name, MAX.short);
    if (!name) {
      return NextResponse.json({ error: "name_required" }, { status: 422 });
    }
    lead.name = name;
    lead.phone = str(body.phone, 40);
    if (type === "contact") {
      lead.subject = str(body.subject, MAX.short);
      lead.message = str(body.message, MAX.long);
      if (!lead.subject || !lead.message) {
        return NextResponse.json({ error: "missing_fields" }, { status: 422 });
      }
    } else {
      if (!lead.phone) {
        return NextResponse.json({ error: "phone_required" }, { status: 422 });
      }
      lead.travelers = str(body.travelers, 5);
      lead.package = str(body.package, MAX.short);
      lead.preferredDates = str(body.preferredDates, MAX.short);
      lead.message = str(body.message, MAX.long);
    }
  }

  // 1) Always keep a copy in the admin inbox
  let stored = true;
  try {
    await addLead({
      type: type as LeadType,
      email,
      name: String(lead.name ?? ""),
      phone: String(lead.phone ?? ""),
      subject: String(lead.subject ?? ""),
      message: String(lead.message ?? ""),
      package: String(lead.package ?? ""),
      travelers: String(lead.travelers ?? ""),
      preferredDates: String(lead.preferredDates ?? ""),
    });
  } catch (error) {
    stored = false;
    console.error("[contact] could not save lead", error);
  }

  // 2) Optionally forward to an external service (e-mail, CRM, chat alert…)
  let forwarded = false;
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      forwarded = res.ok;
      if (!res.ok) console.error(`[contact] webhook responded ${res.status}`);
    } catch (error) {
      console.error("[contact] webhook delivery failed", error);
    }
  }

  // Only report success when at least one destination really received it.
  if (!stored && !forwarded) {
    return NextResponse.json({ error: "delivery_failed" }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
