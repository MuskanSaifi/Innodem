import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import Blog from "@/models/Blogs";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream"; // ✅ Import for Buffer conversion

// ✅ Convert File to Buffer
const fileToBuffer = async (file) => {
  const chunks = [];
  const stream = file.stream();
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

// ✅ Upload Image to Cloudinary
const uploadToCloudinary = async (image) => {
  try {
    const buffer = await fileToBuffer(image);
    const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "blogs",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });
    return { imageUrl: result.secure_url, imagePublicId: result.public_id };
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
};

// ✅ Create Blog
export async function POST(req) {
  try {
    await connectdb();
    const formData = await req.formData();
    const title = formData.get("title")?.trim();
    const slug = formData.get("slug")?.trim();
    const author = formData.get("author")?.trim();
    const content = formData.get("content")?.trim();
    const metaTitle = formData.get("metaTitle")?.trim();
    const metaDescription = formData.get("metaDescription")?.trim();
    const metaKeywords = formData.get("metaKeywords")?.trim();

    if (!title || !metaKeywords || !slug || !author || !content) {
      console.log("❌ Missing required fields!");
      return NextResponse.json({ error: "Required fields missing!" }, { status: 400 });
    }

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      console.log("❌ Slug already in use!");
      return NextResponse.json({ error: "Slug already in use!" }, { status: 400 });
    }

    let imageUrl = "";
    let imagePublicId = "";
    const image = formData.get("image");

    if (image && image.size > 0) {
      console.log("📤 Uploading image to Cloudinary...");
      const uploadResult = await uploadToCloudinary(image);
      imageUrl = uploadResult.imageUrl;
      imagePublicId = uploadResult.imagePublicId;
      console.log("✅ Image Uploaded:", imageUrl);
    }

    console.log("⚡ Before saving to database:", {
      title,
      slug,
      author,
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
      image: imageUrl,  
    });

    const newBlog = new Blog({
      title,
      slug,
      author,
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
      image: imageUrl,
      imagePublicId: imagePublicId,
    });
    
    await newBlog.save();

    return NextResponse.json({ success: true, message: "Blog created successfully!", blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Get all blogs
export async function GET() {
  try {
    await connectdb();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE a blog
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    await connectdb();
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId);
        console.log("✅ Image deleted from Cloudinary");
      } catch (error) {
        console.error("❌ Cloudinary Image Delete Error:", error);
      }
    }

    await Blog.findByIdAndDelete(blogId);

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
