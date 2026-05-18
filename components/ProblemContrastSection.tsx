"use client";
export function ProblemContrastSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold text-white">The old way vs this product</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6">
          <p className="text-xs uppercase text-red-300">Before</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-400"><li>Scattered tools</li><li>No audit trail</li><li>Slow handoffs</li></ul>
        </div>
        <div className="rounded-2xl border ring-fuchsia-500/20 bg-fuchsia-500/10 p-6">
          <p className="text-xs uppercase text-fuchsia-300">After</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300"><li>Structured intake</li><li>Clear outputs</li><li>Next action visible</li></ul>
        </div>
      </div>
    </section>
  );
}