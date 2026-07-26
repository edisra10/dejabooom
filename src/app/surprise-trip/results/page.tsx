import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SurpriseTripResultsPlaceholderPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
          <Sparkles className="size-3.5" />
          Surprise match
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Surprise results are now delivered privately.
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Complete the questionnaire, choose a planning service, and finish
          hosted checkout. Dejabooom generates the recommendation only after the
          payment webhook verifies the order, then sends a private reveal link.
        </p>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/surprise-trip">
              <ArrowLeft className="size-4" />
              Back to Trip Profile
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

