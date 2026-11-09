import { NextResponse } from "next/server";
import { addLead, type LeadType } from "@/lib/store";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { short: 200, long: 4000 };

type Body = Record<string, unknown>;

/* Simple per-IP rate limit (in memory): 8 submissions / 10 minutes. */
const WINDOW_MS = 10 * 60_000;
const MAX_HITS = 8;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_HITS;
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

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

  // Contact and newsletter strictly require a valid email.
  // Bookings require a phone number; email is optional (validated if provided).
  if (type === "contact" || type === "newsletter") {
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 422 });
    }
  } else if (type === "booking") {
    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 422 });
    }
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
