import Link from "next/link";
import type { ReactNode } from "react";
import { getSupportEmail } from "@/server/env";

interface LegalPageProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  const supportEmail = getSupportEmail();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Dejabooom
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700">
          Legal information
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {updated}</p>
        <div className="prose prose-slate mt-8 max-w-none space-y-5 leading-7 text-slate-700">
          {children}
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
          Questions or requests: {" "}
          <a className="font-medium text-cyan-700" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
        </div>
      </article>
    </main>
  );
}
