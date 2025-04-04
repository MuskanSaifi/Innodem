"use client";
import React from "react";
import Head from "next/head";  // ✅ Import Head
import Bannerslider from "@/components/Bannerslider";
import BuySellform from "@/components/BuySellform";
import ProductSections1 from "@/components/ProductSections1";
import ProductSections2 from "@/components/ProductSections2";
import IndustrySlider from "@/components/IndustrySlider";
import Cities from "@/components/Cities";
import Countries from "@/components/Countries";
import CountryList from "@/components/CountryList";

export default function Home() {
  return (
    <>
      {/* ✅ SEO Meta Tags */}
      <Head>
        <title>Dial Export Mart - Buy & Sell Globally</title>
        <meta name="description" content="Dial Export Mart is a trusted Google Partner, empowering small and medium businesses with cutting-edge digital solutions and a seamless platform for global trade." />
        <link rel="canonical" href="https://dialexportmart.com/" />
      </Head>

      <Bannerslider />
      <BuySellform />

      {/* Industry Section with Background Video */}
      <div className="relative w-full h-[400px] md:h-[100px] lg:h-[300px] flex items-center justify-center">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/4.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute5 inset-0 bg-black bg-opacity-0"></div>
      </div>

      {/* Product Sections */}
      <ProductSections1 tag="trending" Name="Trending" />
      
      <div className="relative w-full h-[400px] md:h-[100px] lg:h-[300px] flex items-center justify-center">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute5 inset-0 bg-black bg-opacity-0"></div>
      </div>

      <IndustrySlider/>
      <ProductSections2 tag="upcoming" Name="Upcoming" />
      <Cities/>
      <Countries/>
      <ProductSections1 tag="diwaliOffer" Name="Diwali Offer" />
      <ProductSections1 tag="holiOffer" Name="Holi Offer" />

      <CountryList/>
    </>
  );
}
