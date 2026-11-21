import { createServerFn } from "@tanstack/react-start";

const PLACE_ID = "ChIJoTgIQEAbWBQR_1Vma-gl1kA";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

export type GoogleReview = {
  author: string;
  authorPhoto: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
};

export type GoogleReviewsPayload = {
  rating: number | null;
  total: number | null;
  reviews: GoogleReview[];
  url: string | null;
  error?: string;
};

let cache: { at: number; data: GoogleReviewsPayload } | null = null;
const TTL_MS = 60 * 60 * 1000; // 1 hour

export const getGoogleReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<GoogleReviewsPayload> => {
    if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

    const lovableKey = process.env.LOVABLE_API_KEY;
    const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!lovableKey || !mapsKey) {
      return { rating: null, total: null, reviews: [], url: null, error: "missing_credentials" };
    }

    try {
      const res = await fetch(`${GATEWAY_URL}/places/v1/places/${PLACE_ID}?languageCode=ar`, {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": mapsKey,
          "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews",
        },
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("Places API error", res.status, body);
        return { rating: null, total: null, reviews: [], url: null, error: `http_${res.status}` };
      }

      const data = (await res.json()) as {
        rating?: number;
        userRatingCount?: number;
        googleMapsUri?: string;
        reviews?: Array<{
          rating?: number;
          text?: { text?: string };
          originalText?: { text?: string };
          relativePublishTimeDescription?: string;
          publishTime?: string;
          authorAttribution?: { displayName?: string; photoUri?: string };
        }>;
      };

      const reviews: GoogleReview[] = (data.reviews ?? []).map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google User",
        authorPhoto: r.authorAttribution?.photoUri ?? null,
        rating: r.rating ?? 0,
        text: r.text?.text ?? r.originalText?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime ?? "",
      }));

      const payload: GoogleReviewsPayload = {
        rating: data.rating ?? null,
        total: data.userRatingCount ?? null,
        reviews,
        url: data.googleMapsUri ?? null,
      };
      cache = { at: Date.now(), data: payload };
      return payload;
    } catch (e) {
      console.error("getGoogleReviews failed", e);
      return { rating: null, total: null, reviews: [], url: null, error: "fetch_failed" };
    }
  },
);
