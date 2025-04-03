"use client";

import { useState, useEffect } from "react";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";  // ✅ Import SweetAlert2

// ✅ Initial State for Form Data
const initialState = {
  title: "",
  slug: "",
  author: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
};

const CreateBlog = () => {
  const [formData, setFormData] = useState(initialState);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ TipTap Editor Setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      Link.configure({ openOnClick: false }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    setFormData((prev) => {
      // Agar slug manually edit hua hai toh use preserve karein
      if (prev.slugEdited) return prev;
  
      return {
        ...prev,
        slug: prev.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-") // Special characters -> "-"
          .replace(/^-+|-+$/g, ""), // Extra hyphens remove
      };
    });
  }, [formData.title]);
  
  // ✅ Allow Manual Slug Editing
  const handleSlugChange = (e) => {
    setFormData({ ...formData, slug: e.target.value, slugEdited: true });
  };

  


  // ✅ File Upload Preview
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // ✅ Handle Form Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Upload
  const handleImageUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("slug", formData.slug);
      formDataObj.append("author", formData.author);
      formDataObj.append("content", formData.content);
      formDataObj.append("metaTitle", formData.metaTitle);
      formDataObj.append("metaDescription", formData.metaDescription);
      
      if (file) {
        formDataObj.append("image", file);
      }

      const response = await axios.post("/api/blogs", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      }); 

      if (response.status === 201) {
        // ✅ Success Alert
        Swal.fire({
          icon: "success",
          title: "Blog Created!",
          text: "Your blog has been successfully created.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Go to Dashboard",
        }).then(() => {
          router.push("/dashboard");
        });
      }
    } catch (error) {
      console.error("❌ Submission Error:", error);
      setError(error.response?.data?.error || "Failed to create blog. Please try again!");

      // ❌ Error Alert
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.error || "Something went wrong. Try again!",
        confirmButtonColor: "#d33",
      });
    }

    setLoading(false);
  };
  return (
    <div className="container mt-4">
      <div className="card p-4 rounded-3 shadow-sm">
        <h1 className="fs-3 mb-4">📝 Create Blog</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>

        <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder="Meta Title"
            className="form-control mb-2"
          />
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="Meta Description"
            className="form-control mb-2"
          />

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Blog Title"
            required
            className="form-control mb-2"
          />
<input
  type="text"
  name="slug"
  value={formData.slug}
  onChange={handleSlugChange}
  placeholder="Slug (Blog Url) automatic generated"
  className="form-control mb-2"
/>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author"
            required
            className="form-control mb-2"
          />

          {/* ✅ TipTap Toolbar */}
          {editor && (
            <div className="toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
<button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
<button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
<button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
<button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
<button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
<button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>Ordered List</button>
<button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Blockquote</button>
<button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
<button type="button" onClick={() => editor.chain().focus().setLink({ href: prompt("Enter link URL") }).run()}>
  Link
</button>

            </div>
          )}

          {/* ✅ TipTap Editor */}
          <div className="border p-1 mb-2 rounded bg-white">
            {editor ? <EditorContent editor={editor} /> : <p>Loading Editor...</p>}
          </div>

          <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control mb-2" />
          {preview && <img src={preview} alt="Preview" className="img-fluid rounded mb-2" style={{ maxWidth: "300px" }} />}

     
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
