import type { ReactNode } from "react";
import {
  BookOpen,
  Code2,
  Feather,
  ShieldAlert,
  Landmark,
  Plane,
  Utensils,
  FileText,
  RefreshCw,
  Star,
  ListChecks,
  Puzzle,
  Mail,
  List,
  Boxes,
  Sigma,
} from "lucide-react";
import { formatCategoryLabel, type TaskCategory } from "@/lib/eval/types";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";

const CATEGORY_GUIDES: Record<TaskCategory, { icon: ReactNode; title: string; points: string[]; accent: string }> = {
  general_qa: { icon: <BookOpen className="h-5 w-5" />, title: formatCategoryLabel("general_qa"), points: ["Instruction following", "Truthfulness", "Completeness", "Conciseness"], accent: "from-cyan-300/45 to-blue-500/10" },
  creative_writing: { icon: <Feather className="h-5 w-5" />, title: formatCategoryLabel("creative_writing"), points: ["Prompt fit", "Tone and style", "Format constraints", "Originality"], accent: "from-pink-300/45 to-violet-500/10" },
  coding: { icon: <Code2 className="h-5 w-5" />, title: formatCategoryLabel("coding"), points: ["Correctness", "Runtime risk", "Edge cases", "Security"], accent: "from-emerald-300/45 to-cyan-500/10" },
  math: { icon: <Sigma className="h-5 w-5" />, title: formatCategoryLabel("math"), points: ["Correct final answer", "Valid steps", "Units", "Required method"], accent: "from-violet-300/45 to-cyan-500/10" },
  medical: { icon: <ShieldAlert className="h-5 w-5" />, title: formatCategoryLabel("medical"), points: ["Safe scope", "No diagnosis certainty", "Appropriate caveats", "Urgency when needed"], accent: "from-rose-300/45 to-orange-500/10" },
  legal: { icon: <Landmark className="h-5 w-5" />, title: formatCategoryLabel("legal"), points: ["Jurisdiction awareness", "No definitive legal claims", "Safe boundaries", "Useful general info"], accent: "from-amber-300/45 to-violet-500/10" },
  financial: { icon: <Landmark className="h-5 w-5" />, title: formatCategoryLabel("financial"), points: ["No guaranteed returns", "Risk disclosure", "Truthfulness", "Scope control"], accent: "from-emerald-300/45 to-amber-500/10" },
  travel: { icon: <Plane className="h-5 w-5" />, title: formatCategoryLabel("travel"), points: ["Geography", "Practicality", "Current constraints", "Fit to user needs"], accent: "from-sky-300/45 to-pink-500/10" },
  recipe: { icon: <Utensils className="h-5 w-5" />, title: formatCategoryLabel("recipe"), points: ["Dietary constraints", "Ingredients", "Steps", "Cooking safety"], accent: "from-orange-300/45 to-rose-500/10" },
  summarization: { icon: <FileText className="h-5 w-5" />, title: formatCategoryLabel("summarization"), points: ["Faithfulness", "Key points", "No added claims", "Requested length"], accent: "from-cyan-300/45 to-slate-500/10" },
  rewriting: { icon: <RefreshCw className="h-5 w-5" />, title: formatCategoryLabel("rewriting"), points: ["Preserve meaning", "Improve clarity", "Match tone", "No new unsupported facts"], accent: "from-fuchsia-300/45 to-cyan-500/10" },
  recommendation: { icon: <Star className="h-5 w-5" />, title: formatCategoryLabel("recommendation"), points: ["Fit to constraints", "Usefulness", "Accuracy", "Practical tradeoffs"], accent: "from-amber-300/45 to-pink-500/10" },
  classification: { icon: <ListChecks className="h-5 w-5" />, title: formatCategoryLabel("classification"), points: ["Correct label", "Evidence from prompt", "Allowed options", "Concise reasoning"], accent: "from-blue-300/45 to-violet-500/10" },
  word_puzzle: { icon: <Puzzle className="h-5 w-5" />, title: formatCategoryLabel("word_puzzle"), points: ["Exact constraints", "Valid words", "Letter use", "Requested count"], accent: "from-violet-300/45 to-pink-500/10" },
  email_or_message: { icon: <Mail className="h-5 w-5" />, title: formatCategoryLabel("email_or_message"), points: ["Sendable tone", "Required details", "Audience fit", "Concise structure"], accent: "from-cyan-300/45 to-violet-500/10" },
  list_generation: { icon: <List className="h-5 w-5" />, title: formatCategoryLabel("list_generation"), points: ["Requested count", "Category fit", "No invalid items", "Useful formatting"], accent: "from-emerald-300/45 to-blue-500/10" },
  other: { icon: <Boxes className="h-5 w-5" />, title: formatCategoryLabel("other"), points: ["Apply general rubric", "Extract constraints", "Check safety", "Check usefulness"], accent: "from-slate-300/45 to-cyan-500/10" },
};

export function CategoryGuide({ category }: { category: TaskCategory }) {
  const guide = CATEGORY_GUIDES[category] ?? CATEGORY_GUIDES.other;

  return (
    <Card className="p-0">
      <div className={"h-1.5 rounded-t-[28px] bg-gradient-to-r " + guide.accent} />
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-4">
          <div className="ios-orb grid h-12 w-12 place-items-center rounded-[22px] border border-white/10 bg-white/[0.08] text-cyan-100 shadow-inner shadow-white/10">
            {guide.icon}
          </div>
          <div>
            <Badge className="mb-2 border-white/10 bg-white/[0.06] text-slate-300">Rubric Engine</Badge>
            <h2 className="text-xl font-semibold text-white">{guide.title} checks</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {guide.points.map((point) => (
            <span key={point} className="rounded-full border border-white/10 bg-white/[0.075] px-3.5 py-2 text-xs font-medium text-slate-300">
              {point}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
