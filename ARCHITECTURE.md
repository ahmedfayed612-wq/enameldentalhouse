# Enamel Dental House — Clinic Management System
## Technical Audit, Product & Architecture Specification (Phase 0)

Status: AUDIT COMPLETE — awaiting Gate 2 approval. No code changes made.
Date: 2026-11-17

---

## PART 1 — EXISTING PROJECT AUDIT (Deliverable 1)

### 1.1 Critical finding (read first)

**The existing website has no backend, no database, no authentication, and no persistent storage.**

- The "booking system" is entirely client-side:
  - `src/components/landing/BookingForm.tsx` validates the form, pushes the payload to `localStorage["enamel-bookings"]`, and opens a `wa.me/<clinic-whatsapp>` deep link with a prefilled confirmation message. No server call, no database write.
  - `src/lib/availability.ts` is a hardcoded config object (`CLINIC.closedWeekdays`, `openHour`, `closeHour`, `slotMinutes`, `bookedSlots: {}`). `bookedSlots` is an empty `Record` meant for manual edits — nothing populates it.
  - `src/components/landing/LiveAvailabilityCard.tsx` renders "live" slots purely from the hardcoded config minus past times.
- There is **no appointments table, no patients table, no users, no payments** — nothing exists to integrate with.
- The `.lovable/plan.md` itself states: *"No backend yet — bookings persist to localStorage, WhatsApp link opens compose window for real confirmation"* and flags real-time slot sync + automated WhatsApp as Phase 2.

**Consequence:** The directive's assumption ("trace the booking lifecycle, integrate with existing booking infrastructure") cannot be fulfilled as written — there is no existing appointment data source of truth. The admin platform must **create** the backend and booking persistence first, then migrate the public form onto it. This is a foundation-build, not an integration. All downstream design assumes this.

### 1.2 Technology stack (verified)

| Layer | Technology | Evidence |
|---|---|---|
| Framework | TanStack Start (React 19 SSR) + Vite 8 | `package.json`, `vite.config.ts` |
| Routing | TanStack Router, file-based | `src/routes/`, `routeTree.gen.ts` |
| UI | React 19 + Radix/shadcn-style `ui/` kit | `src/components/ui/*` (50 components) |
| Styling | Tailwind CSS v4 (`@theme`, `@utility`, CSS vars) | `src/styles.css` |
| Data fetching | TanStack Query | `@tanstack/react-query`, `__root.tsx` |
| Forms | react-hook-form + zod | deps present (unused so far) |
| Charts | recharts (unused) | dep present |
| i18n | Custom context, ar/en, RTL-aware | `src/lib/i18n.tsx`, `translations.ts` |
| Server fns | `createServerFn` from TanStack Start | `src/lib/google-reviews.functions.ts` |
| Deploy | Vercel serverless via nitro `preset: "vercel"` | `vite.config.ts`; `vercel.json` has SPA-style rewrite (see risk R-9) |
| Host/editor | Lovable-connected (Git sync), AGENTS.md warns against history rewrites | `AGENTS.md`, `.lovable/` |

**Not present (verified absent):** no Prisma/Drizzle/ORM, no Supabase/Firebase client, no auth lib, no database driver, no env DB config. `.env` contains only Google Maps connector keys (values not inspected).

### 1.3 Frontend architecture

- Single route `src/routes/index.tsx` renders all landing sections; `__root.tsx` provides QueryClient + error/404 shells.
- Landing components in `src/components/landing/` (Nav, Hero, Services, Gallery, BookingForm, Calendar, etc.).
- Full shadcn/Radix `ui/` kit already installed — including `sidebar.tsx`, `table.tsx`, `chart.tsx`, `calendar.tsx`, `form.tsx`, `command.tsx` — ideal for the admin shell without new deps.
- State: React context only (`I18nProvider`, `BookingProvider`). No global store; React Query available but unused.
- `src/lib/booking-store.tsx` is only a "preselected service" context — unrelated to persistence.

