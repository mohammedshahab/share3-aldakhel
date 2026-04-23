"use client";

import Link from "next/link";
import type { Category } from "@/lib/types";
import { Zap } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryTabs({ categories, activeSlug }: Props) {
  const pathname = usePathname();
  const active = activeSlug ?? pathname.split("/").filter(Boolean)[1];

  return (
    <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-3 md:mx-0 md:px-0">
      <Link
        href="/category/breaking"
        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
          active === "breaking"
            ? "border-[var(--color-red)] bg-[var(--color-red)] text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:border-[var(--color-red)] hover:text-white"
        }`}
      >
        <span className="inline-flex items-center gap-1">
          <Zap size={14} fill="currentColor" />
          عاجل
        </span>
      </Link>
      {categories.map((c) => {
        const isActive = active === c.slug;
        return (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
              isActive
                ? "border-[var(--color-red)] bg-[var(--color-red)] text-white"
                : "border-white/10 bg-white/5 text-white/80 hover:border-[var(--color-red)] hover:text-white"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <span>{c.icon}</span>
              <span>{c.name_ar}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
