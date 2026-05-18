"use client";
export function ProcessFlowSection() {
  const steps = [
  {
    "title": "Discover",
    "body": "Stage 1 — demo flow."
  },
  {
    "title": "Score",
    "body": "Stage 2 — demo flow."
  },
  {
    "title": "Wire",
    "body": "Stage 3 — demo flow."
  },
  {
    "title": "Ship",
    "body": "Stage 4 — demo flow."
  }
];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold text-white">How it works</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white">{i + 1}</span>
            <h3 className="mt-4 font-medium text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}