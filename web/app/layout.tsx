import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oasis - Your Information Oasis",
  description: "Find your oasis in the desert of information. A curated feed of high-quality content from your favorite creators.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
