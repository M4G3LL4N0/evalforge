"use client";

/** Portfolio UI/UX pass — honest demo/sample labeling */
export function TrustStrip({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-slate-400 ${className}`.trim()}
      role="note"
    >
      Demo and sample outputs are for planning and review — not audited metrics, live revenue, binding
      quotes, or professional advice. Confirm facts before acting.
    </p>
  );
}
