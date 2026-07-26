import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/server/db/prisma";
import {
  formatServicePrice,
  getServiceProducts,
} from "@/server/checkout/service-products";

export const dynamic = "force-dynamic";

export default async function CheckoutSelectionPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  const tripProfile = await prisma.tripProfile.findUnique({
    where: { id: profileId },
    include: { travelerGroup: true },
  });

  if (!tripProfile) {
    notFound();
  }

  const products = getServiceProducts();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Dejabooom
        </Link>
        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700">
            Planning service
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Choose how Dejabooom creates your surprise.
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Your trip profile was saved. Pick a planning service and complete
            payment through hosted checkout. Flights, hotels, and activities are
            still booked directly with external providers.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {products.map((product) => {
            const canCheckout = Boolean(product.amountCents);

            return (
              <article
                key={product.tier}
                className="rounded-md border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.description}
                </p>
                <p className="mt-5 text-3xl font-semibold">
                  {formatServicePrice(product)}
                </p>
                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-emerald-700" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <form action="/api/checkout/sessions" method="post" className="mt-6">
                  <input type="hidden" name="profileId" value={tripProfile.id} />
                  <input type="hidden" name="serviceTier" value={product.tier} />
                  <Button
                    type="submit"
                    className="w-full bg-slate-950 text-white"
                    disabled={!canCheckout}
                  >
                    {canCheckout ? "Continue to Hosted Checkout" : "Price Not Configured"}
                  </Button>
                </form>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

