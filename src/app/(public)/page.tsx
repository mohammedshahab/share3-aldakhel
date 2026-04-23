import { CategoryTabs } from "@/components/CategoryTabs";
import { Hero } from "@/components/Hero";
import { NewsCard } from "@/components/NewsCard";
import { BreakingSection } from "@/components/BreakingSection";
import { MostRead } from "@/components/MostRead";
import { VideoSection } from "@/components/VideoSection";
import { getMostRead, listArticles, listCategories } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default function Home() {
  const categories = listCategories();
  const { rows: featured } = listArticles({ featured: true, limit: 5 });
  const { rows: latest } = listArticles({ limit: 9 });
  const { rows: breaking } = listArticles({ breaking: true, limit: 8 });
  const mostRead = getMostRead(8);

  const heroMain = featured[0] ?? latest[0];
  const heroSide = [...featured.slice(1), ...latest].filter(
    (a) => heroMain && a.id !== heroMain.id
  );

  if (!heroMain) {
    return (
      <div className="py-16 text-center text-[var(--color-gray-light)]">
        لا توجد أخبار منشورة حالياً.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Hero main={heroMain} side={heroSide} />
      <CategoryTabs categories={categories} />

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="font-[var(--font-cairo)] text-2xl font-black text-white md:text-3xl">
            آخر الأخبار
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {latest.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <MostRead items={mostRead} />
          <div className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-5 text-center">
            <div className="text-xs text-[var(--color-gray-light)]">مساحة إعلانية</div>
            <div className="mt-2 text-sm">إعلانك هنا</div>
          </div>
        </div>
      </section>

      {breaking.length > 0 ? <BreakingSection items={breaking} /> : null}

      <VideoSection items={latest.slice(0, 4)} />
    </div>
  );
}
