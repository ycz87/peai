import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PEAI - AI-Powered Enterprise Analytics",
  description: "Transform your data into actionable intelligence with PEAI's advanced AI analytics platform",
  keywords: ["AI", "Analytics", "Enterprise", "Machine Learning", "Data Intelligence"],
  authors: [{ name: "PEAI Team" }],
  openGraph: {
    title: "PEAI - AI-Powered Enterprise Analytics",
    description: "Transform your data into actionable intelligence with PEAI's advanced AI analytics platform",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
