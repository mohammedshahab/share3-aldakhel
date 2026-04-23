"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة للأعلى"
      className="fixed bottom-6 left-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-red)] text-white shadow-lg transition hover:bg-[var(--color-red-dark)]"
    >
      <ArrowUp size={20} />
    </button>
  );
}
