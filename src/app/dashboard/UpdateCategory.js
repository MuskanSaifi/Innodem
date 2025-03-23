import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    id: "",
    name: "",
    icon: "",
    subcategories: [],
  });
  const [previewImage, setPreviewImage] = useState(""); // To show selected image preview

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const result = await axios.get(`/api/adminprofile/category`);
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find((cat) => cat._id === e.target.value);
    if (selectedCategory) {
      setCategoryData({
        id: selectedCategory._id,
        name: selectedCategory.name,
        icon: selectedCategory.icon || "",
        subcategories: selectedCategory.subcategories.map((sub) => sub._id),
      });

      setPreviewImage(selectedCategory.icon || ""); // Show existing category image
      setFilteredSubCategories(selectedCategory.subcategories);
    } else {
      setFilteredSubCategories([]);
    }
  };

  // ✅ Handle image selection & convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryData({ ...categoryData, icon: reader.result });
        setPreviewImage(reader.result); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.id || !categoryData.name) {
      toast.error("Please select a category and enter a name.");
      return;
    }

    try {
      const response = await axios.patch(`/api/adminprofile/category`, categoryData);

      if (response.status === 200) {
        toast.success("Category updated successfully!");
        setCategoryData({ id: "", name: "", icon: "", subcategories: [] });
        setPreviewImage(""); // Reset preview
        setFilteredSubCategories([]);
        fetchCategories(); // Refresh categories list
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

      {/* Icon Upload */}
      <input type="file" className="form-control mb-3" accept="image/*" onChange={handleImageChange} />

      {/* Image Preview */}
      {previewImage && (
        <div className="mb-3">
          <img src={previewImage} alt="Category Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
        </div>
      )}

      {/* Select Subcategories */}
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
