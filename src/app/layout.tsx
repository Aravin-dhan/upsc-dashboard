import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/responsive.css";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { DashboardCustomizationProvider } from "@/contexts/DashboardCustomizationContext";
import MainLayout from "@/components/layout/MainLayout";
import ThemeScript from "@/components/ui/ThemeScript";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UPSC Dashboard - Organize Your Civil Services Journey",
  description: "A comprehensive dashboard to organize your UPSC Civil Services preparation with progress tracking, analytics, and smart revision system.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UPSC Dashboard'
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={false}
            storageKey="upsc-theme"
          >
            <AuthProvider>
              <AnalyticsProvider>
                <DashboardCustomizationProvider>
                  <MainLayout>
                    {children}
                  </MainLayout>
                </DashboardCustomizationProvider>
                <Toaster position="top-right" />
              </AnalyticsProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}