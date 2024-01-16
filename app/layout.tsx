import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/header";
import { MobileNav } from "@/components/mobileNav";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ContextProvider } from "@/lib/context/globalContext";

import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gym app",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col md:flex-row">
            <Sidebar />
            <ContextProvider>
              <MobileNav />
              <div className="flex-1 p-4">
                <Header />
                <div className="mt-5">{children}</div>
              </div>
            </ContextProvider>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const revalidate = 0;
