import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { countArticlesByAuthor, listUsers } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const rows = listUsers().map((u) => ({
    ...u,
    articles_count: countArticlesByAuthor(u.id),
  }));
  return NextResponse.json({ rows });
}
