"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Slug generator function (reused from other components)
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const CreateSubCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    subcategoryslug: "",
    metatitle: "",
    metadescription: "",
    metakeyword: "",
  });
  const [file, setFile] = useState(null); // ✅ State for the image file
  const [loading, setLoading] = useState(false); // ✅ Added loading state for button
  const [slugEdited, setSlugEdited] = useState(false); // To prevent slug auto-update on manual edit

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Auto-generate slug when name changes, unless manually edited
  useEffect(() => {
    setProductData((prev) => {
      if (slugEdited) return prev; // If slug was manually edited, don't auto-update
      return {
        ...prev,
        subcategoryslug: generateSlug(prev.name),
      };
    });
  }, [productData.name, slugEdited]); // Depend on name and slugEdited

  const fetchCategories = async () => {
    try {
      const result = await axios.get(`/api/adminprofile/category`);
      setSelectedCategory(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    if (name === "subcategoryslug") {
      setSlugEdited(true); // Mark slug as manually edited
    }
  };

  // ✅ New function to upload image to Cloudinary (similar to category form)
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
formData.append("upload_preset", "unsigned_subcategory_upload"); // This must match the preset name created in Step 1
    const res = await fetch("https://api.cloudinary.com/v1_1/dchek3sr8/image/upload", { // Replace 'dchek3sr8' with your Cloudinary cloud name
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const errorText = await res.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const data = await res.json();
    if (!data.secure_url || !data.public_id) {
      throw new Error(data.error?.message || "Image upload failed: Missing URL or Public ID.");
    }

    return { secure_url: data.secure_url, public_id: data.public_id }; // Return both
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const { name, category, subcategoryslug, metatitle, metadescription, metakeyword } = productData;

    if (!name || !category || !subcategoryslug || !metatitle || !metadescription || !metakeyword) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    let iconUrl = "";
    let iconPublicId = "";

    if (file) {
      toast.loading("Uploading subcategory icon...");
      try {
        const uploadResult = await uploadImageToCloudinary(file);
        iconUrl = uploadResult.secure_url;
        iconPublicId = uploadResult.public_id;
        toast.dismiss();
        toast.success("Subcategory icon uploaded!");
      } catch (uploadError) {
        console.error("Error uploading subcategory icon:", uploadError);
        toast.dismiss();
        toast.error(uploadError.message || "Failed to upload subcategory icon.");
        setLoading(false);
        return; // Stop execution if image upload fails
      }
    }

    try {
      const response = await axios.post(`/api/adminprofile/subcategory`, {
        name,
        category,
        subcategoryslug,
        metatitle,
        metadescription,
        metakeyword,
        icon: iconUrl,           // ✅ Send icon URL
        iconPublicId: iconPublicId, // ✅ Send icon Public ID
      });

      if (response.status === 201) {
        toast.success("SubCategory created successfully!");
        setProductData({
          name: "",
          category: "",
          subcategoryslug: "",
          metatitle: "",
          metadescription: "",
          metakeyword: "",
        });
        setFile(null); // ✅ Clear file input
        setSlugEdited(false);
      }
    } catch (error) {
      console.error("Error creating Sub Category:", error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || "Failed to create Sub Category. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="create-product-form p-4">
      <h3>Create a New SubCategory</h3>

      <input
        className="form-control mb-3"
        type="text"
        name="name"
        placeholder="Enter SubCategory Name"
        value={productData.name}
        onChange={handleInputChange}
        required
      />

      <input
        className="form-control mb-3"
        type="text"
        name="subcategoryslug"
        placeholder="SubCategory Slug (URL)"
        value={productData.subcategoryslug}
        onChange={handleInputChange}
        required
      />

      <select
        className="form-control mb-3"
        name="category"
        value={productData.category}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Category</option>
        {selectedCategory.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* ✅ File input for SubCategory Icon */}
      <div className="mb-3">
        <label htmlFor="subcategoryIcon" className="form-label">SubCategory Icon</label>
        <input
          type="file"
          className="form-control"
          id="subcategoryIcon"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Subcategory Icon Preview"
            className="mt-2"
            style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
          />
        )}
      </div>

      <input
        className="form-control mb-3"
        type="text"
        name="metatitle"
        placeholder="Enter Meta Title"
        value={productData.metatitle}
        onChange={handleInputChange}
        required
      />

      <textarea
        className="form-control mb-3"
        name="metadescription"
        placeholder="Enter Meta Description"
        rows={3}
        value={productData.metadescription}
        onChange={handleInputChange}
        required
      ></textarea>

      <input
        className="form-control mb-3"
        type="text"
        name="metakeyword"
        placeholder="Enter Meta Keywords (comma-separated)"
        value={productData.metakeyword}
        onChange={handleInputChange}
        required
      />

      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create SubCategory"}
      </button>
    </div>
  );
};

export default CreateSubCategory;