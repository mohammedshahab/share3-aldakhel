import { getCurrentUser } from "@/lib/auth";
import { listArticles, listCategories } from "@/lib/articles";
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { Topbar } from "@/components/dashboard/Topbar";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const categories = listCategories();
  const { rows } = listArticles({ limit: 50 });
  const { rows: drafts } = listArticles({ limit: 20, status: "draft" });
  const { rows: pending } = listArticles({ limit: 20, status: "pending" });

  const merged = [...rows, ...drafts, ...pending].filter(
    (a, i, arr) => arr.findIndex((b) => b.id === a.id) === i
  );

  return (
    <>
      <Topbar title="إدارة الأخبار" user={user} />
      <div className="flex-1 p-4 md:p-6">
        <ArticlesTable rows={merged} categories={categories} currentUser={user} />
      </div>
    </>
  );
}
