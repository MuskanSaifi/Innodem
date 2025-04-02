import { useEffect, useState } from 'react';

const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('/api/blogs');
                if (!response.ok) throw new Error('Failed to fetch blogs');
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

    // Function to delete a blog by ID
    const deleteBlog = async (id) => {
        try {
            const response = await fetch(`/api/blogs?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
            } else {
                // Remove the deleted blog from the state
                setBlogs(blogs.filter(blog => blog._id !== id));
                alert('Blog deleted successfully');
            }
        } catch (error) {
            setError('Failed to delete the blog');
        }
    };

    return (
        <div className='container mt-4'>
            <div className='common-shad p-4 rounded-3'>
                <h1 className='fs-2'>📝 All Blogs</h1>
                {loading && <p>Loading blogs...</p>}
                {error && <p className='text-danger'>Error: {error}</p>}
                {!loading && !error && blogs.length === 0 && <p>No blogs found.</p>}
                {!loading && blogs.length > 0 && (
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Created At</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, index) => (
                                <tr key={blog._id}>
                                    <td>{index + 1}</td>
                                    <td>{blog.title}</td>
                                    <td>{blog.author}</td>
                                    <td>{blog.category}</td>
                                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteBlog(blog._id)}
                                            className='btn btn-danger'>
                                            Delete
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
