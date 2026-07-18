import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fyneeds Transcript",
  description: "Transcript ticket Fyneeds yang aman dan memiliki masa berlaku.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
