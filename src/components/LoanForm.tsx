"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loan } from "@/lib/types";
import { PIPELINE_STAGES, STAGE_LABELS } from "@/lib/stages";

interface Props {
  initial?: Partial<Loan>;
  loanId?: string;
}

export default function LoanForm({ initial, loanId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    borrowerName: initial?.borrowerName ?? "",
    borrowerEmail: initial?.borrowerEmail ?? "",
    borrowerPhone: initial?.borrowerPhone ?? "",
    propertyAddress: initial?.propertyAddress ?? "",
    loanAmount: initial?.loanAmount?.toString() ?? "",
    lender: initial?.lender ?? "",
    loanType: initial?.loanType ?? "Fixed rate",
    interestRate: initial?.interestRate?.toString() ?? "",
    stage: initial?.stage ?? "lead",
    rateLockExpiration: initial?.rateLockExpiration?.slice(0, 10) ?? "",
    closingDate: initial?.closingDate?.slice(0, 10) ?? "",
    commissionExpected: initial?.commissionExpected?.toString() ?? "",
    documentsFolderUrl: initial?.documentsFolderUrl ?? "",
    notes: initial?.notes ?? "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      loanAmount: form.loanAmount ? Number(form.loanAmount) : undefined,
      interestRate: form.interestRate ? Number(form.interestRate) : undefined,
      commissionExpected: form.commissionExpected
        ? Number(form.commissionExpected)
        : undefined,
      rateLockExpiration: form.rateLockExpiration || undefined,
      closingDate: form.closingDate || undefined,
    };

    try {
      const res = await fetch(loanId ? `/api/loans/${loanId}` : "/api/loans", {
        method: loanId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save loan");
      const saved = await res.json();
      router.push(`/loans/${saved._id}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {error && <p className="text-sm text-rust">{error}</p>}

      <Section title="Borrower">
        <Field label="Full name" required>
          <input
            required
            value={form.borrowerName}
            onChange={(e) => update("borrowerName", e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input
              type="email"
              value={form.borrowerEmail}
              onChange={(e) => update("borrowerEmail", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.borrowerPhone}
              onChange={(e) => update("borrowerPhone", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Mortgage">
        <Field label="Property address">
          <input
            value={form.propertyAddress}
            onChange={(e) => update("propertyAddress", e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Mortgage amount (£)">
            <input
              type="number"
              value={form.loanAmount}
              onChange={(e) => update("loanAmount", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Interest rate (%)">
            <input
              type="number"
              step="0.01"
              value={form.interestRate}
              onChange={(e) => update("interestRate", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Mortgage type">
            <select
              value={form.loanType}
              onChange={(e) => update("loanType", e.target.value)}
              className={inputClass}
            >
              {[
                "Fixed rate",
                "Tracker",
                "Discount",
                "Variable (SVR)",
                "Offset",
                "Help to Buy",
                "Buy-to-let",
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Lender">
            <input
              value={form.lender}
              onChange={(e) => update("lender", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Stage">
            <select
              value={form.stage}
              onChange={(e) => update("stage", e.target.value)}
              className={inputClass}
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Deadlines & commission">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
          <Field label="Offer expiry">
            <input
              type="date"
              value={form.rateLockExpiration}
              onChange={(e) => update("rateLockExpiration", e.target.value)}
              className={`${inputClass} w-full max-w-full min-w-0 box-border appearance-none [&::-webkit-calendar-picker-indicator]:max-w-full`}
            />
          </Field>
          <Field label="Completion date">
            <input
              type="date"
              value={form.closingDate}
              onChange={(e) => update("closingDate", e.target.value)}
              className={`${inputClass} w-full max-w-full min-w-0 box-border appearance-none [&::-webkit-calendar-picker-indicator]:max-w-full`}
            />
          </Field>
          <Field label="Expected commission (£)">
            <input
              type="number"
              value={form.commissionExpected}
              onChange={(e) => update("commissionExpected", e.target.value)}
              className={`${inputClass} w-full max-w-full min-w-0 box-border`}
            />
          </Field>
        </div>
      </Section>

      <Section title="Documents">
        <Field label="Documents folder link">
          <input
            type="url"
            value={form.documentsFolderUrl}
            onChange={(e) => update("documentsFolderUrl", e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
        <p className="text-xs text-slate -mt-2">
          Paste a shareable link to this mortgage's folder — OneDrive,
          SharePoint, Google Drive, or Dropbox all work. Set the folder's
          sharing permissions yourself; this app only stores the link.
        </p>
      </Section>

      <Section title="Notes">
        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className={inputClass}
        />
      </Section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="border border-ink bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : loanId ? "Save changes" : "Add mortgage"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full border border-rule bg-white px-3 py-2 text-base text-ink focus:border-ink outline-none";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="font-display text-sm text-slate mb-3">{title}</legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-slate mb-1">
        {label}
        {required && <span className="text-rust"> *</span>}
      </span>
      {children}
    </label>
  );
}
