import { notFound } from "next/navigation";
import BlogDetail from "./BlogDetail";
import connectdb from "@/lib/dbConnect";
import Blog from "@/models/Blogs";

export async function generateMetadata({ params }) {
  await connectdb();
  const blog = await Blog.findOne({ slug: params.slug }).lean();

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog was not found.",
    };
  }

  return {
    title: `${blog.metaTitle || "Blog Title"}`,
    description: blog.metaDescription || "Blog Description",
    keywords: `${blog.metaKeywords || "Blog Keywords"}`,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || "Default blog description",
      keywords: blog.metaKeywords || "Default blog Keywords",
      images: blog.image ? [`https://yourdomain.com${blog.image}`] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  await connectdb();
const blog = await Blog.findOne({ slug: params.slug }).lean();
if (!blog) return notFound();

// Convert to plain object
const blogData = JSON.parse(JSON.stringify(blog));

// Add a formatted date string (ISO-safe)
blogData.formattedDate = new Date(blog.createdAt).toISOString().split("T")[0]; // e.g., "2025-04-30"

return <BlogDetail blog={blogData} />;

}
