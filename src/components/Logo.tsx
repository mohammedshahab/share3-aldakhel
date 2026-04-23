import { Radio } from "lucide-react";

export function Logo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="inline-flex items-center justify-center rounded-md bg-[var(--color-red)] text-white"
        style={{ width: size + 8, height: size + 8 }}
      >
        <Radio size={size - 4} strokeWidth={2.5} />
      </span>
      <span
        className="font-[var(--font-cairo)] font-black tracking-tight text-white"
        style={{ fontSize: size }}
      >
        شارع الداخل
      </span>
    </span>
  );
}
