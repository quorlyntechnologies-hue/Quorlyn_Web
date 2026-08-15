"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Staff sign-in.
 *
 * Runs in the browser because Supabase Auth needs to set its session cookies
 * client-side; `proxy.ts` then refreshes them on subsequent requests. The
 * session alone grants nothing — every admin route re-checks the profile row
 * server-side through the DAL.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const fieldClass =
    "w-full rounded-md border border-line bg-elevated/60 px-4 py-3 text-fg " +
    "placeholder:text-subtle transition-[border-color,box-shadow] duration-150 ease-precise " +
    "hover:border-line-strong focus:border-cyan/50 focus:outline-none focus:ring-2 focus:ring-cyan/25";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured.");
      return;
    }

    setPending(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      // Deliberately vague: distinguishing "no such user" from "wrong password"
      // confirms which addresses are staff accounts.
      setError("That email and password combination did not work.");
      setPending(false);
      return;
    }

    track("admin_signed_in");

    // refresh() so the server re-renders with the new session cookie before we
    // navigate — otherwise the destination can render as signed-out once.
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/[0.06] px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="admin-email" className="text-sm font-medium text-fg">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(fieldClass, "mt-2.5")}
          placeholder="you@quorlyn.com.np"
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="text-sm font-medium text-fg">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(fieldClass, "mt-2.5")}
          placeholder="••••••••••••"
        />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
