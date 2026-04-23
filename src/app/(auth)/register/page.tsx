"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password !== confirm) {
      setErr("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "حدث خطأ");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--color-panel)] p-7 shadow-xl">
      <h1 className="mb-2 font-[var(--font-cairo)] text-2xl font-black text-white">
        إنشاء حساب جديد
      </h1>
      <p className="mb-6 text-sm text-[var(--color-gray-light)]">
        أنشئ حساب محرر لنشر الأخبار على شارع الداخل.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-white">
            الاسم الكامل
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-white">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-white">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-white">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="field"
            />
          </div>
        </div>

        {err ? (
          <div className="rounded-md border border-[var(--color-red)]/30 bg-[var(--color-red)]/10 p-3 text-sm text-[var(--color-red)]">
            {err}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-red w-full disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : null}
          إنشاء حساب
        </button>

        <div className="text-center text-sm">
          <span className="text-[var(--color-gray-light)]">لديك حساب؟ </span>
          <Link href="/login" className="font-bold text-[var(--color-red)] hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </form>
    </div>
  );
}
