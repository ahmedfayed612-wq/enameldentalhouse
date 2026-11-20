import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
// node_modules/.nitro/vite/services/ssr/assets/supabase-CeBPyXVR.js
/**
* Browser Supabase client. Returns null when env vars are not configured so the
* public site keeps working before the backend is provisioned.
* All data access is enforced by Postgres RLS — the anon key is safe to expose.
*/
var supabase = createClient("https://egkruiudhmqmsghqziou.supabase.co", "sb_publishable_4_Mx3AB5ohKNWQb-QfGf-A_dC5znm9o");
var isSupabaseConfigured = supabase !== null;
export { supabase as n, isSupabaseConfigured as t };