### 1.4 Backend investigation

- `src/server.ts` is a thin SSR error-wrapper around the TanStack Start server entry; nitro builds it for Vercel.
- Only server function: `getGoogleReviews` (`google-reviews.functions.ts`) — calls Lovable's connector gateway for Google Places reviews; in-memory 1h cache; fails soft. This proves `createServerFn` works on the deployed target.
- No API routes, no middleware, no storage, no realtime, no background jobs.
- Vercel serverless is the current deploy target → long-running connections (e.g., Postgres websockets/Supabase realtime) are constrained but workable via HTTP polling or Supabase's REST/realtime-over-websocket from the client.

### 1.5 Database investigation

None exists. There is no schema, no migrations, no tables. Every entity in the product spec (patients, appointments, services, dentists, invoices, payments, expenses, staff) is greenfield.

### 1.6 Authentication & security

None exists. No login, no roles, no RLS, no session handling. `vercel.json` rewrites everything to `/` — must be reviewed so admin/API routes aren't shadowed (risk R-9).

### 1.7 Existing reusable functionality

- Design system: complete and production-quality (see Part 2).
- i18n infrastructure (ar default, en, RTL flip) — directly reusable for admin.
- `ui/` component kit — reusable for admin tables, forms, dialogs, sidebar, charts.
- `availability.ts` slot-generation logic — reusable as reference, but must move server-side.
- `EG_PHONE` validation regex in BookingForm — reusable.
- `createServerFn` pattern — proven path for admin API functions.
- Google reviews server fn — shows env-secret pattern (`process.env.*` on server only).

### 1.8 Limitations / unverifiable items

- Cannot verify what Lovable Cloud provisions behind the scenes (Lovable projects typically pair with Supabase, but no Supabase code/env is present). Whether a Supabase project already exists for this app is **unknown** — needs user confirmation or Lovable dashboard check.
- `vercel.json` rewrite `/(.*) -> /` would break any future non-SSR API endpoints if it applies to serverless functions — must test before adding routes.
- Lovable connector env vars (`LOVABLE_API_KEY`, `GOOGLE_MAPS_API_KEY`) are referenced but only present if injected by Lovable at runtime.

---

## PART 2 — DESIGN SYSTEM SPECIFICATION (Deliverable, from code)

All tokens live in `src/styles.css`. **Source of truth — reuse verbatim.**

### Colors (`:root` CSS vars → Tailwind theme)

| Token | Value | Use |
|---|---|---|
| `--background` / card / popover | `#FFFFFF` | surfaces |
| `--foreground` | `#0F2A3D` (deep navy) | text |
| `--primary` | `#29ABE2` (sky blue) | accents, rings, icons |
| `--primary-foreground` | `#FFFFFF` | on primary |
| `--primary-soft` | `#D4EDDA` | tinted chips/pills |
| `--deep` | `#1A7FB5` (dark blue) | primary buttons, headings accents |
| `--deep-foreground` | `#FFFFFF` | on deep |
| `--mint` | `#D4EDDA` | section backgrounds (`bg-mint/30`) |
| `--secondary` | `#EAF6FC` | soft blue surfaces |
| `--secondary-foreground` | `#1A7FB5` | |
| `--muted` | `#F4F8FB` | subtle fills |
| `--muted-foreground` | `#547085` | secondary text |
| `--accent` | `#D4EDDA` | hover accents |
| `--destructive` | oklch red | errors |
| `--border` / `--input` | `#E2EAF0` | hairlines, input borders |
| `--ring` | `#29ABE2` | focus rings |

### Typography
- `--font-sans`: Inter + IBM Plex Sans Arabic (both `@fontsource`, loaded in `src/lib/fonts.ts`).
- `--font-arabic`: IBM Plex Sans Arabic first when `html[dir=rtl]`.
- Headings `h1–h4`: `font-weight 600`, `letter-spacing -0.02em`.
- Admin can be English-first but should reuse same fonts; Arabic RTL already supported by infra.

