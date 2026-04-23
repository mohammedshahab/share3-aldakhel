import { getDb } from "./db";
import type { Article, ArticleStatus, ArticleWithRefs, Category } from "./types";

const ARTICLE_SELECT = `
  a.*,
  c.name_ar AS category_name,
  c.slug    AS category_slug,
  c.color   AS category_color,
  u.name    AS author_name,
  u.avatar  AS author_avatar
`;

const ARTICLE_JOIN = `
  FROM articles a
  INNER JOIN categories c ON c.id = a.category_id
  INNER JOIN users u      ON u.id = a.author_id
`;

export interface ListArticlesParams {
  categorySlug?: string;
  status?: ArticleStatus;
  breaking?: boolean;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: "newest" | "most_viewed";
  authorId?: number;
  excludeId?: number;
}

export function listArticles(
  p: ListArticlesParams = {}
): { rows: ArticleWithRefs[]; total: number } {
  const db = getDb();
  const where: string[] = ["1=1"];
  const args: unknown[] = [];

  if (p.status) {
    where.push("a.status = ?");
    args.push(p.status);
  } else {
    where.push("a.status = 'published'");
  }
  if (p.categorySlug) {
    where.push("c.slug = ?");
    args.push(p.categorySlug);
  }
  if (p.breaking) where.push("a.is_breaking = 1");
  if (p.featured) where.push("a.is_featured = 1");
  if (p.search) {
    where.push("(a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ? OR a.tags LIKE ?)");
    const q = `%${p.search}%`;
    args.push(q, q, q, q);
  }
  if (p.authorId) {
    where.push("a.author_id = ?");
    args.push(p.authorId);
  }
  if (p.excludeId) {
    where.push("a.id != ?");
    args.push(p.excludeId);
  }

  const orderBy =
    p.sort === "most_viewed"
      ? "a.views DESC, a.published_at DESC"
      : "COALESCE(a.published_at, a.created_at) DESC";

  const limit = Math.min(Math.max(1, p.limit ?? 12), 60);
  const offset = Math.max(0, p.offset ?? 0);

  const sql = `
    SELECT ${ARTICLE_SELECT}
    ${ARTICLE_JOIN}
    WHERE ${where.join(" AND ")}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;
  const rows = db.prepare(sql).all(...args, limit, offset) as ArticleWithRefs[];

  const countSql = `
    SELECT COUNT(*) AS total
    ${ARTICLE_JOIN}
    WHERE ${where.join(" AND ")}
  `;
  const { total } = db.prepare(countSql).get(...args) as { total: number };

  return { rows, total };
}

export function getArticleBySlug(slug: string): ArticleWithRefs | null {
  const sql = `
    SELECT ${ARTICLE_SELECT}
    ${ARTICLE_JOIN}
    WHERE a.slug = ?
  `;
  return (getDb().prepare(sql).get(slug) as ArticleWithRefs) ?? null;
}

export function getArticleById(id: number): ArticleWithRefs | null {
  const sql = `
    SELECT ${ARTICLE_SELECT}
    ${ARTICLE_JOIN}
    WHERE a.id = ?
  `;
  return (getDb().prepare(sql).get(id) as ArticleWithRefs) ?? null;
}

export function incrementViews(id: number) {
  getDb().prepare("UPDATE articles SET views = views + 1 WHERE id = ?").run(id);
}

export function getMostRead(limit = 10): ArticleWithRefs[] {
  const sql = `
    SELECT ${ARTICLE_SELECT}
    ${ARTICLE_JOIN}
    WHERE a.status = 'published'
    ORDER BY a.views DESC, a.published_at DESC
    LIMIT ?
  `;
  return getDb().prepare(sql).all(limit) as ArticleWithRefs[];
}

export function listCategories(): Category[] {
  return getDb().prepare("SELECT * FROM categories ORDER BY id ASC").all() as Category[];
}

export function getCategoryBySlug(slug: string): Category | null {
  return (
    (getDb()
      .prepare("SELECT * FROM categories WHERE slug = ?")
      .get(slug) as Category | undefined) ?? null
  );
}

export interface CreateArticleInput {
  title: string;
  subtitle?: string | null;
  content: string;
  excerpt?: string;
  category_id: number;
  status: ArticleStatus;
  is_breaking?: boolean;
  is_featured?: boolean;
  cover_image?: string | null;
  image_caption?: string | null;
  tags: string;
  author_id: number;
  slug: string;
  meta_description?: string | null;
}

export function createArticle(input: CreateArticleInput): Article {
  const db = getDb();
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const published = input.status === "published" ? now : null;
  const info = db
    .prepare(
      `INSERT INTO articles (slug, title, subtitle, content, excerpt, category_id, status, is_breaking, is_featured, cover_image, image_caption, tags, author_id, views, meta_description, created_at, updated_at, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`
    )
    .run(
      input.slug,
      input.title,
      input.subtitle ?? null,
      input.content,
      input.excerpt ?? "",
      input.category_id,
      input.status,
      input.is_breaking ? 1 : 0,
      input.is_featured ? 1 : 0,
      input.cover_image ?? null,
      input.image_caption ?? null,
      input.tags,
      input.author_id,
      input.meta_description ?? null,
      now,
      now,
      published
    );
  return db
    .prepare("SELECT * FROM articles WHERE id = ?")
    .get(info.lastInsertRowid) as Article;
}

export type UpdateArticleInput = Partial<Omit<CreateArticleInput, "author_id">>;

export function updateArticle(id: number, patch: UpdateArticleInput): Article | null {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as
    | Article
    | undefined;
  if (!existing) return null;

  const fields: string[] = [];
  const values: unknown[] = [];

  const simple: (keyof UpdateArticleInput)[] = [
    "slug",
    "title",
    "subtitle",
    "content",
    "excerpt",
    "category_id",
    "status",
    "cover_image",
    "image_caption",
    "tags",
    "meta_description",
  ];
  for (const key of simple) {
    if (patch[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(patch[key] ?? null);
    }
  }
  if (patch.is_breaking !== undefined) {
    fields.push("is_breaking = ?");
    values.push(patch.is_breaking ? 1 : 0);
  }
  if (patch.is_featured !== undefined) {
    fields.push("is_featured = ?");
    values.push(patch.is_featured ? 1 : 0);
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  fields.push("updated_at = ?");
  values.push(now);

  if (patch.status === "published" && !existing.published_at) {
    fields.push("published_at = ?");
    values.push(now);
  }

  if (fields.length === 0) return existing;

  values.push(id);
  db.prepare(`UPDATE articles SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as Article;
}

export function deleteArticle(id: number) {
  getDb().prepare("DELETE FROM articles WHERE id = ?").run(id);
}

export function getStats() {
  const db = getDb();
  const totalArticles = (
    db.prepare("SELECT COUNT(*) AS c FROM articles WHERE status = 'published'").get() as {
      c: number;
    }
  ).c;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const totalViewsToday = (
    db
      .prepare(
        `SELECT COALESCE(SUM(views), 0) AS s FROM articles WHERE COALESCE(published_at, created_at) >= ?`
      )
      .get(todayStart.toISOString().replace("T", " ").slice(0, 19)) as { s: number }
  ).s;
  const pending = (
    db.prepare("SELECT COUNT(*) AS c FROM articles WHERE status = 'pending'").get() as {
      c: number;
    }
  ).c;
  const totalViews = (
    db.prepare("SELECT COALESCE(SUM(views),0) AS s FROM articles").get() as { s: number }
  ).s;
  const editors = (
    db
      .prepare("SELECT COUNT(*) AS c FROM users WHERE is_active = 1")
      .get() as { c: number }
  ).c;
  const articlesByDay = db
    .prepare(
      `SELECT DATE(COALESCE(published_at, created_at)) AS day,
              COUNT(*) AS total,
              SUM(CASE WHEN is_breaking = 1 THEN 1 ELSE 0 END) AS breaking,
              SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) AS featured
       FROM articles
       WHERE DATE(COALESCE(published_at, created_at)) >= DATE('now', '-30 day')
       GROUP BY day
       ORDER BY day ASC`
    )
    .all() as { day: string; total: number; breaking: number; featured: number }[];

  return {
    totalArticles,
    totalViewsToday,
    totalViews,
    pending,
    editors,
    articlesByDay,
  };
}
