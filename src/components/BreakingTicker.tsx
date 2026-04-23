import { listArticles } from "@/lib/articles";
import { Zap } from "lucide-react";

export function BreakingTicker() {
  const { rows } = listArticles({ breaking: true, limit: 10 });
  const items =
    rows.length > 0
      ? rows.map((r) => r.title)
      : ["مرحباً بكم في شارع الداخل — آخر الأخبار لحظة بلحظة"];

  return (
    <div className="sticky top-0 z-50 flex items-stretch bg-[var(--color-red)] text-white">
      <div className="flex items-center gap-2 bg-[var(--color-red-dark)] px-4 py-2 font-[var(--font-cairo)] font-black">
        <Zap size={16} fill="currentColor" />
        <span>عاجل</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-track py-2 text-[15px]">
          {items.concat(items).map((t, i) => (
            <span key={`${t}-${i}`} className="inline-flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
