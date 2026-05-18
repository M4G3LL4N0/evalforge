"use client";
export function TrustLayerGraphic() {
  const cards = [
    { t: "Demo-labeled", d: "Sample outputs — not production metrics." },
    { t: "Human review", d: "Confirm high-stakes decisions with professionals." },
    { t: "Your control", d: "Export and discard on your terms." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-2xl font-semibold text-white">Trust & data</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 h-1 w-12 rounded-full bg-fuchsia-400" />
            <h3 className="text-sm font-medium text-white">{c.t}</h3>
            <p className="mt-2 text-xs text-slate-400">{c.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}