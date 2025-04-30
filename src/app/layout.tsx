import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
