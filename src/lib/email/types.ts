/**
 * Email provider contract.
 *
 * Everything that sends mail talks to this interface, never to a vendor SDK.
 * Swapping Resend for SES, Postmark or SMTP means adding one file under
 * `providers/` and changing `EMAIL_PROVIDER` — no call sites move.
 */

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendResult =
  | { ok: true; id?: string; provider: string }
  | { ok: false; provider: string; reason: "not_configured" | "send_failed"; detail?: string };

export interface EmailProvider {
  readonly name: string;
  readonly configured: boolean;
  send(message: EmailMessage): Promise<SendResult>;
}
