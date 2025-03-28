"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


export default function StatePage() {
  const { stateName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/location/products?state=${stateName}`) // ✅ Ensure this matches the API filter
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, [stateName]);
  

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Products in {stateName}</h2>
      <div className="grid grid-cols-3 gap-4">
  
{products.map((product) => (
  <div key={product._id} className="p-4 border rounded-lg text-center">
<Image
  src={product?.images?.[0]?.url} 
  alt={product?.name || "Product Image"}
  width={96}  // Equivalent to w-24 (Tailwind)
  height={96} // Equivalent to h-24
  className="mx-auto object-cover"
/>
    <p className="mt-2 font-bold">{product.name}</p>
    <p className="text-gray-500">₹{product.price}</p>

    {/* ✅ Link to product detail page */}
    <Link href={`/products/${product._id}`}>
      <button className="btn btn-primary">View Detail</button>
    </Link>
  </div>
))}

      </div>
    </div>
  );
}
