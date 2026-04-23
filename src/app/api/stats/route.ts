import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getStats } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getStats());
}
