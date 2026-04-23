"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  Image as ImageIcon,
  LogOut,
  PenLine,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import { Logo } from "../Logo";
import type { PublicUser } from "@/lib/types";

interface Props {
  user: PublicUser;
}

export function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { href: "/dashboard", label: "الإحصائيات", icon: BarChart3, match: (p: string) => p === "/dashboard" },
    { href: "/dashboard/articles/new", label: "نشر خبر جديد", icon: PenLine, match: (p: string) => p.startsWith("/dashboard/articles/new") },
    { href: "/dashboard/articles", label: "إدارة الأخبار", icon: FileText, match: (p: string) => p === "/dashboard/articles" || (p.startsWith("/dashboard/articles/") && !p.startsWith("/dashboard/articles/new")) },
    { href: "/dashboard/categories", label: "التصنيفات", icon: Tags, match: (p: string) => p.startsWith("/dashboard/categories") },
    { href: "/dashboard/media", label: "مكتبة الصور", icon: ImageIcon, match: (p: string) => p.startsWith("/dashboard/media") },
    ...(user.role === "admin"
      ? [{ href: "/dashboard/users", label: "إدارة المحررين", icon: Users, match: (p: string) => p.startsWith("/dashboard/users") }]
      : []),
    { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, match: (p: string) => p.startsWith("/dashboard/settings") },
  ];

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden shrink-0 flex-col border-l border-white/5 bg-[var(--color-black-deep)] md:flex md:w-[260px]">
      <div className="border-b border-white/5 px-5 py-5">
        <Link href="/">
          <Logo size={20} />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map((it) => {
          const active = it.match(pathname);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition ${
                active
                  ? "bg-[var(--color-red)] text-white"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <it.icon size={16} />
              {it.label}
            </Link>
          );
        })}
        <button
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-white/75 transition hover:bg-white/5 hover:text-[var(--color-red)]"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </nav>
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-red)] font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-white">{user.name}</div>
            <div className="text-xs text-[var(--color-gray-light)]">
              {user.role === "admin" ? "مشرف" : "محرر"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
