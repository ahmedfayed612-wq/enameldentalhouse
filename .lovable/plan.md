# Enamel Dental House — Consolidated Update

Keep current light-blue (Deep Sea + Mint) branding. Mobile-first throughout (test 360–430px first).

## 1. Central availability config (editable)

New file `src/lib/availability.ts` — single source of truth, easy to edit:

```ts
export const CLINIC = {
  closedWeekdays: [5],          // 5 = Friday (JS getDay)
  openHour: 12,                  // 12:00 PM
  closeHour: 22,                 // 10:00 PM
  slotMinutes: 45,
  bookedSlots: {} as Record<string, string[]>, // "YYYY-MM-DD": ["13:30", ...]
};

export function isOpenDay(d: Date) { ... }
export function generateSlots() { ... }   // ["12:00","12:45",...]
export function isSlotBooked(date, time) { ... }
```

Comment block at top: "Edit hours, slot length, and manually-blocked slots here."

## 2. Section reorder (in `src/routes/index.tsx`)

1. Nav
2. Hero (+ Google badge + Arabic live availability widget)
3. Gallery (trimmed to 2 before/after cases)
4. BookingForm (two-step calendar/time picker)
5. VideoTestimonials (new, swipeable)
6. WhyEnamel
7. Services (+ full pricing)
8. FAQ
9. Location (map)
10. Doctor (real info placeholder marker)
11. Reviews (live Google widget marker)
12. Footer
13. StickyMobileBar (always visible)

## 3. Hero changes (`Hero.tsx`)

- Add Google rating badge component: white pill with colored "G" SVG + "4.9" + 5 stars + "بناءً على تقييمات Google".
- Replace English "HeroCard" with Arabic `LiveAvailabilityCard`:
  - Title: "المواعيد المتاحة اليوم"
  - Slot rows show Arabic time + "متاح" / "متبقي مكان واحد"
  - CTA button: "احجز الموعد"
  - Hides Fridays (shows "العيادة مغلقة اليوم — نراكم غدًا").

## 4. Booking — two-step tap selection (`BookingForm.tsx`)

Replace date `<input type=date>` + time `<select>` with:

- **Step 1 — Calendar grid**: month view, Fridays disabled (greyed), past dates disabled, large 44px+ tap targets, selected date highlighted in primary.
- **Step 2 — Time slot buttons** (revealed after date pick): generated from `generateSlots()`, booked ones disabled with strikethrough, selected one shows checkmark + primary fill.
- Below picker: small link `مش لاقي وقت يناسبك؟ تواصل معنا على واتساب` → wa.me link.
- Keep reassurance line `مش هتتحاسب غير لما تيجي العيادة` and scarcity banner `متاح ٣ مواعيد فقط هذا الأسبوع` at top of form card.
- On submit success: open WhatsApp with prefilled confirmation message
  `wa.me/<clinic>?text=تأكيد حجزك يوم {date} الساعة {time}. سنرسل تذكير قبل الموعد بيوم.`
  (auto-confirmation note in success screen; actual automated send requires Cloud + WhatsApp Business API — flagged in code comment for Phase 2).

## 5. Gallery trim (`Gallery.tsx`)

Keep only first 2 before/after cases. Heading + 2 cards in a responsive 1-col mobile / 2-col desktop grid.

## 6. New `VideoTestimonials.tsx`

- Horizontal swipe carousel using `embla-carousel-react` (already present via `ui/carousel`).
- 9:16 vertical cards, ~280px wide on mobile.
- Each card: `<video poster>` placeholder with play icon, name + Arabic caption below.
- 4 placeholder slots clearly commented `{/* TODO: replace src with patient video */}`.
- Snap scrolling, free drag on touch.

## 7. Cleanup

- `Doctor.tsx`: clear placeholder marker `{/* TODO: real doctor name + photo */}` with realistic Arabic name `د. أحمد عبد الرحمن` placeholder.
- `Reviews.tsx`: add comment `{/* TODO: connect Google Places API in Phase 2 */}`, keep curated reviews but label section heading honestly.
- Sweep all components for English UI fragments — translate to Arabic (keep `dir` flip working).
- StickyMobileBar: ensure shows on all sections (remove any hero-only condition).

## Technical notes

- New translation keys in `src/lib/translations.ts` (ar + en) for: liveAvailToday, slotAvailable, slotOneLeft, clinicClosedToday, googleRating, pickDate, pickTime, slotBooked, noTimeWhatsapp, videoTestimonialsTitle, confirmedVia WhatsApp, etc.
- `analytics.ts` unchanged; still call `trackLead` on submit.
- All tap targets ≥44px. Calendar cells `h-11 w-11`. Time slot buttons `min-h-12`.
- No new dependencies needed (embla already present).
- No backend yet — bookings persist to localStorage, WhatsApp link opens compose window for real confirmation.

## Out of scope (Phase 2)

- Real-time booked-slot sync (needs Cloud DB)
- Automated WhatsApp sending (needs Business API + Cloud function)
- Live Google Reviews API
