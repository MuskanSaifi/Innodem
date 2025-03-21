import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";

const AllSubcategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all subcategories
  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/subcategory/allsubcategory`
      );
      setSubCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setLoading(false);
    }
  };

  // Delete a subcategory
  const deleteSubCategory = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the subcategory!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/subcategory/allsubcategory?id=${id}`
        );        
        Swal.fire("Deleted!", "Subcategory has been deleted.", "success");
        setSubCategories(subCategories.filter((subcategory) => subcategory._id !== id)); // Remove from UI
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        Swal.fire("Error!", "Failed to delete subcategory.", "error");
      }
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">All Subcategories</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table className="striped bordered hover responsive">
          <thead className="bg-dark text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.length > 0 ? (
              subCategories.map((subcategory, index) => (
                <tr key={subcategory._id}>
                  <td>{index + 1}</td>
                  <td>{subcategory.name}</td>
                  <td>{subcategory.category?.name || "N/A"}</td>
                  <td>{subcategory.products.length}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteSubCategory(subcategory._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No subcategories found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AllSubcategory;
