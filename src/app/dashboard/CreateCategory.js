import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateCategory = () => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    icon: "",
    isTrending: false,
    subcategories: "", // Optional subcategory input
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.name) {
      toast.error("Please enter the category name.");
      return;
    }

    const formattedData = {
      name: categoryData.name,
      icon: categoryData.icon || null,
      isTrending: categoryData.isTrending,
      subcategories: categoryData.subcategories
        ? categoryData.subcategories.split(",").map((id) => id.trim())
        : [],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/adminprofile/category",
        formattedData
      );

      if (response.status === 201) {
        toast.success("Category created successfully!");
        setCategoryData({ name: "", icon: "", isTrending: false, subcategories: "" });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category. Please try again.");
    }
  };

  return (
    <div>
      <h3>Create a New Category</h3>
      <input
        className="form-control mb-3"
        type="text"
        name="name"
        placeholder="New Category Name"
        value={categoryData.name}
        onChange={handleChange}
      />
      <input
        className="form-control mb-3"
        type="text"
        name="icon"
        placeholder="Icon URL (optional)"
        value={categoryData.icon}
        onChange={handleChange}
      />
      <input
        className="form-control mb-3"
        type="text"
        name="subcategories"
        placeholder="Subcategory IDs (comma-separated, optional)"
        value={categoryData.subcategories}
        onChange={handleChange}
      />
      <label>
        <input
          type="checkbox"
          name="isTrending"
          checked={categoryData.isTrending}
          onChange={handleChange}
        />
        Trending Category
      </label>
      <br />
      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        Create Category
      </button>
    </div>
  );
};

export default CreateCategory;
