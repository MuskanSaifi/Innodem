"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Pagination } from "react-bootstrap";
import Image from "next/image"; // Import Next.js Image


const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4; // Adjusted to fit the design properly

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Pagination Logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
 <>

<div className="text-center">
  <Image
    src={"/assets/OUR BLOGS.jpg" || "/placeholder.png"}
    alt="Blog Banner"
    layout="responsive" // Makes the image 100% width
    width={1000} // Base width (ignored in responsive mode)
    height={400} // Aspect ratio is maintained
    className="rounded img-fluid"
    style={{ objectFit: "cover", width: "100%" }} // Ensures it stretches to full width
    priority
  />
</div>


    <Container className="mt-5 mb-5">
      <h1 className="title">Our <span>Blogs</span></h1>

      {loading && <p className="text-center">Loading blogs...</p>}
      {error && <p className="text-danger text-center">Error: {error}</p>}
      {!loading && !error && currentBlogs.length === 0 && (
        <p className="text-center">No blogs found.</p>
      )}

      <Row className="justify-content-center">
        {currentBlogs.map((blog) => (
          <Col md={3} sm={6} xs={12} key={blog._id} className="mb-4">
            <Card className="h-100 common-shad border-0 rounded-3 overflow-hidden">
            <div style={{ height: "180px", overflow: "hidden" }}>
  <div className="relative w-full h-full">
    <Image
      src={blog.image || "/placeholder.png"}
      alt={blog.title}
      layout="fill"
      className="object-contain"
    />
  </div>
</div>


              <Card.Body className="text-center">
                <Card.Title className="fw-bold">{blog.title}</Card.Title>
                <Card.Text className="text-muted" style={{ fontSize: "14px" }}>
                  {blog.metaDescription
                    ? blog.metaDescription.length > 100
                      ? blog.metaDescription.slice(0, 100) + "..."
                      : blog.metaDescription
                    : "No description available."}
                </Card.Text>
                <Link variant="primary" className="w-50 rounded-pill fw-semibold btn btn-primary" href={`/blogs/${blog.slug}`}>
                  Read More
                </Link>

              </Card.Body>
              <Card.Footer className="bg-light text-center small text-muted">
                Published on {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Unknown date"}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </Container>
    </>
  );
};

export default BlogPage;
