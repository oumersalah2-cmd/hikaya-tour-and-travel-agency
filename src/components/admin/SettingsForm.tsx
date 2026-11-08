"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, RotateCcw, Save } from "lucide-react";
import { resetSettingsAction, saveSettingsAction } from "@/app/admin/actions";
import type { SiteSettings } from "@/data/site";

const lines = (a: readonly string[]) => a.join("\n");

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  help,
  placeholder,
  full,
  rows,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  help?: string;
  placeholder?: string;
  full?: boolean;
  rows?: number;
}) {
  const id = `s-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </label>
      {rows ? (
        <textarea id={id} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="form-input py-2.5 text-sm" />
      ) : (
        <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="form-input py-2.5 text-sm" />
      )}
      {help && <p className="mt-1 text-xs text-gray-400">{help}</p>}
    </div>
  );
}

export default function SettingsForm({ initial, isCustom }: { initial: SiteSettings; isCustom: boolean }) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const dirty = useMemo(() => JSON.stringify(s) !== saved, [s, saved]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => setS((prev) => ({ ...prev, [key]: value }));

  const save = () =>
    start(async () => {
      const res = await saveSettingsAction(s);
      if (res.ok) {
        setSaved(JSON.stringify(s));
        setMessage({ ok: true, text: "Saved — the website now shows your new details." });
        router.refresh();
      } else {
        setMessage({ ok: false, text: res.error ?? "Could not save." });
      }
    });

  const reset = () => {
    if (!confirm("Restore the original placeholder details? Your saved business info will be lost.")) return;
    start(async () => {
      await resetSettingsAction();
      window.location.reload();
    });
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <p className="text-sm text-gray-500">
          {dirty ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Unsaved changes</span>
          ) : (
            "All changes saved"
          )}
        </p>
        <div className="flex gap-2">
          {isCustom && (
            <button type="button" onClick={reset} disabled={pending} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
              <RotateCcw className="h-4 w-4" /> Restore originals
            </button>
          )}
          <button type="button" onClick={save} disabled={!dirty || pending} className="btn-primary px-5 py-2 text-sm">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {message && (
        <p role="status" className={`flex items-start gap-2 rounded-xl p-3 text-sm ${message.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {!message.ok && <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          {message.text}
        </p>
      )}

      <Card title="Business" hint="Shown in the header, footer, page titles and search results.">
        <Input label="Business name" value={s.name} onChange={(v) => set("name", v)} />
        <Input label="Short name (logo text)" value={s.shortName} onChange={(v) => set("shortName", v)} />
      </Card>

      <Card title="Phone, WhatsApp & e-mail" hint="The first phone number and first e-mail are used for the call and e-mail buttons.">
        <Input label="Phone numbers (one per line)" rows={3} value={lines(s.phones)} onChange={(v) => set("phones", v.split("\n"))} placeholder="+251 911 000 000" />
        <Input label="E-mail addresses (one per line)" rows={3} value={lines(s.emails)} onChange={(v) => set("emails", v.split("\n"))} placeholder="info@yourdomain.com" />
        <Input
          label="WhatsApp number (digits only, with country code)"
          value={s.whatsapp}
          onChange={(v) => set("whatsapp", v.replace(/\D/g, ""))}
          placeholder="251911000000"
          help="Used for the green WhatsApp buttons. No + or spaces."
        />
        <Input label="WhatsApp number as shown to visitors" value={s.whatsappDisplay} onChange={(v) => set("whatsappDisplay", v)} placeholder="+251 911 000 000" />
        <Input label="Default WhatsApp message" full value={s.whatsappMessage} onChange={(v) => set("whatsappMessage", v)} help="What visitors’ chat starts with when they tap a WhatsApp button." />
      </Card>

      <Card title="Office address & opening hours" hint="One line per row. Afaan Oromoo and Amharic fall back to English if left empty.">
        <Input label="Address (English)" rows={3} value={lines(s.address.en)} onChange={(v) => set("address", { ...s.address, en: v.split("\n") })} />
        <Input label="Address (Afaan Oromoo)" rows={3} value={lines(s.address.om)} onChange={(v) => set("address", { ...s.address, om: v.split("\n") })} />
        <Input label="Address (አማርኛ)" rows={3} value={lines(s.address.am || [])} onChange={(v) => set("address", { ...s.address, am: v.split("\n") })} />
        <Input label="Opening hours (English)" rows={3} value={lines(s.hours.en)} onChange={(v) => set("hours", { ...s.hours, en: v.split("\n") })} />
        <Input label="Opening hours (Afaan Oromoo)" rows={3} value={lines(s.hours.om)} onChange={(v) => set("hours", { ...s.hours, om: v.split("\n") })} />
        <Input label="Opening hours (አማርኛ)" rows={3} value={lines(s.hours.am || [])} onChange={(v) => set("hours", { ...s.hours, am: v.split("\n") })} />
        <Input label="Google Maps link (optional)" full value={s.mapUrl} onChange={(v) => set("mapUrl", v)} placeholder="https://maps.google.com/…" />
      </Card>

      <Card title="Social media" hint="Paste the full page links. Empty ones are hidden. Icons appear in the website footer.">
        {(["facebook", "instagram", "tiktok", "telegram", "youtube"] as const).map((k) => (
          <Input
            key={k}
            label={k[0].toUpperCase() + k.slice(1)}
            value={s.social[k]}
            onChange={(v) => set("social", { ...s.social, [k]: v })}
            placeholder={`https://${k}.com/yourpage`}
          />
        ))}
      </Card>

      <Card title="Numbers on the home page" hint="The animated counters (shown with a + sign). Use real, current figures.">
        <Input label="Happy travelers" type="number" value={s.stats.travelers} onChange={(v) => set("stats", { ...s.stats, travelers: Number(v) || 0 })} />
        <Input label="Destinations" type="number" value={s.stats.destinations} onChange={(v) => set("stats", { ...s.stats, destinations: Number(v) || 0 })} />
        <Input label="Trips completed" type="number" value={s.stats.trips} onChange={(v) => set("stats", { ...s.stats, trips: Number(v) || 0 })} />
        <Input label="Years of experience" type="number" value={s.stats.experience} onChange={(v) => set("stats", { ...s.stats, experience: Number(v) || 0 })} />
      </Card>
    </div>
  );
}
