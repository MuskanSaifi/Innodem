import { useState } from "react";
import { toast } from "react-hot-toast";

// Slug generator function
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function CreateCategoryForm() {
  const [name, setName] = useState("");
  const [categoryslug, setCategorySlug] = useState("");
  const [metatitle, setMetaTitle] = useState("");
  const [metadescription, setMetaDescription] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_category_upload");
    formData.append("folder", "categories");

    const res = await fetch("https://api.cloudinary.com/v1_1/dchek3sr8/image/upload", {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const errorText = await res.text();
      throw new Error("Cloudinary upload failed. Check your settings.");
    }

    const data = await res.json();
    if (!data.secure_url) {
      throw new Error(data.error?.message || "Image upload failed.");
    }

    return data.secure_url;
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let iconUrl = "";

      if (file) {
        toast.loading("Uploading image...");
        iconUrl = await uploadImageToCloudinary(file);
        toast.dismiss();
        toast.success("Image uploaded!");
      }

      const response = await fetch("/api/adminprofile/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          categoryslug,
          metatitle,
          metadescription,
          icon: iconUrl,
          isTrending,
          subcategories,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create category");

      toast.success("Category created successfully!");
      setName("");
      setCategorySlug("");
      setMetaTitle("");
      setMetaDescription("");
      setIsTrending(false);
      setFile(null);
    } catch (err) {
      console.error("❌ Error creating category:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateCategory} className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => {
          const value = e.target.value;
          setName(value);
          setCategorySlug(generateSlug(value));
        }}
        required
        className="border p-2 w-full"
      />

      <input
        type="text"
        placeholder="Category Slug"
        value={categoryslug}
        onChange={(e) => setCategorySlug(generateSlug(e.target.value))}
        required
        className="border p-2 w-full"
      />

      <input
        type="text"
        placeholder="Meta Title"
        value={metatitle}
        onChange={(e) => setMetaTitle(e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Meta Description"
        value={metadescription}
        onChange={(e) => setMetaDescription(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
        className="border p-2 w-full"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isTrending}
          onChange={(e) => setIsTrending(e.target.checked)}
        />
        <span>Is Trending</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}
