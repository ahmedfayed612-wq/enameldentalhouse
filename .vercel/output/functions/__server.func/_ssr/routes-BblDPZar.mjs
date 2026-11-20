import { i as __toESM } from "../_runtime.mjs";
import { t as isSupabaseConfigured } from "./supabase-CeBPyXVR.mjs";
import { n as getDaySlots, r as submitBooking, t as createSsrRpc } from "./booking.functions-BdB0CgT2.mjs";
import { r as createServerFn } from "./server-5IeYenoQ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as ArrowUpRight, C as GraduationCap, E as Clock, H as Anchor, I as CalendarCheck, L as BadgeDollarSign, M as ChevronLeft, N as ChevronDown, O as CircleCheck, R as BadgeCheck, S as Instagram, T as Facebook, V as ArrowRight, _ as MessageCircle, a as Stethoscope, c as Smile, g as Phone, h as Play, i as Users, j as ChevronRight, l as Siren, n as WandSparkles, o as Star, s as Sparkles, t as X, u as ShieldCheck, v as Menu, w as Globe, y as MapPin, z as Award } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-BblDPZar.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var translations = {
	en: {
		brand: "Enamel Dental House",
		navWhy: "Why Enamel",
		navServices: "Services",
		navResults: "Results",
		navDoctor: "Doctor",
		navReviews: "Reviews",
		navFaq: "FAQ",
		navContact: "Contact",
		navBook: "Book Now",
		langToggle: "العربية",
		heroEyebrow: "Obour City · New Patients Welcome",
		heroTitle: "A confident smile, without the wait.",
		heroSubtitle: "Same-week appointments, transparent pricing, and a pain-free experience — from your first checkup to advanced care.",
		heroCta: "Book Your Free Consultation",
		heroSecondary: "Call us on WhatsApp",
		trustYears: "Years caring for Obour",
		trustPatients: "Happy patients treated",
		trustRating: "Google rating",
		googleBadge: "Based on Google reviews",
		liveAvailToday: "Today's available slots",
		slotAvailable: "Available",
		slotOneLeft: "1 slot left",
		slotBooked: "Booked",
		clinicClosedToday: "Clinic closed today — see you tomorrow.",
		bookedOutToday: "Fully booked today — message us on WhatsApp.",
		ctaReserveSlot: "Reserve a slot",
		whyTitle: "Care you can actually feel.",
		whySubtitle: "Why families across Obour City choose Enamel for their dental care.",
		why1Title: "Experienced lead doctor",
		why1Body: "Years of clinical practice across general, cosmetic and restorative dentistry.",
		why2Title: "Modern, sterilised equipment",
		why2Body: "Digital imaging, single-use tools and rigorous sterilisation on every visit.",
		why3Title: "Transparent pricing",
		why3Body: "Clear quotes before any treatment starts — no surprises on the bill.",
		why4Title: "Flexible scheduling",
		why4Body: "Evening slots every day except Friday, with same-week appointments for urgent cases.",
		servicesTitle: "Treatments built around you.",
		servicesSubtitle: "Tap any service to start a booking — we'll pre-fill it for you.",
		svcCheckup: "General Check-up",
		svcCheckupDesc: "Full exam, cleaning and X-rays when needed.",
		svcWhitening: "Teeth Whitening",
		svcWhiteningDesc: "Safe in-clinic whitening with visible results.",
		svcBraces: "Braces & Orthodontics",
		svcBracesDesc: "Traditional and clear aligner options.",
		svcImplants: "Dental Implants",
		svcImplantsDesc: "Long-lasting tooth replacement, planned digitally.",
		svcCosmetic: "Cosmetic Dentistry",
		svcCosmeticDesc: "Veneers, bonding and smile design.",
		svcEmergency: "Emergency Care",
		svcEmergencyDesc: "Pain relief and urgent treatment, same-day.",
		svcBook: "Book this",
		resultsTitle: "Real smiles from our clinic.",
		resultsSubtitle: "Recent before/after cases — more available on request.",
		resultsBefore: "Before",
		resultsAfter: "After",
		doctorTitle: "Meet your dentist",
		doctorName: "Dr. Mohamed Ibrahim Zaki",
		doctorRole: "General Dentist & Oral Biologist",
		doctorBio: "With years of experience treating families in Obour City and Cairo, our lead doctor combines modern technique with a gentle, unhurried chairside manner. Every plan starts with listening to you.",
		doctorCred1: "BDS, Faculty of Dentistry",
		doctorCred2: "Member, Egyptian Dental Syndicate",
		doctorCred3: "Continuing education in implantology & cosmetic dentistry",
		reviewsTitle: "What our patients say",
		reviewsSubtitle: "Live reviews from our patients on Google.",
		reviewsPlaceholder: "Loading Google reviews…",
		reviewsError: "Couldn't load Google reviews right now.",
		reviewsViewAll: "See all reviews on Google",
		reviewsRatingSuffix: "on Google",
		videoTitle: "Stories from our patients",
		videoSubtitle: "Swipe to hear real patients share their experience at Enamel.",
		bookTitle: "Reserve your visit",
		bookSubtitle: "Pick a date and time below. You won't be charged anything until you arrive at the clinic.",
		bookScarcity: "Only 3 slots left this week",
		bookReassurance: "You won't be charged anything until you arrive at the clinic.",
		bookStep1: "1 · Pick a date",
		bookStep2: "2 · Pick a time",
		bookStep2Hint: "Pick a date first to see available times.",
		bookYourDetails: "3 · Your details",
		noTimeWhatsapp: "Can't find a time that works? Message us on WhatsApp",
		fieldName: "Full name",
		fieldNamePh: "Your full name",
		fieldPhone: "Phone number",
		fieldPhonePh: "e.g. 01012345678",
		fieldService: "Preferred service",
		fieldServicePh: "Select a service",
		fieldDate: "Preferred date",
		fieldTime: "Preferred time",
		timeMorning: "Morning (9 AM – 12 PM)",
		timeAfternoon: "Afternoon (12 – 5 PM)",
		timeEvening: "Evening (5 – 9 PM)",
		fieldNotes: "Notes (optional)",
		fieldNotesPh: "Anything we should know before your visit?",
		bookSubmit: "Confirm My Appointment",
		bookSubmitting: "Sending…",
		bookSuccessTitle: "Appointment confirmed!",
		bookSuccessBody: "We're opening WhatsApp now to send you written confirmation. A reminder will follow the day before your visit.",
		bookSuccessAnother: "Book another appointment",
		bookOpenWhatsapp: "Open WhatsApp confirmation",
		errName: "Please enter your full name.",
		errPhone: "Enter a valid Egyptian phone (e.g. 01012345678).",
		errService: "Choose a service.",
		errDate: "Pick a date.",
		errTime: "Choose a time slot.",
		errSlotTaken: "That time slot was just booked — please pick another.",
		errBooking: "Booking failed — please try again or message us on WhatsApp.",
		calMonths_long: "January,February,March,April,May,June,July,August,September,October,November,December",
		calWeekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat",
		calPrev: "Previous month",
		calNext: "Next month",
		calFriClosed: "Closed",
		faqTitle: "Common questions",
		faq1Q: "What are your hours?",
		faq1A: "We're open every day except Friday, from 12:00 PM to 10:00 PM.",
		faq2Q: "Are your prices transparent?",
		faq2A: "Yes — we provide a written quote before any treatment begins, with no hidden fees.",
		faq3Q: "Do you accept insurance?",
		faq3A: "We work with most major Egyptian insurance providers. Bring your card and we'll verify coverage.",
		faq4Q: "What should I bring to my first visit?",
		faq4A: "A valid ID, any previous X-rays or dental records, and a list of medications you're taking.",
		faq5Q: "What payment options do you accept?",
		faq5A: "Cash, all major debit and credit cards, and instalment plans for larger treatments.",
		faq6Q: "What is your cancellation policy?",
		faq6A: "Please let us know at least 24 hours in advance so we can offer the slot to someone else.",
		locTitle: "Visit the clinic",
		locAddressLabel: "Address",
		locAddress: "Obour City, Cairo, Egypt",
		locHoursLabel: "Working hours",
		locHours: "Sat – Thu: 12 PM – 10 PM · Friday: Closed",
		locPhoneLabel: "Phone",
		locPhone: "+20 100 026 8550",
		locWhatsapp: "WhatsApp Us",
		locMapPlaceholder: "Google Map will appear here.",
		footerTagline: "Dentistry that treats you like family.",
		footerRights: "All rights reserved.",
		footerQuick: "Explore",
		footerContact: "Contact",
		footerFollow: "Follow",
		mobileBook: "Book Now",
		mobileWa: "WhatsApp"
	},
	ar: {
		brand: "إنامل دنتال هاوس",
		navWhy: "ليه إنامل",
		navServices: "خدماتنا",
		navResults: "النتائج",
		navDoctor: "الطبيب",
		navReviews: "آراء المرضى",
		navFaq: "أسئلة شائعة",
		navContact: "تواصل",
		navBook: "احجز الآن",
		langToggle: "English",
		heroEyebrow: "مدينة العبور · نرحب بالمرضى الجدد",
		heroTitle: "ابتسامة واثقة، بدون انتظار.",
		heroSubtitle: "مواعيد في نفس الأسبوع، أسعار واضحة، وتجربة بدون ألم — من أول كشف لحد أحدث العلاجات.",
		heroCta: "احجز كشفك المجاني",
		heroSecondary: "كلمنا على واتساب",
		trustYears: "سنوات في خدمة العبور",
		trustPatients: "مريض سعيد",
		trustRating: "تقييم جوجل",
		googleBadge: "بناءً على تقييمات جوجل",
		liveAvailToday: "المواعيد المتاحة اليوم",
		slotAvailable: "متاح",
		slotOneLeft: "متبقي مكان واحد",
		slotBooked: "محجوز",
		clinicClosedToday: "العيادة مغلقة اليوم — نراكم غداً.",
		bookedOutToday: "كل مواعيد النهارده محجوزة — كلمنا على واتساب.",
		ctaReserveSlot: "احجز الموعد",
		whyTitle: "رعاية تحس بيها فعلاً.",
		whySubtitle: "ليه عائلات العبور بتختار إنامل لرعاية أسنانها.",
		why1Title: "طبيب متخصص بخبرة طويلة",
		why1Body: "سنوات من الممارسة في طب الأسنان العام والتجميلي والترميمي.",
		why2Title: "أجهزة حديثة ومعقمة",
		why2Body: "تصوير رقمي، أدوات تستخدم لمرة واحدة، وتعقيم صارم في كل زيارة.",
		why3Title: "أسعار واضحة من الأول",
		why3Body: "بنقدم لك التكلفة الكاملة قبل بداية أي علاج — بدون أي مفاجآت.",
		why4Title: "مواعيد مرنة",
		why4Body: "العيادة مفتوحة كل يوم ما عدا الجمعة، من ١٢ ظهراً لـ ١٠ مساءً.",
		servicesTitle: "علاجات مصممة لك.",
		servicesSubtitle: "اضغط على أي خدمة لبدء الحجز — هنملاها لك تلقائياً.",
		svcCheckup: "كشف عام",
		svcCheckupDesc: "فحص شامل وتنظيف وأشعة عند الحاجة.",
		svcWhitening: "تبييض الأسنان",
		svcWhiteningDesc: "تبييض آمن داخل العيادة بنتائج واضحة.",
		svcBraces: "تقويم الأسنان",
		svcBracesDesc: "تقويم تقليدي أو شفاف.",
		svcImplants: "زراعة الأسنان",
		svcImplantsDesc: "بديل دائم للأسنان المفقودة بتخطيط رقمي.",
		svcCosmetic: "تجميل الأسنان",
		svcCosmeticDesc: "فينير، تلميع، وتصميم ابتسامة.",
		svcEmergency: "حالات طارئة",
		svcEmergencyDesc: "تسكين الألم وعلاج عاجل في نفس اليوم.",
		svcBook: "احجز دلوقتي",
		resultsTitle: "ابتسامات حقيقية من عيادتنا.",
		resultsSubtitle: "أحدث حالات قبل وبعد — صور كاملة متاحة عند الطلب.",
		resultsBefore: "قبل",
		resultsAfter: "بعد",
		doctorTitle: "اتعرف على طبيبك",
		doctorName: "د. محمد إبراهيم زكي",
		doctorRole: "طبيب أسنان عام وأخصائي بيولوجيا الفم",
		doctorBio: "بخبرة سنوات في علاج عائلات العبور والقاهرة، بيجمع طبيبنا بين أحدث التقنيات وأسلوب لطيف ومريح. كل خطة علاج بتبدأ بالاستماع لك أولاً.",
		doctorCred1: "بكالوريوس طب وجراحة الفم والأسنان",
		doctorCred2: "عضو نقابة أطباء الأسنان المصرية",
		doctorCred3: "تعليم مستمر في زراعة الأسنان وتجميلها",
		reviewsTitle: "آراء مرضانا",
		reviewsSubtitle: "تقييمات مباشرة من مرضانا على جوجل.",
		reviewsPlaceholder: "بنحمّل التقييمات…",
		reviewsError: "مش قادرين نحمّل التقييمات دلوقتي.",
		reviewsViewAll: "شوف كل التقييمات على جوجل",
		reviewsRatingSuffix: "على جوجل",
		videoTitle: "حكاوي مرضانا",
		videoSubtitle: "اسحب لتشوف تجارب حقيقية من مرضانا في إنامل.",
		bookTitle: "احجز زيارتك",
		bookSubtitle: "اختار التاريخ والوقت من تحت. مش هتتحاسب على أي حاجة غير لما تيجي العيادة.",
		bookScarcity: "متاح ٣ مواعيد فقط هذا الأسبوع",
		bookReassurance: "مش هتتحاسب غير لما تيجي العيادة.",
		bookStep1: "١ · اختار التاريخ",
		bookStep2: "٢ · اختار الوقت",
		bookStep2Hint: "اختار تاريخ الأول عشان تشوف المواعيد المتاحة.",
		bookYourDetails: "٣ · بياناتك",
		noTimeWhatsapp: "مش لاقي وقت يناسبك؟ تواصل معنا على واتساب",
		fieldName: "الاسم بالكامل",
		fieldNamePh: "اكتب اسمك بالكامل",
		fieldPhone: "رقم الموبايل",
		fieldPhonePh: "مثال: 01012345678",
		fieldService: "الخدمة المطلوبة",
		fieldServicePh: "اختر الخدمة",
		fieldDate: "التاريخ المفضل",
		fieldTime: "الوقت المفضل",
		timeMorning: "صباحاً (٩ – ١٢ ظهراً)",
		timeAfternoon: "ظهراً (١٢ – ٥ مساءً)",
		timeEvening: "مساءً (٥ – ٩ مساءً)",
		fieldNotes: "ملاحظات (اختياري)",
		fieldNotesPh: "أي حاجة تحب تعرفها قبل الزيارة؟",
		bookSubmit: "أكد موعدي",
		bookSubmitting: "جاري الإرسال…",
		bookSuccessTitle: "تم تأكيد موعدك!",
		bookSuccessBody: "هنفتح لك واتساب دلوقتي عشان تستلم تأكيد مكتوب. هيوصلك تذكير قبل الموعد بيوم.",
		bookSuccessAnother: "احجز موعد تاني",
		bookOpenWhatsapp: "افتح تأكيد واتساب",
		errName: "من فضلك اكتب اسمك بالكامل.",
		errPhone: "اكتب رقم موبايل مصري صحيح (مثال 01012345678).",
		errService: "اختر الخدمة.",
		errDate: "اختر التاريخ.",
		errTime: "اختر الميعاد.",
		errSlotTaken: "المعاد ده اتحجز دلوقتي — اختار ميعاد تاني.",
		errBooking: "حصلت مشكلة في الحجز — حاول تاني أو كلمنا على واتساب.",
		calMonths_long: "يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر",
		calWeekdaysShort: "أحد,اثنين,ثلاثاء,أربعاء,خميس,جمعة,سبت",
		calPrev: "الشهر السابق",
		calNext: "الشهر التالي",
		calFriClosed: "مغلق",
		faqTitle: "أسئلة شائعة",
		faq1Q: "إيه مواعيد العمل؟",
		faq1A: "العيادة مفتوحة كل يوم ما عدا الجمعة، من ١٢ ظهراً لـ ١٠ مساءً.",
		faq2Q: "هل الأسعار واضحة؟",
		faq2A: "أيوة — بنقدم عرض سعر مكتوب قبل بداية أي علاج، بدون أي رسوم خفية.",
		faq3Q: "هل بتقبلوا التأمين الصحي؟",
		faq3A: "بنتعامل مع معظم شركات التأمين الكبيرة في مصر. هات بطاقتك وهنتأكد من التغطية.",
		faq4Q: "إيه اللي محتاج أجيبه في أول زيارة؟",
		faq4A: "بطاقة شخصية، أي أشعة أو سجلات سابقة، وقائمة بالأدوية اللي بتاخدها.",
		faq5Q: "إيه طرق الدفع المتاحة؟",
		faq5A: "كاش، كل بطاقات الخصم والائتمان، وأنظمة تقسيط للعلاجات الكبيرة.",
		faq6Q: "إيه سياسة إلغاء الميعاد؟",
		faq6A: "ياريت تخبرنا قبل الميعاد بـ ٢٤ ساعة على الأقل عشان نقدر نعرض الميعاد لشخص تاني.",
		locTitle: "زورنا في العيادة",
		locAddressLabel: "العنوان",
		locAddress: "مدينة العبور، القاهرة، مصر",
		locHoursLabel: "ساعات العمل",
		locHours: "السبت – الخميس: ١٢ ظهراً – ١٠ مساءً · الجمعة: مغلق",
		locPhoneLabel: "الموبايل",
		locPhone: "+20 100 026 8550",
		locWhatsapp: "تواصل واتساب",
		locMapPlaceholder: "هتظهر هنا خريطة جوجل.",
		footerTagline: "طب أسنان بيعاملك زي العيلة.",
		footerRights: "جميع الحقوق محفوظة.",
		footerQuick: "روابط",
		footerContact: "تواصل",
		footerFollow: "تابعنا",
		mobileBook: "احجز",
		mobileWa: "واتساب"
	}
};
var I18nCtx = (0, import_react.createContext)(null);
function I18nProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("ar");
	(0, import_react.useEffect)(() => {
		const stored = typeof window !== "undefined" && localStorage.getItem("enamel-lang");
		if (stored === "ar" || stored === "en") setLangState(stored);
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof document === "undefined") return;
		document.documentElement.lang = lang;
		document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
	}, [lang]);
	const setLang = (l) => {
		setLangState(l);
		if (typeof window !== "undefined") localStorage.setItem("enamel-lang", l);
	};
	const t = (k) => translations[lang][k] ?? translations.en[k] ?? k;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nCtx.Provider, {
		value: {
			lang,
			setLang,
			t,
			dir: lang === "ar" ? "rtl" : "ltr"
		},
		children
	});
}
function useI18n() {
	const ctx = (0, import_react.useContext)(I18nCtx);
	if (!ctx) throw new Error("useI18n must be used within I18nProvider");
	return ctx;
}
var Ctx = (0, import_react.createContext)(null);
function BookingProvider({ children }) {
	const [preselectedService, setService] = (0, import_react.useState)("");
	const selectService = (0, import_react.useCallback)((id) => {
		setService(id);
		if (typeof document !== "undefined") {
			const el = document.getElementById("booking");
			if (el) el.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
	}, []);
	const clearService = (0, import_react.useCallback)(() => setService(""), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			preselectedService,
			selectService,
			clearService
		},
		children
	});
}
function useBooking() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) throw new Error("useBooking must be used within BookingProvider");
	return ctx;
}
function trackLead(payload = {}) {
	try {
		window.fbq?.("track", "Lead", payload);
		window.gtag?.("event", "generate_lead", payload);
		window.clarity?.("event", "lead_submitted");
	} catch {}
}
function trackPageView() {
	try {
		window.fbq?.("track", "PageView");
	} catch {}
}
var WA_LINK$4 = "https://wa.me/201000268550";
var navLinks = [
	{
		key: "navWhy",
		href: "#why"
	},
	{
		key: "navServices",
		href: "#services"
	},
	{
		key: "navResults",
		href: "#results"
	},
	{
		key: "navDoctor",
		href: "#doctor"
	},
	{
		key: "navFaq",
		href: "#faq"
	},
	{
		key: "navContact",
		href: "#contact"
	}
];
function Nav() {
	const { t, lang, setLang } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page flex h-16 items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#top",
					className: "flex items-center gap-2 font-semibold tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-deep",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-bold",
							children: "E"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: t("brand")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-7 md:flex",
					children: navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: t(l.key)
					}, l.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setLang(lang === "ar" ? "en" : "ar"),
							className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent",
							"aria-label": "Toggle language",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5" }), t("langToggle")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#booking",
							className: "hidden rounded-full bg-deep px-4 py-2 text-sm font-medium text-deep-foreground transition-transform hover:scale-[1.02] md:inline-flex",
							children: t("navBook")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-md p-2 text-foreground md:hidden",
							onClick: () => setOpen((v) => !v),
							"aria-label": "Menu",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-background md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "container-page flex flex-col py-3",
				children: [
					navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						onClick: () => setOpen(false),
						className: "py-2 text-sm text-foreground",
						children: t(l.key)
					}, l.key)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#booking",
						onClick: () => setOpen(false),
						className: "mt-2 rounded-full bg-deep px-4 py-2 text-center text-sm font-medium text-deep-foreground",
						children: t("navBook")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: WA_LINK$4,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-2 rounded-full border border-border px-4 py-2 text-center text-sm font-medium text-foreground",
						children: t("heroSecondary")
					})
				]
			})
		})]
	});
}
function GoogleBadge() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-[var(--shadow-soft)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleG, { className: "h-4 w-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: "4.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex items-center",
				"aria-hidden": true,
				children: [
					0,
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-[#FBBC05] text-[#FBBC05]" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted-foreground",
				children: ["· ", t("googleBadge")]
			})
		]
	});
}
function GoogleG({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FFC107",
				d: "M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FF3D00",
				d: "M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4CAF50",
				d: "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#1976D2",
				d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.2l6.2 5.2C41.4 35.9 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z"
			})
		]
	});
}
/**
* ============================================================
*  CLINIC AVAILABILITY — single source of truth
* ============================================================
*  Edit the values below to change hours, closed days, slot
*  length, or to manually mark slots as already booked.
*  No other file needs to change.
*
*  Defaults: Open every day except Friday, 12:00 PM – 10:00 PM.
* ============================================================
*/
var CLINIC = {
	closedWeekdays: [5],
	openHour: 12,
	closeHour: 22,
	slotMinutes: 45,
	/**
	* Manually mark slots as booked, e.g.:
	*   "2025-03-14": ["13:30", "18:00"]
	* Keys are local YYYY-MM-DD, values are "HH:MM" 24h.
	*/
	bookedSlots: {},
	whatsapp: "201000268550"
};
function ymd(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function isOpenDay(date) {
	return !CLINIC.closedWeekdays.includes(date.getDay());
}
function isPastDay(date) {
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d.getTime() < today.getTime();
}
function generateSlots() {
	const out = [];
	const total = (CLINIC.closeHour - CLINIC.openHour) * 60;
	for (let m = 0; m + CLINIC.slotMinutes <= total; m += CLINIC.slotMinutes) {
		const minutes = CLINIC.openHour * 60 + m;
		const h = Math.floor(minutes / 60);
		const min = minutes % 60;
		out.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
	}
	return out;
}
function isSlotBooked(date, time) {
	const key = ymd(date);
	return (CLINIC.bookedSlots[key] || []).includes(time);
}
function formatSlotLabel(time, lang) {
	const [hStr, mStr] = time.split(":");
	const h = parseInt(hStr, 10);
	const m = parseInt(mStr, 10);
	if (lang === "ar") {
		const period = h < 12 ? "ص" : "م";
		const h12 = h % 12 === 0 ? 12 : h % 12;
		const mm = m === 0 ? "" : `:${String(m).padStart(2, "0")}`;
		const toAr = (s) => s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
		return toAr(`${h12}${mm}`) + " " + period;
	}
	const period = h < 12 ? "AM" : "PM";
	return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${period}`;
}
function formatDateLabel(date, lang) {
	return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
function LiveAvailabilityCard() {
	const { t, lang } = useI18n();
	const today = (0, import_react.useMemo)(() => /* @__PURE__ */ new Date(), []);
	const open = isOpenDay(today);
	const { data: slotData } = useQuery({
		queryKey: ["day-slots", ymd(today)],
		queryFn: () => getDaySlots({ data: { date: ymd(today) } }),
		enabled: isSupabaseConfigured,
		staleTime: 6e4
	});
	const slots = (0, import_react.useMemo)(() => {
		if (slotData?.ok) return slotData.slots.slice(0, 4);
		return [];
	}, [slotData]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2rem] bg-primary/15"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-soft relative overflow-hidden rounded-[2rem] p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "إنامل · العبور"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold text-foreground",
							children: t("liveAvailToday")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-deep",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-primary" }), t("slotAvailable")]
					})]
				}),
				!open || slots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-xl border border-border bg-background/60 p-5 text-center text-sm text-muted-foreground",
					children: open ? t("bookedOutToday") : t("clinicClosedToday")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-2.5",
					children: slots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-foreground",
							dir: "ltr",
							children: formatSlotLabel(s, lang)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-primary",
							children: t("slotAvailable")
						})]
					}, s))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#booking",
					className: "mt-6 block min-h-12 w-full rounded-xl bg-deep py-3.5 text-center text-sm font-semibold text-deep-foreground transition-opacity hover:opacity-90",
					children: t("ctaReserveSlot")
				})
			]
		})]
	});
}
var WA_LINK$3 = `https://wa.me/${CLINIC.whatsapp}`;
function Hero() {
	const { t, dir } = useI18n();
	const Arrow = dir === "rtl" ? null : ArrowRight;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "top",
		className: "relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0 -z-10",
			style: { background: "radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 60%), radial-gradient(40% 30% at 0% 100%, color-mix(in oklab, var(--color-mint) 60%, transparent), transparent 70%)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page section-pad grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }), t("heroEyebrow")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleBadge, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-[2rem] leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl",
					children: t("heroTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg",
					children: t("heroSubtitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "#booking",
						className: "inline-flex min-h-12 items-center gap-2 rounded-full bg-deep px-6 py-3.5 text-sm font-medium text-deep-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]",
						children: [t("heroCta"), Arrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, { className: "h-4 w-4" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: WA_LINK$3,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4 text-primary" }), t("heroSecondary")]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6 sm:gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							value: "12+",
							label: t("trustYears")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							value: "6,000+",
							label: t("trustPatients")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							value: "4.9★",
							label: t("trustRating")
						})
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveAvailabilityCard, {})]
		})]
	});
}
function Stat({ value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xl font-semibold text-foreground sm:text-2xl md:text-3xl",
		children: value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 text-[11px] leading-tight text-muted-foreground sm:text-xs",
		children: label
	})] });
}
var items = [
	{
		icon: Stethoscope,
		title: "why1Title",
		body: "why1Body"
	},
	{
		icon: Sparkles,
		title: "why2Title",
		body: "why2Body"
	},
	{
		icon: BadgeDollarSign,
		title: "why3Title",
		body: "why3Body"
	},
	{
		icon: Clock,
		title: "why4Title",
		body: "why4Body"
	}
];
function WhyEnamel() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "why",
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
						children: t("navWhy")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
						children: t("whyTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-muted-foreground",
						children: t("whySubtitle")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: items.map(({ icon: Icon, title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-soft group p-6 transition-transform hover:-translate-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-deep transition-colors group-hover:bg-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 text-base font-semibold text-foreground",
							children: t(title)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: t(body)
						})
					]
				}, title))
			})]
		})
	});
}
var SERVICE_OPTIONS = [
	{
		id: "checkup",
		label: "svcCheckup",
		desc: "svcCheckupDesc",
		icon: Stethoscope
	},
	{
		id: "whitening",
		label: "svcWhitening",
		desc: "svcWhiteningDesc",
		icon: Sparkles
	},
	{
		id: "braces",
		label: "svcBraces",
		desc: "svcBracesDesc",
		icon: Smile
	},
	{
		id: "implants",
		label: "svcImplants",
		desc: "svcImplantsDesc",
		icon: Anchor
	},
	{
		id: "cosmetic",
		label: "svcCosmetic",
		desc: "svcCosmeticDesc",
		icon: WandSparkles
	},
	{
		id: "emergency",
		label: "svcEmergency",
		desc: "svcEmergencyDesc",
		icon: Siren
	}
];
function Services() {
	const { t } = useI18n();
	const { selectService } = useBooking();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "services",
		className: "section-pad bg-mint/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
						children: t("navServices")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
						children: t("servicesTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-muted-foreground",
						children: t("servicesSubtitle")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: SERVICE_OPTIONS.map(({ id, label, desc, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => selectService(id),
					className: "card-soft group flex h-full flex-col p-6 text-start transition-all hover:-translate-y-0.5 hover:border-primary/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary text-deep",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 text-lg font-semibold text-foreground",
							children: t(label)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 grow text-sm leading-relaxed text-muted-foreground",
							children: t(desc)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary",
							children: [t("svcBook"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
						})
					]
				}, id))
			})]
		})
	});
}
var CASES = [{
	before: {
		version: 1,
		asset_id: "49fea91a-03e1-4df4-afa2-842e90843188",
		project_id: "3535b467-eb9c-43cd-89c7-0835b01bda6e",
		url: "/__l5e/assets-v1/49fea91a-03e1-4df4-afa2-842e90843188/case1-before.jpeg",
		r2_key: "a/v1/3535b467-eb9c-43cd-89c7-0835b01bda6e/49fea91a-03e1-4df4-afa2-842e90843188/case1-before.jpeg",
		original_filename: "case1-before.jpeg",
		size: 552996,
		content_type: "image/jpeg",
		created_at: "2026-07-10T16:16:11Z"
	}.url,
	after: {
		version: 1,
		asset_id: "5824703f-817f-4203-983c-e8c6bb0beee8",
		project_id: "3535b467-eb9c-43cd-89c7-0835b01bda6e",
		url: "/__l5e/assets-v1/5824703f-817f-4203-983c-e8c6bb0beee8/case1-after.jpeg",
		r2_key: "a/v1/3535b467-eb9c-43cd-89c7-0835b01bda6e/5824703f-817f-4203-983c-e8c6bb0beee8/case1-after.jpeg",
		original_filename: "case1-after.jpeg",
		size: 526557,
		content_type: "image/jpeg",
		created_at: "2026-07-10T16:16:11Z"
	}.url
}, {
	before: {
		version: 1,
		asset_id: "43a64ef4-0137-4799-af80-f946d0f69ca7",
		project_id: "3535b467-eb9c-43cd-89c7-0835b01bda6e",
		url: "/__l5e/assets-v1/43a64ef4-0137-4799-af80-f946d0f69ca7/case2-before.jpeg",
		r2_key: "a/v1/3535b467-eb9c-43cd-89c7-0835b01bda6e/43a64ef4-0137-4799-af80-f946d0f69ca7/case2-before.jpeg",
		original_filename: "case2-before.jpeg",
		size: 340899,
		content_type: "image/jpeg",
		created_at: "2026-07-10T16:18:19Z"
	}.url,
	after: {
		version: 1,
		asset_id: "8997c144-70b6-49b8-b958-628bcf751f0c",
		project_id: "3535b467-eb9c-43cd-89c7-0835b01bda6e",
		url: "/__l5e/assets-v1/8997c144-70b6-49b8-b958-628bcf751f0c/case2-after.jpeg",
		r2_key: "a/v1/3535b467-eb9c-43cd-89c7-0835b01bda6e/8997c144-70b6-49b8-b958-628bcf751f0c/case2-after.jpeg",
		original_filename: "case2-after.jpeg",
		size: 168323,
		content_type: "image/jpeg",
		created_at: "2026-07-10T16:18:19Z"
	}.url
}];
function Gallery() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "results",
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
						children: t("navResults")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
						children: t("resultsTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-muted-foreground",
						children: t("resultsSubtitle")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2",
				children: CASES.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "card-soft overflow-hidden p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/3]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.before,
								alt: `${t("resultsBefore")} — Case ${i + 1}`,
								loading: "lazy",
								className: "absolute inset-0 h-full w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-2 left-2 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-deep",
								children: t("resultsBefore")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/3]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.after,
								alt: `${t("resultsAfter")} — Case ${i + 1}`,
								loading: "lazy",
								className: "absolute inset-0 h-full w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground",
								children: t("resultsAfter")
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "flex items-center justify-between p-3 text-xs text-deep/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Case #", i + 1] })
					})]
				}, i))
			})]
		})
	});
}
var dr_mohamed_ibrahim_jpeg_asset_default = {
	version: 1,
	asset_id: "30f409d6-26b5-4ed3-abe9-c21d7831678b",
	project_id: "3535b467-eb9c-43cd-89c7-0835b01bda6e",
	url: "/__l5e/assets-v1/30f409d6-26b5-4ed3-abe9-c21d7831678b/dr-mohamed-ibrahim.jpeg",
	r2_key: "a/v1/3535b467-eb9c-43cd-89c7-0835b01bda6e/30f409d6-26b5-4ed3-abe9-c21d7831678b/dr-mohamed-ibrahim.jpeg",
	original_filename: "dr-mohamed-ibrahim.jpeg",
	size: 121008,
	content_type: "image/jpeg",
	created_at: "2026-07-09T15:22:55Z"
};
function Doctor() {
	const { t } = useI18n();
	const creds = [
		{
			icon: GraduationCap,
			key: "doctorCred1"
		},
		{
			icon: BadgeCheck,
			key: "doctorCred2"
		},
		{
			icon: Award,
			key: "doctorCred3"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "doctor",
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2rem] bg-primary-soft"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-soft aspect-[4/5] overflow-hidden p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: dr_mohamed_ibrahim_jpeg_asset_default.url,
						alt: t("doctorName"),
						loading: "lazy",
						className: "h-full w-full object-cover object-top"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
					children: t("doctorTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
					children: t("doctorName")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium text-primary",
					children: t("doctorRole")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-base leading-relaxed text-muted-foreground",
					children: t("doctorBio")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 space-y-3",
					children: creds.map(({ icon: Icon, key }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-deep",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-foreground",
							children: t(key)
						})]
					}, key))
				})
			] })]
		})
	});
}
var getGoogleReviews = createServerFn({ method: "GET" }).handler(createSsrRpc("9a51c8e9f37e0cfb9a6a86a0d40a4079b09b7b94264aaafcf3f03df436fcbb7e"));
function Stars({ rating }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-0.5",
		"aria-label": `${rating} stars`,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}` }, i))
	});
}
function Reviews() {
	const { t } = useI18n();
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		getGoogleReviews().then((res) => {
			if (active) setData(res);
		}).catch(() => {
			if (active) setData({
				rating: null,
				total: null,
				reviews: [],
				url: null,
				error: "fetch_failed"
			});
		}).finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, []);
	const reviews = data?.reviews ?? [];
	const hasError = !loading && (data?.error || reviews.length === 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "reviews",
		className: "section-pad bg-mint/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
								children: t("navReviews")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
								children: t("reviewsTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-base text-muted-foreground",
								children: t("reviewsSubtitle")
							})
						]
					}), data?.rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl bg-background/80 px-4 py-3 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-semibold text-foreground",
							children: data.rating.toFixed(1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { rating: data.rating }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: [
								data.total ?? 0,
								" · ",
								t("reviewsRatingSuffix")
							]
						})] })]
					})]
				}),
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-soft mt-10 grid min-h-[200px] place-items-center p-10 text-sm text-muted-foreground",
					children: t("reviewsPlaceholder")
				}),
				hasError && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-soft mt-10 grid min-h-[160px] place-items-center p-10 text-sm text-muted-foreground",
					children: t("reviewsError")
				}),
				!loading && reviews.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3",
					children: reviews.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "card-soft flex w-[85%] shrink-0 snap-start flex-col gap-3 p-5 md:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [r.authorPhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: r.authorPhoto,
									alt: "",
									loading: "lazy",
									className: "h-10 w-10 rounded-full object-cover",
									referrerPolicy: "no-referrer"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary",
									children: r.author.charAt(0)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold text-foreground",
										children: r.author
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: r.relativeTime
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { rating: r.rating }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground line-clamp-6",
								children: r.text
							})
						]
					}, i))
				}), data?.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: data.url,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline",
						children: [t("reviewsViewAll"), " →"]
					})
				})] })
			]
		})
	});
}
function Calendar({ value, onChange }) {
	const { t, lang, dir } = useI18n();
	const [view, setView] = (0, import_react.useState)(() => {
		const d = value ?? /* @__PURE__ */ new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});
	const months = t("calMonths_long").split(",");
	const weekdays = t("calWeekdaysShort").split(",");
	const cells = (0, import_react.useMemo)(() => {
		const startOffset = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
		const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
		const arr = [];
		for (let i = 0; i < startOffset; i++) arr.push(null);
		for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(view.getFullYear(), view.getMonth(), d));
		while (arr.length % 7 !== 0) arr.push(null);
		return arr;
	}, [view]);
	const goPrev = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
	const goNext = () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
	const Prev = dir === "rtl" ? ChevronRight : ChevronLeft;
	const Next = dir === "rtl" ? ChevronLeft : ChevronRight;
	const selectedKey = value ? ymd(value) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-3 sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: goPrev,
						"aria-label": t("calPrev"),
						className: "grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prev, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-semibold text-foreground",
						children: [
							months[view.getMonth()],
							" ",
							view.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", { year: "numeric" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: goNext,
						"aria-label": t("calNext"),
						className: "grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Next, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
				children: weekdays.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-1",
					children: w
				}, w))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid grid-cols-7 gap-1",
				children: cells.map((d, i) => {
					if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11" }, i);
					const past = isPastDay(d);
					const open = isOpenDay(d);
					const disabled = past || !open;
					const selected = ymd(d) === selectedKey;
					const isFri = CLINIC.closedWeekdays.includes(d.getDay());
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled,
						onClick: () => onChange(d),
						"aria-label": d.toDateString(),
						className: ["relative h-11 rounded-xl text-sm font-medium transition-colors", selected ? "bg-deep text-deep-foreground" : disabled ? "cursor-not-allowed text-muted-foreground/40" : "text-foreground hover:bg-primary-soft"].join(" "),
						children: [d.getDate(), isFri && !selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-x-1 bottom-0.5 text-[8px] uppercase text-muted-foreground/60",
							children: t("calFriClosed")
						})]
					}, i);
				})
			})
		]
	});
}
var EG_PHONE = /^(?:\+?20|0020)?0?1[0125][0-9]{8}$/;
var WA_LINK$2 = `https://wa.me/${CLINIC.whatsapp}`;
function BookingForm() {
	const { t, lang } = useI18n();
	const { preselectedService, clearService } = useBooking();
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [service, setService] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(null);
	const [time, setTime] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitError, setSubmitError] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [waUrl, setWaUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (preselectedService) setService(preselectedService);
	}, [preselectedService]);
	const slots = (0, import_react.useMemo)(() => generateSlots(), []);
	const dateKey = date ? ymd(date) : null;
	const { data: slotData, refetch: refetchSlots } = useQuery({
		queryKey: ["day-slots", dateKey],
		queryFn: () => getDaySlots({ data: { date: dateKey } }),
		enabled: !!dateKey && isSupabaseConfigured,
		staleTime: 3e4
	});
	const availableSlots = slotData?.ok === true ? new Set(slotData.slots) : null;
	function validate() {
		const e = {};
		if (name.trim().length < 2) e.name = "errName";
		const cleaned = phone.replace(/[\s-]/g, "");
		if (!EG_PHONE.test(cleaned)) e.phone = "errPhone";
		if (!service) e.service = "errService";
		if (!date) e.date = "errDate";
		if (!time) e.time = "errTime";
		return e;
	}
	async function onSubmit(ev) {
		ev.preventDefault();
		const e = validate();
		setErrors(e);
		if (Object.keys(e).length) return;
		setSubmitting(true);
		setSubmitError(null);
		try {
			const payload = {
				name: name.trim(),
				phone: phone.replace(/[\s-]/g, ""),
				service,
				date: date ? ymd(date) : "",
				time,
				notes: notes.trim(),
				submittedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (isSupabaseConfigured) {
				const res = await submitBooking({ data: payload });
				if (!res.ok) {
					if (res.error === "slot_unavailable") {
						setSubmitError("errSlotTaken");
						setTime("");
						refetchSlots();
					} else setSubmitError("errBooking");
					return;
				}
			}
			if (typeof window !== "undefined") {
				const existing = JSON.parse(localStorage.getItem("enamel-bookings") || "[]");
				existing.unshift(payload);
				localStorage.setItem("enamel-bookings", JSON.stringify(existing));
			}
			trackLead({
				service,
				value: 0,
				currency: "EGP"
			});
			const dateLabel = date ? formatDateLabel(date, lang) : "";
			const timeLabel = formatSlotLabel(time, lang);
			const svcLabel = t(SERVICE_OPTIONS.find((s) => s.id === service)?.label || "navBook");
			const msg = lang === "ar" ? `تأكيد حجزك في إنامل دنتال هاوس\nالاسم: ${payload.name}\nالخدمة: ${svcLabel}\nالتاريخ: ${dateLabel}\nالساعة: ${timeLabel}\nهيوصلك تذكير قبل الموعد بيوم.` : `Enamel Dental House — appointment confirmation\nName: ${payload.name}\nService: ${svcLabel}\nDate: ${dateLabel}\nTime: ${timeLabel}\nWe'll send a reminder the day before.`;
			const url = `${WA_LINK$2}?text=${encodeURIComponent(msg)}`;
			setWaUrl(url);
			if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
			setDone(true);
			clearService();
		} finally {
			setSubmitting(false);
		}
	}
	function reset() {
		setName("");
		setPhone("");
		setService("");
		setDate(null);
		setTime("");
		setNotes("");
		setErrors({});
		setSubmitError(null);
		setDone(false);
		setWaUrl("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "booking",
		className: "section-pad bg-mint/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
						children: t("navBook")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
						children: t("bookTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-muted-foreground",
						children: t("bookSubtitle")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-8 max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-deep",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), t("bookScarcity")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-soft overflow-hidden p-5 sm:p-7",
					children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid place-items-center py-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-14 w-14 place-items-center rounded-full bg-primary text-deep",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-7 w-7" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-5 text-xl font-semibold text-foreground",
								children: t("bookSuccessTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-sm text-sm text-muted-foreground",
								children: t("bookSuccessBody")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: waUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-deep px-5 py-3 text-sm font-semibold text-deep-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), t("bookOpenWhatsapp")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: reset,
								className: "mt-3 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:bg-accent",
								children: t("bookSuccessAnother")
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						noValidate: true,
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-sm font-semibold text-foreground",
									children: t("bookStep1")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
									value: date,
									onChange: (d) => {
										setDate(d);
										setTime("");
										setErrors((e) => ({
											...e,
											date: void 0
										}));
									}
								}),
								errors.date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-destructive",
									children: t(errors.date)
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-sm font-semibold text-foreground",
									children: t("bookStep2")
								}),
								!date ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-xl border border-dashed border-border bg-background/50 p-4 text-center text-xs text-muted-foreground",
									children: t("bookStep2Hint")
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-2 sm:grid-cols-4",
									children: slots.map((s) => {
										const booked = date ? availableSlots ? !availableSlots.has(s) : isSlotBooked(date, s) : false;
										const selected = time === s;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: booked,
											onClick: () => {
												setTime(s);
												setErrors((e) => ({
													...e,
													time: void 0
												}));
											},
											className: ["relative min-h-12 rounded-xl border px-2 py-2 text-sm font-medium transition-colors", selected ? "border-deep bg-deep text-deep-foreground" : booked ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through" : "border-border bg-background text-foreground hover:border-primary hover:bg-primary-soft"].join(" "),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												dir: "ltr",
												children: formatSlotLabel(s, lang)
											}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "absolute end-1 top-1 h-3.5 w-3.5" })]
										}, s);
									})
								}),
								errors.time && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-destructive",
									children: t(errors.time)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: WA_LINK$2,
									target: "_blank",
									rel: "noreferrer",
									className: "mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-2 hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" }), t("noTimeWhatsapp")]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold text-foreground",
										children: t("bookYourDetails")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("fieldName"),
										error: errors.name ? t(errors.name) : void 0,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: name,
											onChange: (e) => setName(e.target.value),
											placeholder: t("fieldNamePh"),
											className: inputCls,
											autoComplete: "name"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("fieldPhone"),
										error: errors.phone ? t(errors.phone) : void 0,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: phone,
											onChange: (e) => setPhone(e.target.value),
											placeholder: t("fieldPhonePh"),
											className: inputCls,
											inputMode: "tel",
											autoComplete: "tel",
											dir: "ltr"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("fieldService"),
										error: errors.service ? t(errors.service) : void 0,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: service,
											onChange: (e) => setService(e.target.value),
											className: inputCls,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: t("fieldServicePh")
											}), SERVICE_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s.id,
												children: t(s.label)
											}, s.id))]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("fieldNotes"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: notes,
											onChange: (e) => setNotes(e.target.value),
											placeholder: t("fieldNotesPh"),
											rows: 2,
											className: inputCls + " resize-none"
										})
									})
								]
							}),
							submitError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive",
								children: t(submitError)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-start gap-2 rounded-xl bg-primary-soft/60 p-3 text-xs text-deep",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }), t("bookReassurance")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: submitting,
								className: "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-deep px-6 py-3.5 text-sm font-semibold text-deep-foreground transition-opacity hover:opacity-95 disabled:opacity-60",
								children: submitting ? t("bookSubmitting") : t("bookSubmit")
							})
						]
					})
				})]
			})]
		})
	});
}
var inputCls = "w-full min-h-12 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
function Field({ label, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-sm font-medium text-foreground",
				children: label
			}),
			children,
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-xs text-destructive",
				children: error
			})
		]
	});
}
/**
* TODO: Drop more patient videos below. Keep short (15-45s) vertical clips.
*/
var SLOTS = [
	{
		caption: "تجربتي مع تبييض الأسنان",
		src: {
			version: 1,
			asset_id: "a3cc6510-e2d7-4fe6-a288-23c9825337b1",
			project_id: "3535b467-eb9c-43cd-89c7-0835b01bda6e",
			url: "/__l5e/assets-v1/a3cc6510-e2d7-4fe6-a288-23c9825337b1/testimonial1.mp4",
			r2_key: "a/v1/3535b467-eb9c-43cd-89c7-0835b01bda6e/a3cc6510-e2d7-4fe6-a288-23c9825337b1/testimonial1.mp4",
			original_filename: "testimonial1.mp4",
			size: 1529349,
			content_type: "video/mp4",
			created_at: "2026-07-10T16:23:56Z"
		}.url,
		poster: {
			version: 1,
			asset_id: "db639184-4364-411e-9625-15d0265f2981",
			project_id: "3535b467-eb9c-43cd-89c7-0835b01bda6e",
			url: "/__l5e/assets-v1/db639184-4364-411e-9625-15d0265f2981/testimonial1-poster.jpg",
			r2_key: "a/v1/3535b467-eb9c-43cd-89c7-0835b01bda6e/db639184-4364-411e-9625-15d0265f2981/testimonial1-poster.jpg",
			original_filename: "testimonial1-poster.jpg",
			size: 27264,
			content_type: "image/jpeg",
			created_at: "2026-07-10T16:23:58Z"
		}.url
	},
	{ caption: "زراعة بدون ألم" },
	{ caption: "تقويم شفاف في ٨ شهور" },
	{ caption: "أول كشف بعد سنين" }
];
function VideoCard({ caption, src, poster }) {
	const ref = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const play = () => {
		const v = ref.current;
		if (!v) return;
		v.play();
		setPlaying(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "snap-start shrink-0 w-[260px] sm:w-[280px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-soft relative aspect-[9/16] overflow-hidden p-0",
			children: [src ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref,
				src,
				poster,
				playsInline: true,
				controls: playing,
				preload: "metadata",
				className: "absolute inset-0 h-full w-full object-cover bg-deep",
				onPause: () => setPlaying(false),
				onEnded: () => setPlaying(false)
			}), !playing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Play video",
				onClick: play,
				className: "absolute inset-0 grid place-items-center bg-black/10 text-deep-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-14 w-14 place-items-center rounded-full bg-card/95 text-deep shadow-[var(--shadow-elevated)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-6 w-6 fill-current" })
				})
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "absolute inset-0",
				style: { background: "linear-gradient(160deg, color-mix(in oklab, var(--color-primary) 30%, var(--color-deep)) 0%, color-mix(in oklab, var(--color-deep) 80%, transparent) 100%)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center text-deep-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-14 w-14 place-items-center rounded-full bg-card/95 text-deep shadow-[var(--shadow-elevated)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-6 w-6 fill-current" })
				})
			})] }), !playing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-deep-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs opacity-90",
					children: caption
				})
			})]
		})
	});
}
function VideoTestimonials() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "video-testimonials",
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
						children: t("navReviews")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
						children: t("videoTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-muted-foreground",
						children: t("videoSubtitle")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 -mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-4 snap-x snap-mandatory",
					children: SLOTS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
						caption: s.caption,
						src: s.src,
						poster: s.poster
					}, i))
				})
			})]
		})
	});
}
var faqs = [
	{
		q: "faq1Q",
		a: "faq1A"
	},
	{
		q: "faq2Q",
		a: "faq2A"
	},
	{
		q: "faq3Q",
		a: "faq3A"
	},
	{
		q: "faq4Q",
		a: "faq4A"
	},
	{
		q: "faq5Q",
		a: "faq5A"
	},
	{
		q: "faq6Q",
		a: "faq6A"
	}
];
function FAQ() {
	const { t } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "faq",
		className: "section-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
					children: t("navFaq")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
					children: t("faqTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 divide-y divide-border rounded-2xl border border-border bg-card",
					children: faqs.map((f, i) => {
						const isOpen = open === i;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpen(isOpen ? null : i),
							className: "flex w-full items-center justify-between gap-4 px-5 py-5 text-start",
							"aria-expanded": isOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-medium text-foreground",
								children: t(f.q)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}` })]
						}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-5 pb-5 text-sm leading-relaxed text-muted-foreground",
							children: t(f.a)
						})] }, f.q);
					})
				})
			]
		})
	});
}
var WA_LINK$1 = "https://wa.me/201000268550";
function Location() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "section-pad bg-mint/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid gap-8 md:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
					children: t("navContact")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl tracking-tight text-foreground md:text-4xl",
					children: t("locTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 space-y-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							icon: MapPin,
							label: t("locAddressLabel"),
							value: t("locAddress")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							icon: Clock,
							label: t("locHoursLabel"),
							value: t("locHours")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							icon: Phone,
							label: t("locPhoneLabel"),
							value: t("locPhone"),
							ltr: true
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: WA_LINK$1,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-8 inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3 text-sm font-medium text-deep-foreground hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), t("locWhatsapp")]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "google-map-embed",
				className: "card-soft min-h-[280px] overflow-hidden p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "Enamel Dental House location",
					src: "https://www.google.com/maps?q=place_id:ChIJoTgIQEAbWBQR_1Vma-gl1kA&hl=ar&z=16&output=embed",
					className: "h-full min-h-[280px] w-full border-0",
					loading: "lazy",
					referrerPolicy: "no-referrer-when-downgrade",
					allowFullScreen: true
				})
			})]
		})
	});
}
function Row({ icon: Icon, label, value, ltr }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-deep",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-0.5 text-base font-medium text-foreground",
			dir: ltr ? "ltr" : void 0,
			children: value
		})] })]
	});
}
function Footer() {
	const { t, lang, setLang } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-deep font-bold",
						children: "E"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tracking-tight",
						children: t("brand")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xs text-sm text-muted-foreground",
					children: t("footerTagline")
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FCol, {
					title: t("footerQuick"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FLink, {
							href: "#why",
							children: t("navWhy")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FLink, {
							href: "#services",
							children: t("navServices")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FLink, {
							href: "#doctor",
							children: t("navDoctor")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FLink, {
							href: "#faq",
							children: t("navFaq")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FCol, {
					title: t("footerContact"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: t("locAddress")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							dir: "ltr",
							children: t("locPhone")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: t("locHours")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FCol, {
					title: t("footerFollow"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "grid h-9 w-9 place-items-center rounded-full border border-border text-foreground hover:bg-accent",
							"aria-label": "Instagram",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "grid h-9 w-9 place-items-center rounded-full border border-border text-foreground hover:bg-accent",
							"aria-label": "Facebook",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setLang(lang === "ar" ? "en" : "ar"),
						className: "mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5" }), t("langToggle")]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					t("brand"),
					". ",
					t("footerRights")
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Obour City · Cairo" })]
			})
		})]
	});
}
function FCol({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
		className: "text-xs font-semibold uppercase tracking-wider text-foreground",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 space-y-2",
		children
	})] });
}
function FLink({ href, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className: "block text-sm text-muted-foreground hover:text-foreground",
		children
	});
}
var WA_LINK = `https://wa.me/${CLINIC.whatsapp}`;
function StickyMobileBar() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur md:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-md items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "#booking",
				className: "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-4 w-4" }), t("mobileBook")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: WA_LINK,
				target: "_blank",
				rel: "noreferrer",
				className: "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-primary bg-primary-soft px-4 py-3 text-sm font-semibold text-deep",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), t("mobileWa")]
			})]
		})
	});
}
function SocialProofBar() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		"aria-label": "social-proof",
		className: "border-y border-border bg-primary-soft/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid grid-cols-3 gap-3 py-5 md:py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-primary text-primary" }),
					value: "4.9★",
					label: t("trustRating")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }),
					value: "6,000+",
					label: t("trustPatients")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-primary" }),
					value: "12+",
					label: t("trustYears")
				})
			]
		})
	});
}
function Item({ icon, value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center text-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-base font-semibold text-foreground sm:text-lg",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] leading-tight text-muted-foreground sm:text-xs",
			children: label
		})]
	});
}
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {}) }) });
}
function Page() {
	(0, import_react.useEffect)(() => {
		trackPageView();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-24 md:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialProofBar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyEnamel, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doctor, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingForm, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoTestimonials, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Services, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Location, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyMobileBar, {})
		]
	});
}
export { LandingPage as component };
