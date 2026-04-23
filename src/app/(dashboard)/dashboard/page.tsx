import Link from "next/link";
import {
  Clock,
  Eye as EyeIcon,
  PenLine,
  Users,
  Trash2,
  Edit,
  ExternalLink,
  Newspaper,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getStats, listArticles } from "@/lib/articles";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ArticlesChart } from "@/components/dashboard/ArticlesChart";
import { Topbar } from "@/components/dashboard/Topbar";
import { formatArDate, formatNumberAr } from "@/lib/utils";
import type { ArticleStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = await getCurrentUser();
  if (!user) return null;
  const stats = getStats();
  const { rows: latest } = listArticles({ limit: 5, status: undefined });

  return (
    <>
      <Topbar title="لوحة التحكم" user={user} />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="إجمالي الأخبار"
            value={formatNumberAr(stats.totalArticles)}
            icon={<Newspaper size={18} />}
            tone="red"
            delta={`${formatNumberAr(stats.totalViews)} مشاهدة إجمالية`}
          />
          <StatsCard
            title="المشاهدات اليوم"
            value={formatNumberAr(stats.totalViewsToday)}
            icon={<EyeIcon size={18} />}
            tone="green"
          />
          <StatsCard
            title="في انتظار المراجعة"
            value={formatNumberAr(stats.pending)}
            icon={<Clock size={18} />}
            tone="gold"
          />
          <StatsCard
            title="المحررون النشطون"
            value={formatNumberAr(stats.editors)}
            icon={<Users size={18} />}
            tone="gray"
          />
        </div>

        <ArticlesChart data={stats.articlesByDay} />

        <div className="rounded-xl border border-white/5 bg-[var(--color-panel)]">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <h3 className="font-[var(--font-cairo)] text-lg font-black text-white">
              آخر الأخبار المنشورة
            </h3>
            <div className="flex gap-2">
              <Link href="/dashboard/articles/new" className="btn btn-red text-sm">
                <PenLine size={14} />
                نشر خبر جديد
              </Link>
              <Link href="/dashboard/articles" className="btn btn-ghost text-sm">
                إدارة الأخبار
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[var(--color-gray-light)]">
                  <th className="py-3 pr-4 font-medium">العنوان</th>
                  <th className="py-3 font-medium">التصنيف</th>
                  <th className="py-3 font-medium">المحرر</th>
                  <th className="py-3 font-medium">التاريخ</th>
                  <th className="py-3 font-medium">الحالة</th>
                  <th className="py-3 font-medium">المشاهدات</th>
                  <th className="py-3 pl-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((a) => (
                  <tr key={a.id} className="border-b border-white/5">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/article/${a.slug}`}
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
                    <td className="py-3 pl-4">
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
                        {user.role === "admin" || a.author_id === user.id ? (
                          <Link
                            href={`/dashboard/articles?delete=${a.id}`}
                            className="rounded p-1.5 text-white/70 hover:bg-white/5 hover:text-[var(--color-red)]"
                            aria-label="حذف"
                          >
                            <Trash2 size={14} />
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {latest.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[var(--color-gray-light)]">
                      لا توجد أخبار بعد — ابدأ بـ
                      <Link href="/dashboard/articles/new" className="mx-1 text-[var(--color-red)] hover:underline">
                        نشر أول خبر
                      </Link>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  if (status === "published")
    return <span className="badge badge-green">منشور</span>;
  if (status === "pending")
    return <span className="badge badge-gold">بانتظار المراجعة</span>;
  return <span className="badge badge-gray">مسودة</span>;
}
