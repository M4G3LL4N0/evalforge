import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EvalForge",
  description: "Multi-model evaluation cockpit for human reviewers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
