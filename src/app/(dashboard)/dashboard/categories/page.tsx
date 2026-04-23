import { getCurrentUser } from "@/lib/auth";
import { listArticles, listCategories } from "@/lib/articles";
import { Topbar } from "@/components/dashboard/Topbar";
import { formatNumberAr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const categories = listCategories();
  const rows = categories.map((c) => ({
    ...c,
    count: listArticles({ categorySlug: c.slug, limit: 1 }).total,
  }));

  return (
    <>
      <Topbar title="التصنيفات" user={user} />
      <div className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                    style={{ background: `${c.color}22`, color: c.color }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-[var(--font-cairo)] text-lg font-black text-white">
                      {c.name_ar}
                    </div>
                    <div className="text-xs text-[var(--color-gray-light)]">
                      /{c.slug}
                    </div>
                  </div>
                </div>
                <span
                  className="badge"
                  style={{ background: `${c.color}22`, color: c.color }}
                >
                  {formatNumberAr(c.count)} خبر
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--color-gray-light)]">
                {c.description || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
