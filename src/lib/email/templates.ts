import { company } from "@/content/company";

/**
 * Branded transactional email templates.
 *
 * Built as table-based HTML with inline styles, because email clients strip
 * <style> blocks, ignore flexbox and mangle CSS custom properties. Every
 * template ships a plain-text alternative — some clients render only that, and
 * spam filters penalise HTML-only mail.
 *
 * The header band is dark with the brand gradient; the body is light. A
 * fully dark email inverts unpredictably in Gmail's dark mode, so the brand
 * shows up in the band and accents rather than across the whole message.
 */

const BRAND_GRADIENT = "linear-gradient(90deg, #00CDFD 0%, #1757FC 55%, #B914FC 100%)";
const SYMBOL_URL = `${company.url}/brand/quorlyn-symbol.png`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout({ heading, body }: { heading: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e8ee;">

    <tr><td style="height:3px;background-color:#1757FC;background-image:${BRAND_GRADIENT};font-size:0;line-height:0;">&nbsp;</td></tr>

    <tr><td style="background-color:#05070B;padding:24px 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;padding-right:12px;">
          <img src="${SYMBOL_URL}" width="34" height="34" alt="" style="display:block;border:0;">
        </td>
        <td style="vertical-align:middle;">
          <div style="color:#F8F8F8;font-size:15px;letter-spacing:4px;font-weight:500;">QUORLYN</div>
          <div style="color:#7B8AA0;font-size:8px;letter-spacing:3px;margin-top:3px;">TECHNOLOGY</div>
        </td>
      </tr></table>
    </td></tr>

    <tr><td style="padding:32px;">
      <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#0d1220;font-weight:600;">${escapeHtml(heading)}</h1>
      ${body}
    </td></tr>

    <tr><td style="padding:20px 32px;background-color:#fafbfc;border-top:1px solid #e4e8ee;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7684;">
        ${escapeHtml(company.legalName)} · ${escapeHtml(company.location.locality)}, ${escapeHtml(company.location.country)}<br>
        <a href="${company.url}" style="color:#1757FC;text-decoration:none;">${escapeHtml(company.domain)}</a>
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

const paragraph = (text: string) =>
  `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#3b4552;">${text}</p>`;

const referenceBlock = (reference: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
    <tr><td style="background-color:#f4f7fc;border:1px solid #dce4f2;border-radius:8px;padding:16px 20px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#6b7684;margin-bottom:6px;">Your reference</div>
      <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:18px;color:#0d1220;letter-spacing:1px;">${escapeHtml(reference)}</div>
    </td></tr>
  </table>`;

const detailRow = (label: string, value: string) =>
  `<tr>
    <td style="padding:8px 0;font-size:13px;color:#6b7684;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;font-size:14px;color:#0d1220;vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`;

export type InquiryEmailData = {
  reference: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  preferredContact?: string;
  message: string;
};

/** Sent to the visitor. Confirms receipt and sets an expectation — nothing more. */
export function inquiryConfirmationEmail(data: InquiryEmailData) {
  const firstName = data.name.trim().split(/\s+/)[0] ?? data.name;

  const html = layout({
    heading: "We have your project inquiry",
    body: [
      paragraph(`Hi ${escapeHtml(firstName)},`),
      paragraph(
        "Thanks for getting in touch. Your inquiry is with our engineering team — an engineer will read it and reply personally, usually within two working days.",
      ),
      referenceBlock(data.reference),
      paragraph("Here is what you sent, for your records:"),
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-top:1px solid #e9edf3;">
        ${detailRow("Project type", data.projectType)}
        ${data.budget ? detailRow("Budget", data.budget) : ""}
        ${data.timeline ? detailRow("Timeline", data.timeline) : ""}
        ${data.company ? detailRow("Company", data.company) : ""}
      </table>`,
      paragraph(
        `<span style="color:#6b7684;font-size:14px;">Replying to this email adds to the same conversation — no need to submit the form again.</span>`,
      ),
    ].join(""),
  });

  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for getting in touch. Your inquiry is with our engineering team — an engineer will read it and reply personally, usually within two working days.",
    "",
    `Your reference: ${data.reference}`,
    "",
    `Project type: ${data.projectType}`,
    data.budget ? `Budget: ${data.budget}` : null,
    data.timeline ? `Timeline: ${data.timeline}` : null,
    data.company ? `Company: ${data.company}` : null,
    "",
    "Replying to this email adds to the same conversation — no need to submit the form again.",
    "",
    `${company.legalName} · ${company.location.locality}, ${company.location.country}`,
    company.url,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    subject: `We have your inquiry — ${data.reference}`,
    html,
    text,
  };
}

/** Sent to the Quorlyn inbox. Front-loads whatever decides whether to reply fast. */
export function inquiryNotificationEmail(data: InquiryEmailData) {
  const html = layout({
    heading: `New inquiry — ${data.reference}`,
    body: [
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-top:1px solid #e9edf3;">
        ${detailRow("Name", data.name)}
        ${detailRow("Email", data.email)}
        ${data.company ? detailRow("Company", data.company) : ""}
        ${data.phone ? detailRow("Phone", data.phone) : ""}
        ${detailRow("Project type", data.projectType)}
        ${data.budget ? detailRow("Budget", data.budget) : ""}
        ${data.timeline ? detailRow("Timeline", data.timeline) : ""}
        ${data.preferredContact ? detailRow("Prefers", data.preferredContact) : ""}
      </table>`,
      `<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#6b7684;margin-bottom:8px;">Project description</div>`,
      `<div style="background-color:#f7f9fb;border-left:3px solid #1757FC;padding:16px 18px;border-radius:0 6px 6px 0;margin-bottom:24px;font-size:14px;line-height:1.65;color:#3b4552;white-space:pre-wrap;">${escapeHtml(data.message)}</div>`,
      `<a href="${company.url}/admin/inquiries" style="display:inline-block;background-color:#0d1220;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:500;">Open in admin</a>`,
    ].join(""),
  });

  const text = [
    `New inquiry — ${data.reference}`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    `Project type: ${data.projectType}`,
    data.budget ? `Budget: ${data.budget}` : null,
    data.timeline ? `Timeline: ${data.timeline}` : null,
    data.preferredContact ? `Prefers: ${data.preferredContact}` : null,
    "",
    "Description:",
    data.message,
    "",
    `${company.url}/admin/inquiries`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject: `New inquiry — ${data.name} (${data.reference})`, html, text };
}
