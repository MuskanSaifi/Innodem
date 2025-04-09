import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";
import "./metamodal.css"; // External CSS for modal


const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [metaForm, setMetaForm] = useState({
    id: "",
    name: "",
    metatitle: "",
    metadescription: "",
    metakeywords: "",
    categoryslug: "",
  });


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await axios.get(`/api/adminprofile/category`);
      setCategories(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleDateChange = (e) => setSearchDate(e.target.value);

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
        const response = await axios.delete(`/api/adminprofile/category?id=${categoryId}`);
        if (response.status === 200) {
          setCategories(categories.filter((c) => c._id !== categoryId));
          Swal.fire("Deleted!", "Category deleted.", "success");
        }
      } catch {
        Swal.fire("Error", "Failed to delete category", "error");
      }
    }
  };

  const filteredCategories = categories.filter((category) => {
    const categoryDate = category.createdAt
      ? new Date(category.createdAt).toISOString().split("T")[0]
      : null;

    return (
      (category.name?.toLowerCase().includes(searchTerm) ||
        category.subcategories?.some((sub) =>
          sub.name.toLowerCase().includes(searchTerm)
        )) &&
      (searchDate === "" || (categoryDate && categoryDate === searchDate))
    );
  });

  const openMetaModal = (category) => {
    setMetaForm({
      id: category._id,
      name: category.name || "",
      metatitle: category.metatitle || "",
      metadescription: category.metadescription || "",
      metakeywords: category.metakeywords || "",
      categoryslug: category.categoryslug || "",
    });

    setShowMetaModal(true);
  };

  const handleMetaUpdate = async () => {
    try {
      const response = await axios.patch(`/api/adminprofile/category/meta`, metaForm);
      if (response.status === 200) {
        Swal.fire("Success", "Category updated", "success");
        setShowMetaModal(false);
        fetchCategories();
      }
    } catch {
      Swal.fire("Error", "Failed to update category", "error");
    }
  };

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-")         // Replace spaces with hyphens
      .replace(/-+/g, "-");         // Collapse multiple hyphens


  return (
    <div className="container mt-4">
      {/* Search Filters */}
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

      {/* Table */}
      <table className="table table-bordered text-center">
        <thead className="bg-dark text-white">
          <tr>
            <th>Name</th>
            <th>Icon</th>
            <th>Subcategories</th>
            <th>Created At</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>
                  {category.icon && (
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={50}
                      height={50}
                    />
                  )}
                </td>
                <td>
                  {category.subcategories.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {category.subcategories.map((sub) => (
                        <li className="common-shad rounded-2 m-2" key={sub._id}>
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No Subcategories"
                  )}
                </td>
                <td>{new Date(category.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm w-100 mb-2"
                    onClick={() => openMetaModal(category)}
                  >
                    Update Category
                  </button>
                  <button
                    className="btn btn-danger btn-sm w-100"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete Category
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No matching categories found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showMetaModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Update Category Info</h4>
            <input
              type="text"
              placeholder="Category Name"
              value={metaForm.name}
              onChange={(e) =>
                setMetaForm({
                  ...metaForm,
                  name: e.target.value,
                  categoryslug: generateSlug(e.target.value),
                })
              }
            />

            <input
              type="text"
              placeholder="Category Slug"
              value={metaForm.categoryslug}
              disabled
            />


            <input
              type="text"
              placeholder="Meta Title"
              value={metaForm.metatitle}
              onChange={(e) => setMetaForm({ ...metaForm, metatitle: e.target.value })}
            />
            <input
              type="text"
              placeholder="Meta Description"
              value={metaForm.metadescription}
              onChange={(e) => setMetaForm({ ...metaForm, metadescription: e.target.value })}
            />
            <input
              type="text"
              placeholder="Meta Keywords"
              value={metaForm.metakeywords}
              onChange={(e) => setMetaForm({ ...metaForm, metakeywords: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={handleMetaUpdate}>Update</button>
              <button onClick={() => setShowMetaModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCategory;
