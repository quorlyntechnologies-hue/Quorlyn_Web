import type { Metadata } from "next";

import { LegalBody } from "@/components/layout/LegalBody";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms governing use of the Quorlyn Technology website.",
  alternates: { canonical: "/terms" },
};

/**
 * Covers use of the website only. Terms of engagement for client work live in
 * the contract for that work, not here. Have a qualified adviser review this
 * before relying on it commercially.
 */
export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of use"
        lead="These cover this website. The terms for any engagement are set out in that project's own agreement."
      />

      <Section>
        <Container size="narrow">
          <LegalBody updated="Applies to use of this website.">
            <h2>About this site</h2>
            <p>
              This website is operated by {company.legalName}, a company registered in{" "}
              {company.location.country}. Using it means accepting the terms below.
            </p>

            <h2>Content</h2>
            <p>
              The material here describes our services and how we work. It is provided for
              information and does not constitute a quote, an offer, or professional advice for your
              specific situation. Nothing on this site creates a contract between us — an engagement
              begins only when both parties sign a written agreement.
            </p>

            <h2>Accuracy</h2>
            <p>
              We keep this site accurate and current. Where we have not yet published something —
              client work, team details — we say so rather than filling the space. If you find
              something here that is wrong, tell us and we will correct it.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The Quorlyn name, logo, written content and design of this site belong to{" "}
              {company.legalName}. You may link to and quote from the site with attribution. You may
              not reproduce it wholesale or present it as your own.
            </p>

            <h2>Enquiries</h2>
            <p>
              Please send only information you are permitted to share. Do not send confidential
              material, credentials or personal data belonging to third parties through the contact
              form; we will arrange a suitable channel once a conversation is under way.
            </p>

            <h2>Availability and liability</h2>
            <p>
              We make no guarantee that this site will be available without interruption. To the
              extent permitted by law, we are not liable for loss arising from use of, or reliance
              on, this website. Nothing here limits liability that cannot lawfully be limited.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of {company.location.country}.
            </p>
          </LegalBody>
        </Container>
      </Section>
    </>
  );
}
