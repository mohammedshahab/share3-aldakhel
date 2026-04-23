"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldOff, UserRound, Loader2 } from "lucide-react";
import { formatArDate, formatNumberAr } from "@/lib/utils";
import type { PublicUser, UserRole } from "@/lib/types";
import { useToast } from "./Toast";

interface Props {
  users: (PublicUser & { articles_count: number })[];
  currentUserId: number;
}

export function UsersTable({ users: initial, currentUserId }: Props) {
  const [users, setUsers] = useState(initial);
  const [busy, setBusy] = useState<number | null>(null);
  const toast = useToast();
  const router = useRouter();

  async function update(id: number, patch: { role?: UserRole; is_active?: boolean }) {
    setBusy(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.push("error", data.error ?? "فشل التحديث");
        return;
      }
      setUsers((xs) =>
        xs.map((u) =>
          u.id === id
            ? {
                ...u,
                ...(patch.role !== undefined ? { role: patch.role } : {}),
                ...(patch.is_active !== undefined
                  ? { is_active: patch.is_active ? 1 : 0 }
                  : {}),
              }
            : u
        )
      );
      toast.push("success", "تم التحديث");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-[var(--color-panel)]">
      <table className="w-full text-right text-sm">
        <thead>
          <tr className="border-b border-white/5 text-[var(--color-gray-light)]">
            <th className="py-3 pr-4 font-medium">المحرر</th>
            <th className="py-3 font-medium">البريد</th>
            <th className="py-3 font-medium">عدد الأخبار</th>
            <th className="py-3 font-medium">انضم في</th>
            <th className="py-3 font-medium">الدور</th>
            <th className="py-3 font-medium">الحالة</th>
            <th className="py-3 pl-4 font-medium">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-white/5">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-red)] font-bold text-white">
                    {u.name.charAt(0)}
                  </div>
                  <span className="font-bold text-white">{u.name}</span>
                </div>
              </td>
              <td className="py-3 text-[var(--color-gray-light)]">{u.email}</td>
              <td className="py-3 text-[var(--color-gray-light)]">
                {formatNumberAr(u.articles_count)}
              </td>
              <td className="py-3 text-[var(--color-gray-light)]">
                {formatArDate(u.created_at)}
              </td>
              <td className="py-3">
                {u.role === "admin" ? (
                  <span className="badge" style={{ background: "#c9a84c", color: "#1a1a1a" }}>
                    مشرف
                  </span>
                ) : (
                  <span className="badge badge-gray">محرر</span>
                )}
              </td>
              <td className="py-3">
                {u.is_active ? (
                  <span className="badge badge-green">نشط</span>
                ) : (
                  <span className="badge badge-gray">موقوف</span>
                )}
              </td>
              <td className="py-3 pl-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      update(u.id, { role: u.role === "admin" ? "editor" : "admin" })
                    }
                    className="rounded p-1.5 text-white/70 hover:bg-white/5 hover:text-[var(--color-gold)]"
                    aria-label="تبديل الدور"
                    disabled={busy === u.id || u.id === currentUserId}
                  >
                    {busy === u.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : u.role === "admin" ? (
                      <UserRound size={14} />
                    ) : (
                      <Shield size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => update(u.id, { is_active: !u.is_active })}
                    className="rounded p-1.5 text-white/70 hover:bg-white/5 hover:text-[var(--color-red)]"
                    aria-label="تعليق"
                    disabled={busy === u.id || u.id === currentUserId}
                  >
                    <ShieldOff size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
