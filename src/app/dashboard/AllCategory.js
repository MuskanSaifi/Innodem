import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/adminprofile/category");  
      // Ensure data is an array
      if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        console.error("API response is not an array:", result.data);
        setCategories([]); // Set an empty array to prevent errors
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };
  

  // Handle delete category
  const handleDelete = async (categoryId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/adminprofile/category?id=${categoryId}`);
        if (response.status === 200) {
          setCategories(categories.filter((category) => category._id !== categoryId)); // Update UI
          Swal.fire("Deleted!", "Category has been deleted.", "success");
        } else {
          Swal.fire("Error", response.data.error || "Failed to delete category", "error");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        Swal.fire("Error", "Failed to delete category", "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">All Categories</h3>
      <table className="table table-striped table-bordered table-responsive text-center">
        <thead className="bg-dark text-white">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Icon</th>
            <th>Subcategories</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>{category.name}</td>
                <td>
                  {category.icon && <img src={category.icon} alt={category.name} width={50} />}
                </td>
                <td>
                  {category.subcategories.length > 0 ? (
                    <ul className="list-unstyled">
                      {category.subcategories.map((sub) => (
                        <li key={sub._id}>{sub.name}</li>
                      ))}
                    </ul>
                  ) : (
                    "No Subcategories"
                  )}
                </td>
                <td>{new Date(category.createdAt).toLocaleString()}</td>
                <td>{new Date(category.updatedAt).toLocaleString()}</td>
                <td>
                  <button className="btn btn-success btn-sm w-100 shadow mb-2">
                    Update Category
                  </button>
                  <button
                    className="btn btn-danger btn-sm w-100 shadow"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete Category
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllCategory;
