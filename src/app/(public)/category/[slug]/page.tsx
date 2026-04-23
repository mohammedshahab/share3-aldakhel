import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryTabs } from "@/components/CategoryTabs";
import { NewsCard } from "@/components/NewsCard";
import {
  getCategoryBySlug,
  listArticles,
  listCategories,
} from "@/lib/articles";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "breaking") {
    return {
      title: "الأخبار العاجلة",
      description: "أحدث الأخبار العاجلة لحظة بلحظة.",
    };
  }
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return { title: cat.name_ar, description: cat.description };
}

const PAGE_SIZE = 12;

export default async function CategoryPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const sp = await searchParams;

  const categories = listCategories();
  const isBreaking = slug === "breaking";

  const cat = isBreaking ? null : getCategoryBySlug(slug);
  if (!isBreaking && !cat) notFound();

  const sort = (sp.sort === "most_viewed" ? "most_viewed" : "newest") as
    | "newest"
    | "most_viewed";
  const page = Math.max(1, Number(sp.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const { rows, total } = listArticles({
    categorySlug: isBreaking ? undefined : slug,
    breaking: isBreaking || undefined,
    sort,
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (sort !== "newest") params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="badge"
            style={{
              background: isBreaking ? "#e63946" : (cat?.color ?? "#e63946"),
              color: "#fff",
            }}
          >
            {isBreaking ? "⚡" : cat?.icon}{" "}
            {isBreaking ? "الأخبار العاجلة" : cat?.name_ar}
          </span>
          <span className="text-xs text-[var(--color-gray-light)]">
            ({total} خبراً)
          </span>
        </div>
        <h1 className="font-[var(--font-cairo)] text-3xl font-black text-white md:text-4xl">
          {isBreaking ? "⚡ أخبار عاجلة" : cat?.name_ar}
        </h1>
        {!isBreaking && cat?.description ? (
          <p className="max-w-2xl text-sm text-[var(--color-gray-light)] md:text-base">
            {cat.description}
          </p>
        ) : null}
      </header>

      <CategoryTabs categories={categories} activeSlug={slug} />

      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--color-gray-light)]">ترتيب:</span>
        <Link
          href={pageHref(1).replace("?", "") === "" ? "." : "."}
          className={`rounded-md px-3 py-1 font-bold ${
            sort === "newest"
              ? "bg-[var(--color-red)] text-white"
              : "bg-white/5 text-white/80 hover:bg-white/10"
          }`}
        >
          الأحدث
        </Link>
        <Link
          href="?sort=most_viewed"
          className={`rounded-md px-3 py-1 font-bold ${
            sort === "most_viewed"
              ? "bg-[var(--color-red)] text-white"
              : "bg-white/5 text-white/80 hover:bg-white/10"
          }`}
        >
          الأكثر قراءة
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-gray-light)]">
          لا توجد أخبار في هذا التصنيف بعد.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="flex items-center justify-center gap-2 pt-4">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1) || "."}
              className="btn btn-ghost text-sm"
            >
              السابق
            </Link>
          ) : null}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p) || "."}
              className={`btn text-sm ${
                p === page ? "btn-red" : "btn-ghost"
              }`}
            >
              {p}
            </Link>
          ))}
          {page < totalPages ? (
            <Link
              href={pageHref(page + 1) || "."}
              className="btn btn-ghost text-sm"
            >
              التالي
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
