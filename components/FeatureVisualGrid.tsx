"use client";
export function FeatureVisualGrid() {
  const items = [
  {
    "title": "Discover",
    "body": "Step 1 in the developer marketplace workflow."
  },
  {
    "title": "Score",
    "body": "Step 2 in the developer marketplace workflow."
  },
  {
    "title": "Wire",
    "body": "Step 3 in the developer marketplace workflow."
  },
  {
    "title": "Ship",
    "body": "Step 4 in the developer marketplace workflow."
  }
];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold text-white">What you get</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <div className="mb-4 h-16 rounded-xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 to-transparent" />
            <h3 className="font-medium text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}