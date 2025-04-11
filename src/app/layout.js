import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./store/providers";  // ✅ Import Providers
import LayoutWrapper from "../components/LayoutWrapper";
import "./globals.css";
import "../components/styles/header.css";
import "../components/styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });


export const metadata = {
  title: "Leading B2B Marketplace in India & Globally | Dial Export Mart",
  description:
    "Join Dial Export Mart, India’s premier B2B platform to connect with international buyers and suppliers. Grow your business globally, explore diverse export markets, and find genuine partners for long-term growth.",
  alternates: {
    canonical: "https://dialexportmart.com/",
  },
  openGraph: {
    title: "Dial Export Mart - Buy & Sell Globally at Best Prices",
    description: "Explore Dial Export Mart, a trusted platform connecting buyers and sellers worldwide.",
    url: "https://dialexportmart.com/",
    type: "website",
    images: ["/path-to-your-social-media-image.jpg"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers> {/* ✅ Wrap Redux & Toast Provider */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
