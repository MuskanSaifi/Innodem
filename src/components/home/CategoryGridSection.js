"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const CategoryGridSection = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <p className="text-center text-gray-500 p-6 text-lg">
        No categories available.
      </p>
    );
  }

  return (
    <div className="space-y-16  p-4  sm:p-6 lg:p-10 bg-gray-100 pt-5 pb-5">
      {categories.map((category) => (
        <div key={category._id} className="bg-white shadow-md rounded-xl p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {category.name}
            </h2>
  <Link
  href={`/seller/${category.categoryslug}`}
  className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline transition duration-200"
>
  View All
</Link>


          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">


<div className="w-full max-w-xs mx-auto bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
  {/* Image on Top */}
  <div className="w-full h-40 relative bg-white">
    <Image
      src={category.icon || "/placeholder.jpg"}
      alt={category.name}
      fill
      className="object-contain p-4"
    />
  </div>

  {/* Content on Bottom */}
  <div className="bg-black text-white p-4">
    <h3 className="text-xl font-bold mb-3">{category.name}</h3>
    <div className="space-y-1 text-sm">
      {category.subcategories?.slice(0, 5).map((sub) => (
        <Link
          key={sub._id}
          href={`/seller/${category.categoryslug}/${sub.subcategoryslug}`}
          className="block text-gray-300 hover:text-white hover:underline transition"
        >
          {sub.name}
        </Link>
      ))}
    </div>
  </div>
  
</div>

            {/* Right: Subcategories with images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:col-span-4">
  {category.subcategories?.map((sub) => (
 <Link
  key={sub._id}
  href={`/seller/${category.categoryslug}/${sub.subcategoryslug}`}
  className="flex bg-white border rounded-lg overflow-hidden hover:shadow-md transition"
>
  {/* ✅ All content directly here */}
  <div className="flex items-center">
    <div className="w-24 h-24 flex-shrink-0 relative">
      <Image
        src={sub.icon || "/subcategory-placeholder.jpg"}
        alt={sub.name}
        fill
        className="object-cover"
      />
    </div>
  </div>
<div className="p-3 flex flex-col justify-center">
  <h4 className="font-semibold text-gray-800 text-base mb-1 capitalize">
    {sub.name}
  </h4>
  <ul className="space-y-0.5 text-sm text-blue-700">
    {sub.products?.slice(0, 3).map((product) => (
      <li key={product._id}>
        <Link
          href={`/manufacturers/${product.productslug}`}
          className="hover:text-blue-900 hover:font-semibold hover:underline transition-all duration-200"
        >
          {product.name}
        </Link>
      </li>
    ))}
  </ul>
</div>
</Link>
  ))}
</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGridSection;
