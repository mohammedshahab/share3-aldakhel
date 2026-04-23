"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, UserPlus, X } from "lucide-react";
import { Logo } from "./Logo";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
}

export function Header({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-[41px] z-40 border-b-[3px] border-[var(--color-red)] bg-[var(--color-black)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-5 overflow-x-auto px-4 text-sm font-bold lg:flex">
          <Link href="/" className="shrink-0 text-white hover:text-[var(--color-red)]">
            الرئيسية
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="shrink-0 text-white/85 hover:text-[var(--color-red)]"
            >
              {c.name_ar}
            </Link>
          ))}
          <Link
            href="/category/breaking"
            className="shrink-0 font-black text-[var(--color-red)]"
          >
            ⚡ عاجل
          </Link>
        </nav>

        <button
          onClick={() => setSearchOpen((s) => !s)}
          aria-label="بحث"
          className="rounded-md p-2 text-white/80 hover:bg-white/5 hover:text-white"
        >
          <Search size={18} />
        </button>

        <Link
          href="/dashboard/articles/new"
          className="btn btn-red hidden text-[13px] md:inline-flex"
        >
          <UserPlus size={16} />
          إضافة خبر
        </Link>

        <button
          onClick={() => setOpen(true)}
          aria-label="فتح القائمة"
          className="rounded-md p-2 text-white/80 hover:bg-white/5 hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      {searchOpen && (
        <form
          action="/search"
          method="GET"
          className="border-t border-white/10 bg-[var(--color-black-deep)] px-4 py-3"
        >
          <div className="mx-auto flex max-w-[1400px] items-center gap-2">
            <Search size={18} className="text-white/60" />
            <input
              autoFocus
              name="q"
              placeholder="ابحث عن خبر..."
              className="field flex-1"
            />
            <button type="submit" className="btn btn-red">
              بحث
            </button>
          </div>
        </form>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={() => setOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-[80%] max-w-sm flex-col gap-2 bg-[var(--color-black-deep)] p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="إغلاق"
                className="rounded-md p-2 text-white/80 hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-white hover:bg-white/5"
            >
              الرئيسية
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-white/85 hover:bg-white/5"
              >
                {c.icon} {c.name_ar}
              </Link>
            ))}
            <Link
              href="/dashboard/articles/new"
              onClick={() => setOpen(false)}
              className="btn btn-red mt-4"
            >
              إضافة خبر
            </Link>
          </aside>
        </div>
      )}
    </header>
  );
}
