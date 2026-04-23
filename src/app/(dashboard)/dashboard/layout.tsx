import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ToastProvider } from "@/components/dashboard/Toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[var(--color-black)]">
        <Sidebar user={user} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </ToastProvider>
  );
}
