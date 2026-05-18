"use client";

import type { ButtonHTMLAttributes } from "react";

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-normal shadow-xl shadow-black/25 transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-[0.99] disabled:translate-y-0 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "border border-white/25 bg-[linear-gradient(135deg,#fdba74_0%,#fb7185_30%,#a78bfa_66%,#67e8f9_100%)] text-white shadow-[0_18px_48px_rgba(236,72,153,0.24)] ring-1 ring-white/15 hover:shadow-[0_22px_60px_rgba(168,85,247,0.28)]",
        variant === "secondary" &&
          "border border-white/15 bg-white/[0.1] text-white shadow-black/20 backdrop-blur-2xl hover:border-white/30 hover:bg-white/[0.16]",
        variant === "ghost" && "bg-transparent text-slate-200 shadow-none hover:bg-white/[0.08]",
        variant === "danger" &&
          "border border-rose-300/30 bg-rose-500/15 text-rose-100 hover:border-rose-200/50 hover:bg-rose-500/25",
        className,
      )}
      {...props}
    />
  );
}
