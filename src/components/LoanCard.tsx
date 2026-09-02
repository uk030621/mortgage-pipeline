"use client";

import Link from "next/link";
import { Loan } from "@/lib/types";
import { deadlineUrgency, formatCurrency, formatDate, urgencyStyles } from "@/lib/format";

export default function LoanCard({ loan }: { loan: Loan }) {
  const closingUrgency = deadlineUrgency(loan.closingDate);
  const lockUrgency = deadlineUrgency(loan.rateLockExpiration);
  const worstUrgency = rank(closingUrgency) >= rank(lockUrgency) ? closingUrgency : lockUrgency;

  return (
    <Link
      href={`/loans/${loan._id}`}
      className={`block bg-white border border-rule px-3 py-3 hover:border-ink transition-colors ${urgencyStyles[worstUrgency]}`}
    >
      <p className="font-medium text-sm text-ink truncate">{loan.borrowerName}</p>
      {loan.propertyAddress && (
        <p className="text-xs text-slate truncate mt-0.5">{loan.propertyAddress}</p>
      )}
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="text-ink">{formatCurrency(loan.loanAmount)}</span>
        {loan.lender && <span className="text-slate truncate ml-2">{loan.lender}</span>}
      </div>
      {(loan.closingDate || loan.rateLockExpiration) && (
        <div className="mt-2 pt-2 border-t border-rule/70 space-y-0.5">
          {loan.rateLockExpiration && (
            <p className="text-xs text-slate">
              Offer exp. <span className="text-ink">{formatDate(loan.rateLockExpiration)}</span>
            </p>
          )}
          {loan.closingDate && (
            <p className="text-xs text-slate">
              Completion <span className="text-ink">{formatDate(loan.closingDate)}</span>
            </p>
          )}
        </div>
      )}
    </Link>
  );
}

function rank(u: string) {
  return { none: 0, ok: 1, soon: 2, urgent: 3, past: 4 }[u] ?? 0;
}
