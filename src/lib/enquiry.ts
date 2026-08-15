/**
 * Enquiry shape and validation, shared by the form and the API route.
 *
 * One definition means the client cannot accept something the server rejects,
 * and the server never trusts the client's check. Hand-rolled rather than
 * pulling in a schema library — this is one object with seven fields.
 */

export const projectTypes = [
  "Product engineering",
  "AI engineering",
  "Platform & cloud",
  "Data engineering",
  "Interface design",
  "Technical consulting",
  "Not sure yet",
] as const;

export const budgetRanges = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Prefer to discuss",
] as const;

export const timelines = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "Still planning",
] as const;

export const contactPreferences = ["Email", "Phone call", "Video call"] as const;

/** Maps a service slug to the project type it should preselect, so
 *  /contact?service=ai-engineering arrives with the question already answered.
 *  Explicit rather than derived from the label — the two lists are allowed to
 *  diverge, and a silent mismatch would preselect the wrong option. */
export const serviceToProjectType: Record<string, (typeof projectTypes)[number]> = {
  "product-engineering": "Product engineering",
  "ai-engineering": "AI engineering",
  "platform-cloud": "Platform & cloud",
  "data-engineering": "Data engineering",
  "interface-design": "Interface design",
  "technical-consulting": "Technical consulting",
};

export type EnquiryField =
  | "name"
  | "email"
  | "company"
  | "phone"
  | "projectType"
  | "budget"
  | "timeline"
  | "preferredContact"
  | "message";

export type EnquiryInput = Record<EnquiryField, string>;

export const emptyEnquiry: EnquiryInput = {
  name: "",
  email: "",
  company: "",
  phone: "",
  projectType: "",
  budget: "",
  timeline: "",
  preferredContact: "",
  message: "",
};

export type ValidationErrors = Partial<Record<EnquiryField, string>>;

/** Deliberately permissive — the goal is to catch typos, not to police
 *  addresses. Anything that survives this is confirmed by a reply landing. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX = { name: 100, email: 200, company: 120, phone: 40, message: 4000 } as const;

/** Digits, spaces and the usual separators. Permissive by design — phone
 *  formats vary by country and a strict pattern rejects valid numbers. */
const PHONE = /^[+\d][\d\s().-]{4,}$/;

export function validateEnquiry(input: Partial<EnquiryInput>): {
  errors: ValidationErrors;
  valid: boolean;
} {
  const errors: ValidationErrors = {};

  const name = input.name?.trim() ?? "";
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length > MAX.name) errors.name = `Please keep this under ${MAX.name} characters.`;

  const email = input.email?.trim() ?? "";
  if (!email) errors.email = "We need an email address to reply to.";
  else if (!EMAIL.test(email)) errors.email = "That does not look like a complete email address.";
  else if (email.length > MAX.email) errors.email = "That email address is too long.";

  if ((input.company?.length ?? 0) > MAX.company) {
    errors.company = `Please keep this under ${MAX.company} characters.`;
  }

  const phone = input.phone?.trim() ?? "";
  if (phone) {
    if (phone.length > MAX.phone) errors.phone = "That phone number is too long.";
    else if (!PHONE.test(phone)) errors.phone = "Please enter a reachable phone number.";
  }

  if (
    input.preferredContact &&
    !contactPreferences.includes(input.preferredContact as (typeof contactPreferences)[number])
  ) {
    errors.preferredContact = "Please choose one of the listed options.";
  }

  // Asking to be phoned without leaving a number is a dead end — catch it here
  // rather than letting an unreachable lead into the pipeline.
  if (input.preferredContact === "Phone call" && !phone) {
    errors.phone = "Add a phone number, or choose email instead.";
  }

  const projectType = input.projectType?.trim() ?? "";
  if (!projectType) errors.projectType = "Pick the closest match — you can change it later.";
  else if (!projectTypes.includes(projectType as (typeof projectTypes)[number])) {
    errors.projectType = "Please choose one of the listed options.";
  }

  if (input.budget && !budgetRanges.includes(input.budget as (typeof budgetRanges)[number])) {
    errors.budget = "Please choose one of the listed options.";
  }

  if (input.timeline && !timelines.includes(input.timeline as (typeof timelines)[number])) {
    errors.timeline = "Please choose one of the listed options.";
  }

  const message = input.message?.trim() ?? "";
  if (!message) errors.message = "A sentence or two about the project is enough to start.";
  else if (message.length < 20) errors.message = "Please add a little more detail — at least 20 characters.";
  else if (message.length > MAX.message) errors.message = `Please keep this under ${MAX.message} characters.`;

  return { errors, valid: Object.keys(errors).length === 0 };
}

export const fieldLabels: Record<EnquiryField, string> = {
  name: "Name",
  email: "Email",
  company: "Company",
  phone: "Phone",
  projectType: "Project type",
  budget: "Budget",
  timeline: "Timeline",
  preferredContact: "Preferred contact",
  message: "Project description",
};
