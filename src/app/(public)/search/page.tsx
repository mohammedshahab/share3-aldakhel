import { Search as SearchIcon } from "lucide-react";
import { NewsCard } from "@/components/NewsCard";
import { listArticles, listCategories } from "@/lib/articles";
import { CategoryTabs } from "@/components/CategoryTabs";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "بحث",
  description: "ابحث في أخبار شارع الداخل",
};

interface SearchParams {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function SearchPage({ searchParams }: SearchParams) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const category = sp.category ?? undefined;

  const categories = listCategories();
  const result = q
    ? listArticles({ search: q, categorySlug: category, limit: 30 })
    : { rows: [], total: 0 };

  return (
    <div className="space-y-8">
      <form
        action="/search"
        method="GET"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--color-panel)] p-3"
      >
        <SearchIcon size={20} className="text-[var(--color-gray-light)]" />
        <input
          name="q"
          defaultValue={q}
          placeholder="ابحث عن خبر..."
          className="field flex-1 border-transparent bg-transparent focus:border-transparent focus:shadow-none"
        />
        <button type="submit" className="btn btn-red">
          بحث
        </button>
      </form>

      <CategoryTabs categories={categories} activeSlug={category} />

      {q ? (
        <div className="text-sm text-[var(--color-gray-light)]">
          وُجد <span className="font-bold text-white">{result.total}</span> نتيجة لـ:{" "}
          <span className="font-bold text-[var(--color-red)]">«{q}»</span>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-8 text-center text-sm text-[var(--color-gray-light)]">
          اكتب كلمة للبحث في الأخبار.
        </div>
      )}

      {result.rows.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.rows.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      ) : q ? (
        <div className="py-12 text-center text-[var(--color-gray-light)]">
          لم يتم العثور على نتائج.
        </div>
      ) : null}
    </div>
  );
}
