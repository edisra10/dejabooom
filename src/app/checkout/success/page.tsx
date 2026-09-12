import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/server/db/prisma";
import { getSupportEmail } from "@/server/env";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const order = sessionId
    ? await prisma.order.findUnique({
        where: { providerCheckoutSessionId: sessionId },
        include: {
          recommendation: true,
          tripProfile: true,
        },
      })
    : null;

  const isPaid = order?.status === "PAID";
  const isGenerated = order?.recommendation?.status === "GENERATED";
  const hasFailed =
    order?.status === "FAILED" || order?.recommendation?.status === "FAILED";
  const isCanceled = order?.status === "CANCELED";
  const supportEmail = getSupportEmail();
  const title = !sessionId || !order
    ? "We could not locate this checkout."
    : hasFailed
      ? isPaid
        ? "Your payment is confirmed. We need to finish your plan."
        : "This checkout could not be completed."
      : isCanceled
        ? "This checkout was canceled."
        : isPaid
          ? "Your planning order is confirmed."
          : "Checkout was received.";
  const currentStatus = !sessionId || !order
    ? "No order was found for this checkout link."
    : order.recommendation?.status === "FAILED"
      ? "Recommendation generation needs operator attention."
      : order.status === "FAILED"
        ? "Payment was not completed."
        : order.status === "CANCELED"
          ? "Checkout was canceled before payment."
          : isGenerated
            ? "Recommendation generated and sent."
            : isPaid
              ? "Payment verified. Recommendation is processing."
              : "Waiting for payment verification.";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white ${hasFailed || !order ? "bg-amber-700" : "bg-emerald-700"}`}>
          {hasFailed || !order ? (
            <AlertTriangle className="size-3.5" />
          ) : (
            <CheckCircle2 className="size-3.5" />
          )}
          Hosted checkout
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          {hasFailed || !order ? (
            <>
              Contact {" "}
              <a className="font-medium text-cyan-700" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
              {order ? ` with order reference ${order.id}.` : " for help with this checkout."}
            </>
          ) : (
            "Dejabooom starts recommendation generation after the payment webhook verifies hosted checkout. You will receive a private reveal link by email once it is ready."
          )}
        </p>

        <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 font-semibold">
              <Clock3 className="size-4 text-cyan-700" />
              Current status
            </div>
            <p className="mt-2 text-slate-600">
              {currentStatus}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 font-semibold">
              <Mail className="size-4 text-cyan-700" />
              Email delivery
            </div>
            <p className="mt-2 text-slate-600">
              {isGenerated
                ? "The private reveal link was sent to the contact email."
                : "Reveal links are sent to the contact email from the trip profile."}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/">Back to Dejabooom</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
