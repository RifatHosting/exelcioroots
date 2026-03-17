import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RRH Web Studio - Professional Frontend Development",
  description: "Layanan pembuatan website frontend statis HTML profesional dengan desain modern dan responsif. By Rifat Radli Hidayat.",
  keywords: ["web development", "frontend", "HTML", "CSS", "static website", "landing page", "portfolio", "Indonesia"],
  authors: [{ name: "Rifat Radli Hidayat" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23f97316' rx='15' width='100' height='100'/><text x='50' y='70' font-size='60' text-anchor='middle' fill='white'>R</text></svg>",
  },
  openGraph: {
    title: "RRH Web Studio",
    description: "Professional Frontend Development - Transform Your Ideas Into Reality",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
