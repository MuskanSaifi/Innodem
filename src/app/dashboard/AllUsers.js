import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Button, Accordion, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state for name, email, company, mobile
  const [searchDate, setSearchDate] = useState(""); // ✅ Search state for registration date
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/users`
      );
      
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


  const handleDeleteUser = async (userId) => {
    if (!userId) return;
  
    // Confirm delete action
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the user and their products!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const response = await axios.delete(`/api/adminprofile/users?userId=${userId}`);
  
      if (response.data.success) {
        Swal.fire("Deleted!", response.data.message, "success");
        setUsers(users.filter((user) => user._id !== userId)); // ✅ Remove from UI
      } else {
        Swal.fire("Error!", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire("Error!", "Failed to delete user", "error");
    }
  };

  

  // ✅ Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // ✅ Handle date filter change
  const handleDateFilter = (e) => {
    setSearchDate(e.target.value);
  };

  // ✅ Filter users based on searchTerm and date
  const filteredUsers = users.filter((user) => {
    const userDate = user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : null; // ✅ Prevent invalid dates
  
    return (
      (user.fullname?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.companyName?.toLowerCase().includes(searchTerm) ||
        user.mobileNumber?.includes(searchTerm)) &&
      (searchDate === "" || (userDate && userDate === searchDate)) // ✅ Ensure date is valid before comparing
    );
  });
  

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 res-color2 text-light w-50 rounded-5	m-auto  p-2 common-shad">All Users & Their Products</h2>

      {/* ✅ Search & Date Filter */}
      <Form className="mb-3 d-flex gap-2 res-color2 rounded-3 common-shad p-3">
        <Form.Control
          type="text"
          placeholder="Search by name, email, company name, or phone number"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Form.Control
          type="date"
          value={searchDate}
          onChange={handleDateFilter}
        />
        <Button variant="secondary" onClick={() => { setSearchTerm(""); setSearchDate(""); }}>
          Reset
        </Button>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="common-shad">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Company</th>
              <th>Registered On</th> {/* ✅ Added Date */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {filteredUsers.length > 0 ? (
    filteredUsers.map((user, index) => (
      <React.Fragment key={user._id}>
        <tr>
          <td>{index + 1}</td>
          <td>{user.fullname}</td>
          <td>{user.email}</td>
          <td>{user.mobileNumber}</td>
          <td>{user.companyName}</td>
          <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
          <td>
  <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>
    Delete
  </Button>
</td>

        </tr>

        {/* ✅ New row for product details with accordion */}
        <tr>
          <td colSpan="7">
            {user.products?.length > 0 ? (
              <Accordion>
                {user.products.map((product, i) => (
                  <Accordion.Item key={product._id} eventKey={i.toString()}>
                    <Accordion.Header>
                      <strong>{product.name}</strong> - ₹{product.price} {product.currency}
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
              <span className="text-muted">No products available</span>
            )}
          </td>
        </tr>
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center">No matching users found.</td>
    </tr>
  )}
</tbody>


        </Table>
      )}
    </div>
  );
};

export default AllUsers;
