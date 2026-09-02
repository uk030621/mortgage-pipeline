"use client";

import { Loan } from "@/lib/types";
import { PIPELINE_STAGES, STAGE_LABELS, PipelineStage } from "@/lib/stages";
import LoanCard from "./LoanCard";
import { formatCurrency } from "@/lib/format";

export default function PipelineBoard({ loans }: { loans: Loan[] }) {
  const byStage = groupByStage(loans);

  return (
    <div className="flex flex-col md:flex-row md:gap-4 md:overflow-x-auto md:pb-4 scrollbar-thin">
      {PIPELINE_STAGES.map((stage) => {
        const stageLoans = byStage[stage] ?? [];
        const stageVolume = stageLoans.reduce((sum, l) => sum + (l.loanAmount ?? 0), 0);
        return (
          <section
            key={stage}
            className="md:w-72 md:shrink-0 mb-6 md:mb-0"
          >
            <header className="flex items-baseline justify-between border-b border-ink pb-2 mb-3">
              <h2 className="font-display text-base text-ink">
                {STAGE_LABELS[stage as PipelineStage]}
              </h2>
              <span className="text-xs text-slate">
                {stageLoans.length} · {formatCurrency(stageVolume)}
              </span>
            </header>

            {stageLoans.length === 0 ? (
              <p className="text-xs text-slate italic py-3">No mortgages in this stage.</p>
            ) : (
              <div className="space-y-2 md:max-h-[calc(100vh-13rem)] md:overflow-y-auto md:pr-1 scrollbar-thin">
                {stageLoans.map((loan) => (
                  <LoanCard key={loan._id} loan={loan} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function groupByStage(loans: Loan[]) {
  const map: Record<string, Loan[]> = {};
  for (const loan of loans) {
    if (!map[loan.stage]) map[loan.stage] = [];
    map[loan.stage].push(loan);
  }
  return map;
}
