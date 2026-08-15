import { NextResponse } from "next/server";

import { isEmailConfigured } from "@/lib/email";
import { isTurnstileConfigured } from "@/lib/security/turnstile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Health check, and the Supabase keep-alive.
 *
 * Free Supabase projects pause after 7 days without a database request. A
 * marketing site can easily go a week without a form submission, and a paused
 * project means the inquiry form starts failing silently. The daily Vercel cron
 * in `vercel.json` hits this endpoint, which performs one trivial query — that
 * is enough to keep the project awake.
 *
 * It doubles as a status probe: the response says which integrations are
 * actually wired up, without revealing any keys.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Vercel signs cron invocations when CRON_SECRET is set. Browsers can still
  // read the endpoint — it exposes booleans, not secrets — but a signed caller
  // is distinguishable from a random one.
  const secret = process.env.CRON_SECRET;
  const authorized =
    !secret || request.headers.get("authorization") === `Bearer ${secret}`;

  const supabase = createSupabaseAdminClient();
  let database: "ok" | "error" | "not_configured" = "not_configured";

  if (supabase) {
    // Cheapest possible query that still counts as activity.
    const { error } = await supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .limit(1);

    database = error ? "error" : "ok";
    if (error) console.error("[health] database check failed", error.message);
  }

  const body = {
    status: database === "error" ? "degraded" : "ok",
    checkedAt: new Date().toISOString(),
    services: {
      database,
      email: isEmailConfigured() ? "ok" : "not_configured",
      turnstile: isTurnstileConfigured ? "ok" : "not_configured",
    },
    keepAlive: authorized,
  };

  return NextResponse.json(body, {
    status: database === "error" ? 503 : 200,
    headers: { "cache-control": "no-store" },
  });
}
