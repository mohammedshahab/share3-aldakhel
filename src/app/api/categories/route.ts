import { NextResponse } from "next/server";
import { listCategories } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ rows: listCategories() });
}
