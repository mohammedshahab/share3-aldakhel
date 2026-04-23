import Link from "next/link";
import Image from "next/image";
import { Play, Video } from "lucide-react";
import type { ArticleWithRefs } from "@/lib/types";

export function VideoSection({ items }: { items: ArticleWithRefs[] }) {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 font-[var(--font-cairo)] text-2xl font-black text-white md:text-3xl">
        <Video size={24} /> أخبار بالفيديو
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((a) => (
          <Link
            key={a.id}
            href={`/article/${a.slug}`}
            className="news-card group relative overflow-hidden rounded-xl border border-white/5 bg-[var(--color-panel)]"
          >
            <div className="relative aspect-video overflow-hidden">
              {a.cover_image ? (
                <Image
                  src={a.cover_image}
                  alt={a.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="news-card-img object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[var(--color-black-deep)]" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-red)] text-white shadow-lg">
                  <Play size={22} fill="currentColor" />
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="line-clamp-2 text-sm font-bold text-white">{a.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
