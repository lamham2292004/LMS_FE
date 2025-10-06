"use client";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "@lms/components/theme-provider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}