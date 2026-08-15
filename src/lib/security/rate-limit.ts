import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Rate limiting, backed by Postgres.
 *
 * The obvious implementation — a Map in module scope — does not work on Vercel:
 * each serverless instance has its own memory, instances are recycled
 * constantly, and an attacker gets a fresh budget with every cold start. A
 * shared counter in the database is the only thing that actually limits.
 *
 * Fails **open** when Supabase is not configured, so local development and the
 * pre-backend deployment still work. That is a deliberate trade: the endpoints
 * this guards do nothing persistent without a database anyway.
 */

export type RateLimitRule = {
  /** Namespace, e.g. "inquiry". Combined with the identifier to form a bucket. */
  key: string;
  limit: number;
  windowSeconds: number;
};

export const rateLimits = {
  /** Public inquiry submissions, per IP. */
  inquiry: { key: "inquiry", limit: 5, windowSeconds: 60 * 60 },
  /** A wider daily ceiling so a slow drip cannot fill the inbox overnight. */
  inquiryDaily: { key: "inquiry-day", limit: 20, windowSeconds: 60 * 60 * 24 },
  /** Sign-in attempts, per IP — credential stuffing protection. */
  login: { key: "login", limit: 10, windowSeconds: 15 * 60 },
} satisfies Record<string, RateLimitRule>;

export type RateLimitResult = { limited: boolean; enforced: boolean };

/**
 * Consumes one unit from the caller's bucket.
 *
 * `enforced` is false when there was no database to count in — callers may log
 * that, but should still serve the request.
 */
export async function consumeRateLimit(
  rule: RateLimitRule,
  identifier: string,
): Promise<RateLimitResult> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { limited: false, enforced: false };

  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_bucket: `${rule.key}:${identifier}`,
    p_limit: rule.limit,
    p_window_seconds: rule.windowSeconds,
  });

  if (error) {
    // A limiter outage must not take the form down with it.
    console.error("[rate-limit] failed, allowing request", error.message);
    return { limited: false, enforced: false };
  }

  return { limited: data === true, enforced: true };
}

/**
 * Best-effort client IP.
 *
 * Behind Vercel and Cloudflare the left-most x-forwarded-for entry is the real
 * client. Do not use this for anything but rate limiting and abuse hashing —
 * the header is caller-supplied and only trustworthy because the platform
 * rewrites it.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Salted, one-way hash of an identifier.
 *
 * Stored on inquiries so repeated abuse from one source can be correlated
 * without keeping an IP address. Without a configured salt the value is not
 * stored at all rather than stored weakly.
 */
export async function hashIdentifier(value: string): Promise<string | null> {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) return null;

  const bytes = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
