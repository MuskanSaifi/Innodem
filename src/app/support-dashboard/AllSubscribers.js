"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get("/api/subscribers");
      if (response.data.success) {
        setSubscribers(response.data.subscribers.reverse());
        setFilteredSubscribers(response.data.subscribers);
      } else {
        setError("Failed to fetch subscribers.");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show popup instead of delete
  const handleDelete = () => {
    Swal.fire({
      icon: "info",
      title: "Restricted Action",
      text: "Only admin can delete subscribers",
      confirmButtonColor: "#3085d6",
    });
  };

  // ✅ Filter Logic
  useEffect(() => {
    let filtered = subscribers;

    if (searchEmail) {
      filtered = filtered.filter((subscriber) =>
        subscriber.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter((subscriber) => {
        const subscriberDate = new Date(subscriber.createdAt).toISOString().split("T")[0];
        return subscriberDate === filterDate;
      });
    }

    setFilteredSubscribers(filtered);
  }, [searchEmail, filterDate, subscribers]);

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h1 className="fs-4 fw-bold mb-4">📩 All Subscribers</h1>

        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-muted">Loading subscribers...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : filteredSubscribers.length === 0 ? (
          <p className="text-muted">No subscribers found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Subscribed On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber, index) => (
                  <tr key={subscriber._id}>
                    <td>{index + 1}</td>
                    <td>{subscriber.email}</td>
                    <td>
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      }).format(new Date(subscriber.createdAt))}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={handleDelete}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSubscribers;
