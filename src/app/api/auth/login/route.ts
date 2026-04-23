import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as {
    email?: string;
    password?: string;
  };
  if (!email || !password) {
    return NextResponse.json(
      { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
      { status: 400 }
    );
  }
  const user = getUserByEmail(email.trim().toLowerCase());
  if (!user || !user.is_active) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }
  const token = await signSession({
    sub: String(user.id),
    uid: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
  await setSessionCookie(token);
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
}
