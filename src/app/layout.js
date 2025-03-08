"use client"; // ✅ Convert RootLayout into a Client Component

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../components/styles/header.css";
import "../components/styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";
import LayoutWrapper from "../components/LayoutWrapper"; // ✅ Import Client Component

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <Toaster position="top-center" />
          <LayoutWrapper>{children}</LayoutWrapper> {/* ✅ Use LayoutWrapper */}
        </Provider>
      </body>
    </html>
  );
}
