import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateSubCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    metatitle: "",
    metadescription: "",
    metakeyword: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await axios.get(`/api/adminprofile/category`);
      setSelectedCategory(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, category, metatitle, metadescription, metakeyword } = productData;

    if (!name || !category || !metatitle || !metadescription) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(`/api/adminprofile/subcategory`, {
        name,
        category,
        metatitle,
        metadescription,
        metakeyword,
      });

      if (response.status === 201) {
        toast.success("SubCategory created successfully!");
        setProductData({
          name: "",
          category: "",
          metatitle: "",
          metadescription: "",
          metakeyword: ""
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
        placeholder="Enter SubCategory Name"
        value={productData.name}
        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
      />

      <select
        className="form-control mb-3"
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

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Enter Meta Title"
        value={productData.metatitle}
        onChange={(e) => setProductData({ ...productData, metatitle: e.target.value })}
      />

      <textarea
        className="form-control mb-3"
        placeholder="Enter Meta Description"
        rows={3}
        value={productData.metadescription}
        onChange={(e) => setProductData({ ...productData, metadescription: e.target.value })}
      ></textarea>

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Enter Meta Keywords (comma-separated)"
        value={productData.metakeyword}
        onChange={(e) => setProductData({ ...productData, metakeyword: e.target.value })}
      />

      <button className="btn btn-primary" onClick={handleSubmit}>
        Create SubCategory
      </button>
    </div>
  );
};

export default CreateSubCategory;
