import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Eye,
  Link as LinkIcon,
  Send,
  MessageCircle,
  Tag,
  Star,
  Zap,
  Share2,
} from "lucide-react";
import {
  getArticleBySlug,
  incrementViews,
  listArticles,
  getMostRead,
} from "@/lib/articles";
import { NewsCard } from "@/components/NewsCard";
import { MostRead } from "@/components/MostRead";
import {
  formatArDate,
  formatArTime,
  formatNumberAr,
  readingTimeAr,
} from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.meta_description ?? article.excerpt,
    openGraph: {
      title: article.title,
      description: article.meta_description ?? article.excerpt,
      images: article.cover_image ? [{ url: article.cover_image }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  incrementViews(article.id);

  const { rows: related } = listArticles({
    categorySlug: article.category_slug,
    limit: 4,
    excludeId: article.id,
  });
  const mostRead = getMostRead(5);

  const tags = article.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <article className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <nav className="mb-4 flex items-center gap-1 text-xs text-[var(--color-gray-light)]">
          <Link href="/" className="hover:text-white">
            الرئيسية
          </Link>
          <ChevronLeft size={12} className="rotate-180" />
          <Link
            href={`/category/${article.category_slug}`}
            className="hover:text-white"
          >
            {article.category_name}
          </Link>
          <ChevronLeft size={12} className="rotate-180" />
          <span className="line-clamp-1 text-white">{article.title}</span>
        </nav>

        <div className="mb-3 flex items-center gap-2">
          <span
            className="badge"
            style={{ background: article.category_color, color: "#fff" }}
          >
            {article.category_name}
          </span>
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

        <h1 className="font-[var(--font-cairo)] text-[30px] font-black leading-tight text-white md:text-[42px]">
          {article.title}
        </h1>
        {article.subtitle ? (
          <p className="mt-3 font-[var(--font-tajawal)] text-lg leading-relaxed text-[var(--color-gray-light)] md:text-xl">
            {article.subtitle}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-white/5 py-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-red)] font-bold text-white">
              {article.author_name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-white">{article.author_name}</div>
              <div className="text-xs text-[var(--color-gray-light)]">
                {formatArDate(article.published_at ?? article.created_at)} ·{" "}
                {formatArTime(article.published_at ?? article.created_at)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--color-gray-light)]">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              وقت القراءة: {readingTimeAr(article.content)}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {formatNumberAr(article.views)} مشاهدة
            </span>
          </div>
        </div>

        <ShareBar title={article.title} />

        {article.cover_image ? (
          <figure className="my-6 overflow-hidden rounded-xl">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
                priority
              />
            </div>
            {article.image_caption ? (
              <figcaption className="mt-2 text-center text-xs text-[var(--color-gray-light)]">
                {article.image_caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div
          className="article-body mx-auto max-w-[750px]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {tags.length > 0 ? (
          <div className="mx-auto mt-8 flex max-w-[750px] flex-wrap items-center gap-2">
            <Tag size={14} className="text-[var(--color-gray-light)]" />
            {tags.map((t) => (
              <Link
                key={t}
                href={`/search?q=${encodeURIComponent(t)}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/80 hover:border-[var(--color-red)] hover:text-white"
              >
                #{t}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mx-auto mt-8 max-w-[750px]">
          <ShareBar title={article.title} />
        </div>

        {related.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 font-[var(--font-cairo)] text-2xl font-black text-white">
              أخبار ذات صلة
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((r) => (
                <NewsCard key={r.id} article={r} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <aside className="space-y-6">
        <MostRead items={mostRead} />
        {related.length > 0 ? (
          <div className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-5">
            <h3 className="mb-4 font-[var(--font-cairo)] text-lg font-black text-white">
              الأخبار ذات الصلة
            </h3>
            <div className="space-y-3">
              {related.slice(0, 2).map((r) => (
                <NewsCard key={r.id} article={r} variant="compact" />
              ))}
            </div>
          </div>
        ) : null}
        <div className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-5 text-center">
          <div className="text-xs text-[var(--color-gray-light)]">مساحة إعلانية</div>
          <div className="mt-3 flex h-40 items-center justify-center rounded-lg bg-[var(--color-black-deep)] text-[var(--color-gray)]">
            إعلانك هنا
          </div>
        </div>
      </aside>
    </article>
  );
}

function ShareBar({ title }: { title: string }) {
  const q = encodeURIComponent(title);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--color-gray-light)]">مشاركة:</span>
      <a
        href={`https://wa.me/?text=${q}`}
        target="_blank"
        rel="noreferrer"
        aria-label="واتساب"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/80 hover:bg-[#25D366] hover:text-white"
      >
        <MessageCircle size={16} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=&quote=${q}`}
        target="_blank"
        rel="noreferrer"
        aria-label="فيسبوك"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/80 hover:bg-[#1877F2] hover:text-white"
      >
        <Share2 size={16} />
      </a>
      <a
        href={`https://t.me/share/url?url=&text=${q}`}
        target="_blank"
        rel="noreferrer"
        aria-label="تيليغرام"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/80 hover:bg-[#0088cc] hover:text-white"
      >
        <Send size={16} />
      </a>
      <button
        type="button"
        aria-label="نسخ الرابط"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/80 hover:bg-[var(--color-gold)] hover:text-black"
      >
        <LinkIcon size={16} />
      </button>
    </div>
  );
}
