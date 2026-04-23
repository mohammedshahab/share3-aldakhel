"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setErr(null);
    setLoading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "فشل الرفع");
        return;
      }
      onChange(data.url as string);
    } catch {
      setErr("فشل الرفع");
    } finally {
      setLoading(false);
    }
  }

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-white/10">
        <div className="relative aspect-[16/9] w-full">
          <Image src={value} alt="cover" fill className="object-cover" />
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="إزالة الصورة"
          className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-[var(--color-red)]"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
        className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/15 bg-[var(--color-black-deep)] text-[var(--color-gray-light)] transition hover:border-[var(--color-red)] hover:text-white"
      >
        <UploadCloud size={28} />
        <span className="text-sm font-bold">
          {loading ? "جارٍ الرفع..." : "اسحب الصورة هنا أو انقر للاختيار"}
        </span>
        <span className="text-xs">مقترح 1200×630 — حتى 5MB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
      {err ? (
        <div className="mt-2 text-xs text-[var(--color-red)]">{err}</div>
      ) : null}
    </div>
  );
}
