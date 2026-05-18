import { AlertTriangle, CheckCircle2, Gauge } from "lucide-react";
import type { ModelVote } from "@/lib/eval/types";
import { Badge } from "./ui/Badge";
import { Card, CardTitle } from "./ui/Card";

export function ModelVoteTable({ votes }: { votes: ModelVote[] }) {
  return (
    <Card>
      <div className="mb-6 flex items-center gap-5">
        <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-cyan-100">
          <Gauge className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Consensus layer</p>
          <CardTitle>Model Votes</CardTitle>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {votes.map((vote) => (
          <div key={vote.role + "-" + vote.model} className="rounded-[34px] border border-white/10 bg-black/25 p-5 transition hover:border-white/20 hover:bg-white/[0.06]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Badge>{vote.role}</Badge>
              <Badge className="border-cyan-200/25 bg-cyan-300/10 text-cyan-100">{vote.recommendation}</Badge>
            </div>
            <p className="truncate font-mono text-xs text-slate-400">{vote.model}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Confidence</p>
                <p className="mt-1 text-2xl font-semibold text-white">{vote.confidence}%</p>
              </div>
              {vote.risks.length ? <AlertTriangle className="h-5 w-5 text-amber-200" /> : <CheckCircle2 className="h-5 w-5 text-emerald-200" />}
            </div>
            <p className="mt-4 line-clamp-5 text-sm leading-6 text-slate-300">{vote.reason}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
