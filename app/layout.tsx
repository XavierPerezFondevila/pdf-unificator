import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Unificator",
  description: "App para unir PDFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="transition-colors">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          bg-slate-900 text-slate-100 transition-colors
        `}
      >
      {children}
      </body>
    </html>
  );
}