### Shape / elevation / spacing
- `--radius: 1rem` (16px); scale sm→4xl derived. Buttons/inputs use `rounded-xl`; cards `rounded-[2rem]` or `rounded-2xl`.
- Shadows: `--shadow-soft` (cards), `--shadow-elevated` (popovers).
- Utilities: `container-page` (max-w 76rem), `section-pad`, `card-soft` (white card + `#E2EAF0` border + 2xl radius + soft shadow). **`card-soft` is the signature component style — reuse for admin cards.**
- Breakpoints: standard Tailwind (mobile-first, 360–430px priority per `.lovable/plan.md`).
- Icons: `lucide-react` only. Animations: `tw-animate-css` + Tailwind transitions; `animate-pulse` dot for "live" indicators.
- Signature patterns: pill badges (`rounded-full bg-primary-soft text-deep`), big `min-h-12` tap targets, `bg-deep` CTA buttons, dashed-border empty states, `bg-mint/30` section bands.

### Reusable for admin
`card-soft`, all `ui/*` primitives, `inputCls` pattern (`min-h-12 rounded-xl border-input focus:border-primary focus:ring-primary/20`), pill badges, `container-page`. New admin-only components (data tables, stat cards, calendar grid) must be built from these tokens — no new colors.

---

## PART 3 — BOOKING SYSTEM INVESTIGATION (Deliverable 2)

### Actual lifecycle today

```
Patient → index.tsx → BookingForm.tsx
  1. Calendar.tsx picks date (closed weekdays + past days disabled client-side)
  2. generateSlots() → 45-min slots 12:00–22:00; isSlotBooked() checks CLINIC.bookedSlots (always empty)
  3. Details: name, EG phone regex, service (6 hardcoded SERVICE_OPTIONS), notes
  4. Submit → localStorage append + trackLead() analytics + window.open(wa.me/201000268550?text=...)
  5. "Confirmation" = patient sends/receives WhatsApp message. No server record. No dedup.
```

### Answers to directive questions

| Question | Reality |
|---|---|
| How are slots calculated? | `availability.ts`: fixed 45-min grid, 12:00–22:00, Friday closed. Hardcoded. |
| How are appointments stored? | **They aren't.** localStorage only, per-browser. |
| Dentists assigned? | No — single implicit provider. |
| Treatment durations? | No — fixed 45-min slot regardless of service. |
| Multiple dentists/rooms? | Not modeled. |
| Overlap prevention? | None — `bookedSlots` is manual and empty. Double-booking is impossible to even detect. |
| Cancel/reschedule? | Via WhatsApp manually, off-system. |
| Auto vs manual confirm? | Manual via WhatsApp. |
| Patient records? | None created. |
| Duplicate patients? | N/A — no patient store. |
| Availability updates? | Manual code edit + redeploy. |

### Data-flow diagram (current)

```
[Browser] BookingForm → localStorage("enamel-bookings")   (lost on cache clear, per-device)
        └→ wa.me link → clinic WhatsApp (human books manually, presumably on paper/Excel)
```

### Integration risks

- **R-B1 (highest):** There is no appointment store. The "integration" is actually "build the booking backend," then rewire `BookingForm` to POST to it. Until then, nothing the admin creates can appear on the public site.
- **R-B2:** Public form currently cannot detect real availability — it shows every slot as available. Once DB-backed, slot availability must be computed server-side (or via a public read-only availability endpoint) or the site will overbook.
- **R-B3:** WhatsApp confirmation flow must be preserved during migration (it's the clinic's real confirmation channel today). Automated WhatsApp Business API is a later phase.
- **R-B4:** `vercel.json` catch-all rewrite may intercept API/function routes — verify before adding endpoints.
- **R-B5:** Slot semantics change: 45-min fixed grid vs per-service durations — needs a product decision (recommend: keep 45-min grid initially, duration per service later).

