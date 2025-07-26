// src/app/dashboard/UpdateCategory.js
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image"; // For inline images

// Helper to generate slug, reused from CreateCategoryForm
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};


const UpdateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]); // To hold all subcategories for the dropdown
  const [categoryData, setCategoryData] = useState({
    id: "",
    name: "",
    icon: "",
    categoryslug: "", // Added
    metatitle: "", // Added
    metadescription: "", // Added
    metakeywords: "", // Added (matching schema)
    content: "", // Added
    isTrending: false, // Added
    subcategories: [],
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false); // To prevent slug auto-update on every change

  // Tiptap Editor for content
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: true, // Consider using Cloudinary for prod
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5] }),
      Bold, Italic, Underline, BulletList, OrderedList, ListItem, Blockquote, CodeBlock,
      Link.configure({ openOnClick: false }),
    ],
    content: categoryData.content, // Initial content from categoryData
    onUpdate: ({ editor }) => {
      setCategoryData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Effect to update editor content when categoryData.content changes (e.g., when a new category is selected)
  useEffect(() => {
    if (editor && editor.getHTML() !== categoryData.content) {
      editor.commands.setContent(categoryData.content || "", false);
    }
  }, [categoryData.content, editor]);


  useEffect(() => {
    fetchCategories();
    fetchAllSubCategories(); // Fetch all subcategories for the selection dropdown
  }, []);

  // Auto-generate slug when name changes, unless manually edited
  useEffect(() => {
    if (!slugEdited && categoryData.id) { // Only auto-generate if a category is selected and slug not manually edited
      setCategoryData((prev) => ({
        ...prev,
        categoryslug: generateSlug(prev.name),
      }));
    }
  }, [categoryData.name, slugEdited, categoryData.id]);


  // Fetch categories
  const fetchCategories = async () => {
    try {
      const result = await axios.get(`/api/adminprofile/category`);
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  // Fetch all subcategories
  const fetchAllSubCategories = async () => {
    try {
      const result = await axios.get(`/api/adminprofile/subcategory`); // Assuming this API returns all subcategories
      setAllSubCategories(result.data);
    } catch (error) {
      console.error("Error fetching all subcategories:", error);
      toast.error("Failed to fetch subcategories.");
    }
  };

  // Handle category selection
  const handleCategorySelectChange = (e) => {
    const selectedCat = categories.find((cat) => cat._id === e.target.value);
    if (selectedCat) {
      setCategoryData({
        id: selectedCat._id,
        name: selectedCat.name,
        icon: selectedCat.icon || "",
        categoryslug: selectedCat.categoryslug || "",
        metatitle: selectedCat.metatitle || "",
        metadescription: selectedCat.metadescription || "",
        metakeywords: selectedCat.metakeywords || "",
        content: selectedCat.content || "",
        isTrending: selectedCat.isTrending || false,
        subcategories: selectedCat.subcategories.map((sub) => sub._id), // Extract IDs
      });
      setPreviewImage(selectedCat.icon || "");
      setSlugEdited(false); // Reset slugEdited when a new category is selected
    } else {
      // Reset form if no category is selected
      setCategoryData({
        id: "", name: "", icon: "", categoryslug: "", metatitle: "",
        metadescription: "", metakeywords: "", content: "", isTrending: false,
        subcategories: []
      });
      setPreviewImage("");
      editor?.commands.clearContent();
      setSlugEdited(false);
    }
  };

  // Handle direct input changes for text fields, including slug
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "categoryslug") {
      setSlugEdited(true); // Mark slug as manually edited
    }
  };

  // Handle image selection & convert to Base64
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

  // Handle inline image upload for editor
  const handleInlineImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      // This API endpoint handles Cloudinary upload for inline images in categories
      const res = await fetch("/api/upload-category-editor-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        console.error("❌ Failed to get URL from inline image upload.");
        toast.error("Failed to upload inline image.");
      }
    };
    input.click();
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!categoryData.id) {
      toast.error("Please select a category to update.");
      setLoading(false);
      return;
    }
    if (!categoryData.name || !categoryData.categoryslug || !categoryData.metatitle || !categoryData.metadescription || !categoryData.metakeywords) {
      toast.error("Please fill in all required text fields.");
      setLoading(false);
      return;
    }


    try {
      const response = await axios.patch(`/api/adminprofile/category`, categoryData);

      if (response.status === 200) {
        toast.success("Category updated successfully!");
        // Reset form
        setCategoryData({
          id: "", name: "", icon: "", categoryslug: "", metatitle: "",
          metadescription: "", metakeywords: "", content: "", isTrending: false,
          subcategories: []
        });
        setPreviewImage("");
        editor?.commands.clearContent();
        setSlugEdited(false);
        fetchCategories(); // Refresh categories list
      }
    } catch (error) {
      console.error("Error updating category:", error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || "Failed to update category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-category-form p-4">
      <h3>Update Category & Add Subcategories in category</h3>

      {/* Select Category */}
      <div className="mb-3">
        <label htmlFor="selectCategory" className="form-label">Select Category:</label>
        <select
          id="selectCategory"
          className="form-control"
          value={categoryData.id}
          onChange={handleCategorySelectChange}
        >
          <option value="">-- Select a Category --</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {categoryData.id && ( // Only show form if a category is selected
        <form onSubmit={handleSubmit}>
          {/* Category Name Input */}
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">Category Name:</label>
            <input
              id="categoryName"
              className="form-control"
              type="text"
              name="name"
              placeholder="Enter category name"
              value={categoryData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Category Slug Input */}
          <div className="mb-3">
            <label htmlFor="categorySlug" className="form-label">Category Slug:</label>
            <input
              id="categorySlug"
              className="form-control"
              type="text"
              name="categoryslug"
              placeholder="Category URL Slug"
              value={categoryData.categoryslug}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Meta Title */}
          <div className="mb-3">
            <label htmlFor="metaTitle" className="form-label">Meta Title:</label>
            <input
              id="metaTitle"
              className="form-control"
              type="text"
              name="metatitle"
              placeholder="Meta Title"
              value={categoryData.metatitle}
              onChange={handleInputChange}
            />
          </div>

          {/* Meta Description */}
          <div className="mb-3">
            <label htmlFor="metaDescription" className="form-label">Meta Description:</label>
            <textarea
              id="metaDescription"
              className="form-control"
              name="metadescription"
              placeholder="Meta Description"
              rows="3"
              value={categoryData.metadescription}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Meta Keywords */}
          <div className="mb-3">
            <label htmlFor="metaKeywords" className="form-label">Meta Keywords:</label>
            <input
              id="metaKeywords"
              className="form-control"
              type="text"
              name="metakeywords"
              placeholder="Meta Keywords (comma-separated)"
              value={categoryData.metakeywords}
              onChange={handleInputChange}
            />
          </div>

          {/* Rich Text Editor for Content */}
          <div className="mb-3">
            <label htmlFor="categoryContent" className="form-label">Category Content:</label>
            {editor && (
              <div className="toolbar mb-2 border rounded p-2 bg-light">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="btn btn-sm btn-outline-secondary me-1">Bold</button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="btn btn-sm btn-outline-secondary me-1">Italic</button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn btn-sm btn-outline-secondary me-1">Underline</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="btn btn-sm btn-outline-secondary me-1">H1</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn btn-sm btn-outline-secondary me-1">H2</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="btn btn-sm btn-outline-secondary me-1">H3</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn btn-sm btn-outline-secondary me-1">Bullet List</button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn btn-sm btn-outline-secondary me-1">Ordered List</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="btn btn-sm btn-outline-secondary me-1">Blockquote</button>
                <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="btn btn-sm btn-outline-secondary me-1">Code</button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter link URL");
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                  }}
                  className="btn btn-sm btn-outline-secondary me-1"
                >
                  Link
                </button>
                <button
                  type="button"
                  onClick={handleInlineImageUpload}
                  className="btn btn-sm btn-outline-secondary me-1"
                >
                  Upload Inline Image
                </button>
              </div>
            )}
            <div className="editor-wrapper border p-2 rounded bg-white">
              {editor ? <EditorContent editor={editor} className="min-h-[200px]" /> : <p>Loading Editor...</p>}
            </div>
          </div>


          {/* Icon Upload */}
          <div className="mb-3">
            <label htmlFor="categoryIcon" className="form-label">Category Icon:</label>
            <input id="categoryIcon" type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Image Preview */}
          {previewImage && (
            <div className="mb-3">
              <Image
                src={previewImage}
                alt="Category Preview"
                width={100}
                height={100}
                className="object-cover"
                unoptimized
                onError={(e) => console.error("Image failed to load", e)}
              />
            </div>
          )}

          {/* Is Trending Checkbox */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isTrending"
              name="isTrending"
              checked={categoryData.isTrending}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="isTrending">Is Trending</label>
          </div>


          {/* Select Subcategories */}
          <div className="mb-3">
            <label htmlFor="selectSubcategories" className="form-label">Select Subcategories:</label>
            <select
              id="selectSubcategories"
              className="form-control"
              multiple
              value={categoryData.subcategories}
              onChange={(e) =>
                setCategoryData({
                  ...categoryData,
                  subcategories: Array.from(e.target.selectedOptions, (option) => option.value),
                })
              }
            >
              {allSubCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.category?.name || 'Unassigned'})
                </option>
              ))}
            </select>
            <small className="form-text text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple subcategories.</small>
          </div>

          {/* Submit Button */}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Category"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateCategory;