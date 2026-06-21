import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { BookingProvider } from "@/lib/booking-store";
import { trackPageView } from "@/lib/analytics";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { WhyEnamel } from "@/components/landing/WhyEnamel";
import { Services } from "@/components/landing/Services";
import { Gallery } from "@/components/landing/Gallery";
import { Doctor } from "@/components/landing/Doctor";
import { Reviews } from "@/components/landing/Reviews";
import { BookingForm } from "@/components/landing/BookingForm";
import { FAQ } from "@/components/landing/FAQ";
import { Location } from "@/components/landing/Location";
import { Footer } from "@/components/landing/Footer";
import { StickyMobileBar } from "@/components/landing/StickyMobileBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Enamel Dental House — Obour City Dentist · Book Online" },
      {
        name: "description",
        content:
          "Premium family dentistry in Obour City. Transparent pricing, same-week appointments and a pain-free experience. Book your free consultation today.",
      },
      { property: "og:title", content: "Enamel Dental House — Obour City" },
      {
        property: "og:description",
        content: "Book your dental appointment in Obour City. Same-week slots, transparent pricing.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <I18nProvider>
      <BookingProvider>
        <Page />
      </BookingProvider>
    </I18nProvider>
  );
}

function Page() {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Nav />
      <main>
        <Hero />
        <WhyEnamel />
        <Services />
        <Gallery />
        <Doctor />
        <Reviews />
        <BookingForm />
        <FAQ />
        <Location />
      </main>
      <Footer />
      <StickyMobileBar />
    </div>
  );
}
