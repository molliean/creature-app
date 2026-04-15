import type { Metadata } from "next";
import { DM_Sans, Inconsolata, Rubik_Beastly, Shippori_Mincho } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
  description: "Upgrade your reading life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${ligconsolata.variable} ${rubikBeastly.variable} ${shipporiMincho.variable} antialiased h-full`}
    >
      <body className="flex flex-col min-h-full">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
