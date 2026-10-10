import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Content } from "@/components/ui/Content";
import { Section } from "@/components/ui/SectionHeading";
import { company, contact } from "@/content/company";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Quorlyn Technology. Describe what you need to build or change, your constraints, and how to contact you.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — Quorlyn Technology", url: "/contact" },
};

/** Explain who reads the enquiry and what the next step involves. */
const expectations = [
  {
    label: "Who reads this",
    body: "An engineer who could work on your project reads the enquiry and replies.",
  },
  {
    label: "Response time",
    body: "We aim to reply within two working days.",
  },
  {
    label: "What happens next",
    body: "We discuss the problem, any missing information, and whether a short scoping call would help.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Tell us what you are building"
        lead="Describe what you need to build or change. An outline is enough to start; include a budget or deadline if you have one."
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
                <Content className="border-t border-line pt-6">
                  <h2 className="text-h4 text-fg">
                    Before you send
                  </h2>
                  <dl className="mt-6 space-y-6">
                    {expectations.map((item) => (
                      <div
                        key={item.label}
                        className="border-t border-line pt-5 first:border-0 first:pt-0"
                      >
                        <dt className="text-h4 font-medium text-fg">{item.label}</dt>
                        <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
                      </div>
                    ))}
                  </dl>
                </Content>

                <Content className="border-t border-line pt-6">
                  <h2 className="text-h4 text-fg">
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
                </Content>
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
