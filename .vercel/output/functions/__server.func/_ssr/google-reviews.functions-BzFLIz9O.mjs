import { t as createServerRpc } from "./createServerRpc-IUYF-nQR.mjs";
import { r as createServerFn } from "./server-BLPv3tDv.mjs";
// node_modules/.nitro/vite/services/ssr/assets/google-reviews.functions-BzFLIz9O.js
var PLACE_ID = "ChIJoTgIQEAbWBQR_1Vma-gl1kA";
var GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";
var cache = null;
var TTL_MS = 36e5;
var getGoogleReviews_createServerFn_handler = createServerRpc({
	id: "9a51c8e9f37e0cfb9a6a86a0d40a4079b09b7b94264aaafcf3f03df436fcbb7e",
	name: "getGoogleReviews",
	filename: "src/lib/google-reviews.functions.ts"
}, (opts) => getGoogleReviews.__executeServer(opts));
var getGoogleReviews = createServerFn({ method: "GET" }).handler(getGoogleReviews_createServerFn_handler, async () => {
	if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
	const lovableKey = process.env.LOVABLE_API_KEY;
	const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
	if (!lovableKey || !mapsKey) return {
		rating: null,
		total: null,
		reviews: [],
		url: null,
		error: "missing_credentials"
	};
	try {
		const res = await fetch(`${GATEWAY_URL}/places/v1/places/${PLACE_ID}?languageCode=ar`, { headers: {
			Authorization: `Bearer ${lovableKey}`,
			"X-Connection-Api-Key": mapsKey,
			"X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews"
		} });
		if (!res.ok) {
			const body = await res.text();
			console.error("Places API error", res.status, body);
			return {
				rating: null,
				total: null,
				reviews: [],
				url: null,
				error: `http_${res.status}`
			};
		}
		const data = await res.json();
		const reviews = (data.reviews ?? []).map((r) => ({
			author: r.authorAttribution?.displayName ?? "Google User",
			authorPhoto: r.authorAttribution?.photoUri ?? null,
			rating: r.rating ?? 0,
			text: r.text?.text ?? r.originalText?.text ?? "",
			relativeTime: r.relativePublishTimeDescription ?? "",
			publishTime: r.publishTime ?? ""
		}));
		const payload = {
			rating: data.rating ?? null,
			total: data.userRatingCount ?? null,
			reviews,
			url: data.googleMapsUri ?? null
		};
		cache = {
			at: Date.now(),
			data: payload
		};
		return payload;
	} catch (e) {
		console.error("getGoogleReviews failed", e);
		return {
			rating: null,
			total: null,
			reviews: [],
			url: null,
			error: "fetch_failed"
		};
	}
});
export { getGoogleReviews_createServerFn_handler };
