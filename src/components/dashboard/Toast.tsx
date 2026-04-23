"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type Kind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: Kind;
  message: string;
}

interface Ctx {
  push: (kind: Kind, message: string) => void;
}

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((kind: Kind, message: string) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, kind, message }]);
    setTimeout(() => {
      setItems((xs) => xs.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`flex min-w-[240px] items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold shadow-lg ${
              t.kind === "success"
                ? "border-green-400/30 bg-green-500/15 text-green-300"
                : t.kind === "error"
                  ? "border-[var(--color-red)]/40 bg-[var(--color-red)]/15 text-[var(--color-red)]"
                  : "border-white/10 bg-[var(--color-panel)] text-white"
            }`}
          >
            {t.kind === "success" ? (
              <CheckCircle2 size={16} />
            ) : t.kind === "error" ? (
              <XCircle size={16} />
            ) : (
              <Info size={16} />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
