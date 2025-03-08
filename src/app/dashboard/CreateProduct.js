import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    brand: "",
    countInStock: "",
    sku: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/adminprofile/category");
      setSelectedCategory(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.brand || !productData.countInStock) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/adminprofile/seller", {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        subCategory: productData.subCategory,
        brand: productData.brand,
        countInStock: parseInt(productData.countInStock),
        sku: productData.sku,
      });

      if (response.status === 201) {
        alert("Product created successfully!");
        setProductData({
          name: "",
          description: "",
          price: "",
          category: "",
          subCategory: "",
          brand: "",
          countInStock: "",
          sku: "",
        });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="create-product-form">
      <h3>Create a New Product</h3>
      <input
  className="form-control mb-3"
  type="text"
  id="product-name"
  placeholder="Enter product name"
  value={productData.name}
  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
/>

<select
  className="form-control mb-3"
  id="product-category"
  value={productData.category}
  onChange={(e) =>
    setProductData({ ...productData, category: e.target.value })
  }
>
  <option value="">Select Category</option>
  {selectedCategory.map((category) => (
    <option key={category._id} value={category._id}>
      {category.name}
    </option>
  ))}
</select>

<select className="form-control mb-3" id="product-subcategory" value={productData.subCategory}
  onChange={(e) =>
    setProductData({ ...productData, subCategory: e.target.value })
  }
>
  <option value="">Select Subcategory</option>
  {selectedCategory
    .find((cat) => cat._id === productData.category)
    ?.subcategories?.map((sub) => (
      <option key={sub._id} value={sub._id}>
        {sub.name}
      </option>
    ))}
</select>

<input
  className="form-control mb-3"
  type="text"
  placeholder="Description"
  value={productData.description}
  onChange={(e) =>
    setProductData({ ...productData, description: e.target.value })
  }
/>

<input
  className="form-control mb-3"
  type="number"
  placeholder="Price"
  value={productData.price}
  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
/>

<input
  className="form-control mb-3"
  type="text"
  placeholder="Brand"
  value={productData.brand}
  onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
/>

<input
  className="form-control mb-3"
  type="number"
  placeholder="Count In Stock"
  value={productData.countInStock}
  onChange={(e) =>
    setProductData({ ...productData, countInStock: e.target.value })
  }
/>

<input
  className="form-control mb-3"
  type="text"
  placeholder="SKU"
  value={productData.sku}
  onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
/>

      <button className="btn btn-primary" onClick={handleSubmit}>Create Product</button>
    </div>
  );
};

export default CreateProduct;
