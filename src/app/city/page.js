"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const AllCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/city"); // Fetch all cities
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || "Failed to fetch cities.");
        
        setCities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Cities</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && cities.length === 0 && (
        <p className="text-red-500">No cities found</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cities.map((city) => (
          <Link
            key={city._id}
            href={`/city/${encodeURIComponent(city.name)}`}
            className="border p-4 rounded shadow hover:bg-gray-100"
          >
            {city.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCities;
