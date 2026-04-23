"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
        تسجيل الدخول
      </h1>
      <p className="mb-6 text-sm text-[var(--color-gray-light)]">
        سجّل دخولك للوصول إلى لوحة التحكم ونشر الأخبار.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-white">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-white">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="field pl-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "إخفاء" : "إظهار"}
              className="absolute inset-y-0 left-2 flex items-center text-[var(--color-gray-light)] hover:text-white"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
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
          تسجيل الدخول
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link href="#" className="text-[var(--color-gray-light)] hover:text-white">
            نسيت كلمة المرور؟
          </Link>
          <Link
            href="/register"
            className="font-bold text-[var(--color-red)] hover:underline"
          >
            إنشاء حساب جديد
          </Link>
        </div>
      </form>

      <div className="mt-6 rounded-md border border-white/5 bg-[var(--color-black-deep)] p-3 text-xs text-[var(--color-gray-light)]">
        <div className="font-bold text-white">حسابات تجريبية:</div>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <div>
            مشرف: <span className="text-white">admin@share3.iq</span> /{" "}
            <span className="text-white">admin1234</span>
          </div>
          <div>
            محرر: <span className="text-white">editor@share3.iq</span> /{" "}
            <span className="text-white">editor1234</span>
          </div>
        </div>
      </div>
    </div>
  );
}
