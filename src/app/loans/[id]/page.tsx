"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import DocumentChecklist from "@/components/DocumentChecklist";
import DocumentsFolderPrompt from "@/components/DocumentsFolderPrompt";
import { Loan, DocumentItem } from "@/lib/types";
import { PIPELINE_STAGES, STAGE_LABELS } from "@/lib/stages";
import { formatCurrency, formatDate, deadlineUrgency, urgencyStyles } from "@/lib/format";

// Next.js 15+: params is a Promise in both server and client components.
// In a client component it's unwrapped with React's `use()` hook (below),
// not `await` — `await` is only valid in async server components.
export default function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/loans/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Loan not found");
        return res.json();
      })
      .then(setLoan)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function patch(updates: Partial<Loan>) {
    if (!loan) return;
    const res = await fetch(`/api/loans/${loan._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) setLoan(await res.json());
  }

  async function handleDelete() {
    if (!loan) return;
    if (!confirm(`Delete the mortgage for ${loan.borrowerName}? This can't be undone.`)) return;
    const res = await fetch(`/api/loans/${loan._id}`, { method: "DELETE" });
    if (res.ok) router.push("/");
  }

  return (
    <div className="md:flex md:min-h-dvh">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8 max-w-3xl">
        {loading && <p className="text-sm text-slate">Loading…</p>}
        {error && <p className="text-sm text-rust">{error}</p>}

        {loan && (
          <>
            <div className="flex items-start justify-between mb-1">
              <h1 className="font-display text-2xl text-ink">{loan.borrowerName}</h1>
              <div className="flex gap-3 shrink-0 ml-4">
                <Link
                  href={`/loans/${loan._id}/edit`}
                  className="text-xs text-slate hover:text-ink underline underline-offset-2"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-xs text-rust hover:text-rust/70 underline underline-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
            {loan.propertyAddress && (
              <p className="text-sm text-slate mb-6">{loan.propertyAddress}</p>
            )}

            <StageStepper stage={loan.stage} onChange={(stage) => patch({ stage })} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule border border-rule my-6">
              <Stat label="Mortgage amount" value={formatCurrency(loan.loanAmount)} />
              <Stat label="Rate" value={loan.interestRate ? `${loan.interestRate}%` : "—"} />
              <Stat label="Lender" value={loan.lender || "—"} />
              <Stat label="Type" value={loan.loanType || "—"} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <DeadlineCard
                label="Offer expiry"
                date={loan.rateLockExpiration}
              />
              <DeadlineCard label="Completion date" date={loan.closingDate} />
            </div>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-base text-ink">Documents</h2>
                {loan.documentsFolderUrl ? (
                  <a
                    href={loan.documentsFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-forest hover:text-forest/70 underline underline-offset-2"
                  >
                    Open documents folder ↗
                  </a>
                ) : (
                  <Link
                    href={`/loans/${loan._id}/edit`}
                    className="text-xs text-slate hover:text-ink underline underline-offset-2"
                  >
                    Add a documents folder link
                  </Link>
                )}
              </div>
              {!loan.documentsFolderUrl && (
                <DocumentsFolderPrompt borrowerName={loan.borrowerName} />
              )}
              <DocumentChecklist
                documents={loan.documents}
                onChange={(documents: DocumentItem[]) => patch({ documents })}
              />
            </section>

            <section className="mb-8">
              <h2 className="font-display text-base text-ink mb-3">Commission</h2>
              <div className="border border-rule px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink">
                    {formatCurrency(loan.commissionExpected)} expected
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate">
                  <input
                    type="checkbox"
                    checked={!!loan.commissionPaid}
                    onChange={(e) => patch({ commissionPaid: e.target.checked })}
                  />
                  Paid
                </label>
              </div>
            </section>

            {loan.notes && (
              <section>
                <h2 className="font-display text-base text-ink mb-2">Notes</h2>
                <p className="text-sm text-ink whitespace-pre-wrap">{loan.notes}</p>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StageStepper({
  stage,
  onChange,
}: {
  stage: string;
  onChange: (stage: (typeof PIPELINE_STAGES)[number]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PIPELINE_STAGES.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`text-xs px-2.5 py-1.5 border ${
            s === stage
              ? "bg-ink text-paper border-ink"
              : "border-rule text-slate hover:border-ink hover:text-ink"
          }`}
        >
          {STAGE_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper px-3 py-2.5">
      <p className="text-xs text-slate">{label}</p>
      <p className="text-sm text-ink mt-0.5 truncate">{value}</p>
    </div>
  );
}

function DeadlineCard({ label, date }: { label: string; date?: string }) {
  const urgency = deadlineUrgency(date);
  return (
    <div className={`border border-rule px-4 py-3 ${urgencyStyles[urgency]}`}>
      <p className="text-xs text-slate">{label}</p>
      <p className="font-display text-lg text-ink mt-0.5">{formatDate(date)}</p>
      {urgency === "urgent" && <p className="text-xs text-rust mt-1">Due soon</p>}
      {urgency === "past" && <p className="text-xs text-rust mt-1">Past due</p>}
    </div>
  );
}
