import { Download } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import LeadsManager from "@/components/admin/LeadsManager";
import { listLeads } from "@/lib/store";

export const metadata = { title: "Leads & Inbox" };

export default async function LeadsPage() {
  const leads = await listLeads();
  const exportButton = (
    // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
    <a
      href="/api/admin/leads/export"
      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:border-accent-400"
    >
      <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
    </a>
  );
  return (
    <>
      <PageHeader
        title="Leads & Inbox"
        description="Booking requests, contact messages and newsletter sign-ups from the website."
        action={exportButton}
      />
      <LeadsManager leads={leads} />
    </>
  );
}
