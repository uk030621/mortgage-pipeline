"use client";

import { Loan } from "@/lib/types";
import { deadlineUrgency, formatCurrency } from "@/lib/format";

export default function DashboardSummary({ loans }: { loans: Loan[] }) {
  const activeLoans = loans.filter((l) => l.stage !== "funded");
  const totalVolume = activeLoans.reduce((sum, l) => sum + (l.loanAmount ?? 0), 0);
  const urgentCount = loans.filter((l) => {
    const u = Math.max(
      rank(deadlineUrgency(l.closingDate)),
      rank(deadlineUrgency(l.rateLockExpiration))
    );
    return u >= 3;
  }).length;
  const expectedCommission = activeLoans.reduce(
    (sum, l) => sum + (l.commissionExpected ?? 0),
    0
  );

  const stats = [
    { label: "Active mortgages", value: activeLoans.length.toString() },
    { label: "Pipeline volume", value: formatCurrency(totalVolume) },
    { label: "Needs attention", value: urgentCount.toString(), alert: urgentCount > 0 },
    { label: "Expected commission", value: formatCurrency(expectedCommission) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-paper px-4 py-3">
          <p className="text-xs text-slate">{stat.label}</p>
          <p
            className={`font-display text-2xl mt-1 ${
              stat.alert ? "text-rust" : "text-ink"
            }`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function rank(u: string) {
  return { none: 0, ok: 1, soon: 2, urgent: 3, past: 4 }[u] ?? 0;
}
