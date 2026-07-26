"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Map,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElegantShape } from "./elegant-shape";
import { ImagesSlider } from "./images-slider";

const heroImages = [
  "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1400&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop",
];

const profileSignals = [
  {
    icon: CalendarDays,
    title: "Dates and budget",
    description: "Approximate timing, flexibility, duration, currency, and budget.",
  },
  {
    icon: SlidersHorizontal,
    title: "Travel style",
    description: "Pace, interests, climate, food, nature, beach, culture, and adventure.",
  },
  {
    icon: ShieldCheck,
    title: "Constraints",
    description: "Visited places, exclusions, visa limits, accessibility, and dietary needs.",
  },
];

const processSteps = [
  {
    title: "Create your profile",
    description: "Answer a focused questionnaire about how you actually like to travel.",
  },
  {
    title: "Get matched",
    description:
      "After hosted checkout, deterministic scoring selects from a curated catalog.",
  },
  {
    title: "Enjoy the reveal",
    description:
      "Receive your private AI-personalized recommendation and surprise reveal link.",
  },
];

export default function AiTripLanding() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <ImagesSlider
        className="min-h-[86svh]"
        images={heroImages}
        overlayClassName="bg-slate-950/65"
      >
        <div className="absolute inset-0 z-40 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={520}
            height={110}
            rotate={12}
            gradient="from-cyan-300/[0.18]"
            className="left-[-10%] top-[14%]"
          />
          <ElegantShape
            delay={0.5}
            width={420}
            height={95}
            rotate={-16}
            gradient="from-amber-200/[0.18]"
            className="right-[-6%] top-[28%]"
          />
          <ElegantShape
            delay={0.7}
            width={320}
            height={85}
            rotate={-6}
            gradient="from-emerald-300/[0.14]"
            className="bottom-[12%] left-[8%]"
          />
        </div>

        <header className="absolute left-0 right-0 top-0 z-50 px-4 py-5 sm:px-6 lg:px-8">
          <nav className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-wide text-white">
              Dejabooom
            </Link>
            <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950">
              <Link href="/surprise-trip">Create Profile</Link>
            </Button>
          </nav>
        </header>

        <section className="relative z-50 mx-auto flex min-h-[86svh] w-full max-w-6xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
              <Sparkles className="size-3.5" />
              Surprise trip planning
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              Your preferences. Your budget. One unforgettable surprise.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Tell us how you like to travel and Dejabooom will design an
              AI-personalized surprise trip around your dates, interests,
              restrictions and budget.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-white/90">
                <Link href="/surprise-trip">
                  Create My Trip Profile
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
              >
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </section>
      </ImagesSlider>

      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700">
              Planning first
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              A planning service, not a booking platform.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Dejabooom helps shape where you should go and what the trip could
              feel like. You pay for matching, personalization, itinerary
              direction, and the reveal; flights, stays, and activities are
              booked directly with external providers.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-md border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
              <Compass className="size-4" />
              Profile signals
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              The first version focuses on matching quality.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              The questionnaire gathers the practical details and taste signals
              needed to score curated destinations and personalize the private
              reveal after payment is verified.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {profileSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <article
                  key={signal.title}
                  className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <Icon className="size-5 text-cyan-700" />
                  <h3 className="mt-4 font-semibold">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {signal.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-md bg-slate-950 p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">
              <Map className="size-4" />
              Start with the profile
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Build the inputs for your surprise match.
            </h2>
          </div>
          <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-white/90">
            <Link href="/surprise-trip">
              Create My Trip Profile
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Dejabooom provides planning guidance, not travel reservations.</p>
          <nav className="flex flex-wrap gap-4">
            <Link href="/legal/terms" className="hover:text-slate-950">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-slate-950">
              Privacy
            </Link>
            <Link href="/legal/refunds" className="hover:text-slate-950">
              Refunds
            </Link>
            <Link
              href="/legal/ai-travel-disclaimer"
              className="hover:text-slate-950"
            >
              AI disclaimer
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

