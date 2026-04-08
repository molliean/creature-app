import type { Metadata } from "next";
import { Inconsolata, Rubik_Beastly, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const ligconsolata = Inconsolata({
  variable: "--font-ligconsolata",
  subsets: ["latin"],
});

const rubikBeastly = Rubik_Beastly({
  variable: "--font-rubik-beastly",
  subsets: ["latin"],
  weight: "400",
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Creature",
  description: "Your reading life, beautifully tracked.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ligconsolata.variable} ${rubikBeastly.variable} ${shipporiMincho.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
