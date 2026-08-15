import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/SectionHeading";
import { company, contact } from "@/content/company";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Quorlyn Technology. Tell us what you are building and what is in the way — we reply to every enquiry.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — Quorlyn Technology", url: "/contact" },
};

/** Sets expectations before the form, which measurably reduces abandonment
 *  more than any amount of encouragement after it. */
const expectations = [
  {
    label: "Who reads this",
    body: "An engineer, not a sales inbox. The reply comes from someone who could work on the project.",
  },
  {
    label: "Response time",
    body: "Usually within two working days. If we are not the right fit, we will tell you that quickly.",
  },
  {
    label: "What happens next",
    body: "A short call to test whether the problem and the approach match. No deck, no obligation.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you are building"
        lead="The more concrete the problem, the more useful our first reply will be. Rough ideas are welcome too — we will tell you what we would need to know to scope it."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {/* useSearchParams needs a Suspense boundary during prerender. */}
              <Suspense fallback={<div className="h-[40rem]" aria-hidden="true" />}>
                <ContactForm />
              </Suspense>
            </div>

            <aside className="lg:col-span-5">
              <div className="space-y-8 lg:sticky lg:top-32">
                <Reveal className="rounded-lg border border-line bg-surface/50 p-7">
                  <h2 className="font-mono text-label tracking-[0.2em] text-subtle uppercase">
                    Before you send
                  </h2>
                  <dl className="mt-6 space-y-6">
                    {expectations.map((item) => (
                      <div
                        key={item.label}
                        className="border-t border-line pt-5 first:border-0 first:pt-0"
                      >
                        <dt className="font-display text-h4 text-fg">{item.label}</dt>
                        <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>

                <Reveal delay={100} className="rounded-lg border border-line p-7">
                  <h2 className="font-mono text-label tracking-[0.2em] text-subtle uppercase">
                    Where we are
                  </h2>
                  <address className="mt-5 space-y-1 text-sm leading-relaxed text-muted not-italic">
                    <p className="text-fg">{company.legalName}</p>
                    {contact.streetAddress && <p>{contact.streetAddress}</p>}
                    <p>
                      {company.location.locality}, {company.location.region}
                    </p>
                    <p>{company.location.country}</p>
                  </address>

                  {(contact.email || contact.phone) && (
                    <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
                      {contact.email && (
                        <li>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-accent underline underline-offset-4 transition-opacity hover:opacity-80"
                          >
                            {contact.email}
                          </a>
                        </li>
                      )}
                      {contact.phone && (
                        <li>
                          <a
                            href={`tel:${contact.phone.replace(/\s/g, "")}`}
                            className="text-muted transition-colors hover:text-fg"
                          >
                            {contact.phone}
                          </a>
                        </li>
                      )}
                    </ul>
                  )}

                  <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-subtle">
                    We work with clients remotely across time zones. Kathmandu is UTC+5:45.
                  </p>
                </Reveal>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ),
        }}
      />
    </>
  );
}
