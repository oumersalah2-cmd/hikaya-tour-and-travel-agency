import { Download } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings, hasContent } from "@/lib/content";

export const metadata = { title: "Business info" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, custom] = await Promise.all([getSettings(), hasContent("settings")]);
  return (
    <>
      <PageHeader
        title="Business info"
        description="Phone, WhatsApp, e-mail, address, opening hours, social links and the numbers shown on the home page."
        action={
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
          <a
            href="/api/admin/backup"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:border-accent-400"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Download backup
          </a>
        }
      />
      <SettingsForm initial={settings} isCustom={custom} />
    </>
  );
}
