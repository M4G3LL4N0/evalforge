"use client";

import { AlertTriangle, CheckCircle2, Eye, ShieldCheck } from "lucide-react";
import type { AIUseClassification, ComplianceResult, MonitoringRisk, PolicyRisk } from "@/lib/eval/types";
import { Badge } from "./ui/Badge";
import { Card, CardTitle } from "./ui/Card";

const policyLabels: Record<PolicyRisk, string> = {
  green: "AI-use risk: green",
  yellow: "AI-use risk: yellow",
  red: "AI-use risk: red",
};

const monitoringLabels: Record<MonitoringRisk, string> = {
  low: "Monitoring risk: low",
  medium: "Monitoring risk: medium",
  high: "Monitoring risk: high",
};

const classificationLabels: Record<AIUseClassification, string> = {
  ai_allowed: "AI allowed",
  ai_allowed_with_limits: "AI allowed with limits",
  learning_only: "AI allowed for learning only",
  policy_unclear: "AI policy unclear",
  likely_prohibited: "AI likely prohibited",
};

function riskClass(risk: PolicyRisk | MonitoringRisk) {
  if (risk === "green" || risk === "low") return "border-emerald-200/30 bg-emerald-300/15 text-emerald-100";
  if (risk === "yellow" || risk === "medium") return "border-amber-200/30 bg-amber-300/15 text-amber-100";
  return "border-rose-200/30 bg-rose-400/15 text-rose-100";
}

export function ComplianceRiskPanel({ compliance }: { compliance: ComplianceResult }) {
  const safeMode = compliance.safeAssistanceMode.enabled;
  return (
    <Card>
      <div className="mb-5 flex items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-cyan-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Compliance layer</p>
            <CardTitle>Compliance Risk Panel</CardTitle>
          </div>
        </div>
        {safeMode ? <Badge className="border-amber-200/30 bg-amber-300/15 text-amber-100">Safe assistance mode</Badge> : null}
      </div>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <RiskTile label={policyLabels[compliance.policyRisk]} value={compliance.policyRisk} className={riskClass(compliance.policyRisk)} />
          <RiskTile label={monitoringLabels[compliance.monitoringRisk]} value={compliance.monitoringRisk} className={riskClass(compliance.monitoringRisk)} />
          <RiskTile label="AI-use classification" value={classificationLabels[compliance.aiUseClassification]} className="border-cyan-200/25 bg-cyan-300/10 text-cyan-100" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[34px] border border-amber-200/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50">
            <div className="mb-2 flex items-center gap-2 font-semibold text-amber-100">
              <AlertTriangle className="h-4 w-4" />
              Manual approval required
            </div>
            Use AI assistance only where allowed by the platform, client, employer, or task instructions. This tool does not auto-submit or bypass platform rules.
          </div>
          <div className="rounded-[34px] border border-emerald-200/20 bg-emerald-300/10 p-5 text-sm leading-6 text-emerald-50">
            <div className="mb-2 flex items-center gap-2 font-semibold text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              Allowed help
            </div>
            Use EvalForge for analysis, learning, quality control, draft review, and checklist-driven human verification where the platform permits it.
          </div>
        </div>
        <div className="rounded-[34px] border border-white/10 bg-black/25 p-5 text-sm leading-6 text-slate-300">
          Normal webpages generally cannot see private AI conversations in other tabs, but they can see behavior inside their own page.
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ReasonList title="Policy interpretation" items={compliance.policyReasons} />
          <ReasonList title="Monitoring notes" items={compliance.monitoringReasons} />
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Eye className="h-4 w-4 text-cyan-200" />
            Browser and platform signals
          </div>
          <div className="flex flex-wrap gap-2">
            {compliance.likelySignals.map((signal) => (
              <div key={signal.label} className="rounded-full border border-white/10 bg-white/[0.065] px-3 py-2 text-xs text-slate-300" title={signal.explanation}>
                <span className="font-semibold text-slate-100">{signal.label}</span>
                <span className="ml-2 text-slate-500">{signal.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function RiskTile({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-black/25 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <Badge className={"mt-3 " + className}>{value}</Badge>
    </div>
  );
}

function ReasonList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.065] p-5">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
        {(items.length ? items : ["No specific issues detected."]).map((item) => (
          <li key={item} className="rounded-[22px] bg-black/25 px-3 py-2">{item}</li>
        ))}
      </ul>
    </div>
  );
}
