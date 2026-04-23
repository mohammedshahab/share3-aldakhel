import { NextRequest, NextResponse } from "next/server";
import { hashPassword, setSessionCookie, signSession } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { name, email, password } = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "كل الحقول مطلوبة" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
      { status: 400 }
    );
  }
  const normalized = email.trim().toLowerCase();
  if (getUserByEmail(normalized)) {
    return NextResponse.json(
      { error: "البريد الإلكتروني مستخدم مسبقاً" },
      { status: 409 }
    );
  }
  const passwordHash = await hashPassword(password);
  const user = createUser({
    name,
    email: normalized,
    password_hash: passwordHash,
    role: "editor",
  });
  const token = await signSession({
    sub: String(user.id),
    uid: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
  await setSessionCookie(token);
  return NextResponse.json({ user }, { status: 201 });
}
