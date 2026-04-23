"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  ExternalLink,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import { formatArDate, formatNumberAr } from "@/lib/utils";
import type {
  ArticleStatus,
  ArticleWithRefs,
  Category,
  PublicUser,
} from "@/lib/types";
import { useToast } from "./Toast";

interface Props {
  rows: ArticleWithRefs[];
  categories: Category[];
  currentUser: PublicUser;
}

export function ArticlesTable({ rows: initialRows, categories, currentUser }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const toast = useToast();
  const router = useRouter();

  const filtered = useMemo(() => {
    return rows.filter((a) => {
      if (q && !a.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (category && a.category_slug !== category) return false;
      if (status && a.status !== status) return false;
      return true;
    });
  }, [rows, q, category, status]);

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  }

  function toggle(id: number) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function deleteOne(id: number) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.push("error", data.error ?? "فشل الحذف");
        return;
      }
      setRows((xs) => xs.filter((a) => a.id !== id));
      setSelected((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
      toast.push("success", "تم حذف الخبر");
    } finally {
      setLoadingId(null);
      setConfirmDel(null);
    }
  }

  async function deleteSelected() {
    for (const id of selected) {
      await fetch(`/api/articles/${id}`, { method: "DELETE" });
    }
    setRows((xs) => xs.filter((a) => !selected.has(a.id)));
    setSelected(new Set());
    setBulkDelete(false);
    toast.push("success", "تم حذف الأخبار المحددة");
    router.refresh();
  }

  const allChecked =
    filtered.length > 0 && filtered.every((a) => selected.has(a.id));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-[var(--color-panel)] p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-light)]"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في العناوين..."
            className="field pr-9 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="field text-sm"
        >
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name_ar}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field text-sm"
        >
          <option value="">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="pending">بانتظار المراجعة</option>
        </select>
        <Link href="/dashboard/articles/new" className="btn btn-red text-sm">
          + خبر جديد
        </Link>
      </div>

      {selected.size > 0 ? (
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-red)]/30 bg-[var(--color-red)]/10 px-4 py-2 text-sm">
          <span className="font-bold text-white">
            تم تحديد {formatNumberAr(selected.size)} أخبار
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setBulkDelete(true)}
              className="btn btn-red text-xs"
            >
              <Trash2 size={12} /> حذف المحدد
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="btn btn-ghost text-xs"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-[var(--color-panel)]">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[var(--color-gray-light)]">
              <th className="py-3 pr-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="accent-[var(--color-red)]"
                />
              </th>
              <th className="py-3 pr-3 font-medium">العنوان</th>
              <th className="py-3 font-medium">التصنيف</th>
              <th className="py-3 font-medium">المحرر</th>
              <th className="py-3 font-medium">التاريخ</th>
              <th className="py-3 font-medium">الحالة</th>
              <th className="py-3 font-medium">المشاهدات</th>
              <th className="py-3 pl-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const canDelete = currentUser.role === "admin" || a.author_id === currentUser.id;
              return (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="py-3 pr-3">
                    <input
                      type="checkbox"
                      checked={selected.has(a.id)}
                      onChange={() => toggle(a.id)}
                      className="accent-[var(--color-red)]"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <Link
                      href={`/dashboard/articles/${a.id}/edit`}
                      className="line-clamp-1 font-bold text-white hover:text-[var(--color-red)]"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="py-3">
                    <span
                      className="badge"
                      style={{
                        background: `${a.category_color}22`,
                        color: a.category_color,
                      }}
                    >
                      {a.category_name}
                    </span>
                  </td>
                  <td className="py-3 text-[var(--color-gray-light)]">
                    {a.author_name}
                  </td>
                  <td className="py-3 text-[var(--color-gray-light)]">
                    {formatArDate(a.published_at ?? a.created_at)}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="py-3 text-[var(--color-gray-light)]">
                    {formatNumberAr(a.views)}
                  </td>
                  <td className="py-3 pl-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/article/${a.slug}`}
                        className="rounded p-1.5 text-white/70 hover:bg-white/5 hover:text-white"
                        aria-label="معاينة"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/dashboard/articles/${a.id}/edit`}
                        className="rounded p-1.5 text-white/70 hover:bg-white/5 hover:text-[var(--color-gold)]"
                        aria-label="تعديل"
                      >
                        <Edit size={14} />
                      </Link>
                      {canDelete ? (
                        <button
                          onClick={() => setConfirmDel(a.id)}
                          className="rounded p-1.5 text-white/70 hover:bg-white/5 hover:text-[var(--color-red)]"
                          aria-label="حذف"
                          disabled={loadingId === a.id}
                        >
                          {loadingId === a.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-[var(--color-gray-light)]">
                  لا توجد أخبار تطابق معايير البحث.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {confirmDel !== null ? (
        <ConfirmDialog
          title="حذف الخبر"
          message="هل أنت متأكد من حذف هذا الخبر؟ لا يمكن التراجع عن هذا الإجراء."
          onCancel={() => setConfirmDel(null)}
          onConfirm={() => void deleteOne(confirmDel)}
        />
      ) : null}

      {bulkDelete ? (
        <ConfirmDialog
          title="حذف الأخبار المحددة"
          message={`هل أنت متأكد من حذف ${selected.size} أخبار؟ لا يمكن التراجع.`}
          onCancel={() => setBulkDelete(false)}
          onConfirm={() => void deleteSelected()}
        />
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  if (status === "published")
    return <span className="badge badge-green">منشور</span>;
  if (status === "pending")
    return <span className="badge badge-gold">بانتظار المراجعة</span>;
  return <span className="badge badge-gray">مسودة</span>;
}

function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[var(--color-panel)] p-6 shadow-2xl"
      >
        <h3 className="font-[var(--font-cairo)] text-lg font-black text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-gray-light)]">{message}</p>
        <div className="mt-6 flex gap-2">
          <button onClick={onConfirm} className="btn btn-red flex-1">
            نعم، احذف
          </button>
          <button onClick={onCancel} className="btn btn-ghost flex-1">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
