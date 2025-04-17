import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./store/providers";  // ✅ Import Providers
import LayoutWrapper from "../components/LayoutWrapper";
import "./globals.css";
import "../components/styles/header.css";
import "../components/styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });


export const metadata = {
  title: "Dial Export Mart | B2B Marketplace in India | B2B Portal in India",
  description:
    "Join Dial Export Mart, India’s premier B2B platform to connect with international buyers and suppliers. Grow your business globally, explore diverse export markets, and find genuine partners for long-term growth.",
    keywords:"B2B Marketplace in India,B2B Portal in India,B2B Platform in India,Best B2B Platform in India, Best B2B Platform in India, Export Import Marketplace in India, Online B2B Platform in India, Global Trade Portal in India, Wholesale, Buy & Sell Online, Indian B2B Platform, International B2B Marketplace, Buy & Sell Online in India, Best B2B Website in India, B2B website for small businesses, Top Export-Import Marketplace",
  alternates: {
    canonical: "https://dialexportmart.com/",
  }
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
         {/* ✅ Google Site Verification */}
         <meta
          name="google-site-verification"
          content="R9WyXTgozYVTSKMCjWbQZkact5ZWyCqa9sMQGmKhwnY"
        />
        
      <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-RMD1BWW0YY`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RMD1BWW0YY');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers> {/* ✅ Wrap Redux & Toast Provider */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
