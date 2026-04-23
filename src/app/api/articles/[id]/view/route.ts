import { NextResponse } from "next/server";
import { incrementViews } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  incrementViews(Number(id));
  return NextResponse.json({ success: true });
}
