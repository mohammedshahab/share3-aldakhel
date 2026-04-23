import Link from "next/link";
import { Zap, Clock } from "lucide-react";
import { timeAgoAr } from "@/lib/utils";
import type { ArticleWithRefs } from "@/lib/types";

export function BreakingSection({ items }: { items: ArticleWithRefs[] }) {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 font-[var(--font-cairo)] text-2xl font-black text-[var(--color-red)] md:text-3xl">
        <Zap size={24} fill="currentColor" /> أخبار عاجلة
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {items.map((a) => (
          <Link
            key={a.id}
            href={`/article/${a.slug}`}
            className="min-w-[280px] max-w-[320px] shrink-0 rounded-xl border border-[var(--color-red)]/30 bg-gradient-to-br from-[var(--color-red-dark)] to-[var(--color-red)] p-4 transition hover:brightness-110 md:min-w-[320px]"
          >
            <span className="mb-2 inline-flex items-center gap-1 rounded bg-black/30 px-2 py-0.5 text-[11px] font-black text-white">
              <Zap size={11} fill="currentColor" /> عاجل
            </span>
            <h3 className="line-clamp-3 font-[var(--font-cairo)] text-base font-bold leading-snug text-white">
              {a.title}
            </h3>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-white/80">
              <Clock size={12} />
              {timeAgoAr(a.published_at ?? a.created_at)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
