"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ProductFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    price: [0, 100000],
    colors: [],
    materials: [],
    metalTypes: [],
    isReturnable: "",
    shippingType: "",
  });

  // ✅ Handle filter change
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Handle Slider Change
  const handlePriceChange = (value) => {
    setFilters((prev) => ({ ...prev, price: value }));
  };

  // ✅ Apply filters only when a filter is selected
  useEffect(() => {
    const query = new URLSearchParams();

    if (
      filters.price[0] > 0 ||
      filters.price[1] < 100000 ||
      filters.colors.length > 0 ||
      filters.materials.length > 0 ||
      filters.metalTypes.length > 0 ||
      filters.isReturnable !== "" ||
      filters.shippingType !== ""
    ) {
      if (filters.price[0] > 0 || filters.price[1] < 100000) {
        query.append("priceMin", filters.price[0]);
        query.append("priceMax", filters.price[1]);
      }

      filters.colors.forEach((color) => query.append("color", color));
      filters.materials.forEach((material) =>
        query.append("material", material)
      );
      filters.metalTypes.forEach((metalType) =>
        query.append("metalType", metalType)
      );

      if (filters.isReturnable)
        query.append("isReturnable", filters.isReturnable);
      if (filters.shippingType)
        query.append("shippingType", filters.shippingType);

      router.push(`/products?${query.toString()}`);
    }
  }, [filters]);

  return (
    <div className="p-4 border rounded-lg w-80">
      <h3 className="text-lg font-bold mb-4">Filter Products</h3>

      {/* ✅ Price Range Slider */}
      <div>
        <label className="block text-sm font-medium">Price Range:</label>
        <Slider
          range
          min={0}
          max={100000}
          value={filters.price}
          onChange={handlePriceChange}
        />
        <div className="flex justify-between text-sm">
          <span>₹{filters.price[0]}</span>
          <span>₹{filters.price[1]}</span>
        </div>
      </div>

      {/* ✅ Multi-Select Colors */}
      <div>
        <label className="block text-sm font-medium">Colors:</label>
        {["Red", "Blue", "Green", "Black", "White"].map((color) => (
          <div key={color}>
            <input
              type="checkbox"
              value={color}
              checked={filters.colors.includes(color)}
              onChange={() =>
                handleChange(
                  "colors",
                  filters.colors.includes(color)
                    ? filters.colors.filter((c) => c !== color)
                    : [...filters.colors, color]
                )
              }
            />
            <span>{color}</span>
          </div>
        ))}
      </div>

      {/* ✅ Multi-Select Materials */}
      <div>
        <label className="block text-sm font-medium">Materials:</label>
        {["Steel", "Wood", "Plastic"].map((material) => (
          <div key={material}>
            <input
              type="checkbox"
              value={material}
              checked={filters.materials.includes(material)}
              onChange={() =>
                handleChange(
                  "materials",
                  filters.materials.includes(material)
                    ? filters.materials.filter((m) => m !== material)
                    : [...filters.materials, material]
                )
              }
            />
            <span>{material}</span>
          </div>
        ))}
      </div>

      {/* ✅ Is Returnable */}
      <div>
        <label className="block text-sm font-medium">Returnable:</label>
        <select
          value={filters.isReturnable}
          onChange={(e) => handleChange("isReturnable", e.target.value)}
        >
          <option value="">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* ✅ Shipping Type */}
      <div>
        <label className="block text-sm font-medium">Shipping Type:</label>
        <select
          value={filters.shippingType}
          onChange={(e) => handleChange("shippingType", e.target.value)}
        >
          <option value="">All</option>
          <option value="Free">Free</option>
          <option value="Flat Rate">Flat Rate</option>
          <option value="Actual">Actual</option>
        </select>
      </div>

      {/* ✅ Clear Filters */}
      <a href="/products">      <button
        className="bg-red-500 text-white mt-4 p-2 rounded"
      >
        Clear Filters
      </button>
      </a>

    </div>
  );
};

export default ProductFilter;
