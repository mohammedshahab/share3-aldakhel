import { BreakingTicker } from "@/components/BreakingTicker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { listCategories } from "@/lib/articles";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = listCategories();
  return (
    <>
      <BreakingTicker />
      <Header categories={categories} />
      <main className="mx-auto min-h-[60vh] max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
      <Footer categories={categories} />
      <ScrollToTop />
    </>
  );
}
