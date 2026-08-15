import type { Metadata } from "next";

import { Hero } from "@/components/home/Hero";
import { Positioning } from "@/components/home/Positioning";
import { Process } from "@/components/home/Process";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { TechnologyGrid } from "@/components/home/TechnologyGrid";
import { WhyQuorlyn } from "@/components/home/WhyQuorlyn";
import { WorkPreview } from "@/components/home/WorkPreview";
import { CTASection } from "@/components/ui/CTASection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description:
    "Quorlyn Technology is a software engineering company in Kathmandu, Nepal. We design, build and run web, mobile and AI-enabled systems — architecture through to production.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Positioning />
      <ServicesIndex />
      <WhyQuorlyn />
      <TechnologyGrid />
      <Process />
      <WorkPreview />
      <CTASection secondaryLabel="Read how we work" secondaryHref="/about" />
    </>
  );
}
