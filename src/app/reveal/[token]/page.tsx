import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Compass,
  Info,
  Luggage,
  MapPin,
  Sparkles,
  Utensils,
} from "lucide-react";
import { trackServerEvent } from "@/server/analytics/events";
import { prisma } from "@/server/db/prisma";
import { getSupportEmail } from "@/server/env";
import {
  generatedItineraryDaySchema,
  type GeneratedItineraryContent,
} from "@/server/recommendations/generated-itinerary-schema";
import { hashRevealToken } from "@/server/security/reveal-token";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private Reveal | Dejabooom",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

function decodeToken(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function formatList(values: string[]) {
  if (values.length === 0) {
    return "No specific notes provided.";
  }

  return values.join(", ");
}

function parseItinerary(
  value: unknown,
): GeneratedItineraryContent["itinerary"] {
  const parsed = generatedItineraryDaySchema.array().safeParse(value);
  return parsed.success ? parsed.data : [];
}

function PrivateRevealUnavailable() {
  const supportEmail = getSupportEmail();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
          <Info className="size-3.5" />
          Private reveal
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">
          This reveal link is not available.
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          The link may be invalid, expired, or not ready yet. Contact {" "}
          <a className="font-medium text-cyan-700" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          {" "}with your order reference if you believe this is an error.
        </p>
        <ButtonLink />
      </div>
    </main>
  );
}

function ButtonLink() {
  return (
    <Link
      href="/"
      className="mt-8 inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium shadow-xs transition hover:bg-slate-100"
    >
      Back to Dejabooom
    </Link>
  );
}

export default async function RevealPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token: tokenParam } = await params;
  const token = decodeToken(tokenParam);

  if (token.length < 32) {
    return <PrivateRevealUnavailable />;
  }

  const revealToken = await prisma.revealToken.findUnique({
    where: { tokenHash: hashRevealToken(token) },
    include: {
      recommendation: {
        include: {
          generatedItinerary: true,
          order: true,
          selectedDestination: true,
          tripProfile: {
            include: {
              travelerGroup: true,
            },
          },
        },
      },
    },
  });

  const recommendation = revealToken?.recommendation;
  const generatedItinerary = recommendation?.generatedItinerary;
  const selectedDestination = recommendation?.selectedDestination;

  if (
    !revealToken ||
    !recommendation ||
    !generatedItinerary ||
    !selectedDestination ||
    (revealToken.expiresAt && revealToken.expiresAt < new Date()) ||
    recommendation.status !== "GENERATED"
  ) {
    return <PrivateRevealUnavailable />;
  }

  if (!revealToken.usedAt) {
    await prisma.revealToken.update({
      where: { id: revealToken.id },
      data: { usedAt: new Date() },
    });
  }

  const { tripProfile } = recommendation;
  const itinerary = parseItinerary(generatedItinerary.itinerary);

  trackServerEvent("reveal_viewed", {
    recommendationId: recommendation.id,
    tripProfileId: tripProfile.id,
    destinationId: selectedDestination.id,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Dejabooom
        </Link>

        <section className="mt-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
            <Sparkles className="size-3.5" />
            Private surprise reveal
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            {selectedDestination.city}, {selectedDestination.country}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {generatedItinerary.revealNarrative}
          </p>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700">
              <Compass className="size-4" />
              Why it matches
            </div>
            <h2 className="mt-3 text-2xl font-semibold">
              {generatedItinerary.tripTheme}
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              {generatedItinerary.matchExplanation}
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              {generatedItinerary.travelerProfileSummary}
            </p>
          </article>

          <aside className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700">
              <MapPin className="size-4" />
              Planning notes
            </div>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold">Approximate budget guidance</dt>
                <dd className="mt-1 text-slate-600">
                  {generatedItinerary.budgetGuidance}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Booking search</dt>
                <dd className="mt-1 text-slate-600">
                  Use your preferred external flight, hotel, and activity
                  providers. Search for: {selectedDestination.externalBookingSearchLabel}.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Destination data</dt>
                <dd className="mt-1 text-slate-600">
                  {selectedDestination.approximateDataNote}
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700">
            <CalendarDays className="size-4" />
            Itinerary
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {itinerary.map((day) => (
              <article
                key={day.day}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="font-semibold">
                  Day {day.day}: {day.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-slate-900">Morning:</span>{" "}
                  {day.morning}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-slate-900">Afternoon:</span>{" "}
                  {day.afternoon}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-slate-900">Evening:</span>{" "}
                  {day.evening}
                </p>
                <p className="mt-3 rounded-md bg-white p-3 text-sm text-slate-700">
                  Clue: {day.surpriseClue}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Utensils className="size-4 text-cyan-700" />
              Food and activities
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {formatList(generatedItinerary.restaurantAndActivityCategories)}
            </p>
          </article>
          <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Luggage className="size-4 text-cyan-700" />
              Packing suggestions
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {formatList(generatedItinerary.packingSuggestions)}
            </p>
          </article>
          <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="size-4 text-cyan-700" />
              Important notes
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {formatList(generatedItinerary.importantNotes)}
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Dejabooom provides travel-planning and personalization services only.
          Prices, availability, passports, visas, entry requirements, weather,
          safety conditions, and accessibility details must be verified directly
          with third-party providers and official sources before booking.
        </section>
      </div>
    </main>
  );
}
