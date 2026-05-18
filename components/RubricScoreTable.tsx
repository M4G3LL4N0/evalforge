import { BarChart3 } from "lucide-react";
import type { EvalResultPayload, EvalScores } from "@/lib/eval/types";
import { Badge } from "./ui/Badge";
import { Card, CardTitle } from "./ui/Card";

const labels: Array<[keyof EvalScores, string]> = [
  ["instructionFollowing", "Instruction"],
  ["truthfulness", "Truth"],
  ["completeness", "Complete"],
  ["helpfulness", "Helpful"],
  ["safety", "Safety"],
  ["writingQuality", "Writing"],
  ["codingCorrectness", "Code"],
  ["overall", "Overall"],
];

export function RubricScoreTable({ scores }: { scores: EvalResultPayload["scores"] }) {
  const rows = labels.filter(([key]) => key !== "codingCorrectness" || scores.responseA.codingCorrectness !== undefined || scores.responseB.codingCorrectness !== undefined);
  return (
    <Card>
      <div className="mb-6 flex items-center gap-5">
        <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-cyan-100">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Rubric Engine</p>
          <CardTitle>Rubric Scores</CardTitle>
        </div>
      </div>
      <div className="grid gap-4">
        {rows.map(([key, label]) => {
          const a = Number(scores.responseA[key] ?? 0);
          const b = Number(scores.responseB[key] ?? 0);
          return (
            <div key={key} className="grid gap-4 rounded-[34px] border border-white/10 bg-black/25 p-5 lg:grid-cols-[150px_1fr_1fr] lg:items-center">
              <div className="text-sm font-semibold text-slate-100">{label}</div>
              <ScoreBar label="A" value={a} />
              <ScoreBar label="B" value={b} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const width = Math.min(100, Math.max(0, value * 10));
  return (
    <div className="grid grid-cols-[28px_1fr_auto] items-center gap-4 text-xs text-slate-300">
      <Badge className="justify-center px-2 py-1">{label}</Badge>
      <span className="h-3.5 overflow-hidden rounded-full bg-slate-950/80 shadow-inner shadow-black/40">
        <span className="block h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#a78bfa,#fb7185)]" style={{ width: width + "%" }} />
      </span>
      <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 font-mono text-slate-100">{value.toFixed(1)}</span>
    </div>
  );
}
