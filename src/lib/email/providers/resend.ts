import type { EmailMessage, EmailProvider, SendResult } from "@/lib/email/types";

/**
 * Resend, over its REST API.
 *
 * No SDK: the surface used here is a single POST, and skipping the dependency
 * keeps the serverless bundle smaller and the upgrade path free of churn.
 *
 * Free plan at time of writing: 3,000 emails/month capped at 100/day on one
 * verified domain. The daily cap is the binding constraint — a burst of
 * inquiries plus their confirmations consumes two sends each.
 */
export function createResendProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Quorlyn <onboarding@resend.dev>";

  return {
    name: "resend",
    configured: Boolean(apiKey),

    async send(message: EmailMessage): Promise<SendResult> {
      if (!apiKey) return { ok: false, provider: "resend", reason: "not_configured" };

      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: Array.isArray(message.to) ? message.to : [message.to],
            subject: message.subject,
            html: message.html,
            text: message.text,
            ...(message.replyTo ? { reply_to: message.replyTo } : {}),
          }),
          signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
          const detail = await response.text();
          return { ok: false, provider: "resend", reason: "send_failed", detail };
        }

        const data = (await response.json()) as { id?: string };
        return { ok: true, id: data.id, provider: "resend" };
      } catch (error) {
        return {
          ok: false,
          provider: "resend",
          reason: "send_failed",
          detail: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}
