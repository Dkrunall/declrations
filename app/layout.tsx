import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OPA Club — Entry Declaration",
  description: "Complete your digital entry declaration for OPA Club.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#FAF9F6] min-h-screen text-[#1C1917] antialiased">
        {children}
        <Toaster
          position="top-center"
          theme="light"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #ebeae5",
              color: "#1c1917",
              fontSize: "14px",
              boxShadow: "0 10px 30px -10px rgba(28, 25, 23, 0.08)",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
