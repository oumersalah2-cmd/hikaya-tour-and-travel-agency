"use client";

import { useActionState } from "react";
import { Lock, AlertCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="form-input pl-10"
          />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
