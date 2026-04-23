import { getCurrentUser } from "@/lib/auth";
import { Topbar } from "@/components/dashboard/Topbar";
import { ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <>
      <Topbar title="مكتبة الصور" user={user} />
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-[var(--color-panel)] p-16 text-center">
          <ImageIcon size={40} className="text-[var(--color-gray-light)]" />
          <h3 className="font-[var(--font-cairo)] text-lg font-black text-white">
            مكتبة الصور
          </h3>
          <p className="max-w-md text-sm text-[var(--color-gray-light)]">
            ستتمكن قريباً من إدارة جميع الصور المرفوعة من هنا. حالياً يمكنك رفع
            الصور مباشرةً من صفحة إنشاء / تعديل الخبر.
          </p>
        </div>
      </div>
    </>
  );
}