---

## PART 4 — PRODUCT SPECIFICATION (Deliverable 3)

Navigation (sidebar, grouped):

```
Overview          → /admin (dashboard)
Operations        → Appointments (calendar) · Waiting Room · Today
Patients          → Patient list · Patient profile · Import CSV
Clinical          → Treatment plans · Treatment records
Finance           → Invoices · Payments · Receipts · Expenses · Reports
Administration    → Staff & roles · Services & pricing · Clinic settings · Audit log
```

Roles: Owner/Admin, Manager, Receptionist, Dentist, Accountant (RBAC enforced server-side + Postgres RLS).

Module summaries (full detail in each phase spec):

1. **Overview** — today's counts by status, collected vs invoiced, expenses, alerts, recent activity. Permission-filtered.
2. **Appointments** — day/week/month calendar; create/edit/cancel/reschedule; status lifecycle `booked → confirmed → arrived → waiting → in_treatment → completed`, plus `cancelled`, `no_show`; conflict prevention via DB exclusion constraint; waiting-room board for reception.
3. **Patients CRM** — unique patient number, profile with appointments/invoices/treatments/balance, search/filter/pagination, tags, CSV import wizard (upload → map → validate → dedupe preview → confirm → report; chunked server-side processing).
4. **Treatment plans** — plan header + line items (service, dentist, price, status, linked appointments); clinical notes restricted to dentist/manager+.
5. **Billing** — invoices + items, partial/multiple payments, discounts, void/refund with audit; payment methods configurable (cash, card, Instapay, transfer); PDF receipts (server-generated, branded, numbered); balances derived from ledger, never stored drifted.
6. **Expenses** — categorized expenses w/ attachments, audit trail, monthly summaries, export.
7. **Reports** — revenue (earned vs invoiced vs collected kept distinct), by dentist/service/method, expenses by category, outstanding balances, collection rate, custom ranges; EGP currency, `numeric(12,2)` money, Africa/Cairo timezone.
8. **Staff/RBAC** — users table + roles + permissions matrix; audit log of sensitive actions.
9. **Settings** — clinic info, working hours/holidays (replaces `availability.ts` hardcoding), services+prices+durations, dentists, rooms, payment methods, expense categories, receipt numbering.

---

## PART 5 — DATABASE ARCHITECTURE PROPOSAL (Deliverable 4)

**Recommendation: Supabase (Postgres + Auth + RLS + Storage)** — best fit: Lovable's native backend, generous free tier, realtime optional, SQL migrations via Supabase CLI, RLS maps directly to the RBAC requirement. Alternative: Neon/Postgres + Auth.js — viable but rebuilds auth/RLS manually. **Decision needed (see Open Questions).**

### A. Reuse / B. Modify / C. New

**A. Existing tables to reuse:** none (no DB exists).

**B. Existing code to repurpose:** `availability.ts` config → becomes `clinic_settings`/`working_hours` rows; `SERVICE_OPTIONS` → `services` table seeded from it; `EG_PHONE` regex → shared validation; i18n + design tokens unchanged.

**C. New tables (proposed schema, Postgres):**

