// app/api/blogs/route.js (For Next.js 13+ with App Router)
import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import Blog from "@/models/Blogs";

// Create a new blog
export async function POST(req) {
  try {
    await connectdb();
    const body = await req.json(); // Parse JSON from the request body
    const { title, author, content, category, tags, image } = body;

    const newBlog = new Blog({
      title,
      author,
      content,
      category,
      tags,
      image,
    });

    await newBlog.save();
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get all blogs
export async function GET() {
  try {
    await connectdb();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




// DELETE a blog by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('id');

    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    await connectdb();

    // Find and delete the blog by ID
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    
    if (!deletedBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
