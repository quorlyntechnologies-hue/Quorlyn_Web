import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { LegalBody } from "@/components/layout/LegalBody";
import { company, contact } from "@/content/company";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Quorlyn Technology collects through this website, why, and how long it is kept.",
  alternates: { canonical: "/privacy" },
};

/**
 * Describes what this site actually does today: one contact form, no analytics,
 * no cookies, no third-party trackers. Keep it in step with the code — if
 * analytics or a CRM is added later, this page has to change with it.
 *
 * Not a substitute for review by a qualified adviser before the site goes live
 * in a regulated market.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy"
        lead="Short, because this website does very little with data."
      />

      <Section>
        <Container size="narrow">
          <LegalBody updated="This policy describes the site as currently built.">
            <h2>What we collect</h2>
            <p>
              What you type into the contact form: your name and email address, plus — if you choose
              to provide them — your company, phone number, project type, budget, timeline,
              preferred way to be contacted, and your description of the work.
            </p>
            <p>
              Alongside a submission we record which page you sent it from, your browser&rsquo;s user
              agent string, and a one-way salted hash of your IP address. That is the minimum needed
              to investigate abuse of the form; it is not used to identify or profile you.
            </p>

            <h2>Why we collect it</h2>
            <p>
              To read your inquiry, reply to it, and keep track of the conversation. We do not add
              contact form submissions to a mailing list, sell them, or share them with third
              parties for marketing.
            </p>

            <h2>Cookies</h2>
            <p>
              This site sets no cookies on the public pages, and runs no advertising or
              cross-site tracking scripts. Staff signing in to the admin area receive a session
              cookie, which is strictly necessary for that sign-in to work.
            </p>

            <h2>Analytics</h2>
            <p>
              We measure aggregate traffic — page views, and a few events such as whether someone
              started the contact form and whether they finished it — using Vercel Analytics. It is
              cookieless, records no identifier that persists across visits, and builds no profile
              of you. We use it to see which pages are useful and where the contact form is losing
              people, not to identify visitors.
            </p>
            <p>
              No personal data is attached to these events: we never pass a name, an email address
              or the contents of your message into analytics.
            </p>

            <h2>Bot protection</h2>
            <p>
              The contact form is protected by Cloudflare Turnstile, which checks that a submission
              comes from a person rather than a script. It is a privacy-preserving alternative to a
              CAPTCHA and does not track you across sites. We also store a one-way, salted hash of
              the submitting IP address with each inquiry so repeated abuse can be recognised — the
              address itself is not retained and the hash cannot be reversed to recover it.
            </p>

            <h2>Where it goes</h2>
            <p>
              Inquiries are stored in our database and a copy is emailed to {company.legalName}.
              Access is limited to authorised staff and enforced by the database itself, not merely
              by the interface. Our hosting, database and email providers process the data on our
              behalf in order to deliver the service, and are subject to their own security
              obligations.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Inquiries are retained while the conversation is active and for a reasonable period
              afterwards for business records. You can ask us to delete yours at any time and we
              will do so.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask us what we hold about you, ask for it to be corrected, or ask for it to be
              deleted.{" "}
              {contact.email ? (
                <>
                  Write to <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </>
              ) : (
                <>Use the contact form and we will handle the request.</>
              )}
            </p>

            <h2>Changes</h2>
            <p>
              If this site starts doing something else with data — analytics, a CRM, an embedded
              third-party tool — this page will be updated before that happens.
            </p>
          </LegalBody>
        </Container>
      </Section>
    </>
  );
}
