import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Button, Accordion } from "react-bootstrap";
import Swal from "sweetalert2";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all users and their products
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/adminprofile/users");
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete user function with Swal confirmation
  const handleDeleteUser = async (userId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the user and all associated products!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/adminprofile/users?userId=${userId}`);
        if (response.data.success) {
          setUsers(users.filter((user) => user._id !== userId)); // ✅ Remove from UI
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } else {
          Swal.fire("Error", "Failed to delete user.", "error");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">All Users & Their Products</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Company</th>
              <th>Products</th>
              <th>Action</th> {/* ✅ Delete button column */}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNumber}</td>
                  <td>{user.companyName}</td>
                  <td>
                    {user.products?.length > 0 ? (
                      <Accordion>
                        {user.products.map((product, i) => (
                          <Accordion.Item key={product._id} eventKey={i.toString()}>
                            <Accordion.Header>
                              {product.name} - ₹{product.price} {product.currency}
                            </Accordion.Header>
                            <Accordion.Body>
                              <h6>Trade Information:</h6>
                              <ul>
                                <li>Supply Ability: {product.tradeInformation?.supplyAbility || "N/A"}</li>
                                <li>Delivery Time: {product.tradeInformation?.deliveryTime || "N/A"}</li>
                                <li>Payment Terms: {product.tradeInformation?.paymentTerms || "N/A"}</li>
                              </ul>
                              
                              <h6>Specifications:</h6>
                              <ul>
                                <li>Material: {product.specifications?.material || "N/A"}</li>
                                <li>Finish: {product.specifications?.finish || "N/A"}</li>
                                <li>Thickness: {product.specifications?.thickness || "N/A"}</li>
                              </ul>

                              <h6>Trade Shopping:</h6>
                              <ul>
                                <li>Brand Name: {product.tradeShopping?.brandName || "N/A"}</li>
                                <li>GST: {product.tradeShopping?.gst || "N/A"}%</li>
                                <li>Stock Quantity: {product.tradeShopping?.stockQuantity || "N/A"}</li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    ) : (
                      "No products available"
                    )}
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AllUsers;
