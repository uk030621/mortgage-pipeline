"use client";

import { use, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import LoanForm from "@/components/LoanForm";
import { Loan } from "@/lib/types";

// Next.js 15+: params is a Promise; unwrap with React's `use()` in a
// client component (server components would `await` it instead).
export default function EditLoanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/loans/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Loan not found");
        return res.json();
      })
      .then(setLoan)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div className="md:flex md:min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8">
        <h1 className="font-display text-2xl text-ink mb-8">Edit mortgage</h1>
        {error && <p className="text-sm text-rust">{error}</p>}
        {loan && <LoanForm initial={loan} loanId={loan._id} />}
      </main>
    </div>
  );
}
