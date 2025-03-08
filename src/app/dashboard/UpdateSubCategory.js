import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateSubCategory = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState([]); // Store subcategories
  const [allProducts, setAllProducts] = useState([]); // Store products
  const [productData, setProductData] = useState({
    id: "", // Store selected subcategory ID
    name: "",
    category: "",
    subcategory: "",
    products: [], // Store multiple selected products
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/adminprofile/subcategory");
      setSelectedSubCategory(result.data); // Store fetched subcategories
    } catch (error) {
      toast.error("Error fetching subcategories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/adminprofile/seller");
      setAllProducts(result.data); // Store fetched products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.id || !productData.name || !productData.category || !productData.subcategory || productData.products.length === 0) {
      toast.error("Please fill in all required fields and select at least one product.");
      return;
    }

    try {
      console.log("Submitting data: ", productData); // Log data for debugging

      const response = await axios.patch("http://localhost:3000/api/adminprofile/subcategory", {
        id: productData.id, // Ensure id is passed
        name: productData.name,
        category: productData.category,
        subcategory: productData.subcategory,
        products: productData.products, // Send the selected products as an array
      });

      console.log("Response from server: ", response); // Log response for debugging

      if (response.status === 200 || response.status === 201) {
        toast.success("Product Updated successfully!");
        setProductData({
          id: "",
          name: "",
          category: "",
          subcategory: "",
          products: [],
        });
      } else {
        toast.error("Failed to update Sub Category. Please try again.");
      }
    } catch (error) {
      toast.error("Error updating Sub Category:", error);
      toast.error("Failed to update Sub Category. Please try again.");
    }
  };

  // Handle changing the subcategory
  const handleSubCategoryChange = (e) => {
    const selectedSubCat = selectedSubCategory.find((cat) => cat._id === e.target.value);
    if (selectedSubCat) {
      setProductData({
        ...productData,
        id: selectedSubCat._id, // Store subcategory ID
        subcategory: selectedSubCat._id,
        category: selectedSubCat.category?._id || "", // Ensure category ID is set correctly
      });
    }
  };

  // Handle selecting multiple products
  const handleProductChange = (e) => {
    const selectedProducts = Array.from(e.target.selectedOptions, (option) => option.value);
    setProductData({
      ...productData,
      products: selectedProducts, // Store the selected product IDs as an array
    });
  };

  return (
    <div className="create-product-form">
      <h3>Add Product and Update in SubCategory</h3>

      {/* Product Name Input */}
      <input
        className="form-control mb-3"
        type="text"
        id="product-name"
        placeholder="Enter product name"
        value={productData.name}
        onChange={(e) =>
          setProductData({ ...productData, name: e.target.value })
        }
      />

      {/* Subcategory Dropdown */}
      <select
        className="form-control mb-3"
        id="product-subcategory"
        value={productData.subcategory}
        onChange={handleSubCategoryChange} // Handle subcategory selection
      >
        <option value="">Select Subcategory</option>
        {selectedSubCategory.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Category Dropdown */}
      <select
        className="form-control mb-3"
        id="product-category"
        value={productData.category}
        onChange={(e) =>
          setProductData({ ...productData, category: e.target.value })
        }
        disabled // This is auto-filled from subcategory selection
      >
        <option value="">Select Category</option>
        {selectedSubCategory
          .filter((cat) => cat._id === productData.subcategory)
          .map((subCategory) => (
            <option key={subCategory.category._id} value={subCategory.category._id}>
              {subCategory.category.name}
            </option>
          ))}
      </select>

      {/* Products Dropdown (Multiple Selection) */}
      <select
        className="form-control mb-3"
        id="product-category"
        multiple
        value={productData.products}
        onChange={handleProductChange} // Handle multiple product selection
      >
        <option value="">Select Products</option>
        {allProducts.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name}
          </option>
        ))}
      </select>

      {/* Submit Button */}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Update Product
      </button>
    </div>
  );
};

export default UpdateSubCategory;
