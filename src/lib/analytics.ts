"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Analytics.
 *
 * Aggregate Vercel Analytics is mounted only for Vercel production deployments.
 * Enable Web Analytics in that project's dashboard before deploying. Local
 * builds and preview deployments do not initialize the provider.
 *
 * Everything goes through `track()` so swapping providers is one file. Events
 * are named for the funnel question they answer, and carry no personal data:
 * never pass a name, email or free-text message into a property.
 */

export type AnalyticsEvent =
  | "cta_click"
  | "service_viewed"
  | "inquiry_started"
  | "inquiry_submitted"
  | "admin_signed_in";

type Properties = Record<string, string | number | boolean | null>;

export function track(event: AnalyticsEvent, properties?: Properties): void {
  // The mounted provider initializes window.va, including its loading queue.
  // A local `next start` is also NODE_ENV=production, so check the provider too.
  if (
    process.env.NODE_ENV !== "production" ||
    typeof window === "undefined" ||
    typeof window.va !== "function"
  ) return;

  try {
    vercelTrack(event, properties);
  } catch {
    // Measurement must never break a user flow.
  }
}
