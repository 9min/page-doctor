import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { LocaleProvider } from "@/components/shared/LocaleProvider";
import { ScheduleRunner } from "@/components/shared/ScheduleRunner";
import { ServiceWorkerRegistrar } from "@/components/shared/ServiceWorkerRegistrar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PageDoctor - 웹 페이지 성능 검사",
  description:
    "URL을 입력하면 Core Web Vitals를 측정하고 성능 개선 제안을 제공합니다.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PageDoctor",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LocaleProvider>
            <TooltipProvider>
              <ScheduleRunner />
              <ServiceWorkerRegistrar />
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 pt-2">{children}</main>
                <Footer />
              </div>
            </TooltipProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
