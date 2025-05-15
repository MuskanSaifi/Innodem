"use client";

import Image from "next/image";
import { Container } from "react-bootstrap";
import { format } from "date-fns"; // For better date formatting

import '../blogs.css'; 

const BlogDetail = ({ blog }) => {
  const formattedDate = blog?.formattedDate
    ? format(new Date(blog.formattedDate), "MMMM dd, yyyy") // Format the date to something like "April 30, 2025"
    : "N/A";

  return (
    <Container className="mt-5 mb-5">
      {/* Blog Image */}
      {blog?.image && (
        <Image
          src={blog.image || "/placeholder.png"}
          alt={blog.title}
          width={840}
          height={420}
          priority
          className="m-auto"
        />
      )}

      {/* Published Date */}
      <p className="text-muted text-center mt-3">
        Published on {formattedDate}
      </p>

      {/* Blog Content */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </Container>
  );
};

export default BlogDetail;
