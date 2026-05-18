"use client";

import type { InputHTMLAttributes } from "react";

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-[52px] w-full rounded-[20px] border border-white/10 bg-black/25 px-5 py-3 text-sm text-slate-100 shadow-inner shadow-black/40 outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60 focus:bg-white/[0.055] focus:ring-4 focus:ring-cyan-300/15",
        className,
      )}
      {...props}
    />
  );
}
