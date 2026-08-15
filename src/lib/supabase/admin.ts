import "server-only";

import { createClient } from "@supabase/supabase-js";

import { supabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

/**
 * Whether the server can act with elevated privileges. Declared here rather
 * than in `config.ts` because that module is bundled into the browser — see the
 * note at the bottom of it.
 */
export const isSupabaseServiceConfigured = Boolean(
  supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 * Service-role client. **Bypasses every RLS policy.**
 *
 * Only for operations the public site must perform without a session:
 * writing an inquiry, consuming a rate-limit bucket, recording an audit entry.
 * Never use it to serve data to a signed-in user — that path must go through
 * `createSupabaseServerClient()` so policies still apply.
 *
 * `server-only` makes importing this from a client component a build error, so
 * the key cannot be bundled by accident.
 */
export function createSupabaseAdminClient() {
  if (!isSupabaseServiceConfigured) return null;

  return createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      // No session to persist or refresh: this client is per-request and
      // authenticates with the key alone.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
