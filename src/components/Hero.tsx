import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { formatNumberAr, timeAgoAr } from "@/lib/utils";
import type { ArticleWithRefs } from "@/lib/types";
import { NewsCard } from "./NewsCard";

interface Props {
  main: ArticleWithRefs;
  side: ArticleWithRefs[];
}

export function Hero({ main, side }: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <Link
        href={`/article/${main.slug}`}
        className="news-card group relative col-span-3 flex min-h-[380px] overflow-hidden rounded-2xl md:min-h-[440px] lg:min-h-[520px]"
      >
        {main.cover_image ? (
          <Image
            src={main.cover_image}
            alt={main.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="news-card-img object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[var(--color-black-deep)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
        <div className="relative mt-auto w-full p-5 md:p-8">
          <span
            className="badge mb-3"
            style={{ background: main.category_color, color: "#fff" }}
          >
            {main.category_name}
          </span>
          <h1 className="font-[var(--font-cairo)] text-[24px] font-black leading-snug text-white md:text-[32px] lg:text-[36px]">
            {main.title}
          </h1>
          {main.subtitle ? (
            <p className="mt-3 line-clamp-2 max-w-3xl text-sm text-white/75 md:text-base">
              {main.subtitle}
            </p>
          ) : null}
          <div className="mt-4 flex items-center gap-5 text-xs text-white/70 md:text-sm">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {timeAgoAr(main.published_at ?? main.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {formatNumberAr(main.views)} مشاهدة
            </span>
          </div>
        </div>
      </Link>

      <div className="col-span-2 grid gap-3">
        {side.slice(0, 4).map((a) => (
          <NewsCard key={a.id} article={a} variant="compact" />
        ))}
      </div>
    </section>
  );
}
