"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import { QuorlynMark } from "@/components/brand/QuorlynMark";
import { Turnstile, isTurnstileEnabled } from "@/components/contact/Turnstile";
import { ArrowRight, Button } from "@/components/ui/Button";
import { contact } from "@/content/company";
import { track } from "@/lib/analytics";
import {
  budgetRanges,
  contactPreferences,
  emptyEnquiry,
  projectTypes,
  serviceToProjectType,
  timelines,
  validateEnquiry,
  type EnquiryField,
  type EnquiryInput,
  type ValidationErrors,
} from "@/lib/enquiry";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const allFieldsTouched: Record<EnquiryField, boolean> = {
  name: true,
  email: true,
  company: true,
  phone: true,
  projectType: true,
  budget: true,
  timeline: true,
  preferredContact: true,
  message: true,
};

const fieldBase =
  "w-full rounded-md border bg-elevated/60 px-4 py-3 text-fg placeholder:text-subtle " +
  "transition-[border-color,box-shadow,background-color] duration-150 ease-precise " +
  "hover:border-line-strong focus:border-cyan/50 focus:bg-elevated focus:outline-none " +
  "focus:ring-2 focus:ring-cyan/25 disabled:opacity-50";

export function ContactForm() {
  const uid = useId().replace(/:/g, "");

  // Deep link from a service block: /contact?service=ai-engineering arrives with
  // the project type already chosen. Resolved in the state initialiser rather
  // than an effect, so the field is correct on first paint and never flickers.
  const searchParams = useSearchParams();
  const [values, setValues] = useState<EnquiryInput>(() => ({
    ...emptyEnquiry,
    projectType: serviceToProjectType[searchParams.get("service") ?? ""] ?? "",
  }));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [emailed, setEmailed] = useState(true);
  const [started, setStarted] = useState(false);

  const setField = (field: EnquiryField, value: string) => {
    // Funnel start fires once, on first interaction — measuring how many
    // visitors begin the form versus finish it is the point of tracking it.
    if (!started) {
      setStarted(true);
      track("inquiry_started");
    }
    setValues((v) => ({ ...v, [field]: value }));
    // Re-validate a field the moment it stops being wrong, so an error message
    // never lingers after the visitor has fixed it.
    if (errors[field]) {
      const { errors: next } = validateEnquiry({ ...values, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: next[field] }));
    }
  };

  const blur = (field: EnquiryField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const { errors: next } = validateEnquiry(values);
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setNotConfigured(false);

    const { errors: next, valid } = validateEnquiry(values);
    setErrors(next);
    setTouched(allFieldsTouched);

    if (!valid) {
      // Move focus to the first problem rather than leaving the visitor to
      // hunt for it — required for keyboard and screen reader users.
      const first = Object.keys(next)[0] as EnquiryField | undefined;
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    // Turnstile runs a managed challenge; on a slow connection the token may
    // not have arrived yet. Say so rather than submitting something the server
    // will reject.
    if (isTurnstileEnabled() && !turnstileToken) {
      setFormError("Just finishing the security check — try again in a moment.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: "",
          turnstileToken,
          sourcePath: window.location.pathname + window.location.search,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setReference(payload.reference ?? null);
        setEmailed(payload.emailed !== false);
        setStatus("success");
        setValues(emptyEnquiry);
        setTouched({});
        track("inquiry_submitted", { projectType: values.projectType });
        return;
      }

      if (payload.errors) setErrors(payload.errors as ValidationErrors);
      if (payload.code === "not_configured") setNotConfigured(true);

      // A consumed Turnstile token cannot be replayed, so clear it and let the
      // widget issue a fresh one before the visitor retries.
      if (payload.code === "turnstile") setTurnstileToken(null);

      setFormError(payload.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setFormError("We could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-cyan/25 bg-cyan/[0.04] p-8 text-center sm:p-12"
      >
        <QuorlynMark size={40} className="mx-auto" />
        <h2 className="mt-6 text-h3 text-fg">Inquiry received</h2>

        {reference && (
          <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-md border border-line bg-void/60 px-6 py-4">
            <span className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
              Your reference
            </span>
            <span className="mt-2 font-mono text-h4 tracking-[0.08em] text-accent">
              {reference}
            </span>
          </div>
        )}

        <p className="mx-auto mt-6 max-w-[48ch] leading-relaxed text-muted">
          {emailed
            ? "A confirmation is on its way to your inbox. An engineer will read this and reply personally, usually within two working days."
            : "It is logged with our team. An engineer will read it and reply personally, usually within two working days."}
        </p>

        <Button
          variant="secondary"
          className="mt-8"
          onClick={() => {
            setReference(null);
            setStatus("idle");
          }}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Error summary. Announced on change, and only rendered when relevant. */}
      {formError && (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/[0.06] px-5 py-4 text-sm"
        >
          <p className="font-medium text-danger">{formError}</p>
          {notConfigured && (
            <p className="mt-2 leading-relaxed text-muted">
              {contact.email ? (
                <>
                  Please email us directly at{" "}
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-accent underline underline-offset-4"
                  >
                    {contact.email}
                  </a>{" "}
                  while this is being set up.
                </>
              ) : (
                <>
                  The site owner needs to set <code className="font-mono text-fg">RESEND_API_KEY</code>{" "}
                  and <code className="font-mono text-fg">CONTACT_INBOX</code> in the environment.
                </>
              )}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          uid={uid}
          name="name"
          label="Name"
          required
          value={values.name}
          error={touched.name ? errors.name : undefined}
          onChange={setField}
          onBlur={blur}
          autoComplete="name"
          placeholder="Your name"
        />
        <Field
          uid={uid}
          name="email"
          label="Email"
          type="email"
          required
          value={values.email}
          error={touched.email ? errors.email : undefined}
          onChange={setField}
          onBlur={blur}
          autoComplete="email"
          placeholder="you@company.com"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          uid={uid}
          name="company"
          label="Company"
          optional
          value={values.company}
          error={touched.company ? errors.company : undefined}
          onChange={setField}
          onBlur={blur}
          autoComplete="organization"
          placeholder="Organisation name"
        />
        <Field
          uid={uid}
          name="phone"
          label="Phone"
          type="tel"
          optional
          value={values.phone}
          error={touched.phone ? errors.phone : undefined}
          onChange={setField}
          onBlur={blur}
          autoComplete="tel"
          placeholder="+977 …"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <SelectField
          uid={uid}
          name="projectType"
          label="Project type"
          required
          options={projectTypes}
          value={values.projectType}
          error={touched.projectType ? errors.projectType : undefined}
          onChange={setField}
          onBlur={blur}
        />
        <SelectField
          uid={uid}
          name="budget"
          label="Budget"
          optional
          options={budgetRanges}
          value={values.budget}
          error={touched.budget ? errors.budget : undefined}
          onChange={setField}
          onBlur={blur}
        />
        <SelectField
          uid={uid}
          name="timeline"
          label="Timeline"
          optional
          options={timelines}
          value={values.timeline}
          error={touched.timeline ? errors.timeline : undefined}
          onChange={setField}
          onBlur={blur}
        />
      </div>

      <SelectField
        uid={uid}
        name="preferredContact"
        label="Preferred way to reach you"
        optional
        options={contactPreferences}
        value={values.preferredContact}
        error={touched.preferredContact ? errors.preferredContact : undefined}
        onChange={setField}
        onBlur={blur}
      />

      <Field
        uid={uid}
        name="message"
        label="Project description"
        required
        multiline
        value={values.message}
        error={touched.message ? errors.message : undefined}
        onChange={setField}
        onBlur={blur}
        hint="What are you building, and what is currently in the way? A few sentences is plenty."
        placeholder="We have a working prototype and need it rebuilt properly before launch…"
      />

      {/* Honeypot — hidden from everyone except bots that fill every input. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Leave this empty</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Turnstile onToken={setTurnstileToken} className="pt-1" />

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={status === "submitting"} className="group">
          {status === "submitting" ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight />
            </>
          )}
        </Button>

        <p className="max-w-[42ch] text-sm text-subtle">
          We only use these details to reply. No mailing list, no third-party sharing.
        </p>
      </div>

      {/* Politely announces submission state to assistive technology. */}
      <p className="sr-only" role="status" aria-live="polite">
        {status === "submitting" ? "Sending your message" : ""}
      </p>
    </form>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 animate-spin rounded-full border-2 border-void/25 border-t-void"
    />
  );
}

type FieldProps = {
  uid: string;
  name: EnquiryField;
  label: string;
  value: string;
  error?: string;
  onChange: (field: EnquiryField, value: string) => void;
  onBlur: (field: EnquiryField) => void;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  hint?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

function Field({
  uid,
  name,
  label,
  value,
  error,
  onChange,
  onBlur,
  required,
  optional,
  multiline,
  hint,
  type = "text",
  placeholder,
  autoComplete,
}: FieldProps) {
  const id = `${uid}-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    name,
    value,
    placeholder,
    autoComplete,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(name, e.target.value),
    onBlur: () => onBlur(name),
    className: cn(fieldBase, error ? "border-danger/60" : "border-line"),
  };

  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} optional={optional} />
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-subtle">
          {hint}
        </p>
      )}
      <div className="mt-2.5">
        {multiline ? (
          <textarea {...shared} rows={6} className={cn(shared.className, "resize-y")} />
        ) : (
          <input {...shared} type={type} />
        )}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function SelectField({
  uid,
  name,
  label,
  options,
  value,
  error,
  onChange,
  onBlur,
  required,
  optional,
}: {
  uid: string;
  name: EnquiryField;
  label: string;
  options: readonly string[];
  value: string;
  error?: string;
  onChange: (field: EnquiryField, value: string) => void;
  onBlur: (field: EnquiryField) => void;
  required?: boolean;
  optional?: boolean;
}) {
  const id = `${uid}-${name}`;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} optional={optional} />
      <div className="relative mt-2.5">
        <select
          id={id}
          name={name}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          className={cn(
            fieldBase,
            "appearance-none pr-10",
            error ? "border-danger/60" : "border-line",
            !value && "text-subtle",
          )}
        >
          <option value="">Select…</option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-elevated text-fg">
              {option}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-subtle"
          fill="none"
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldLabel({
  htmlFor,
  label,
  required,
  optional,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm font-medium text-fg">
      {label}
      {required && (
        <span className="font-mono text-[10px] tracking-[0.1em] text-accent uppercase">
          Required
        </span>
      )}
      {optional && (
        <span className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">
          Optional
        </span>
      )}
    </label>
  );
}

/** Errors sit directly under their field and pair an icon with the text, so
 *  the state is not signalled by colour alone. */
function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm text-danger">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-3.5 shrink-0" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.85" fill="currentColor" />
      </svg>
      {message}
    </p>
  );
}
