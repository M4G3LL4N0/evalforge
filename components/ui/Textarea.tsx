"use client";

import type { TextareaHTMLAttributes } from "react";

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full resize-y rounded-[24px] border border-white/10 bg-black/25 px-5 py-4 text-sm leading-7 text-slate-100 shadow-inner shadow-black/40 outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60 focus:bg-white/[0.055] focus:ring-4 focus:ring-violet-300/15",
        className,
      )}
      {...props}
    />
  );
}
