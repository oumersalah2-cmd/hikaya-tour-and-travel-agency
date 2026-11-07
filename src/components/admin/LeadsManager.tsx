"use client";

import { useMemo, useState, useTransition } from "react";
import { ChevronDown, Search, Trash2, Phone, Mail, MessageCircle, Save } from "lucide-react";
import { StatusBadge, TypeBadge } from "@/components/admin/Badges";
import { deleteLeadAction, saveLeadAction } from "@/app/admin/actions";
import type { Lead, LeadStatus, LeadType } from "@/lib/store";

const statusTabs: { id: "all" | LeadStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "closed", label: "Closed" },
];
const typeOptions: { id: "all" | LeadType; label: string }[] = [
  { id: "all", label: "All types" },
  { id: "booking", label: "Bookings" },
  { id: "contact", label: "Messages" },
  { id: "newsletter", label: "Newsletter" },
];

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function LeadRow({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const dirty = status !== lead.status || notes !== lead.notes;
  const wa = lead.phone.replace(/[^\d]/g, "");

  const save = () =>
    start(async () => {
      await saveLeadAction(lead.id, status, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });

  const remove = () => {
    if (confirm(`Delete this ${lead.type} from ${lead.name || lead.email}? This cannot be undone.`)) {
      start(() => deleteLeadAction(lead.id));
    }
  };

  const detail = (label: string, value: string) =>
    value ? (
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</dt>
        <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm">{value}</dd>
      </div>
    ) : null;

  return (
    <li className={`rounded-2xl border bg-white shadow-sm transition-shadow ${open ? "border-accent-300 shadow-md" : "border-gray-100"} ${pending ? "opacity-60" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-4 text-left"
      >
        <div className="min-w-0 flex-1 basis-48">
          <p className="truncate font-semibold">{lead.name || lead.email}</p>
          <p className="truncate text-sm text-gray-500">{lead.package || lead.subject || lead.email}</p>
        </div>
        <TypeBadge type={lead.type} />
        <StatusBadge status={lead.status} />
        <time className="text-xs text-gray-400" dateTime={lead.createdAt}>{fmt(lead.createdAt)}</time>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="space-y-5 border-t border-gray-100 p-4 sm:p-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {detail("Name", lead.name)}
            {detail("Email", lead.email)}
            {detail("Phone", lead.phone)}
            {detail("Package", lead.package)}
            {detail("Travelers", lead.travelers)}
            {detail("Preferred dates", lead.preferredDates)}
            {detail("Subject", lead.subject)}
          </dl>
          {lead.message && (
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Message</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm">{lead.message}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {lead.phone && (
              <>
                <a href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:border-accent-400"><Phone className="h-3.5 w-3.5" /> Call</a>
                {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:border-[#25D366]"><MessageCircle className="h-3.5 w-3.5 text-[#25D366]" /> WhatsApp</a>}
              </>
            )}
            <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:border-accent-400"><Mail className="h-3.5 w-3.5" /> Email</a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[200px_1fr]">
            <div>
              <label htmlFor={`s-${lead.id}`} className="mb-1.5 block text-xs font-semibold text-gray-600">Status</label>
              <select id={`s-${lead.id}`} value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className="form-input">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label htmlFor={`n-${lead.id}`} className="mb-1.5 block text-xs font-semibold text-gray-600">Internal notes</label>
              <textarea id={`n-${lead.id}`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to admins…" className="form-input resize-y" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={remove} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
            <div className="flex items-center gap-3">
              {saved && <span role="status" className="text-sm font-medium text-emerald-600">Saved ✓</span>}
              <button type="button" onClick={save} disabled={!dirty || pending} className="btn-primary px-5 py-2 text-sm">
                <Save className="h-4 w-4" /> Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

export default function LeadsManager({ leads }: { leads: Lead[] }) {
  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [type, setType] = useState<"all" | LeadType>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (status === "all" || l.status === status) &&
        (type === "all" || l.type === type) &&
        (!q || [l.name, l.email, l.phone, l.subject, l.package, l.message].some((v) => v.toLowerCase().includes(q)))
    );
  }, [leads, status, type, query]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Filter by status" className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
          {statusTabs.map((tab) => {
            const n = tab.id === "all" ? leads.length : leads.filter((l) => l.status === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={status === tab.id}
                onClick={() => setStatus(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${status === tab.id ? "bg-primary-700 text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {tab.label} <span className="opacity-60">{n}</span>
              </button>
            );
          })}
        </div>

        <select aria-label="Filter by type" value={type} onChange={(e) => setType(e.target.value as "all" | LeadType)} className="form-input w-auto py-2.5">
          {typeOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>

        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input type="search" aria-label="Search leads" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone, package…" className="form-input py-2.5 pl-10" />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          {leads.length === 0 ? "No enquiries yet — they will show up here as soon as someone submits a form on the website." : "No leads match these filters."}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
        </ul>
      )}
    </>
  );
}
