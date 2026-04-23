import Link from "next/link";
import Image from "next/image";
import { Flame } from "lucide-react";
import { formatNumberAr } from "@/lib/utils";
import type { ArticleWithRefs } from "@/lib/types";

export function MostRead({ items }: { items: ArticleWithRefs[] }) {
  if (!items.length) return null;
  return (
    <aside className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-5">
      <h3 className="mb-4 flex items-center gap-2 font-[var(--font-cairo)] text-xl font-black text-[var(--color-gold)]">
        <Flame size={20} />
        الأكثر قراءة
      </h3>
      <ol className="divide-y divide-white/5">
        {items.map((a, i) => (
          <li key={a.id} className="flex items-center gap-3 py-3">
            <span className="w-6 shrink-0 font-[var(--font-cairo)] text-2xl font-black text-[var(--color-gold)]">
              {i + 1}
            </span>
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              {a.cover_image ? (
                <Image
                  src={a.cover_image}
                  alt={a.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[var(--color-black-deep)]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/article/${a.slug}`}
                className="line-clamp-2 text-[13px] font-bold text-white hover:text-[var(--color-red)]"
              >
                {a.title}
              </Link>
              <span className="text-[11px] text-[var(--color-gray-light)]">
                {formatNumberAr(a.views)} مشاهدة
              </span>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
