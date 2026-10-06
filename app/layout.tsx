import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

const helvetica = localFont({
  src: [
    {
      path: "./fonts/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/HelveticaNeueMediumItalic.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/HelveticaNeueBlack.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/HelveticaNeueThin.otf",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhijeet Kulkarni | Software Developer & AI Builder",
  description:
    "Abhijeet Kulkarni builds digital products, AI-powered software, and business automation solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${helvetica.variable} h-full antialiased text-black selection:bg-violet-700 selection:text-white`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        <Navbar />
        <CustomCursor />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}