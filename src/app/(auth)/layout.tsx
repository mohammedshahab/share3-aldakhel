import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-black)] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Link href="/">
            <Logo size={28} />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
