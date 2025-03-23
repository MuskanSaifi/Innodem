"use client";
import React from "react";
import Bannerslider from "@/components/Bannerslider";
import BuySellform from "@/components/BuySellform";
import ProductSections1 from "@/components/ProductSections1";
import ProductSections2 from "@/components/ProductSections2";
import Link from "next/link";
import IndustrySlider from "@/components/IndustrySlider";
import Cities from "@/components/Cities";
import Countries from "@/components/Countries";

export default function Home() {
  return (
    <>
      <Bannerslider />
      <BuySellform />
  
      {/* Industry Section with Background Video */}
      <div className="relative w-full h-[400px] md:h-[100px] lg:h-[300px] flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/4.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute5 inset-0 bg-black bg-opacity-0"></div>
      </div>


      {/* Product Sections */}
      <ProductSections1 tag="trending" Name="Trending" />
          {/* Industry Section with Background Video */}
          <div className="relative w-full h-[400px] md:h-[100px] lg:h-[300px] flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute5 inset-0 bg-black bg-opacity-0"></div>

        {/* Centered Button */}
        {/* <Link
          href="/industry"
          className="relative z-10 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Explore Industries
        </Link> */}
      </div>

      <IndustrySlider/>
      <ProductSections2 tag="upcoming" Name="Upcoming" />
      <Cities/>
      <Countries/>
      <ProductSections1 tag="diwaliOffer" Name="Diwali Offer" />
      <ProductSections1 tag="holiOffer" Name="Holi Offer" />


      <div className="container mb-4">
        <div className="google-partner">
               <Link 
                href="https://www.google.com/partners/agency?id=7430369059" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img src="/assets/gp.png" alt="Google Partner Logo" className="gp-img shadow" />
              </Link>
            <p className="px-3 text-sm">Dial Export Mart is a trusted Google Partner, empowering small and medium businesses with cutting-edge digital solutions and a seamless platform for global trade.</p>
        </div>
      </div>


    </>
  );
}
