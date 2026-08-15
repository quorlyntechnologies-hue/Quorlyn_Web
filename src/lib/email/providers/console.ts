import type { EmailMessage, EmailProvider, SendResult } from "@/lib/email/types";

/**
 * Development provider: prints the message instead of sending it.
 *
 * Used when no real provider is configured, so local work on the inquiry flow
 * shows exactly what would have gone out — and, more importantly, so a
 * submission during setup is never silently lost.
 *
 * Reports `ok: false, reason: "not_configured"` rather than pretending to
 * succeed: the caller needs to know the visitor did not actually get an email.
 */
export function createConsoleProvider(): EmailProvider {
  return {
    name: "console",
    configured: false,

    async send(message: EmailMessage): Promise<SendResult> {
      console.info(
        [
          "",
          "──────── email (not sent — no provider configured) ────────",
          `to:      ${Array.isArray(message.to) ? message.to.join(", ") : message.to}`,
          `subject: ${message.subject}`,
          message.replyTo ? `replyTo: ${message.replyTo}` : null,
          "",
          message.text,
          "───────────────────────────────────────────────────────────",
        ]
          .filter(Boolean)
          .join("\n"),
      );

      return { ok: false, provider: "console", reason: "not_configured" };
    },
  };
}
