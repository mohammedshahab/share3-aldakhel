import { getCurrentUser } from "@/lib/auth";
import { Topbar } from "@/components/dashboard/Topbar";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <>
      <Topbar title="الإعدادات" user={user} />
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-6">
          <h3 className="mb-4 font-[var(--font-cairo)] text-lg font-black text-white">
            معلومات الحساب
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-3">
              <dt className="text-[var(--color-gray-light)]">الاسم</dt>
              <dd className="font-bold text-white">{user.name}</dd>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <dt className="text-[var(--color-gray-light)]">البريد</dt>
              <dd className="font-bold text-white">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-gray-light)]">الدور</dt>
              <dd className="font-bold text-white">
                {user.role === "admin" ? "مشرف" : "محرر"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