| Table | Purpose | Key fields / notes |
|---|---|---|
| `profiles` | staff user extension of `auth.users` | id→auth.users, full_name, role enum, phone, active, created_at |
| `clinics`/`clinic_settings` | single-row config | name, address, phones, whatsapp, timezone `Africa/Cairo`, currency `EGP`, working hours JSON or `working_hours` table, receipt prefix |
| `working_hours` | per-weekday open/close | weekday, open_time, close_time, is_closed |
| `holidays` | closed dates | date, reason |
| `services` | treatments catalog | code, name_ar/en, description, price numeric(12,2), duration_min, active, sort_order |
| `dentists` | providers | id, name, title, color, active, linked profile_id nullable |
| `rooms` | treatment rooms (optional v1) | name, active |
| `patients` | CRM | patient_no (unique serial), full_name, phone (normalized, indexed), email, dob, gender, address, notes, tags text[], created_by, created_at; unique-ish phone+name dedupe handled in app + import review |
| `appointments` | bookings — **single source of truth** | id uuid, patient_id FK, service_id FK, dentist_id FK, room_id FK null, starts_at timestamptz, ends_at, status enum, source enum(web/admin/import/whatsapp), notes, created_by, confirmed_at; **exclusion constraint** `tstzrange` per dentist (and room) to prevent overlaps; indexes on (dentist_id, starts_at), (patient_id), (status, starts_at) |
| `appointment_status_log` | audit of transitions | appointment_id, from_status, to_status, actor, at |
| `patient_notes` | internal notes (staff-only RLS) | patient_id, author, body, internal flag |
| `treatment_plans` | plan header | patient_id, dentist_id, title, status, notes |
| `treatment_plan_items` | procedures | plan_id, service_id, dentist_id, price, status, completed_at, notes |
| `treatment_records` | clinical entries | patient_id, dentist_id, appointment_id null, plan_item_id null, note, procedure jsonb, created_at — **RLS: clinical roles only** |
| `invoices` | billing header | invoice_no unique, patient_id, appointment_id null, issue_date, subtotal, discount, total, status(draft/issued/partial/paid/void), currency |
| `invoice_items` | line items | invoice_id, service_id null, description, qty, unit_price, line_total |
| `payments` | **immutable ledger** | payment_no unique, patient_id, invoice_id null, amount numeric(12,2), method_id, paid_at, recorded_by, reference, status(active/voided/refunded), void_of_id null — never UPDATE amounts; corrections via reversal rows |
| `payment_methods` | config | name, kind(cash/card/instapay/transfer/other), active |
| `receipts` | generated receipts | receipt_no unique, payment_id unique, issued_at, pdf_path null (or generated on demand) |
| `expenses` | operating costs | expense_no, category_id, amount, expense_date, method_id, vendor, attachment_path, recorded_by, status, recurring_rule null |
| `expense_categories` | config | name, active |
| `import_jobs` + `import_rows` | CSV import tracking | job: file meta, user, counts, status; rows: raw jsonb, mapped fields, status(ok/duplicate/error), patient_id |
| `audit_log` | sensitive actions | actor, action, entity, entity_id, diff jsonb, at |
| `appointment_reminders` (later) | WhatsApp reminders | appointment_id, channel, sent_at, status |

### D. Potentially unnecessary
Separate `bookings` vs `appointments` (rejected — one table), `availability_cache` (compute on read), `sessions` (Supabase Auth handles), `products/inventory` (out of scope).

### Integrity measures
- Money: `numeric(12,2)` everywhere; balances = `SUM(invoice totals) − SUM(active payments)` computed or via view; no mutable balance columns.
- Appointments: exclusion constraint prevents double-booking per dentist; status transitions validated in server fn + trigger or check.
- RLS on every table; `patients`/clinical data restricted; financial tables restricted to finance roles.
- Timezone: store `timestamptz`; clinic TZ `Africa/Cairo` for display/working-hours math.

---

## PART 6 — UI/UX ARCHITECTURE (Deliverable 5)

