import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Share2, Star, Zap } from "lucide-react";
import { formatNumberAr, timeAgoAr } from "@/lib/utils";
import type { ArticleWithRefs } from "@/lib/types";

interface Props {
  article: ArticleWithRefs;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function NewsCard({ article, variant = "default", className = "" }: Props) {
  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="news-card flex items-center gap-3 rounded-lg border border-white/5 bg-[var(--color-panel)] p-2 hover:border-white/15"
      >
        <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-md md:w-32">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              sizes="128px"
              className="news-card-img object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[var(--color-black-deep)]" />
          )}
          {article.is_breaking ? (
            <span className="absolute right-1 top-1 badge badge-red">عاجل</span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <span
            className="badge mb-1"
            style={{
              background: `${article.category_color}22`,
              color: article.category_color,
            }}
          >
            {article.category_name}
          </span>
          <h3 className="line-clamp-2 font-[var(--font-cairo)] text-[14px] font-bold text-white md:text-[15px]">
            {article.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-[var(--color-gray-light)]">
            <Clock size={12} />
            <span>{timeAgoAr(article.published_at ?? article.created_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${article.slug}`}
      className={`news-card group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[var(--color-panel)] hover:border-white/15 ${className}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="news-card-img object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-black-deep)] p-4 text-center text-white">
            <span className="font-[var(--font-cairo)] text-lg font-bold">{article.title}</span>
          </div>
        )}

        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          <span
            className="badge"
            style={{ background: article.category_color, color: "#fff" }}
          >
            {article.category_name}
          </span>
          <div className="flex flex-col items-end gap-1">
            {article.is_breaking ? (
              <span className="badge badge-red live-dot">
                <Zap size={12} /> عاجل
              </span>
            ) : null}
            {article.is_featured ? (
              <span className="badge badge-gold">
                <Star size={12} fill="currentColor" /> مميز
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-[var(--font-cairo)] text-[17px] font-bold leading-snug text-white md:text-[18px]">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-[14px] text-[var(--color-gray-light)]">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-[var(--color-gray-light)]">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {timeAgoAr(article.published_at ?? article.created_at)}
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {formatNumberAr(article.views)}
            </span>
            <Share2 size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
