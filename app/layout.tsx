import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";
import { ToastContainer } from "@/components/Toast";

export const metadata: Metadata = {
  title: "FinBuddy - AI-Powered Personal Finance Assistant",
  description: "Track expenses, visualize spending patterns, and receive personalized financial insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <Navigation />
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
