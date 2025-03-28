import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";


const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state
  const [searchDate, setSearchDate] = useState(""); // ✅ Date filter

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const result = await axios.get(`/api/adminprofile/category`);
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

  // ✅ Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // ✅ Handle date filter change
  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  // ✅ Filter categories based on searchTerm and date
  const filteredCategories = categories.filter((category) => {
    const categoryDate = category.createdAt ? new Date(category.createdAt).toISOString().split("T")[0] : null;

    return (
      (category.name.toLowerCase().includes(searchTerm) || 
        category.subcategories.some((sub) => sub.name.toLowerCase().includes(searchTerm))) &&
      (searchDate === "" || (categoryDate && categoryDate === searchDate))
    );
  });

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
        const response = await axios.delete(
          `/api/adminprofile/category?id=${categoryId}`
        );
        
        if (response.status === 200) {
          setCategories(categories.filter((category) => category._id !== categoryId));
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
      {/* ✅ Search Filters */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by category or subcategory name"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={searchDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={() => setSearchTerm("")}>
            Clear Filter
          </button>
        </div>
      </div>

      {/* Table Section */}
      <table className="table table-striped table-bordered table-responsive text-center">
        <thead className="bg-dark text-white">
          <tr>
            {/* <th>ID</th> */}
            <th>Name</th>
            <th>Icon</th>
            <th>Subcategories</th>
            <th>Created At</th>
            {/* <th>Updated At</th> */}
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <tr key={category._id}>
                {/* <td>{category._id}</td> */}
                <td>{category.name}</td>
                <td>
                {category.icon && (
  <Image 
    src={category.icon} 
    alt={category.name} 
    width={50} 
    height={50} 
    className="object-cover"
  />
)}                </td>
                <td>
                  {category.subcategories.length > 0 ? (
                    <ul className="list-unstyled">
                      {category.subcategories.map((sub) => (
                        <li className="common-shad m-1 rounded-1 text-dark" key={sub._id}>{sub.name}</li>
                      ))}
                    </ul>
                  ) : (
                    "No Subcategories"
                  )}
                </td>
                <td>{new Date(category.createdAt).toLocaleString()}</td>
                {/* <td>{new Date(category.updatedAt).toLocaleString()}</td> */}
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
                No matching categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllCategory;
