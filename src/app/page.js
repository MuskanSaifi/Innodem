"use client";
import React from "react";
import Bannerslider from "@/components/Bannerslider";
import BuySellform from "@/components/BuySellform";
import ProductSections1 from "@/components/ProductSections1";
import ProductSections2 from "@/components/ProductSections2";
import IndustrySlider from "@/components/IndustrySlider";
import Cities from "@/components/Cities";
import Countries from "@/components/Countries";
import CountryList from "@/components/CountryList";
import Image from "next/image";
import Link from "next/link";
import Testimonials from "@/components/home/Testimonials";
import WhatWeOffer from "@/components/home/Whatweoffer";
import StatsWithImage from "@/components/home/Stats";
import ContactRating from "@/components/home/ContactRating";
import CustomChatBot from "../components/home/CustomChatBot";
import Faq from "@/components/home/Faq";
import CategoryGridPage from "@/components/home/CategoryGridPage";

export default function Home() {
  return (
    <>
<h1 className="hidden">Dial Export Mart | B2B Marketplace in India</h1>
      <Bannerslider />

      <BuySellform />

      {/* Industry Section with Background Video */}
      {/* <div className="relative w-full h-[100px] md:h-[100px] lg:h-[300px] flex items-center justify-center">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-contain">
    <source src="/videos/4.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className="absolute5 inset-0 bg-black bg-opacity-0"></div>
</div> */}
      {/* Product Sections */}

      <div className="banner-container">
        <Link href="/all-categories">
    <Image
  className="m-auto"
  src="/assets/subbanner/banner-min.png"
  alt="Banner for website dial"
  width={2000}
  height={400}
  quality={90}
    loading="lazy"           // ✅ Add this line

/>

        </Link>
      </div>


      <ProductSections1 tag="trending" Name="Trending" />

      {/* <div className="relative w-full h-[100px] md:h-[100px] lg:h-[300px] flex items-center justify-center">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-contain">
          <source src="/videos/3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute5 inset-0 bg-black bg-opacity-0"></div>
      </div> */}

<div className="banner-container">
<Link href="/user/register">
        <Image
        className="m-auto"
          src="/assets/subbanner/banner-min-2.png" // Path relative to the 'public' folder
          alt="Banner for website dial"
          width={2000} // Replace with desired width
          height={400} // Replace with desired height
          quality={90}
  loading="lazy"           
        />
                </Link>

      </div>


      <IndustrySlider />
      <CategoryGridPage/>

      <ProductSections2 tag="upcoming" Name="Upcoming" />

      <Cities />

      <Countries />

      <ProductSections1 tag="diwaliOffer" Name="Featured Products" />

      <ProductSections1 tag="holiOffer" Name="Products You May Like" />

      <CountryList />

      <StatsWithImage/>

      <WhatWeOffer/>

      <Testimonials/>

      <Faq/>

      <ContactRating/>

   {/* Your page content */}
      <div className="fixed bottom-5 right-5 z-[999]">
        <CustomChatBot />
      </div>


    </>
  );
}
