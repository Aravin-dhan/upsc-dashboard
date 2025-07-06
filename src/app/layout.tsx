import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/responsive.css";
import "../styles/leaflet.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import ThemeScript from "@/components/ui/ThemeScript";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UPSC Dashboard - Organize Your Civil Services Journey",
  description: "A comprehensive dashboard to organize your UPSC Civil Services preparation with progress tracking, analytics, and smart revision system.",
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
              <MainLayout>
                {children}
              </MainLayout>
              <Toaster position="top-right" />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}