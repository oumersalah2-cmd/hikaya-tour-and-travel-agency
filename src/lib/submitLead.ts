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
      email?: string;
      phone: string;
      travelers: string;
      package: string;
      preferredDates?: string;
      message?: string;
    }
  | { type: "newsletter"; email: string };

export type SubmitLeadResult = {
  ok: boolean;
  error?: string;
};

/** Posts a lead to /api/contact. */
export async function submitLead(
  payload: LeadPayload & { website?: string }
): Promise<SubmitLeadResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.error || `error_${res.status}` };
    }
    return { ok: true };
  } catch (error) {
    console.error("[submitLead] network or server error", error);
    return { ok: false, error: "network_error" };
  }
}
