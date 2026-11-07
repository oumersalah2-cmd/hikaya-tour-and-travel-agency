import Sidebar from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { listLeads } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const leads = await listLeads();
  const newLeads = leads.filter((l) => l.status === "new").length;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar newLeads={newLeads} />
      <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
