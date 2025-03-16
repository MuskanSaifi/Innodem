import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateSubCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/category`);
      setSelectedCategory(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.name || !productData.category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/subcategory`, {
        name: productData.name,
        category: productData.category,
      });

      if (response.status === 201) {
        toast.success("SubCategory created successfully!");
        setProductData({
          name: "",
          category: "",
        });
      }
    } catch (error) {
      console.error("Error creating Sub Category:", error);
      toast.error("Failed to create Sub Category. Please try again.");
    }
  };

  return (
    <div className="create-product-form">
      <h3>Create a New SubCategory</h3>

      <input
        className="form-control mb-3"
        type="text"
        id="subcategory-name"
        placeholder="Enter subcategory name"
        value={productData.name}
        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
      />

      <select
        className="form-control mb-3"
        id="subcategory-category"
        value={productData.category}
        onChange={(e) => setProductData({ ...productData, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {selectedCategory.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Create SubCategory
      </button>
    </div>
  );
};

export default CreateSubCategory;
