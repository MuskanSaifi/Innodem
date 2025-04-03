"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Spinner } from "react-bootstrap";
import Image from "next/image"; // Import Next.js Image

const BlogDetail = () => {
  const params = useParams();
  const slug = params?.slug; // Ensure slug is properly extracted

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}`);
        if (!response.ok) throw new Error("Blog not found");
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog(); // Fetch only if slug exists
  }, [slug]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
 <>
    <Container className="mt-5 mb-5">
      {/* <h1 className="text-center fw-bold">{blog?.title}</h1> */}
   <div>
   {blog?.image && (
     <Image
     src={blog.image || "/placeholder.png"}
     alt={blog.title}
     layout="responsive" // Makes the image 100% width
     width={1000} // Base width (ignored in responsive mode)
     height={450} // Aspect ratio is maintained
     className="rounded img-fluid"
     style={{ objectFit: "cover", width: "100%" }} // Ensures it stretches to full width
     priority
   />
      )}
   </div>

      <p className="text-muted text-center mt-3">
        Published on {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </Container>
    </>
  );
};

export default BlogDetail;
