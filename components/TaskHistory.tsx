"use client";

import { Clock3, History, Sparkles, Trash2 } from "lucide-react";
import type { StoredTask } from "@/lib/storage";
import { formatCategoryLabel } from "@/lib/eval/types";
import { Button } from "./ui/Button";
import { Card, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";

const riskClasses = {
  green: "border-emerald-200/30 bg-emerald-300/15 text-emerald-100",
  yellow: "border-amber-200/30 bg-amber-300/15 text-amber-100",
  red: "border-rose-200/30 bg-rose-400/15 text-rose-100",
};

export function TaskHistory({ tasks, onSelect, onClear }: { tasks: StoredTask[]; onSelect: (task: StoredTask) => void; onClear: () => void }) {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-cyan-100">
            <History className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Local memory</p>
            <CardTitle>Task History</CardTitle>
          </div>
        </div>
        <Button type="button" variant="ghost" onClick={onClear} disabled={!tasks.length} aria-label="Clear task history" className="px-3">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-4">
        {tasks.length ? (
          tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onSelect(task)}
              className="rounded-[34px] border border-white/10 bg-white/[0.065] p-5 text-left shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.075]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{formatCategoryLabel(task.category)}</Badge>
                <Badge className="border-cyan-200/25 bg-cyan-300/10 text-cyan-100">{task.recommendation}</Badge>
                {task.compliance ? <Badge className={riskClasses[task.compliance.policyRisk]}>{task.compliance.policyRisk}</Badge> : null}
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{task.label}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{task.summary}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {new Date(task.createdAt).toLocaleString()} · {task.confidence}% confidence
              </div>
            </button>
          ))
        ) : (
          <div className="grid justify-items-center rounded-[34px] border border-dashed border-white/15 bg-white/[0.035] p-7 text-center">
            <div className="mb-4 ios-orb grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.08] text-cyan-100 shadow-inner shadow-white/10">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No saved evaluations yet</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Run and save a review to build an audit-ready local memory stream.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
