"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const IndustrySlider = () => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/adminprofile/category");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch categories");
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Format URL function (same as SidebarMenu)
  function formatUrl(name) {
    return encodeURIComponent(name.replace(/&/g, "and").replace(/\s+/g, "-").toLowerCase());
  }

  if (!isClient) return null;
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="container mx-auto mb-5 mt-5">
      <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-2">
        Explore Industries
      </h2>

      <Swiper
        modules={[ Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        loop={true}
        autoplay={{ delay: 3000 }}
        // navigation
        pagination={{ clickable: true }}
        className="w-full"
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <div className="bg-white rounded-lg p-2 hover:shadow-lg transition w-[100%]">
              <div className="flex justify-between items-center mb-4">
              <Image 
                      src={category.icon  || "/placeholder.png"} 
                      alt={category.name} 
                      width={30} 
                      height={30} 
                      className="rounded-md" 
                    />
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                  {category.name}
                </h3>
                {/* ✅ Use formatted URL for Category */}
            
                <Link href={`/seller/${formatUrl(category.name)}`} className="text-blue-600 text-sm hover:underline">
                  View All
                </Link>
              </div>

              {/* ✅ Subcategory Grid with Correct URLs */}
              <div className="grid grid-cols-3 gap-2">
                {category.subcategories.slice(0, 6).map((sub) => (
                  
                  <Link 
                    key={sub._id} 
                    href={`/seller/${formatUrl(category.name)}/${formatUrl(sub.name)}`} 
                    className="group block bg-gray-100 rounded-md p-1 hover:bg-gray-200 transition"
                  >
                    <Image 
                      src={sub.icon || "/placeholder.png"} 
                      alt={sub.name} 
                      width={80} 
                      height={80} 
                      className="rounded-md object-cover w-full h-20" 
                    />
                    <p className="text-xs truncate text-gray-700 text-center mt-2 group-hover:text-gray-900" title={sub.name}>
                    {sub.name.replace(/\b\w/g, c => c.toUpperCase())}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default IndustrySlider;
