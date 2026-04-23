import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "شارع الداخل — وكالة أخبار عراقية",
    template: "%s | شارع الداخل",
  },
  description:
    "وكالة أخبار شارع الداخل — آخر الأخبار العراقية والعربية والعالمية: سياسة، اقتصاد، رياضة، ثقافة، وعاجل لحظة بلحظة.",
  openGraph: {
    title: "شارع الداخل",
    description: "وكالة أخبار عراقية — الخبر أولاً وبمصداقية",
    locale: "ar_IQ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${tajawal.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
