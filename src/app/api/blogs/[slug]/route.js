import connectdb from "@/lib/dbConnect";
import Blog from "@/models/Blogs";

export const GET = async (req, { params }) => {
  try {
    await connectdb();

    if (!params || !params.slug) {
      return new Response(JSON.stringify({ message: "Slug is required" }), { status: 400 });
    }

    const { slug } = params; // Extract slug properly after checking params

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return new Response(JSON.stringify({ message: "Blog not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(blog), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch blog", error: error.message }), { status: 500 });
  }
};
