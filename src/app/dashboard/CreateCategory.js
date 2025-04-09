import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CreateCategoryForm() {
  const [name, setName] = useState("");
  const [metatitle, setMetaTitle] = useState("");
  const [metadescription, setMetaDescription] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Upload to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_category_upload"); // Replace with your unsigned preset
    formData.append("folder", "categories");
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dchek3sr8/image/upload", {
      method: "POST",
      body: formData,
    });
  
    const contentType = res.headers.get("content-type");
  
    if (!res.ok || !contentType?.includes("application/json")) {
      const errorText = await res.text(); // get raw HTML or error
      console.error("💥 Cloudinary error:", errorText);
      throw new Error("Cloudinary upload failed. Please check your upload preset and cloud name.");
    }
  
    const data = await res.json();
  
    if (!data.secure_url) {
      throw new Error(data.error?.message || "Image upload failed.");
    }
  
    return data.secure_url;
  };
  
  
  // Step 2: Handle Submit
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
      // reset form
      setName("");
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
        onChange={(e) => setName(e.target.value)}
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

      {/* Optional: Subcategories input */}
      {/* Add your subcategory selection logic here */}

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
