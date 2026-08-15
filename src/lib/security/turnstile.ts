import "server-only";

/**
 * Cloudflare Turnstile verification.
 *
 * Chosen over a CAPTCHA because it is free at this scale, needs no interaction
 * from the visitor, and does not send behavioural data to an advertising
 * business — which matters given the privacy policy this site publishes.
 *
 * Unconfigured, `verifyTurnstile` returns `skipped`. The form then still works
 * in development and before the keys are issued; the caller decides whether to
 * accept a skipped check, and logs it in production.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const isTurnstileConfigured = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY,
);

export type TurnstileResult =
  | { ok: true; skipped: boolean }
  | { ok: false; skipped: false; reason: string };

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };

  if (!token) return { ok: false, skipped: false, reason: "missing-token" };

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp && remoteIp !== "unknown") body.append("remoteip", remoteIp);

  try {
    // Bounded: a hanging verification must not hold the request open.
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });

    const result = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!result.success) {
      return {
        ok: false,
        skipped: false,
        reason: result["error-codes"]?.join(",") ?? "verification-failed",
      };
    }

    return { ok: true, skipped: false };
  } catch (error) {
    console.error("[turnstile] verification error", error);
    return { ok: false, skipped: false, reason: "verification-unavailable" };
  }
}
