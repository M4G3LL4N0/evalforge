"use client";

import { ArrowDown, BrainCircuit, CheckCircle2, ClipboardList, Eye, LockKeyhole, Radar, Scale3d, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingGraphicsStack } from "@/components/MarketingGraphicsStack";
import { ProcessFlowSection } from "@/components/ProcessFlowSection";
import { HeroProductPanel } from "@/components/HeroProductPanel";
import { TrustStrip } from "@/components/TrustStrip";
import type React from "react";
import { useEffect, useState } from "react";
import { CategoryGuide } from "@/components/CategoryGuide";
import { EvalForm } from "@/components/EvalForm";
import { EvalResults } from "@/components/EvalResults";
import { TaskHistory } from "@/components/TaskHistory";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { EvalResultPayload, TaskCategory } from "@/lib/eval/types";
import { addTask, clearTasks, loadTasks, type StoredTask } from "@/lib/storage";

export default function Home() {
  const [category, setCategory] = useState<TaskCategory>("general_qa");
  const [result, setResult] = useState<EvalResultPayload | null>(null);
  const [tasks, setTasks] = useState<StoredTask[]>([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  function saveResult(item: EvalResultPayload) {
    setTasks(addTask(item));
  }

  function clearHistory() {
    clearTasks();
    setTasks([]);
  }

  return (
    <main className="min-h-screen px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <TrustStrip />
        </div>

      <div className="mx-auto grid max-w-[1320px] gap-10 lg:gap-12">
        <nav className="sticky top-4 z-30 rounded-[28px] border border-white/10 bg-slate-950/70 px-3 py-2 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:rounded-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 pl-2">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.1] shadow-inner shadow-white/10">
                <Sparkles className="h-5 w-5 text-cyan-100" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold tracking-[-0.02em] text-white">EvalForge</span>
                <Badge className="hidden border-cyan-200/25 bg-cyan-300/10 text-cyan-100 sm:inline-flex">Human-in-the-loop QA</Badge>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-1 text-sm text-slate-300 lg:justify-center">
              <NavLink href="#console">Console</NavLink>
              <NavLink href="#compliance">Compliance</NavLink>
              <NavLink href="#history">History</NavLink>
              <NavLink href="#rubric">Rubric Engine</NavLink>
            </div>
            <a href="#console" className="rounded-full border border-white/15 bg-[linear-gradient(135deg,#fb923c,#f43f5e,#a855f7,#38bdf8)] px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-pink-950/40 transition hover:-translate-y-0.5">
              Run Evaluation
            </a>
          </div>
        </nav>

        <section className="hero-orbit luxury-panel relative overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-7 lg:p-9">
          <div className="absolute left-[-10%] top-[-18%] h-[34rem] w-[34rem] rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute right-[-18%] top-[6%] h-[36rem] w-[36rem] rounded-full bg-fuchsia-500/22 blur-3xl" />
          <div className="absolute bottom-[-22%] left-[26%] h-[30rem] w-[30rem] rounded-full bg-orange-400/16 blur-3xl" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          <div className="absolute left-8 right-8 top-8 h-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid min-h-[680px] gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="grid content-center py-10 lg:py-16">
              <div className="mb-7 flex flex-wrap items-center gap-2">
                <Badge className="border-cyan-200/25 bg-cyan-300/10 text-cyan-100">Manual-review workstation</Badge>
                <Badge className="border-white/10 bg-white/[0.08] text-slate-200">Server-side API key only</Badge>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/80">MULTI-MODEL EVALUATION COCKPIT</p>
              <h1 className="gradient-text mt-4 text-6xl font-semibold leading-[0.88] tracking-[-0.065em] sm:text-7xl lg:text-8xl">EvalForge</h1>
              <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Grade AI responses with human judgment, model consensus, and compliance control.
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                EvalForge compares responses across evaluator, skeptic, and judge models, then routes the final decision through a human review gate.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#console"><Button type="button"><Radar className="h-4 w-4" />Start Evaluation</Button></a>
                <a href="#compliance"><Button type="button" variant="secondary"><ShieldCheck className="h-4 w-4" />View Compliance Layer</Button></a>
              </div>
              <div className="mt-9 flex w-full max-w-2xl flex-wrap items-center gap-2 rounded-[28px] border border-white/10 bg-slate-950/45 p-2 shadow-inner shadow-black/40 backdrop-blur-2xl">
                {['Evaluator', 'Skeptic', 'Final Judge', 'Human Approval'].map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-slate-200">{step}</span>
                    {index < 3 ? <span className="text-slate-600">→</span> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <HeroWidget icon={<BrainCircuit className="h-5 w-5" />} label="Evaluator panel" value="Fast + deep + skeptic" detail="Independent scoring passes" />
              <HeroWidget icon={<Scale3d className="h-5 w-5" />} label="Judge pass" value="Consensus synthesis" detail="Final model adjudication" />
              <HeroWidget icon={<LockKeyhole className="h-5 w-5" />} label="Compliance" value="Policy + audit log" detail="Human-in-the-loop guardrails" />
              <HeroWidget icon={<ClipboardList className="h-5 w-5" />} label="Review gate" value="Manual approval" detail="No auto-submit workflow" />
              <div className="rounded-[36px] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:col-span-2">
                <div className="mb-4 flex flex-wrap gap-2">
                  {[
                    "Manual approval required",
                    "OpenRouter multi-model stack",
                    "No auto-submit",
                    "Audit-ready review logs",
                  ].map((item) => (
                    <Badge key={item} className="border-white/10 bg-white/[0.07] text-slate-200">
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-cyan-100" />
                      {item}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm leading-6 text-slate-300">An institutional-grade AI evaluation cockpit built for careful, accountable review workflows.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="console" className="grid gap-8 lg:grid-cols-[minmax(0,0.63fr)_minmax(360px,0.37fr)]">
          <EvalForm onCategoryChange={setCategory} onResult={setResult} />
          <aside className="grid content-start gap-6">
            <div id="compliance" className="grid gap-6">
              <CategoryGuide category={category} />
              <ComplianceWidget />
            </div>
            <div id="history">
              <TaskHistory tasks={tasks} onSelect={setResult} onClear={clearHistory} />
            </div>
            <OperatingRules />
          </aside>
        </section>

        <section id="rubric" className="grid gap-5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            <ArrowDown className="h-4 w-4" /> Decision Board
          </div>
          <EvalResults result={result} onSave={saveResult} />
        </section>
      </div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6"><HeroProductPanel /></section>
      <ProcessFlowSection />
    <MarketingGraphicsStack />
    </main>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="rounded-full px-3 py-2 transition hover:bg-white/[0.08] hover:text-white">
      {children}
    </a>
  );
}

function HeroWidget({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="luxury-panel rounded-[36px] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/35 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="mb-5 ios-orb grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.09] text-cyan-100">{icon}</div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-slate-100">{value}</div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  );
}

function ComplianceWidget() {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="ios-orb grid h-12 w-12 place-items-center rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-100">
          <Eye className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Compliance & Human Review</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Platform-aware assistance</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Policy fields classify AI-use risk, monitoring risk, and safe assistance mode before a recommendation is used.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {['Policy risk classification', 'Monitoring signal awareness', 'Manual approval checklist'].map((item) => (
          <div key={item} className="rounded-[24px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">{item}</div>
        ))}
      </div>
    </Card>
  );
}

function OperatingRules() {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="ios-orb grid h-12 w-12 place-items-center rounded-2xl border border-violet-200/20 bg-violet-300/10 text-violet-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Operating rules</p>
          <h2 className="text-xl font-semibold text-white">Compliance-first review</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {[
          "AI prepares the analysis. You make the final judgment.",
          "Manual human approval required before using any recommendation.",
          "This tool does not auto-submit or bypass platform rules.",
          "Use AI assistance only where allowed by the platform, client, employer, or task instructions.",
        ].map((rule) => (
          <div key={rule} className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4 text-sm leading-6 text-slate-300">
            {rule}
          </div>
        ))}
      </div>
    </Card>
  );
}
