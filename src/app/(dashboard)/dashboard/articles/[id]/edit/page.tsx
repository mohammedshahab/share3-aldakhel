import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getArticleById, listCategories } from "@/lib/articles";
import { ArticleForm } from "@/components/dashboard/ArticleForm";
import { Topbar } from "@/components/dashboard/Topbar";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  const article = getArticleById(Number(id));
  if (!article) notFound();
  if (user.role !== "admin" && article.author_id !== user.id) {
    redirect("/dashboard/articles");
  }
  const categories = listCategories();

  return (
    <>
      <Topbar title="تعديل الخبر" user={user} />
      <div className="flex-1 p-4 md:p-6">
        <ArticleForm
          categories={categories}
          initial={{
            id: article.id,
            title: article.title,
            subtitle: article.subtitle ?? "",
            content: article.content,
            excerpt: article.excerpt,
            category_id: article.category_id,
            status: article.status,
            is_breaking: !!article.is_breaking,
            is_featured: !!article.is_featured,
            cover_image: article.cover_image,
            image_caption: article.image_caption ?? "",
            tags: article.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            meta_description: article.meta_description ?? "",
          }}
        />
      </div>
    </>
  );
}
