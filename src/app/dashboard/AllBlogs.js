import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filterBlogs = (term, date) => {
    let filtered = blogs;
    if (term) {
      filtered = filtered.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(term.toLowerCase()) ||
          blog.author?.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (date) {
      filtered = filtered.filter((blog) => blog.createdAt?.startsWith(date));
    }
    setFilteredBlogs(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterBlogs(e.target.value, searchDate);
  };

  const handleDateFilter = (e) => {
    setSearchDate(e.target.value);
    filterBlogs(searchTerm, e.target.value);
  };

  const deleteBlog = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/blogs?id=${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error);
          } else {
            setBlogs(blogs.filter((blog) => blog._id !== id));
            setFilteredBlogs(filteredBlogs.filter((blog) => blog._id !== id));
            Swal.fire("Deleted!", "Your blog has been deleted.", "success");
          }
        } catch (error) {
          setError("Failed to delete the blog");
          Swal.fire("Error!", "Failed to delete the blog.", "error");
        }
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h1 className="fs-2">📝 All Blogs</h1>

        <div className="mb-3 d-flex gap-3 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={handleSearch}
          />
          <input
            type="date"
            className="form-control"
            value={searchDate}
            onChange={handleDateFilter}
          />
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm("");
              setSearchDate("");
              setFilteredBlogs(blogs);
            }}
          >
            Reset
          </button>
        </div>

        {loading && <p>Loading blogs...</p>}
        {error && <p className="text-danger">Error: {error}</p>}
        {!loading && !error && filteredBlogs.length === 0 && <p>No blogs found.</p>}

        {!loading && filteredBlogs.length > 0 && (
          <table className="table table-bordered table-hover mt-2">
            <thead className="table-dark">
              <tr className="bg-dark text-light">
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td>{index + 1}</td>
                  <td>
                    <Image
                      src={blog.image?.startsWith("http") ? blog.image : "/placeholder.png"}
                      alt={blog.title}
                      width={80}
                      height={80}
                      className="rounded img-fluid"
                      style={{ objectFit: "cover" }}
                      priority={false}
                    />
                  </td>
                  <td>{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>{blog.category}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => deleteBlog(blog._id)} className="btn btn-danger">
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;