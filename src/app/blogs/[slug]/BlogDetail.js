"use client";

import Image from "next/image";
import { Container } from "react-bootstrap";

const BlogDetail = ({ blog }) => {
  return (
    <Container className="mt-5 mb-5">
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

<p className="text-muted text-center mt-3">
  Published on {blog.formattedDate}
</p>


      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </Container>
  );
};

export default BlogDetail;
