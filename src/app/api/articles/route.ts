import { NextRequest, NextResponse } from "next/server";
import {
  createArticle,
  listArticles,
  type CreateArticleInput,
} from "@/lib/articles";
import { getCurrentUser } from "@/lib/auth";
import { slugify, excerptFromHtml } from "@/lib/utils";
import type { ArticleStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const result = listArticles({
    categorySlug: sp.get("category") ?? undefined,
    search: sp.get("q") ?? undefined,
    breaking: sp.get("breaking") === "1",
    featured: sp.get("featured") === "1",
    limit: sp.get("limit") ? Number(sp.get("limit")) : 12,
    offset: sp.get("offset") ? Number(sp.get("offset")) : 0,
    sort: (sp.get("sort") as "newest" | "most_viewed") ?? "newest",
    status: (sp.get("status") as ArticleStatus) ?? undefined,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Partial<CreateArticleInput>;

  if (!body.title || !body.content || !body.category_id) {
    return NextResponse.json(
      { error: "العنوان والمحتوى والتصنيف حقول مطلوبة" },
      { status: 400 }
    );
  }

  const status: ArticleStatus = (body.status as ArticleStatus) ?? "draft";
  const slug = body.slug && body.slug.length > 0 ? body.slug : slugify(body.title);
  const excerpt =
    body.excerpt && body.excerpt.length > 0 ? body.excerpt : excerptFromHtml(body.content, 220);

  const created = createArticle({
    title: body.title,
    subtitle: body.subtitle ?? null,
    content: body.content,
    excerpt,
    category_id: Number(body.category_id),
    status,
    is_breaking: Boolean(body.is_breaking),
    is_featured: Boolean(body.is_featured),
    cover_image: body.cover_image ?? null,
    image_caption: body.image_caption ?? null,
    tags: body.tags ?? "",
    meta_description: body.meta_description ?? null,
    author_id: user.id,
    slug,
  });

  return NextResponse.json({ article: created }, { status: 201 });
}
