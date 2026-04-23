"use client";

import { Bell } from "lucide-react";
import type { PublicUser } from "@/lib/types";

interface Props {
  title: string;
  user: PublicUser;
}

export function Topbar({ title, user }: Props) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-[var(--color-red)] bg-[var(--color-black)] px-4 py-3 md:px-6">
      <h1 className="font-[var(--font-cairo)] text-xl font-black text-white">
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <button
          aria-label="الإشعارات"
          className="relative rounded-md p-2 text-white/80 hover:bg-white/5 hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-red)] text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-red)] text-sm font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <span className="text-sm font-bold text-white">{user.name}</span>
        </div>
      </div>
    </header>
  );
}
