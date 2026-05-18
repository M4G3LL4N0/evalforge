"use client";
const LABELS: Record<string, { title: string; sub: string }> = {
  pricing: { title: "Plans", sub: "Compare tiers." },
  about: { title: "About", sub: "Product thesis." },
  contact: { title: "Contact", sub: "Partnerships & pilots." },
  demo: { title: "Demo", sub: "Sample workflow." },
  dashboard: { title: "Workspace", sub: "Status & next actions." },
  default: { title: "Product", sub: "Explore this surface." },
};
export function SubpageVisual({ variant = "default" }: { variant?: string }) {
  const v = LABELS[variant] || LABELS.default;
  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
      <p className="text-xs uppercase text-fuchsia-300">{v.title}</p>
      <p className="mt-1 text-sm text-slate-400">{v.sub}</p>
      <svg className="mt-4 h-12 w-full max-w-[120px] opacity-40" viewBox="0 0 120 48" aria-hidden>
        <rect x="4" y="4" width="112" height="40" rx="6" fill="none" stroke="currentColor" className="text-white/25" />
        <path d="M16 16h88M16 28h72" stroke="currentColor" className="text-white/20" />
      </svg>
    </div>
  );
}