"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, Images, ExternalLink, LogOut, Settings, Package, MapPin, Star, Info } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import HikayaLogo from "@/components/ui/HikayaLogo";

const groups = [
  {
    title: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/leads", label: "Leads & Inbox", icon: Inbox },
    ],
  },
  {
    title: "Website content",
    links: [
      { href: "/admin/settings", label: "Business info", icon: Settings },
      { href: "/admin/packages", label: "Packages & prices", icon: Package },
      { href: "/admin/destinations", label: "Destinations", icon: MapPin },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star },
      { href: "/admin/faq", label: "FAQ", icon: Info },
    ],
  },
];

export default function Sidebar({ newLeads }: { newLeads: number }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col bg-primary-800 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Link href="/" target="_blank" rel="noopener" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <HikayaLogo variant="full" inverted size="md" />
        </Link>
      </div>

      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-y-auto">
        {groups.map((group) => (
          <div key={group.title} className="flex gap-1 lg:flex-col">
            <p className="hidden px-4 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 lg:block">
              {group.title}
            </p>
            {group.links.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active ? "bg-accent-600 text-white shadow-glow" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                  {href === "/admin/leads" && newLeads > 0 && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">{newLeads}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex gap-2 border-t border-white/10 p-3 lg:flex-col">
        <Link
          href="/en"
          target="_blank"
          className="flex flex-1 items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" /> View website
        </Link>
        <form action={logoutAction} className="flex-1">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
