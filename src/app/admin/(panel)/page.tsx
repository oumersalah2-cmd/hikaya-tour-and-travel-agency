import Link from "next/link";
import { Inbox, CalendarCheck, MessageSquare, Mail, Images, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { StatusBadge, TypeBadge } from "@/components/admin/Badges";
import { getSettings, hasContent } from "@/lib/content";
import { getGallery } from "@/lib/gallery";
import { listLeads } from "@/lib/store";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const [leads, gallery, settings, customTestimonials, customPackages] = await Promise.all([
    listLeads(),
    getGallery(),
    getSettings(),
    hasContent("testimonials"),
    hasContent("packages"),
  ]);

  const checklist = [
    {
      done: Boolean(
        settings.emails[0] &&
          !settings.emails[0].includes("hikayatour.com") &&
          !settings.emails[0].includes("example.com")
      ),
      label: "Enter your real e-mail address (and double-check phone / WhatsApp)",
      href: "/admin/settings",
    },
    { done: customPackages, label: "Review packages and prices", href: "/admin/packages" },
    { done: customTestimonials, label: "Replace sample testimonials with real customer reviews", href: "/admin/testimonials" },
    { done: gallery.length > 0, label: "Add photos to the gallery", href: "/admin/gallery" },
    {
      done: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      label: "Set NEXT_PUBLIC_SITE_URL to your real domain (server setting)",
    },
    {
      done: Boolean(process.env.CONTACT_WEBHOOK_URL),
      label: "Optional: e-mail / chat alerts for new leads (CONTACT_WEBHOOK_URL)",
    },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  const count = (fn: (l: (typeof leads)[number]) => boolean) => leads.filter(fn).length;
  const stats = [
    { label: "New leads", value: count((l) => l.status === "new"), icon: Inbox, tone: "bg-red-50 text-red-600", href: "/admin/leads" },
    { label: "Booking requests", value: count((l) => l.type === "booking"), icon: CalendarCheck, tone: "bg-accent-400/15 text-accent-700", href: "/admin/leads" },
    { label: "Contact messages", value: count((l) => l.type === "contact"), icon: MessageSquare, tone: "bg-primary-50 text-primary-500", href: "/admin/leads" },
    { label: "Newsletter sign-ups", value: count((l) => l.type === "newsletter"), icon: Mail, tone: "bg-emerald-50 text-emerald-600", href: "/admin/leads" },
    { label: "Gallery photos", value: gallery.filter((g) => g.visible).length, icon: Images, tone: "bg-violet-50 text-violet-600", href: "/admin/gallery", hint: `${gallery.length} total` },
  ];

  // Leads per day, last 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (13 - i));
    return d;
  });
  const perDay = days.map((d) => {
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    return leads.filter((l) => {
      const t = new Date(l.createdAt);
      return t >= d && t < next;
    }).length;
  });
  const max = Math.max(1, ...perDay);
  const recent = leads.slice(0, 6);

  return (
    <>
      <PageHeader title="Dashboard" description="A quick overview of enquiries and website content." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, tone, href, hint }) => (
          <Link key={label} href={href} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold tabular-nums">{value}</p>
            <p className="mt-1 text-sm text-gray-500">{label}{hint && <span className="text-gray-400"> · {hint}</span>}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="font-display text-lg font-bold">Leads · last 14 days</h2>
          <div className="mt-6 flex h-40 items-end gap-1.5" role="img" aria-label={`Leads per day: ${perDay.join(", ")}`}>
            {perDay.map((n, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] font-semibold text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">{n}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-accent-500 to-accent-300"
                  style={{ height: `${Math.max(n === 0 ? 3 : 8, (n / max) * 100)}%`, opacity: n === 0 ? 0.25 : 1 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-gray-400">
            <span>{days[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
            <span>Today</span>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Latest enquiries</h2>
            <Link href="/admin/leads" className="flex items-center gap-1 text-sm font-semibold text-accent-700 hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
              No enquiries yet. They will appear here as soon as someone uses the website forms.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{l.name || l.email}</p>
                    <p className="truncate text-sm text-gray-500">{l.package || l.subject || l.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TypeBadge type={l.type} />
                    <StatusBadge status={l.status} />
                    <time className="w-20 text-right text-xs text-gray-400" dateTime={l.createdAt}>
                      {new Date(l.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Go-live checklist</h2>
          <span className="text-sm font-semibold text-gray-500">
            {doneCount} of {checklist.length} done
          </span>
        </div>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuemin={0} aria-valuemax={checklist.length} aria-valuenow={doneCount}>
          <div className="h-full rounded-full bg-gradient-to-r from-accent-300 to-accent-500" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {checklist.map((c) => {
            const Icon = c.done ? CheckCircle2 : Circle;
            const inner = (
              <>
                <Icon className={`h-5 w-5 shrink-0 ${c.done ? "text-emerald-500" : "text-gray-300"}`} aria-hidden="true" />
                <span className={c.done ? "text-gray-400 line-through" : "font-medium"}>{c.label}</span>
              </>
            );
            return (
              <li key={c.label}>
                {c.href && !c.done ? (
                  <Link href={c.href} className="flex items-center gap-3 rounded-xl p-3 text-sm transition-colors hover:bg-gray-50">
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl p-3 text-sm">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
