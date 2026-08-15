"use client";

import { createBrowserClient } from "@supabase/ssr";

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

/**
 * Browser client, used only by the admin sign-in form so Supabase can set the
 * session cookies. The public site makes no direct database calls — everything
 * goes through server routes.
 */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
