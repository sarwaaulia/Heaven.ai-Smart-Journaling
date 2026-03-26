import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "react-hot-toast";
import { EntryProvider } from "./context/EntryContex";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heaven.ai - Smart Journaling",
  description: "AI-Powered Insights for your mental growth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // avoid an error warning in consol when change the theme
    <html lang="en" suppressHydrationWarning> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster position="top-center" reverseOrder={false} />
        <ThemeProvider> 
          <EntryProvider>
            {children}
          </EntryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
