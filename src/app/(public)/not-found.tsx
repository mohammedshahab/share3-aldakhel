import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="font-[var(--font-cairo)] text-7xl font-black text-[var(--color-red)]">
        404
      </div>
      <h1 className="font-[var(--font-cairo)] text-2xl font-black text-white">
        الصفحة غير موجودة
      </h1>
      <p className="text-[var(--color-gray-light)]">
        عذراً، الصفحة التي تبحث عنها لم تعد متوفرة أو تم نقلها.
      </p>
      <Link href="/" className="btn btn-red mt-2">
        العودة للرئيسية
      </Link>
    </div>
  );
}
