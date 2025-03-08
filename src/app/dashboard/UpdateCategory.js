import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateCategory = () => {
  const [categories, setCategories] = useState([]); // Store all categories
  const [filteredSubCategories, setFilteredSubCategories] = useState([]); // Subcategories of selected category
  const [categoryData, setCategoryData] = useState({
    id: "", // Selected category ID
    name: "",
    icon: "",
    subcategories: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/adminprofile/category");
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find((cat) => cat._id === e.target.value);
    if (selectedCategory) {
      setCategoryData({
        id: selectedCategory._id,
        name: selectedCategory.name,
        icon: selectedCategory.icon || "",
        subcategories: selectedCategory.subcategories.map((sub) => sub._id), // Store only subcategory IDs
      });

      // ✅ Filter only subcategories belonging to selected category
      setFilteredSubCategories(selectedCategory.subcategories);
    } else {
      setFilteredSubCategories([]); // Reset subcategories if no category is selected
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.id || !categoryData.name) {
      toast.error("Please select a category and enter a name.");
      return;
    }

    try {
      console.log("Submitting data: ", categoryData);
      const response = await axios.patch("http://localhost:3000/api/adminprofile/category", categoryData);
      console.log("Response from server: ", response);

      if (response.status === 200) {
        toast.success("Category updated successfully!");
        setCategoryData({ id: "", name: "", icon: "", subcategories: [] });
        setFilteredSubCategories([]); // Reset subcategories after update
      } else {
        toast.error("Failed to update category.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category. Please try again.");
    }
  };

  return (
    <div className="update-category-form">
      <h3>Update Category & Subcategories</h3>

      {/* Select Category */}
      <select className="form-control mb-3" value={categoryData.id} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Category Name Input */}
      <input
        className="form-control mb-3"
        type="text"
        placeholder="Enter category name"
        value={categoryData.name}
        onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
      />

      {/* Icon Input */}
      <input
        className="form-control mb-3"
        type="text"
        placeholder="Enter category icon URL (optional)"
        value={categoryData.icon}
        onChange={(e) => setCategoryData({ ...categoryData, icon: e.target.value })}
      />

      {/* Select Subcategories of Selected Category */}
      <select
        className="form-control mb-3"
        multiple
        value={categoryData.subcategories}
        onChange={(e) =>
          setCategoryData({
            ...categoryData,
            subcategories: Array.from(e.target.selectedOptions, (option) => option.value),
          })
        }
      >
        {filteredSubCategories.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {sub.name}
          </option>
        ))}
      </select>
      
      {/* Submit Button */}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Update Category
      </button>
    </div>
  );
};

export default UpdateCategory;
