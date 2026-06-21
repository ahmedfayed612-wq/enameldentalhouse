/**
 * Analytics hooks — Meta Pixel, GA4 and Microsoft Clarity slots.
 * Tracking IDs are wired in src/routes/__root.tsx via the global script tags
 * (left as placeholders). These helpers fire conversion events safely
 * whether or not the underlying script has loaded.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackLead(payload: Record<string, unknown> = {}) {
  try {
    window.fbq?.("track", "Lead", payload);
    window.gtag?.("event", "generate_lead", payload);
    window.clarity?.("event", "lead_submitted");
  } catch {
    // analytics must never break the form
  }
}

export function trackPageView() {
  try {
    window.fbq?.("track", "PageView");
  } catch {
    /* noop */
  }
}
