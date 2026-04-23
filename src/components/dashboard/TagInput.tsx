"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ value, onChange }: Props) {
  const [draft, setDraft] = useState("");

  function add(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-white/10 bg-[#1f1f1f] p-2">
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-full bg-[var(--color-red)] px-2.5 py-0.5 text-xs font-bold text-white"
        >
          #{t}
          <button
            type="button"
            onClick={() => remove(t)}
            className="rounded-full hover:bg-black/20"
            aria-label={`إزالة ${t}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
            setDraft("");
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => {
          if (draft) {
            add(draft);
            setDraft("");
          }
        }}
        placeholder="أضف وسم واضغط Enter..."
        className="flex-1 border-0 bg-transparent px-2 py-1 text-sm text-white placeholder-[#6b6b6b] outline-none"
      />
    </div>
  );
}
