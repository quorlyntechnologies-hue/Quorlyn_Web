/**
 * Supabase configuration and availability.
 *
 * The site is built to run with no backend at all: without these variables the
 * public pages render normally, the inquiry form validates and returns an
 * honest "not connected yet" response, and the admin area shows a setup notice
 * instead of crashing. Nothing here throws at import time.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the public (browser-safe) credentials are present. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * NOTHING SERVER-ONLY BELONGS IN THIS FILE.
 *
 * It is imported by `client.ts`, so every statement here is bundled into the
 * browser. Next only inlines `NEXT_PUBLIC_*` values, so a stray
 * `process.env.SECRET` would evaluate to undefined rather than leak — but it
 * still puts the secret's name in a public artefact and invites the next person
 * to "fix" the undefined by making it public.
 *
 * The service-role check lives in `admin.ts`, which is marked `server-only`.
 */
