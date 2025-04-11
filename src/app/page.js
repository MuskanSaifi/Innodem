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

export default function Home() {
  return (
    <>
      <Bannerslider />

      <BuySellform />


      {/* Industry Section with Background Video */}
      <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] flex items-center justify-center">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-contain">
    <source src="/videos/4.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className="absolute5 inset-0 bg-black bg-opacity-0"></div>
</div>
{/* Product Sections */}


      <ProductSections1 tag="trending" Name="Trending" />

      <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] flex items-center justify-center">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-contain">
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
