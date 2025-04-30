// ================================================
// FILE: src/app/layout.tsx (Remove theme switching)
// ================================================
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';

// REMOVE: import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
// REMOVE: import { LayoutClientContent } from "@/components/layout-client-content";
// REMOVE: import { ModeToggle } from "@/components/mode-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apollo Creations",
  description: "Melhores práticas e tecnologias em design e desenvolvimento web.",
  keywords: "criação de sites, inteligência artificial, IA, desenvolvimento web, Santos, Brasil",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    //url: "https://www.felipecataneo.com.br",
  },
  icons: {
    icon: [
      {
        url: '/icon.ico'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // REMOVE: ThemeProvider and suppressHydrationWarning
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children} {/* Your page content renders here */}

        {/* REMOVE: ModeToggle positioning div */}

        {/* Keep Toaster */}
        <Toaster position="bottom-right" />

        {/* Keep your existing footer or remove if desired */}
        {/* Example: <footer className="...">...</footer> */}

      </body>
    </html>
  );
}