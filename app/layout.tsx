import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import { ToastProvider } from "../lib/toast-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Portfolio Generator - Create Your Professional Portfolio",
  description: "Generate stunning student portfolios with AI. Upload your resume, connect GitHub/LinkedIn, and create a professional portfolio that showcases your skills and projects.",
  keywords: "portfolio generator, AI portfolio, student portfolio, resume builder, GitHub integration, LinkedIn integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
