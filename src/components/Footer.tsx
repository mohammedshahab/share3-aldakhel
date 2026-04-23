import Link from "next/link";
import { Send, Music2 } from "lucide-react";
import { Logo } from "./Logo";
import { listArticles } from "@/lib/articles";
import type { Category } from "@/lib/types";
import { timeAgoAr } from "@/lib/utils";

export function Footer({ categories }: { categories: Category[] }) {
  const { rows: latest } = listArticles({ limit: 5 });

  return (
    <footer className="mt-16 border-t-2 border-[var(--color-red)] bg-[var(--color-black-deep)]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-gray-light)]">
            وكالة أخبار شارع الداخل — الخبر أولاً وبمصداقية. ننقل إليكم آخر الأخبار العراقية والعربية والعالمية لحظة بلحظة.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <SocialLink icon={<FacebookIcon />} label="فيسبوك" />
            <SocialLink icon={<Send size={16} />} label="تيليغرام" />
            <SocialLink icon={<YoutubeIcon />} label="يوتيوب" />
            <SocialLink icon={<Music2 size={16} />} label="تيك توك" />
            <SocialLink icon={<InstagramIcon />} label="إنستغرام" />
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-[var(--font-cairo)] text-lg font-black text-white">
            روابط سريعة
          </h4>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="text-[var(--color-gray-light)] hover:text-[var(--color-red)]"
                >
                  {c.icon} {c.name_ar}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-[var(--font-cairo)] text-lg font-black text-white">
            آخر الأخبار
          </h4>
          <ul className="space-y-3 text-sm">
            {latest.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/article/${a.slug}`}
                  className="block text-[var(--color-gray-light)] hover:text-white"
                >
                  <span className="line-clamp-2">{a.title}</span>
                  <span className="mt-1 block text-xs text-[var(--color-gray)]">
                    {timeAgoAr(a.published_at ?? a.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-[var(--font-cairo)] text-lg font-black text-white">
            تواصل معنا
          </h4>
          <p className="text-sm text-[var(--color-gray-light)]">
            اشترك في النشرة البريدية لتصلك آخر الأخبار مباشرةً.
          </p>
          <form className="mt-4 flex flex-col gap-2">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="field"
            />
            <button type="button" className="btn btn-red">
              اشترك
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-[var(--color-gray-light)]">
        جميع الحقوق محفوظة © {new Date().getFullYear()} شارع الداخل
      </div>
    </footer>
  );
}

function SocialLink({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/80 hover:bg-[var(--color-red)] hover:text-white"
    >
      {icon}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}