- **Shell:** left sidebar (collapsible, `ui/sidebar.tsx`) with grouped nav + role-filtered items; top bar with clinic name, date (Africa/Cairo), language toggle (reuse `I18nProvider`), user menu. Content area `bg-muted/40`, `container-page`-like padding; cards via `card-soft`.
- **Overview:** stat-card row (today's appointments by status, collected, invoiced, expenses) → `bg-primary-soft`/`bg-secondary` tints, `text-deep` numbers; appointment timeline list; alerts panel; recharts for 7-day revenue.
- **Appointments:** three views (day agenda / week grid by dentist columns / month calendar) built on `ui/calendar` + custom grid; filters (dentist, service, status); create/edit in `ui/dialog`/`sheet` with the same form patterns as BookingForm (`inputCls`, pill selects); status advance buttons for waiting-room flow.
- **Waiting room:** kanban-ish columns (Expected → Arrived → Waiting → In treatment → Done) using status colors from existing palette only (primary/mint/deep/muted; destructive for no-show/cancelled).
- **Patients:** `ui/table` + `ui/command` search + pagination; profile page with tabs (Overview, Appointments, Invoices, Payments, Treatments, Documents, Notes).
- **Import:** 4-step wizard (Upload → Map columns → Validate/preview → Report) with progress for large files.
- **Billing:** invoice list → invoice detail (items table, payment history, "Record payment" dialog, "Generate receipt" PDF preview/print). Receipts: branded PDF (clinic logo/colors) — generated server-side.
- **Expenses:** table + category filter + monthly summary cards + export CSV.
- **Reports:** date-range picker, report selector, recharts charts, export.
- **Staff:** user list, invite, role assignment matrix.
- New components needed (all token-compliant): `StatCard`, `StatusPill`, `DataTable` wrapper, `CalendarGrid`, `KanbanBoard`, `WizardShell`, `PdfReceipt` template. Everything else reuses `ui/*`.

---

## PART 7 — SECURITY & PERMISSIONS (architecture)

- Supabase Auth (email+password; optional phone later) → `profiles.role`.
- RLS policies per table mirroring roles:
  - Receptionist: patients CRUD, appointments CRUD+status, payments create, invoices read, no delete on financials.
  - Dentist: own appointments, assigned patients, treatment records/plans write.
  - Accountant: invoices/payments/expenses/reports only.
  - Manager: ops read/write, no user admin.
  - Owner: all + user management.
- Server functions (`createServerFn`) re-verify role for every mutation — RLS is the second layer, not the only one.
- Audit log on: status transitions, payment void/refund, invoice void, user/role changes, imports, settings changes.
- Public booking endpoint: unauthenticated but rate-limited, validated (zod), creates `appointments` with `source='web'` + `status='booked'` (or `pending`→confirm via WhatsApp flow as today).
- No PHI in logs; receipts/invoices PDFs in private storage bucket with signed URLs.

---

## PART 8 — PHASED ROADMAP (Deliverable 6)

**Phase 0 — Audit & architecture** ✅ (this document). *Exit: approval.*

**Phase 1 — Foundation** (GATE 3)
- Provision Supabase project; env wiring; migrations for `profiles`, `clinic_settings`, `working_hours`, `services`, `dentists`, `rooms`, `patients`, `appointments`, `audit_log`.
- Auth: login page `/admin/login`, role guard, admin shell (sidebar/topbar), seed owner account.
- Seed services from `SERVICE_OPTIONS`; working hours from `availability.ts`.
- *Acceptance:* owner can log in, see empty dashboard shell; RLS verified; public site untouched.

**Phase 2 — Booking backend + appointment management**
- Public availability endpoint (slots computed from `appointments` + working hours); rewire `BookingForm` submit → server fn → `appointments` row; keep WhatsApp confirm + localStorage fallback message; admin calendar (day/week/month), create/edit/cancel, status lifecycle, conflict prevention.
- *Acceptance:* web booking appears in admin <5s; admin booking blocks web slot; double-booking rejected by DB.

**Phase 3 — Patients CRM + CSV import**
- Patient list/profile, duplicate detection, import wizard, patient_notes.
- *Acceptance:* import 1k-row CSV end-to-end with report; dedupe flags work.

**Phase 4 — Billing**
- `payment_methods`, `invoices`, `invoice_items`, `payments` (ledger), `receipts`; invoice create from appointment/plan; payments partial/multiple; PDF receipts; void/refund flows.
- *Acceptance:* financial invariants tested (balance = invoices − payments); receipt PDF branded + numbered.

**Phase 5 — Expenses + Reports**
- `expense_categories`, `expenses` + attachments (storage bucket); reports module; exports.

**Phase 6 — Treatment plans + clinical**
- `treatment_plans`, `treatment_plan_items`, `treatment_records`; dentist-scoped views.

**Phase 7 — Automation & polish**
- WhatsApp reminders (Business API or manual-assisted), realtime waiting-room updates, advanced analytics, Arabic admin pass, backups/DR verification.

Each phase ends with: tests (unit for money/slot math, RLS policy tests, E2E happy path), regression check on public site, and explicit authorization request for the next gate.

---

## PART 9 — RISK REGISTER (Deliverable 7)

| # | Risk | Mitigation |
|---|---|---|
| R-1 | No existing booking DB — "integration" is actually a rebuild; public form must be rewired | Phase 1–2 explicitly includes public-form migration behind a feature flag; keep WhatsApp fallback until DB path verified |
| R-2 | Public slot availability becomes real → site may show fewer slots than today (currently all "available") | Availability endpoint returns real data; cache ~60s; "no time? WhatsApp" escape hatch already exists |
| R-3 | Double-booking once multiple dentists exist | Postgres exclusion constraint on `tstzrange` per dentist — enforced in DB, not app code |
| R-4 | Patient duplicates (esp. CSV import + web bookings by phone) | Normalized phone column + dedupe index; import review queue; merge tool (admin-only, audited) |
| R-5 | Financial drift / balance inconsistency | Immutable payments ledger + reversal rows; balances via SQL view; nightly reconciliation check; numeric(12,2) |
| R-6 | Sensitive data exposure | RLS everywhere + server-fn role checks + private storage + no PHI in analytics/logs; penetration checklist at Gate 5 |
| R-7 | `vercel.json` catch-all rewrite breaks API routes | Test first server fn under new route in Phase 1; adjust rewrite to exclude `/api`/function paths if needed |
| R-8 | Lovable sync conflicts (AGENTS.md: no history rewrites) | All work on working branch, normal commits/pushes only; keep public site green at every commit |
| R-9 | Migration/data loss on prod | Supabase backups + point-in-time recovery; destructive changes only with explicit approval; staging schema first |
| R-10 | Vercel serverless limits (execution time, realtime) | CSV import chunked server-side; polling or Supabase realtime client-side; no long-running jobs in functions |
| R-11 | Timezone bugs (clinic is Africa/Cairo, server UTC) | All math in `timestamptz` + TZ-aware working-hours; date-fns-tz or Intl; dedicated tests around DST-free Cairo rules |
| R-12 | Scope creep toward full EMR | Treatment records kept minimal (notes + procedures); no imaging/lab modules without separate approval |

---

## Decisions (Gate 2 — approved 2026-11-17)

1. **Backend: Supabase** (Postgres + Auth + RLS + Storage). Project to be provisioned in Phase 1.
2. **Providers: single dentist** for now. Schema still includes `dentists`/`rooms` tables (cheap, future-proof) but UI treats provider as fixed.
3. **Slot model: uniform 45-min grid** matching the current public site. Per-service durations deferred.
4. **Phase 1 approved** — admin shell + auth + DB foundation; public booking flow untouched.
5. Currency: EGP (carried from analytics). Admin language: English-first.
6. Booking confirmation flow: keep WhatsApp-as-confirmation for now; revisit in Phase 7.

## Open questions remaining

- Whether a Lovable Cloud/Supabase project already exists for this app (check Lovable dashboard or provide new project keys).
- Supabase project URL + anon key + service-role key needed to finish Phase 1 env wiring (service key stays server-side only).

## Recommended first implementation task

**Phase 1, Task 1:** provision the backend (Supabase project + env), create initial migration (auth profile + clinic settings + working hours + services seed + patients + appointments), and stand up the `/admin` login + shell — with zero changes to the public booking flow. This unblocks everything else and is independently verifiable.

---

*STOP — awaiting Gate 2 approval before any implementation.*
