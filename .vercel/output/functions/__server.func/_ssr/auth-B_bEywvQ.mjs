import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/auth-B_bEywvQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_LABELS = {
	owner: "Owner",
	manager: "Manager",
	receptionist: "Receptionist",
	dentist: "Dentist",
	accountant: "Accountant"
};
/** Roles allowed into the admin area at all (Phase 1: everyone except none). */
var ADMIN_ROLES = [
	"owner",
	"manager",
	"receptionist",
	"dentist",
	"accountant"
];
var AuthCtx = (0, import_react.createContext)(null);
async function loadProfile(userId) {
	if (!supabase) return null;
	const { data } = await supabase.from("profiles").select("id, full_name, role, phone, active").eq("id", userId).maybeSingle();
	return data ?? null;
}
function AdminAuthProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(() => supabase ? { status: "loading" } : { status: "unconfigured" });
	(0, import_react.useEffect)(() => {
		if (!supabase) return;
		let mounted = true;
		supabase.auth.getSession().then(async ({ data }) => {
			if (!mounted) return;
			const session = data.session;
			if (!session) {
				setState({ status: "signed_out" });
				return;
			}
			const profile = await loadProfile(session.user.id);
			if (!mounted) return;
			setState({
				status: "signed_in",
				session,
				profile
			});
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (!mounted) return;
			if (!session) {
				setState({ status: "signed_out" });
				return;
			}
			const profile = await loadProfile(session.user.id);
			if (!mounted) return;
			setState({
				status: "signed_in",
				session,
				profile
			});
		});
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);
	const signIn = (0, import_react.useCallback)(async (email, password) => {
		if (!supabase) return { error: "Backend not configured" };
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		return { error: error?.message ?? null };
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		await supabase?.auth.signOut();
		setState({ status: "signed_out" });
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		state,
		signIn,
		signOut
	}), [
		state,
		signIn,
		signOut
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthCtx.Provider, {
		value,
		children
	});
}
function useAdminAuth() {
	const ctx = (0, import_react.useContext)(AuthCtx);
	if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
	return ctx;
}
function useAdminRole() {
	const { state } = useAdminAuth();
	if (state.status !== "signed_in") return null;
	const role = state.profile?.role;
	return role && ADMIN_ROLES.includes(role) ? role : null;
}
export { useAdminRole as a, useAdminAuth as i, AdminAuthProvider as n, ROLE_LABELS as r, ADMIN_ROLES as t };
