"use client";

import { AlertTriangle, Copy, Download, FileText, Save, ShieldCheck, Trophy } from "lucide-react";
import { useState } from "react";
import { formatCategoryLabel, type EvalResultPayload } from "@/lib/eval/types";
import { Button } from "./ui/Button";
import { Card, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { ComplianceRiskPanel } from "./ComplianceRiskPanel";
import { HumanReviewChecklist } from "./HumanReviewChecklist";
import { ModelVoteTable } from "./ModelVoteTable";
import { RubricScoreTable } from "./RubricScoreTable";

const riskClasses = {
  green: "border-emerald-200/30 bg-emerald-300/15 text-emerald-100",
  yellow: "border-amber-200/30 bg-amber-300/15 text-amber-100",
  red: "border-rose-200/30 bg-rose-400/15 text-rose-100",
};

export function EvalResults({ result, onSave }: { result: EvalResultPayload | null; onSave: (result: EvalResultPayload) => void }) {
  const [humanChecklistCompleted, setHumanChecklistCompleted] = useState(false);
  if (!result) {
    return (
      <Card className="grid min-h-[360px] place-items-center border-dashed border-white/15 bg-white/[0.03] text-center">
        <div className="max-w-lg px-4">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-[30px] border border-white/10 bg-white/[0.08] text-cyan-100">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Results dashboard is standing by</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Run a multi-model evaluation to populate recommendation, compliance risk, model votes, rubric scores, audit guidance, and the human review checklist.</p>
        </div>
      </Card>
    );
  }

  const current = result;
  const safeMode = current.compliance.safeAssistanceMode.enabled;

  async function copyFinalDraft() {
    await navigator.clipboard.writeText(current.finalDraft);
  }

  function saveWithAudit() {
    const audited: EvalResultPayload = {
      ...current,
      humanChecklistCompleted,
      auditLog: {
        ...current.auditLog,
        humanChecklistCompleted,
      },
    };
    onSave(audited);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ ...current, humanChecklistCompleted }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "evalforge-" + current.id + ".json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8">
      <Card className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.24),transparent_28rem),radial-gradient(circle_at_92%_10%,rgba(236,72,153,0.22),transparent_28rem),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge>{formatCategoryLabel(result.category)}</Badge>
                <Badge className="border-cyan-200/25 bg-cyan-300/10 text-cyan-100">{result.confidence}% confidence</Badge>
                <Badge className={riskClasses[result.compliance.policyRisk]}>Policy {result.compliance.policyRisk}</Badge>
                <Badge className="border-rose-200/30 bg-rose-400/15 text-rose-100">Manual review required</Badge>
                {safeMode ? <Badge className="border-amber-200/30 bg-amber-300/15 text-amber-100">Safe assistance mode</Badge> : null}
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Decision Board</p>
              <h2 className="mt-2 gradient-text text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">Winner: {result.recommendation}</h2>
              <p className="mt-4 max-w-5xl text-base leading-8 text-slate-300">{result.summary}</p>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">AI prepares the analysis. You make the final judgment. This tool does not auto-submit or bypass platform rules.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:w-[520px] lg:grid-cols-1 xl:grid-cols-3">
              <Stat label="Confidence" value={result.confidence + "%"} />
              <Stat label="Policy Risk" value={result.compliance.policyRisk} />
              <Stat label="Monitoring" value={result.compliance.monitoringRisk} />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={copyFinalDraft}><Copy className="h-4 w-4" />{safeMode ? "Copy guidance" : "Copy final draft"}</Button>
            <Button type="button" variant="secondary" onClick={saveWithAudit}><Save className="h-4 w-4" />Save task</Button>
            <Button type="button" variant="secondary" onClick={exportJson}><Download className="h-4 w-4" />Export JSON</Button>
          </div>
        </div>
      </Card>

      <ComplianceRiskPanel compliance={result.compliance} />
      <RationaleQualityCard />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-cyan-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Human-edited output</p>
              <CardTitle>{safeMode ? "Safe Assistance Guidance" : "Final Draft"}</CardTitle>
            </div>
          </div>
          <pre className="subtle-scrollbar max-h-[520px] overflow-auto whitespace-pre-wrap rounded-[34px] border border-white/10 bg-slate-950/60 p-5 text-sm leading-7 text-slate-200 shadow-inner shadow-black/40">{result.finalDraft}</pre>
        </Card>
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-amber-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Review gates</p>
              <CardTitle>Risk Flags</CardTitle>
            </div>
          </div>
          <div className="grid gap-3">
            {(result.riskFlags.length ? result.riskFlags : ["No structured risk flags returned."]).map((risk) => (
              <div key={risk} className="rounded-[34px] border border-white/10 bg-white/[0.065] p-5 text-sm leading-6 text-slate-300">{risk}</div>
            ))}
          </div>
        </Card>
      </div>

      <ModelVoteTable votes={result.modelVotes} />
      <RubricScoreTable scores={result.scores} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ListCard tone="good" title="Response A Strengths" items={result.strengthsA} />
        <ListCard tone="risk" title="Response A Weaknesses" items={result.weaknessesA} />
        <ListCard tone="good" title="Response B Strengths" items={result.strengthsB} />
        <ListCard tone="risk" title="Response B Weaknesses" items={result.weaknessesB} />
      </div>
      <HumanReviewChecklist checks={result.humanChecks} onCompletionChange={setHumanChecklistCompleted} />
    </div>
  );
}

function RationaleQualityCard() {
  const items = [
    "Specific evidence",
    "Fact-check awareness",
    "Grammar polish",
    "Subjective examples",
    "Comparative clarity",
  ];

  return (
    <Card>
      <div className="mb-5 flex items-center gap-3">
        <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-cyan-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Rationale Quality</p>
          <CardTitle>Professional review standard</CardTitle>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} className="border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
            {item}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.07] p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_48px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white capitalize">{value}</p>
    </div>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "good" | "risk" }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <CardTitle>{title}</CardTitle>
        <Badge className={tone === "good" ? "border-emerald-200/30 bg-emerald-300/15 text-emerald-100" : "border-amber-200/30 bg-amber-300/15 text-amber-100"}>{tone === "good" ? "Signal" : "Review"}</Badge>
      </div>
      <ul className="grid gap-3 text-sm text-slate-300">
        {(items.length ? items : ["No structured items returned."]).map((item) => (
          <li key={item} className="rounded-[34px] border border-white/10 bg-white/[0.065] p-5 leading-6">{item}</li>
        ))}
      </ul>
    </Card>
  );
}
