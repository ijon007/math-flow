import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";
import Provider from "@/components/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Math Flow - Learn by doing",
  description: "An ai native math problem solving tool.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    images: "/og.png",
  },
  twitter: {
    images: "/og.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
