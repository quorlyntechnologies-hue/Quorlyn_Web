import { NextResponse } from "next/server";

import {
  adminInbox,
  isEmailConfigured,
  sendEmail,
} from "@/lib/email";
import { inquiryConfirmationEmail, inquiryNotificationEmail } from "@/lib/email/templates";
import { validateEnquiry, type EnquiryInput } from "@/lib/enquiry";
import {
  clientIp,
  consumeRateLimit,
  hashIdentifier,
  rateLimits,
} from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Project inquiry endpoint.
 *
 * Order matters: cheap rejections first, then bot verification, then the
 * database write, and only then email. The write is the thing that must not be
 * lost — if email fails afterwards the lead is still captured and visible in
 * the admin, and the response says so honestly.
 */

export const runtime = "nodejs";

type Payload = Partial<EnquiryInput> & {
  website?: string;
  turnstileToken?: string;
  sourcePath?: string;
};

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: invisible to people, irresistible to naive bots. 200 so the
  // sender learns nothing from the response.
  if (body.website) return NextResponse.json({ ok: true });

  const ip = clientIp(request);

  const [burst, daily] = await Promise.all([
    consumeRateLimit(rateLimits.inquiry, ip),
    consumeRateLimit(rateLimits.inquiryDaily, ip),
  ]);

  if (burst.limited || daily.limited) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Please try again later." },
      { status: 429 },
    );
  }

  const { errors, valid } = validateEnquiry(body);
  if (!valid) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", errors },
      { status: 422 },
    );
  }

  const turnstile = await verifyTurnstile(body.turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json(
      { error: "We could not verify that you are human. Please try again.", code: "turnstile" },
      { status: 403 },
    );
  }

  const data = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    company: body.company?.trim() || null,
    phone: body.phone?.trim() || null,
    project_type: body.projectType!.trim(),
    service_slug: null,
    budget: body.budget?.trim() || null,
    timeline: body.timeline?.trim() || null,
    preferred_contact: body.preferredContact?.trim() || null,
    message: body.message!.trim(),
    source_path: body.sourcePath?.slice(0, 200) ?? null,
    ip_hash: await hashIdentifier(ip),
    user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
  };

  const supabase = createSupabaseAdminClient();

  // No database yet: validate, log so nothing is silently dropped, and tell the
  // visitor the truth rather than showing a success state that means nothing.
  if (!supabase) {
    console.warn("[inquiries] Supabase not configured — inquiry not stored:", {
      name: data.name,
      email: data.email,
      project_type: data.project_type,
    });
    return NextResponse.json(
      {
        error: "The inquiry system is not connected yet.",
        code: "not_configured",
      },
      { status: 503 },
    );
  }

  // Duplicate guard: a double-submit (impatient click, retried request) should
  // return the original reference rather than opening a second lead.
  const { data: recent } = await supabase
    .from("inquiries")
    .select("reference, created_at")
    .eq("email", data.email)
    .gte("created_at", new Date(Date.now() - 2 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent) {
    return NextResponse.json({ ok: true, reference: recent.reference, duplicate: true });
  }

  const { data: inserted, error } = await supabase
    .from("inquiries")
    .insert(data)
    .select("reference")
    .single();

  if (error || !inserted) {
    console.error("[inquiries] insert failed", error?.message);
    return NextResponse.json(
      { error: "We could not save that just now. Please try again." },
      { status: 502 },
    );
  }

  const reference = inserted.reference;

  // Everything past this point is best-effort. The lead is already safe.
  const emailData = {
    reference,
    name: data.name,
    email: data.email,
    company: data.company ?? undefined,
    phone: data.phone ?? undefined,
    projectType: data.project_type,
    budget: data.budget ?? undefined,
    timeline: data.timeline ?? undefined,
    preferredContact: data.preferred_contact ?? undefined,
    message: data.message,
  };

  const inbox = adminInbox();

  await Promise.allSettled([
    supabase.from("notifications").insert({
      kind: "inquiry",
      title: `New inquiry from ${data.name}`,
      body: data.message.slice(0, 200),
      link: "/admin/inquiries",
    }),

    sendEmail({ to: data.email, ...inquiryConfirmationEmail(emailData) }),

    inbox
      ? sendEmail({
          to: inbox,
          replyTo: data.email,
          ...inquiryNotificationEmail(emailData),
        })
      : Promise.resolve(),
  ]);

  if (!isEmailConfigured()) {
    console.warn(
      `[inquiries] ${reference} stored, but no email provider is configured — nobody was notified.`,
    );
  }

  return NextResponse.json({ ok: true, reference, emailed: isEmailConfigured() });
}
