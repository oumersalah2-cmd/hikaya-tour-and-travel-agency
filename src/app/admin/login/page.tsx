import { redirect } from "next/navigation";
import { Plane } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { adminConfigured, isAdmin } from "@/lib/auth";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = adminConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-500 shadow-glow">
            <Plane className="h-7 w-7 -rotate-45 text-primary-900" />
          </div>
          <h1 className="font-display text-2xl font-bold">HIKAYA Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage enquiries and your website content</p>
        </div>

        {configured ? (
          <LoginForm />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Admin isn’t set up yet</p>
            <p className="mt-1">
              Add <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> and{" "}
              <code className="rounded bg-amber-100 px-1">SESSION_SECRET</code> to your environment
              (see <code className="rounded bg-amber-100 px-1">.env.example</code>) and restart the server.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
