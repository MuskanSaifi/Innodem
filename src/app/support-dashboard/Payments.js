import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('/api/adminprofile/payments');
        setPayments(response.data.data || []);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const toggleDropdown = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  const filteredPayments = payments.filter((user) =>
    `${user.fullname} ${user.email} ${user.mobileNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
        <div className="relative shadow-lg p-4 border-0 rounded-xl overflow-hidden">

      <h1 className="fs-4 fw-bold mb-4">💸 All User Payments</h1>

    <div className="absolute top-16 left-0 w-full z-[1050]">

          <input
            type="text"
            className="form-control shadow-sm w-50 m-auto"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Padding to prevent input overlap */}
<div className="pt-10">
        <div className="d-flex justify-content-between align-items-center mb-3">
  <h5 className="text-primary">Total Users: {filteredPayments.length}</h5>
</div>

<div className="overflow-auto max-h-[500px]">
  {filteredPayments.length === 0 ? (
    <p className="text-center text-muted">No matching users found.</p>
  ) : (
    filteredPayments.map((user, userIndex) => (
      <div key={user._id} className="mb-3">
        <button
          className="res-color1 w-100 text-start rounded-2 px-4 py-2 shadow-sm"
          onClick={() => toggleDropdown(user._id)}
        >
          <strong>{user.fullname}</strong> ({user.email} {user.mobileNumber})
        </button>

        {expandedUserId === user._id && (
          <div className="mt-3">
            {user.userPackage?.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-bordered mt-2 shadow-sm">
                  <thead className="table-primary sticky-top">
                    <tr>
                      <th>S. No</th>
                      <th>Package Name</th>
                      <th>Total Amount</th>
                      <th>Paid</th>
                      <th>Remaining</th>
                      <th>Start Date</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.userPackage.map((pkg, idx) => {
                      const isRemaining = parseFloat(pkg.remainingAmount) > 0;
                      const remainingClass = isRemaining ? 'text-danger fw-bold' : 'text-success';

                      return (
                        <tr key={idx} className="text-sm">
                          <td>{idx + 1}</td>
                          <td>{pkg.packageName}</td>
                          <td className="text-primary">₹{pkg.totalAmount}</td>
                          <td className="text-success">₹{pkg.paidAmount}</td>
                          <td className={remainingClass}>₹{pkg.remainingAmount}</td>
                          <td>{new Date(pkg.packageStartDate).toLocaleDateString()}</td>
                          <td>{new Date(pkg.packageExpiryDate).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No active packages for this user.</p>
            )}
          </div>
        )}
      </div>
    ))
  )}
</div>


        </div>

      </div>
    </div>
  );
};

export default Payments;
