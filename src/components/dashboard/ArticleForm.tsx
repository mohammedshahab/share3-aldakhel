"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Save, Send, Loader2 } from "lucide-react";
import { ArticleEditor } from "./ArticleEditor";
import { TagInput } from "./TagInput";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "./Toast";
import type { ArticleStatus, Category } from "@/lib/types";

export interface ArticleFormValue {
  id?: number;
  title: string;
  subtitle: string;
  content: string;
  excerpt: string;
  category_id: number | null;
  status: ArticleStatus;
  is_breaking: boolean;
  is_featured: boolean;
  cover_image: string | null;
  image_caption: string;
  tags: string[];
  meta_description: string;
}

interface Props {
  categories: Category[];
  initial?: Partial<ArticleFormValue>;
}

const DEFAULT: ArticleFormValue = {
  title: "",
  subtitle: "",
  content: "",
  excerpt: "",
  category_id: null,
  status: "draft",
  is_breaking: false,
  is_featured: false,
  cover_image: null,
  image_caption: "",
  tags: [],
  meta_description: "",
};

export function ArticleForm({ categories, initial }: Props) {
  const router = useRouter();
  const toast = useToast();

  const [value, setValue] = useState<ArticleFormValue>({
    ...DEFAULT,
    ...initial,
    category_id: initial?.category_id ?? categories[0]?.id ?? null,
  });
  const [saving, setSaving] = useState<ArticleStatus | "draft-auto" | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const update = <K extends keyof ArticleFormValue>(key: K, v: ArticleFormValue[K]) =>
    setValue((s) => ({ ...s, [key]: v }));

  const wordCount = useMemo(() => {
    const text = value.content.replace(/<[^>]*>/g, " ").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [value.content]);
  const charCount = useMemo(() => {
    const text = value.content.replace(/<[^>]*>/g, "").trim();
    return text.length;
  }, [value.content]);

  async function save(status: ArticleStatus, opts?: { silent?: boolean }) {
    if (!value.title.trim()) {
      toast.push("error", "يرجى إدخال عنوان الخبر");
      return;
    }
    if (!value.category_id) {
      toast.push("error", "اختر تصنيفاً");
      return;
    }
    if (charCount < 100 && status === "published") {
      toast.push("error", "يجب أن يكون المحتوى 100 حرف على الأقل للنشر");
      return;
    }

    setSaving(opts?.silent ? "draft-auto" : status);
    try {
      const payload = {
        title: value.title,
        subtitle: value.subtitle || null,
        content: value.content,
        excerpt: value.excerpt,
        category_id: value.category_id,
        status,
        is_breaking: value.is_breaking,
        is_featured: value.is_featured,
        cover_image: value.cover_image,
        image_caption: value.image_caption || null,
        tags: value.tags.join(","),
        meta_description: value.meta_description || null,
      };

      const url = value.id ? `/api/articles/${value.id}` : "/api/articles";
      const method = value.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.push("error", data.error ?? "حدث خطأ أثناء الحفظ");
        return;
      }
      const newId: number | undefined = data.article?.id ?? value.id;
      if (newId && !value.id) setValue((s) => ({ ...s, id: newId }));
      setLastSaved(new Date());
      if (!opts?.silent) {
        toast.push(
          "success",
          status === "published"
            ? "تم نشر الخبر بنجاح"
            : status === "pending"
              ? "تم إرسال الخبر للمراجعة"
              : "تم حفظ المسودة"
        );
        if (status === "published" && data.article?.slug) {
          router.push(`/article/${data.article.slug}`);
        }
      }
    } finally {
      setSaving(null);
    }
  }

  // Autosave every 60s if we have an id and some content
  useEffect(() => {
    if (autosaveTimer.current) clearInterval(autosaveTimer.current);
    autosaveTimer.current = setInterval(() => {
      if (value.id && value.title.trim() && value.content.trim()) {
        void save("draft", { silent: true });
      }
    }, 60000);
    return () => {
      if (autosaveTimer.current) clearInterval(autosaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.id, value.title, value.content]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <input
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="عنوان الخبر الرئيسي..."
          className="w-full border-0 bg-transparent px-1 py-2 font-[var(--font-cairo)] text-[28px] font-black text-white placeholder-[#555] outline-none md:text-[32px]"
        />
        <div className="text-xs text-[var(--color-gray-light)]">
          {value.title.length} حرف
        </div>
        <input
          value={value.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          placeholder="عنوان فرعي للخبر (اختياري)..."
          className="w-full border-0 bg-transparent px-1 py-2 font-[var(--font-tajawal)] text-xl text-[var(--color-gray-light)] placeholder-[#555] outline-none"
        />

        <ArticleEditor
          value={value.content}
          onChange={(html) => update("content", html)}
        />

        <div className="flex items-center justify-between text-xs text-[var(--color-gray-light)]">
          <span>{wordCount} كلمة · {charCount} حرف</span>
          {charCount < 150 ? (
            <span className="text-[var(--color-gold)]">
              الحد الأدنى المقترح 150 حرفاً
            </span>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-white">
            وسوم الموضوع
          </label>
          <TagInput value={value.tags} onChange={(tags) => update("tags", tags)} />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="space-y-2 rounded-xl border border-white/5 bg-[var(--color-panel)] p-4">
          <button
            type="button"
            disabled={saving !== null}
            onClick={() => void save("published")}
            className="btn btn-red w-full disabled:opacity-60"
          >
            {saving === "published" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Send size={16} />
            )}
            نشر الخبر الآن
          </button>
          <button
            type="button"
            disabled={saving !== null}
            onClick={() => void save("draft")}
            className="btn btn-ghost w-full disabled:opacity-60"
          >
            {saving === "draft" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            حفظ كمسودة
          </button>
          <button
            type="button"
            disabled={saving !== null}
            onClick={() => void save("pending")}
            className="btn btn-outline-red w-full disabled:opacity-60"
          >
            <Eye size={16} />
            إرسال للمراجعة
          </button>
          {lastSaved ? (
            <div className="pt-1 text-center text-[11px] text-[var(--color-gray-light)]">
              حُفظت تلقائياً — {lastSaved.toLocaleTimeString("ar-EG")}
            </div>
          ) : null}
        </div>

        <div className="space-y-3 rounded-xl border border-white/5 bg-[var(--color-panel)] p-4">
          <h4 className="font-[var(--font-cairo)] text-sm font-black text-white">
            التصنيف
          </h4>
          <select
            value={value.category_id ?? ""}
            onChange={(e) => update("category_id", Number(e.target.value))}
            className="field"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name_ar}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={value.is_breaking}
              onChange={(e) => update("is_breaking", e.target.checked)}
              className="accent-[var(--color-red)]"
            />
            خبر عاجل ⚡
          </label>
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={value.is_featured}
              onChange={(e) => update("is_featured", e.target.checked)}
              className="accent-[var(--color-gold)]"
            />
            خبر مميز ⭐
          </label>
        </div>

        <div className="space-y-3 rounded-xl border border-white/5 bg-[var(--color-panel)] p-4">
          <h4 className="font-[var(--font-cairo)] text-sm font-black text-white">
            الصورة الرئيسية
          </h4>
          <ImageUpload
            value={value.cover_image}
            onChange={(url) => update("cover_image", url)}
          />
          <input
            value={value.image_caption}
            onChange={(e) => update("image_caption", e.target.value)}
            placeholder="تعليق الصورة (اختياري)"
            className="field text-sm"
          />
        </div>

        <div className="space-y-3 rounded-xl border border-white/5 bg-[var(--color-panel)] p-4">
          <h4 className="font-[var(--font-cairo)] text-sm font-black text-white">
            تحسين محركات البحث
          </h4>
          <textarea
            value={value.meta_description}
            onChange={(e) => update("meta_description", e.target.value.slice(0, 160))}
            rows={3}
            placeholder="وصف تعريفي للخبر (حتى 160 حرف)"
            className="field resize-none text-sm"
          />
          <div className="text-[11px] text-[var(--color-gray-light)]">
            {value.meta_description.length}/160
          </div>
          <textarea
            value={value.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={2}
            placeholder="ملخص قصير للبطاقة (اختياري، يُنشأ تلقائياً إن ترك فارغاً)"
            className="field resize-none text-sm"
          />
        </div>
      </aside>
    </div>
  );
}
