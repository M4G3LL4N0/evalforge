"use client";

import { Check, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardTitle } from "./ui/Card";

export function HumanReviewChecklist({ checks, onCompletionChange }: { checks: string[]; onCompletionChange?: (completed: boolean) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const completedCount = checks.filter((check) => checked[check]).length;
  const completed = checks.length > 0 && completedCount === checks.length;

  useEffect(() => {
    onCompletionChange?.(completed);
  }, [completed, onCompletionChange]);

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-cyan-100">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Human gate</p>
            <CardTitle>Human Accountability Checklist</CardTitle>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300">{completedCount}/{checks.length}</span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {checks.map((check) => (
          <label key={check} className="flex cursor-pointer items-start gap-4 rounded-[34px] border border-white/10 bg-black/25 p-5 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
              <input
                type="checkbox"
                checked={Boolean(checked[check])}
                onChange={(event) => setChecked((current) => ({ ...current, [check]: event.target.checked }))}
                className="sr-only"
              />
              {checked[check] ? <Check className="h-3.5 w-3.5 text-cyan-100" /> : null}
            </span>
            <span>{check}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 rounded-[34px] border border-rose-200/20 bg-rose-400/10 p-5 text-sm text-rose-50">
        Manual human approval required.
      </p>
    </Card>
  );
}
