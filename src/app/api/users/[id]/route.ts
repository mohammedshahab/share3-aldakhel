import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { setUserActive, updateUserRole } from "@/lib/users";
import type { UserRole } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const userId = Number(id);
  const body = (await req.json()) as { role?: UserRole; is_active?: boolean };
  if (body.role) updateUserRole(userId, body.role);
  if (typeof body.is_active === "boolean") setUserActive(userId, body.is_active);
  return NextResponse.json({ success: true });
}
