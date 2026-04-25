import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GRADE LMS",
  description:
    "Science and English learning management system for SSC and HSC students in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
