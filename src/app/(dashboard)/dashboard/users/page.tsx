import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { countArticlesByAuthor, listUsers } from "@/lib/users";
import { Topbar } from "@/components/dashboard/Topbar";
import { UsersTable } from "@/components/dashboard/UsersTable";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const users = listUsers().map((u) => ({
    ...u,
    articles_count: countArticlesByAuthor(u.id),
  }));

  return (
    <>
      <Topbar title="إدارة المحررين" user={user} />
      <div className="flex-1 p-4 md:p-6">
        <UsersTable users={users} currentUserId={user.id} />
      </div>
    </>
  );
}
