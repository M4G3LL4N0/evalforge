import type { HTMLAttributes } from "react";

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.09] px-3.5 py-1.5 text-xs font-semibold text-slate-200 shadow-sm shadow-black/20 backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
