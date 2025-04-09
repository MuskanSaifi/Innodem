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
  title: {
    default: "Dial Export Mart - Buy & Sell Globally at Best Prices",
  },
  description: "Dial Export Mart helps businesses connect globally. Buy & sell with trusted partners easily.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>  {/* ✅ Wrap Redux & Toast Provider */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
