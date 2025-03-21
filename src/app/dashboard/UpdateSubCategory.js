import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateSubCategory = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState([]); // Store subcategories
  const [allProducts, setAllProducts] = useState([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
  const [selectedDate, setSelectedDate] = useState(""); // Store selected filter date

  const [productData, setProductData] = useState({
    id: "",
    name: "",
    category: "",
    subcategory: "",
    products: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ✅ Fetch all subcategories
  const fetchCategories = async () => {
    try {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/subcategory`);
      setSelectedSubCategory(result.data);
    } catch (error) {
      toast.error("Error fetching subcategories:", error);
    }
  };

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/seller`);

      // Sort products by creation time (latest first)
      const sortedProducts = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.id || !productData.name || !productData.category || !productData.subcategory || productData.products.length === 0) {
      toast.error("Please fill in all fields and select at least one product.");
      return;
    }

    try {

      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/subcategory`, {
        id: productData.id,
        name: productData.name,
        category: productData.category,
        subcategory: productData.subcategory,
        products: productData.products,
      });


      if (response.status === 200 || response.status === 201) {
        toast.success("Product updated successfully!");
      
        // Refresh product list
        fetchProducts();
      
        setProductData({ id: "", name: "", category: "", subcategory: "", products: [] });
      }
       else {
        toast.error("Failed to update subcategory.");
      }
    } catch (error) {
      toast.error("Error updating subcategory:", error);
    }
  };

  // ✅ Handle subcategory selection
  const handleSubCategoryChange = (e) => {
    const selectedSubCat = selectedSubCategory.find((cat) => cat._id === e.target.value);
    if (selectedSubCat) {
      setProductData({
        ...productData,
        id: selectedSubCat._id,
        subcategory: selectedSubCat._id,
        category: selectedSubCat.category?._id || "",
      });
    }
  };

  // ✅ Handle selecting multiple products
  const handleProductChange = (e) => {
    const selectedProducts = Array.from(e.target.selectedOptions, (option) => option.value);
    setProductData({ ...productData, products: selectedProducts });
  };

  // ✅ Handle date filter
  const handleDateFilter = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);

    if (!selected) {
      setFilteredProducts(allProducts);
      return;
    }

    const selectedDate = new Date(selected).toDateString();
    const filtered = allProducts.filter((product) => new Date(product.createdAt).toDateString() === selectedDate);
    setFilteredProducts(filtered);
  };

  return (
    <div className="create-product-form">
      <h3>Add Product and Update in SubCategory</h3>

      {/* Product Name Input */}
      <input
        className="form-control mb-3"
        type="text"
        placeholder="Enter product name"
        value={productData.name}
        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
      />

      {/* Subcategory Dropdown */}
      <select className="form-control mb-3" value={productData.subcategory} onChange={handleSubCategoryChange}>
        <option value="">Select Subcategory</option>
        {selectedSubCategory.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Category Dropdown (Auto-filled) */}
      <select className="form-control mb-3" value={productData.category} disabled>
        <option value="">Select Category</option>
        {selectedSubCategory
          .filter((cat) => cat._id === productData.subcategory)
          .map((subCategory) => (
            <option key={subCategory.category._id} value={subCategory.category._id}>
              {subCategory.category.name}
            </option>
          ))}
      </select>

      {/* Date Filter */}
      <input className="form-control mb-3" type="date" value={selectedDate} onChange={handleDateFilter} />

      {/* Product Selection */}
      <select className="form-control mb-3" multiple value={productData.products} onChange={handleProductChange}>
        {filteredProducts.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} - {product.userId?.fullname || "Unknown"} ({new Date(product.createdAt).toLocaleString()})
          </option>
        ))}
      </select>

      {/* Submit Button */}
      <button className="btn btn-primary w-100 shadow" onClick={handleSubmit}>
        Update Product
      </button>

      {/* Products Table */}
      <table className="table mt-4 shadow">
  <thead>
    <tr>
      <th>Name</th>
      <th>Creator</th>
      <th>Created At</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {filteredProducts.map((product) => {
      const productSubcategory = product?.subCategory?._id;
      const selectedSubcategory = productData?.subcategory;
      const hasSubcategory = productSubcategory && selectedSubcategory
        ? String(productSubcategory) === String(selectedSubcategory)
        : false;

      return (
        <tr key={product._id} className={hasSubcategory ? "table-success" : "table-danger"}>
          <td>{product.name}</td>
          <td>{product.userId?.fullname || "Unknown"}</td>
          <td>{product.createdAt ? new Date(product.createdAt).toLocaleString() : "N/A"}</td>
          <td>
            {hasSubcategory ? (
              <span className="text-success fw-bold">✅ Subcategory Assigned</span>
            ) : (
              <span className="text-danger fw-bold">❌ No Subcategory</span>
            )}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

    </div>
  );
};

export default UpdateSubCategory;
