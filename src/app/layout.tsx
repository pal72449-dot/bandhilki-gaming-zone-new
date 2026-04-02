import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bandhilki Gaming Zone | Ultimate PS5 Experience in Vasai West",
  description: "Start the New Year with the Ultimate PS5 Gaming Experience at Bandhilki Gaming Zone, Vasai West. Multiplayer, Solo, Private Theater, and Birthday Parties. Book your slot online today!",
  keywords: ["Gaming Zone", "PS5", "Vasai West", "Gaming Cafe", "Bandhilki Gaming", "PlayStation 5", "Private Theater", "Birthday Party"],
  openGraph: {
    title: "Bandhilki Gaming Zone | Premium PS5 Gaming Lounge",
    description: "Experience premium, lag-free PS5 gaming with high-fidelity graphics and deep neon cyberpunk aesthetics in Vasai West.",
    url: "https://bandhilkigaming.com",
    siteName: "Bandhilki Gaming Zone",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body>{children}</body>
    </html>
  );
}
