import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Rabbit Mart — Hiring Admin",
  description: "Admin portal for the Rabbit Mart job application system",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/brand/round-mark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen text-slate-900 font-sans antialiased">{children}</body>
    </html>
  );
}
