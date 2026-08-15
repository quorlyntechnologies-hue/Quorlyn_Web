"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Analytics.
 *
 * One provider, not five. Vercel Analytics is cookieless, needs no consent
 * banner, and is included on the plan this deploys to — which matters given the
 * privacy policy this site publishes promises no tracking scripts beyond
 * aggregate measurement.
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
  // No-op in development so local clicking never pollutes production figures.
  if (process.env.NODE_ENV !== "production") return;

  try {
    vercelTrack(event, properties);
  } catch {
    // Measurement must never break a user flow.
  }
}
