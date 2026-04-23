import { getCurrentUser } from "@/lib/auth";
import { listCategories } from "@/lib/articles";
import { ArticleForm } from "@/components/dashboard/ArticleForm";
import { Topbar } from "@/components/dashboard/Topbar";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const categories = listCategories();
  return (
    <>
      <Topbar title="نشر خبر جديد" user={user} />
      <div className="flex-1 p-4 md:p-6">
        <ArticleForm categories={categories} />
      </div>
    </>
  );
}
