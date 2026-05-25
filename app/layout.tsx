import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { TemplateProvider } from "@/context/TemplateContext";
import { ScanProvider } from "@/context/ScanContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OMR Ujian - Koreksi Otomatis",
  description: "Sistem koreksi lembar jawaban otomatis dengan kamera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <TemplateProvider>
          <ScanProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </ScanProvider>
        </TemplateProvider>
      </body>
    </html>
  );
}
