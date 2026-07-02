import type { Metadata } from "next";
import { Lato, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GUHAS GEMS AND JEWELLERIES — Fine Jewelry & Diamonds",
  description:
    "Guhas Gems and Jewelleries is a modern fine-jewelry house. Discover diamond rings, bracelets, pendants and earrings crafted in 18k gold and platinum.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.variable} ${baskerville.variable}`}>
      <body className="font-sans antialiased">
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
