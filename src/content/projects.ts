/**
 * Published products and approved case studies.
 *
 * To publish a project, append an object below — the page, the work list
 * and the homepage section all read from this array, so nothing else changes.
 *
 * `metrics` must only ever contain measured numbers the client has approved for
 * publication. If there is no measured result, leave the array empty; the UI
 * omits the block entirely rather than showing a placeholder statistic.
 */

export type Project = {
  slug: string;
  title: string;
  category: string;
  /** Approved client name; omit client metadata when null. */
  client: string | null;
  year: string;
  /** One-line summary for the index grid. */
  summary: string;
  /** Products can have an overview without an invented client-case narrative. */
  overview?: string;
  challenge?: string;
  approach?: string;
  solution?: string;
  technologies: string[];
  /** Approved, measured outcomes only. Empty is a valid and honest state. */
  metrics: Array<{ label: string; value: string }>;
  /** Paths under /public. Omit rather than shipping a grey placeholder box. */
  images: Array<{ src: string; alt: string; width: number; height: number }>;
  /** Public listing for evidence; the action URL may include an approved referral. */
  publication?: { platform: string; listingUrl: string; actionUrl: string; actionLabel: string };
};

export const projects: Project[] = [
  {
    slug: "tripper-driving-simulator",
    title: "Tripper Driving Simulator",
    category: "Browser game",
    client: null,
    year: "2026",
    summary:
      "Haul cargo in a tipper truck through mountain routes. A driving game by Quorlyn Technology, published on Playgama.",
    overview:
      "Load at the quarry, drive to the delivery site and tip the cargo. Routes include tight bends, bridges and river crossings. Play with keyboard controls on desktop or touch controls on mobile.",
    technologies: [],
    metrics: [],
    images: [
      {
        src: "/work/tripper-driving-simulator.webp",
        alt: "Tripper Driving Simulator cover: a yellow tipper truck at a quarry beneath mountain peaks.",
        width: 1920,
        height: 1080,
      },
    ],
    publication: {
      platform: "Playgama",
      listingUrl: "https://playgama.com/game/tripper-driving-simulator",
      actionUrl:
        "https://playgama.com/game/tripper-driving-simulator?clid=p_cc408050-e713-493f-9b2c-e4fed949c831",
      actionLabel: "Play on Playgama",
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/**
 * Shown on /work while `projects` is empty. These describe the kind of problem
 * the team is set up to take on — framed as capability, never as history.
 */
export const workFocusAreas = [
  {
    index: "01",
    title: "A first product release",
    body: "A product idea that needs architecture, an interface, development and a first production release.",
  },
  {
    index: "02",
    title: "An existing system to improve",
    body: "An existing codebase that has outgrown its original shape: slow deploys, fragile releases, or a data model fighting the product it now has to support.",
  },
  {
    index: "03",
    title: "An AI feature to evaluate",
    body: "A task to test against language models and simpler alternatives, with evaluation criteria and fallbacks before production integration.",
  },
];
