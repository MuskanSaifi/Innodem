"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CityPage = ({ params }) => {
  const { city } = params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/city?city=${city}`); // ✅ Fixed API URL
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch products.");

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [city]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products in {city}</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-red-500">No products found for this city</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-40 object-cover" />
            <h2 className="text-lg font-bold mt-2">{product.name}</h2>
            <p className="text-gray-600">Price: ₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityPage;
