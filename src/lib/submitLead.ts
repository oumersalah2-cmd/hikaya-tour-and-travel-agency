export type LeadPayload =
  | {
      type: "contact";
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }
  | {
      type: "booking";
      name: string;
      email: string;
      phone: string;
      travelers: string;
      package: string;
      preferredDates?: string;
      message?: string;
    }
  | { type: "newsletter"; email: string };

/** Posts a lead to /api/contact. Resolves `true` only when the server accepted it. */
export async function submitLead(
  payload: LeadPayload & { website?: string }
): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
