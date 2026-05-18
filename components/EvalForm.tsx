"use client";

import { CheckCircle2, FileText, Layers3, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { CATEGORIES, formatCategoryLabel, type EvalResultPayload, type TaskCategory } from "@/lib/eval/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";

interface FormState {
  category: TaskCategory;
  prompt: string;
  responseA: string;
  responseB: string;
  rubric: string;
  specialInstructions: string;
  referenceNotes: string;
  platformPolicy: string;
  taskInstructions: string;
  isQualificationTask: boolean;
  saysNoAI: boolean;
  saysNoOutsideTools: boolean;
  requiresExtension: boolean;
  isProctored: boolean;
  managedDevice: boolean;
  finalSubmissionWillBePasted: boolean;
}

const initialState: FormState = {
  category: "general_qa",
  prompt: "",
  responseA: "",
  responseB: "",
  rubric: "Pick the response that best follows the prompt, is factually reliable, complete, safe, and useful.",
  specialInstructions: "",
  referenceNotes: "",
  platformPolicy: "",
  taskInstructions: "",
  isQualificationTask: false,
  saysNoAI: false,
  saysNoOutsideTools: false,
  requiresExtension: false,
  isProctored: false,
  managedDevice: false,
  finalSubmissionWillBePasted: false,
};

export function EvalForm({
  onCategoryChange,
  onResult,
}: {
  onCategoryChange: (category: TaskCategory) => void;
  onResult: (result: EvalResultPayload) => void;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Evaluation failed.");
      onResult(payload as EvalResultPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-0">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.12),transparent_22rem)] p-6 sm:p-8">
        <CardHeader className="mb-0">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="border-cyan-200/25 bg-cyan-300/10 text-cyan-100">Human-controlled</Badge>
              <Badge className="border-white/10 bg-white/[0.06]">OpenRouter panel</Badge>
            </div>
            <CardTitle className="text-3xl">Evaluation Input</CardTitle>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">A command center for comparing two candidate answers with evaluator, skeptic, judge, and compliance review layers.</p>
          </div>
        </CardHeader>
      </div>
      <form onSubmit={submit} className="grid gap-6 p-5 sm:p-8">
        <div className="rounded-[28px] border border-cyan-200/15 bg-cyan-300/10 p-5 text-sm leading-6 text-cyan-50 shadow-inner shadow-white/5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100" />
            <span>AI prepares the analysis. You make the final judgment.</span>
          </div>
        </div>

        <FormSection icon={<Layers3 className="h-5 w-5" />} title="Task Setup" subtitle="Classify the work before the model panel evaluates it.">
          <Field label="Category" helper="Used to tune the rubric and score priorities.">
            <Select
              value={form.category}
              onChange={(event) => {
                const category = event.target.value as TaskCategory;
                setForm({ ...form, category });
                onCategoryChange(category);
              }}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {formatCategoryLabel(category)}
                </option>
              ))}
            </Select>
          </Field>
        </FormSection>

        <FormSection icon={<FileText className="h-5 w-5" />} title="Prompt & Responses" subtitle="Paste the exact material the human reviewer is judging.">
          <Field label="Prompt" helper="Original user request or task prompt.">
            <Textarea required className="min-h-40" value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} placeholder="Paste the original user request." />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <ResponseCard badge="A" label="Response A">
              <Textarea required className="min-h-72 border-white/5 bg-black/20" value={form.responseA} onChange={(event) => setForm({ ...form, responseA: event.target.value })} placeholder="Paste candidate response A." />
            </ResponseCard>
            <ResponseCard badge="B" label="Response B">
              <Textarea required className="min-h-72 border-white/5 bg-black/20" value={form.responseB} onChange={(event) => setForm({ ...form, responseB: event.target.value })} placeholder="Paste candidate response B." />
            </ResponseCard>
          </div>
        </FormSection>

        <FormSection icon={<Sparkles className="h-5 w-5" />} title="Rubric & Notes" subtitle="Give the evaluation engine ground truth, constraints, and preferences.">
          <Field label="Rubric">
            <Textarea required value={form.rubric} onChange={(event) => setForm({ ...form, rubric: event.target.value })} />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Reference Notes" helper="Facts, tests, sources, or expected outputs.">
              <Textarea value={form.referenceNotes} onChange={(event) => setForm({ ...form, referenceNotes: event.target.value })} placeholder="Ground truth, expected facts, tests, or source notes." />
            </Field>
            <Field label="Special Instructions" helper="Reviewer preferences or task-specific constraints.">
              <Textarea value={form.specialInstructions} onChange={(event) => setForm({ ...form, specialInstructions: event.target.value })} placeholder="Any reviewer preferences or constraints." />
            </Field>
          </div>
        </FormSection>

        <FormSection icon={<ShieldCheck className="h-5 w-5" />} title="Compliance Context" subtitle="Tell EvalForge what the platform permits before it recommends how to use AI output.">
          <div className="rounded-3xl border border-amber-200/15 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
            Use AI assistance only where allowed by the platform, client, employer, or task instructions.
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Platform Policy">
              <Textarea
                value={form.platformPolicy}
                onChange={(event) => setForm({ ...form, platformPolicy: event.target.value })}
                placeholder="Paste platform, client, employer, or task-level AI-use policy."
              />
            </Field>
            <Field label="Task Instructions">
              <Textarea
                value={form.taskInstructions}
                onChange={(event) => setForm({ ...form, taskInstructions: event.target.value })}
                placeholder="Paste any instructions about tool use, originality, monitoring, or submission."
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Checkbox label="Qualification task" checked={form.isQualificationTask} onChange={(checked) => setForm({ ...form, isQualificationTask: checked })} />
            <Checkbox label="Says no AI" checked={form.saysNoAI} onChange={(checked) => setForm({ ...form, saysNoAI: checked })} />
            <Checkbox label="Says no outside tools" checked={form.saysNoOutsideTools} onChange={(checked) => setForm({ ...form, saysNoOutsideTools: checked })} />
            <Checkbox label="Requires extension" checked={form.requiresExtension} onChange={(checked) => setForm({ ...form, requiresExtension: checked })} />
            <Checkbox label="Is proctored" checked={form.isProctored} onChange={(checked) => setForm({ ...form, isProctored: checked })} />
            <Checkbox label="Managed device" checked={form.managedDevice} onChange={(checked) => setForm({ ...form, managedDevice: checked })} />
            <Checkbox
              label="Final submission will be pasted"
              checked={form.finalSubmissionWillBePasted}
              onChange={(checked) => setForm({ ...form, finalSubmissionWillBePasted: checked })}
            />
          </div>
        </FormSection>

        {error ? <p className="rounded-3xl border border-rose-300/25 bg-rose-500/15 p-4 text-sm text-rose-100">{error}</p> : null}
        <div className="sticky bottom-4 z-10 rounded-[34px] border border-white/10 bg-slate-950/70 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <Button type="submit" disabled={loading} className="min-h-16 w-full text-base shadow-2xl shadow-pink-950/40">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            Run Multi-Model Evaluation
          </Button>
          <p className="mt-3 text-center text-xs font-medium text-slate-500">No auto-submit. Manual review required.</p>
        </div>
      </form>
    </Card>
  );
}

function FormSection({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-[36px] border border-white/10 bg-white/[0.045] p-5 shadow-inner shadow-white/5 transition hover:border-white/20 sm:p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-cyan-100">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function ResponseCard({ badge, label, children }: { badge: string; label: string; children: ReactNode }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(125,211,252,0.09),transparent_16rem),rgba(255,255,255,0.055)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</span>
        <span className="ios-orb grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.11] text-xs font-semibold text-cyan-100">{badge}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</span>
      {children}
      {helper ? <span className="text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[24px] border border-white/10 bg-white/[0.065] p-4 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/[0.075]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded accent-cyan-300"
      />
      <span>{label}</span>
    </label>
  );
}
