import Link from "next/link";
import { AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { getPublicAppUrl } from "@/server/env";
import { decryptRevealToken } from "@/server/security/reveal-token";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 19).replace("T", " ") : "Not set";
}

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

function stringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function safeRevealUrl(encryptedToken: string | null) {
  try {
    const token = decryptRevealToken(encryptedToken);
    return token ? `${getPublicAppUrl()}/reveal/${token}` : null;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const [profiles, orders, recommendations] = await Promise.all([
    prisma.tripProfile.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        travelerGroup: true,
        destinationScores: {
          take: 3,
          orderBy: { totalScore: "desc" },
          include: { destination: true },
        },
      },
    }),
    prisma.order.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        tripProfile: true,
        recommendation: {
          include: {
            selectedDestination: true,
          },
        },
      },
    }),
    prisma.recommendation.findMany({
      take: 20,
      orderBy: { updatedAt: "desc" },
      include: {
        generatedItinerary: true,
        order: true,
        revealTokens: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        selectedDestination: true,
        tripProfile: true,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              <ShieldCheck className="size-3.5" />
              Operator admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Dejabooom operations
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              Review customer profiles, hosted checkout status, destination
              candidates, generation output, and private reveal availability.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium shadow-xs transition hover:bg-slate-100"
          >
            View site
          </Link>
        </div>

        <section className="mt-8 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Recent trip profiles</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Profile</th>
                  <th className="px-3 py-2">Travelers</th>
                  <th className="px-3 py-2">Budget</th>
                  <th className="px-3 py-2">Top candidates</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id} className="border-t border-slate-100">
                    <td className="px-3 py-3">{formatDate(profile.createdAt)}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{profile.contactEmail}</div>
                      <div className="text-slate-500">
                        {profile.departureCity} ({profile.departureAirport})
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {profile.travelerGroup.travelerCount} total
                    </td>
                    <td className="px-3 py-3">
                      {formatMoney(profile.totalBudget * 100, profile.preferredCurrency)}
                    </td>
                    <td className="px-3 py-3">
                      {profile.destinationScores.length > 0
                        ? profile.destinationScores
                            .map(
                              (score) =>
                                `${score.destination.city} (${score.totalScore.toFixed(1)})`,
                            )
                            .join(", ")
                        : "No scores yet"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Orders and payment status</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Service</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100">
                    <td className="px-3 py-3">{formatDate(order.createdAt)}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{order.id}</div>
                      <div className="text-slate-500">{order.tripProfile.contactEmail}</div>
                    </td>
                    <td className="px-3 py-3">{order.status}</td>
                    <td className="px-3 py-3">{order.serviceTier}</td>
                    <td className="px-3 py-3">
                      {formatMoney(order.amountCents, order.currency)}
                    </td>
                    <td className="px-3 py-3">
                      {order.recommendation?.selectedDestination
                        ? `${order.recommendation.selectedDestination.city}, ${order.recommendation.selectedDestination.country}`
                        : order.recommendation?.status ?? "Not generated"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {recommendations.map((recommendation) => {
            const revealToken = recommendation.revealTokens[0];
            const revealUrl = revealToken
              ? safeRevealUrl(revealToken.encryptedToken)
              : null;

            return (
              <article
                key={recommendation.id}
                className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {recommendation.selectedDestination
                        ? `${recommendation.selectedDestination.city}, ${recommendation.selectedDestination.country}`
                        : "Pending destination"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {recommendation.tripProfile.contactEmail} ·{" "}
                      {recommendation.status}
                    </p>
                  </div>
                  {recommendation.generationError ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                      <AlertTriangle className="size-3.5" />
                      Error
                    </span>
                  ) : null}
                </div>

                {recommendation.generatedItinerary ? (
                  <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-950">Theme:</span>{" "}
                      {recommendation.generatedItinerary.tripTheme}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">Summary:</span>{" "}
                      {recommendation.generatedItinerary.travelerProfileSummary}
                    </p>
                  </div>
                ) : null}

                {recommendation.generationError ? (
                  <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-red-50 p-3 text-xs text-red-900">
                    {recommendation.generationError}
                  </pre>
                ) : null}

                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Score breakdown</h3>
                  <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-50">
                    {stringify(recommendation.scoringBreakdown)}
                  </pre>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Hard filters</h3>
                  <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-50">
                    {stringify(recommendation.hardFilterReasons)}
                  </pre>
                </div>

                <div className="mt-4 text-sm">
                  {revealUrl ? (
                    <a
                      href={revealUrl}
                      className="inline-flex items-center gap-2 font-medium text-cyan-700 hover:text-cyan-900"
                    >
                      Reveal link
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : revealToken ? (
                    <span className="text-slate-500">
                      Reveal token stored securely. Last four:{" "}
                      {revealToken.tokenLastFour}
                    </span>
                  ) : (
                    <span className="text-slate-500">No reveal token yet.</span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
