import type { Metadata, ResolvingMetadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSystemInfo } from "@/services/home";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await getSystemInfo();
    const systemData = res?.data;

    return {
      title: systemData?.system_name || "PublicationHub",
      description: systemData?.description || "Advancing research excellence and scientific impact.",
      icons: systemData?.favicon ? [{ url: systemData.favicon, rel: "icon" }] : undefined,
    };
  } catch (error) {
    return {
      title: "PublicationHub",
      description: "Advancing research excellence and scientific impact.",
    };
  }
}

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
