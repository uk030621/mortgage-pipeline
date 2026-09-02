import { differenceInCalendarDays, format, parseISO } from "date-fns";

export function formatCurrency(amount?: number) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return format(parseISO(dateStr), "d MMM yyyy");
}

/**
 * Returns an urgency level for a deadline date, used to color-code
 * mortgage offer expiry and completion dates so the broker can scan
 * for what needs attention first.
 */
export function deadlineUrgency(
  dateStr?: string
): "none" | "ok" | "soon" | "urgent" | "past" {
  if (!dateStr) return "none";
  const days = differenceInCalendarDays(parseISO(dateStr), new Date());
  if (days < 0) return "past";
  if (days <= 3) return "urgent";
  if (days <= 10) return "soon";
  return "ok";
}

export const urgencyStyles: Record<string, string> = {
  none: "",
  ok: "border-l-2 border-rule",
  soon: "border-l-2 border-brass",
  urgent: "border-l-2 border-rust",
  past: "border-l-2 border-rust bg-rustSoft",
};
