import { NextResponse } from "next/server";
import { listArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET() {
  const { rows } = listArticles({ breaking: true, limit: 10 });
  return NextResponse.json({ rows });
}
