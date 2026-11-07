import type { LeadStatus, LeadType } from "@/lib/store";

const statusStyle: Record<LeadStatus, string> = {
  new: "bg-red-50 text-red-700 ring-red-200",
  contacted: "bg-amber-50 text-amber-800 ring-amber-200",
  closed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};
const typeStyle: Record<LeadType, string> = {
  booking: "bg-accent-400/15 text-accent-800 ring-accent-300",
  contact: "bg-primary-50 text-primary-600 ring-primary-100",
  newsletter: "bg-violet-50 text-violet-700 ring-violet-200",
};
const typeLabel: Record<LeadType, string> = { booking: "Booking", contact: "Message", newsletter: "Newsletter" };

const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset";

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={`${base} ${statusStyle[status]}`}>{status}</span>
);
export const TypeBadge = ({ type }: { type: LeadType }) => (
  <span className={`${base} ${typeStyle[type]}`}>{typeLabel[type]}</span>
);
