import { NextRequest, NextResponse } from "next/server";
import {
  deleteArticle,
  getArticleById,
  updateArticle,
  type UpdateArticleInput,
} from "@/lib/articles";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = getArticleById(Number(id));
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const articleId = Number(id);

  const current = getArticleById(articleId);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.role !== "admin" && current.author_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as UpdateArticleInput;
  const updated = updateArticle(articleId, body);
  return NextResponse.json({ article: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const articleId = Number(id);
  const current = getArticleById(articleId);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "admin" && current.author_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  deleteArticle(articleId);
  return NextResponse.json({ success: true });
}
