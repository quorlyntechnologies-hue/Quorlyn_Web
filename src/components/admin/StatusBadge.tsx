import { inquiryStatuses, type InquiryStatus } from "@/lib/supabase/types";

/**
 * Pipeline status chip.
 *
 * Carries a label as well as a colour — status must survive greyscale printing
 * and colour-blind viewing, so the tint is reinforcement, never the signal.
 */
export function StatusBadge({ status }: { status: InquiryStatus }) {
  const label = inquiryStatuses.find((s) => s.value === status)?.label ?? status;

  const tone =
    status === "new"
      ? "border-cyan/30 bg-cyan/10 text-accent"
      : status === "won"
        ? "border-success/30 bg-success/10 text-success"
        : status === "lost" || status === "archived"
          ? "border-line bg-white/[0.03] text-subtle"
          : "border-line-strong bg-white/[0.04] text-muted";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-sm font-medium ${tone}`}
    >
      {label}
    </span>
  );
}
