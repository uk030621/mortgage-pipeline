"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import PipelineBoard from "@/components/PipelineBoard";
import DashboardSummary from "@/components/DashboardSummary";
import { useLoans } from "@/lib/useLoans";

export default function HomePage() {
  const { loans, loading, error } = useLoans();

  return (
    <div className="md:flex md:min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8 max-w-[1400px]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-2xl text-ink">Pipeline</h1>
            <p className="text-sm text-slate mt-1">
              Every mortgage, sorted by where it stands.
            </p>
          </div>
          <Link
            href="/loans/new"
            className="hidden md:inline-block border border-ink px-4 py-2 text-sm text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            New mortgage
          </Link>
        </div>

        {loading && <p className="text-sm text-slate">Loading pipeline…</p>}
        {error && <p className="text-sm text-rust">{error}</p>}

        {!loading && !error && (
          <>
            <DashboardSummary loans={loans} />
            {loans.length === 0 ? (
              <EmptyState />
            ) : (
              <PipelineBoard loans={loans} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-rule px-6 py-16 text-center">
      <p className="font-display text-lg text-ink mb-2">No mortgages yet</p>
      <p className="text-sm text-slate mb-5">
        Add your first mortgage to start tracking it through the pipeline.
      </p>
      <Link
        href="/loans/new"
        className="inline-block border border-ink px-4 py-2 text-sm text-ink hover:bg-ink hover:text-paper transition-colors"
      >
        Add a mortgage
      </Link>
    </div>
  );
}
