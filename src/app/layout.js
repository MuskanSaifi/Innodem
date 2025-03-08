"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./styles/header.css"
import "./styles/footer.css"
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

import { Toaster } from "react-hot-toast";

import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {pathname !== "/about" &&
        pathname !== "/dashboard" &&
        pathname !== "/about/aboutstudent" &&
        pathname !== "/about/aboutcollege" ? (
          <Header />
        ) : (
          <p>About Common Layout</p>
        )}
        <Toaster position="top-center" />
        {children}
        {/* Hide footer only on the /dashboard page */}
        {pathname !== "/userdashboard" && <Footer />}
      </body>
    </html>
  );
}
