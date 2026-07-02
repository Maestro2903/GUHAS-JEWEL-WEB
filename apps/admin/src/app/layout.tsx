import type { Metadata } from "next";
import { Lato, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GUHAS GEMS AND JEWELLERIES — Admin",
  description: "Manage products, categories, reviews and messages.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.variable} ${baskerville.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
