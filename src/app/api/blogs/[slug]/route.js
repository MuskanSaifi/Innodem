import connectdb from "@/lib/dbConnect";
import Blog from "@/models/Blogs";

export async function GET(request, contextPromise) {
  const context = await contextPromise; // ✅ await the second param

  try {
    await connectdb();

    const slug = context.params.slug; // now safely accessible

    if (!slug) {
      return new Response(JSON.stringify({ message: "Slug is required" }), {
        status: 400,
      });
    }

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return new Response(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(blog), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch blog", error: error.message }),
      { status: 500 }
    );
  }
}
