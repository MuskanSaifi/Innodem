"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";

const Buyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await fetch("/api/adminprofile/buyers");
        if (!response.ok) throw new Error("Failed to fetch buyers");
        const data = await response.json();
        setBuyers(data.buyers);
        setFilteredBuyers(data.buyers); // Set initial filtered data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  // ✅ Search Filter
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterBuyers(e.target.value, searchDate);
  };

  // ✅ Date Filter
  const handleDateFilter = (e) => {
    setSearchDate(e.target.value);
    filterBuyers(searchTerm, e.target.value);
  };

  // ✅ Filter Logic
  const filterBuyers = (term, date) => {
    let filtered = buyers;
    if (term) {
      filtered = filtered.filter(
        (buyer) =>
          buyer.fullname.toLowerCase().includes(term.toLowerCase()) ||
          buyer.email.toLowerCase().includes(term.toLowerCase()) ||
          buyer.mobileNumber.includes(term) ||
          buyer.productname.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (date) {
      filtered = filtered.filter((buyer) =>
        buyer.otpExpires ? buyer.otpExpires.startsWith(date) : false
      );
    }
    setFilteredBuyers(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 res-color2 text-light w-50 rounded-5 m-auto p-2 common-shad">
        All Buyers
      </h2>

      {/* ✅ Search & Date Filter */}
      <Form className="mb-3 d-flex gap-2 res-color2 rounded-3 common-shad p-3">
        <Form.Control
          type="text"
          placeholder="Search by name, email, or phone number"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Form.Control type="date" value={searchDate} onChange={handleDateFilter} />
        <Button
          variant="secondary"
          onClick={() => {
            setSearchTerm("");
            setSearchDate("");
            setFilteredBuyers(buyers);
          }}
        >
          Reset
        </Button>
      </Form>

      {loading && <p>Loading buyers...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {!loading && !error && filteredBuyers.length === 0 && <p>No buyers found.</p>}

      {!loading && !error && filteredBuyers.length > 0 && (
        <Table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          className="table-striped table-bordered table-hover table-responsive common-shad"
        >
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Product Name</th>
              <th>Registered On</th> {/* ✅ Added Date */}
            </tr>
          </thead>
          <tbody>
            {filteredBuyers.map((buyer, index) => (
              <tr key={buyer._id}>
                <td>{index + 1}</td>
                <td>{buyer.fullname || "N/A"}</td>
                <td>{buyer.email || "N/A"}</td>
                <td>{buyer.mobileNumber}</td>
                <td>{buyer.productname}</td>
                <td>{buyer.createdAt ? new Date(buyer.createdAt).toLocaleDateString() : "N/A"}</td>

              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Buyers;
