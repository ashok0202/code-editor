import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeCraft | Interactive Code Editor & Playground",
  description: "High-performance interactive online code editor with real-time output and community snippet sharing.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-linear-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <Footer />
            <Toaster className="bottom-9 sm:right-6" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
