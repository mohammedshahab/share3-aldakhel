import { NextResponse } from "next/server";
import { getMostRead } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ rows: getMostRead(10) });
}
