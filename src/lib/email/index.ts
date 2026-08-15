import "server-only";

import { createConsoleProvider } from "@/lib/email/providers/console";
import { createResendProvider } from "@/lib/email/providers/resend";
import type { EmailMessage, EmailProvider, SendResult } from "@/lib/email/types";

/**
 * Email entry point.
 *
 * Provider is selected by `EMAIL_PROVIDER`; anything unconfigured falls back to
 * the console provider, which logs the message so a submission during setup is
 * visible rather than lost.
 */

let cached: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (cached) return cached;

  const requested = (process.env.EMAIL_PROVIDER ?? "resend").toLowerCase();

  const provider =
    requested === "console" ? createConsoleProvider() : createResendProvider();

  cached = provider.configured ? provider : createConsoleProvider();
  return cached;
}

export const isEmailConfigured = () => getEmailProvider().configured;

/**
 * Sends without throwing.
 *
 * Callers are workflows where the email is secondary to the database write —
 * an inquiry that is stored but unnotified is recoverable; one that is lost
 * because the mail provider was down is not. Failures are logged and returned,
 * never raised.
 */
export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  const provider = getEmailProvider();
  const result = await provider.send(message);

  if (!result.ok && result.reason === "send_failed") {
    console.error(`[email] ${provider.name} send failed:`, result.detail);
  }

  return result;
}

/** Where staff notifications go. Falls back to the published contact address. */
export function adminInbox(): string | null {
  return process.env.CONTACT_INBOX ?? process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;
}

export type { EmailMessage, SendResult } from "@/lib/email/types";
