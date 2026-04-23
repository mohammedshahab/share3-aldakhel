import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  tone?: "red" | "gold" | "green" | "gray";
  delta?: string;
}

const TONES: Record<NonNullable<Props["tone"]>, string> = {
  red: "bg-[var(--color-red)]/15 text-[var(--color-red)]",
  gold: "bg-[var(--color-gold)]/15 text-[var(--color-gold)]",
  green: "bg-green-500/15 text-green-400",
  gray: "bg-white/10 text-white",
};

export function StatsCard({ title, value, icon, tone = "red", delta }: Props) {
  return (
    <div className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-[var(--color-gray-light)]">{title}</div>
          <div className="mt-2 font-[var(--font-cairo)] text-3xl font-black text-white">
            {value}
          </div>
          {delta ? (
            <div className="mt-1 text-xs text-green-400">{delta}</div>
          ) : null}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${TONES[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
