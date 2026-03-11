import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scrollytelling Experience",
  description: "High-end scrollytelling experience using Next.js, Framer Motion, and Lenis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
