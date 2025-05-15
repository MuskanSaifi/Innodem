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
  },
    robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [
    {
      name: "Dial Export Mart",
      url: "https://dialexportmart.com",
    },
  ],
  publisher: "Dial Export Mart",
  metadataBase: new URL("https://dialexportmart.com"),
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
              {/* ✅ Google Analytics */}
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

              {/* ✅ Google Tag Manager */}
              <Script id="gtm-script" strategy="afterInteractive">
          {`
         (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PHL73GLL');
          `}
        </Script>

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         {/* ✅ GTM noscript fallback */}
         <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PHL73GLL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Providers> {/* ✅ Wrap Redux & Toast Provider */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
