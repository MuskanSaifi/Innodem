import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Payments = () => {
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [loading, setLoading] = useState(true); // 🔁 New state

  useEffect(() => {
    getPayment();
  }, []);

  const getPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/userprofile/profile/userprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentDetail(response.data.user);
    } catch (error) {
      console.log(`Something went wrong: ${error}`);
    } finally {
      setLoading(false); // ✅ Done loading
    }
  };

  const getLatestPackage = () => {
    if (!paymentDetail?.userPackage || paymentDetail.userPackage.length === 0) return null;
    return paymentDetail.userPackage[paymentDetail.userPackage.length - 1];
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='payment-content'>
      <div className='container mt-5 mb-5'>
        <div className='shadow-lg p-4 rounded-4 border-0 bg-white'>
          <h2 className="title">All <span>Payments</span></h2>

          {/* 🧾 Current Package */}
          {paymentDetail && paymentDetail.userPackage?.length > 0 ? (
            <>
              <h4 className='fw-semibold text-success'>
                 Package: {getLatestPackage()?.packageName}
              </h4>
              <h3 className='text-sm'>
                Package Price ₹{parseInt(getLatestPackage()?.totalAmount / 1.18)}
             </h3>

              <div className='row g-3'>
                <div className='col-md-4'>
                  <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                    <h6 className='text-muted'>Total Amount with GST (18%)</h6>
                    <h4 className='text-dark'>₹{getLatestPackage()?.totalAmount}</h4>
                  </div>
                </div>

                <div className='col-md-4'>
                  <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                    <h6 className='text-muted'>Paid Amount</h6>
                    <h4 className='text-success'>₹{getLatestPackage()?.paidAmount}</h4>
                  </div>
                </div>

                <div className='col-md-4'>
                  <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                    <h6 className='text-muted'>Remaining Amount</h6>
                    <h4 className='text-danger'>₹{getLatestPackage()?.remainingAmount}</h4>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                    <h6 className='text-muted'>Start Date</h6>
                    <h5>{new Date(getLatestPackage()?.packageStartDate).toLocaleDateString('en-GB')}</h5>
                    </div>
                </div>

                <div className='col-md-6'>
                  <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                    <h6 className='text-muted'>Expiry Date</h6>
                    <h5>{new Date(getLatestPackage()?.packageExpiryDate).toLocaleDateString('en-GB')}</h5>
                    </div>
                </div>
              </div>
            </>
          ) : (
            <p className='text-danger'>No Payments available</p>
          )}

          {/* 📜 All Payments */}
          {paymentDetail?.userPackage?.length > 1 && (
  <div className='mt-5'>
    <h4 className='text-primary mb-3'>🧾 All Packages:</h4>
    <div className='row g-4'>
  {paymentDetail.userPackage
    .slice(0, -1)
    .reverse()
    .map((pkg, index) => (
      <div className='col-md-6' key={index}>
        <div className='p-4 border rounded-4 bg-white shadow-sm h-100'>
          <h6 className='fw-bold text-secondary mb-3'>{pkg.packageName}</h6>

          <div className='mb-2'>
            <span className='fw-medium'>Total: </span>
            <span className='badge bg-primary text-light px-2 py-1'>
              ₹{Number(pkg.totalAmount).toLocaleString()}
            </span>
          </div>

          <div className='mb-2'>
            <span className='fw-medium'>Paid: </span>
            <span className='badge bg-success text-light px-2 py-1'>
              ₹{Number(pkg.paidAmount).toLocaleString()}
            </span>
          </div>

          <div className='mb-2'>
            <span className='fw-medium'>Remaining: </span>
            <span className={`badge px-2 py-1 ${Number(pkg.remainingAmount) === 0 ? 'bg-secondary' : 'bg-danger'}`}>
              ₹{Number(pkg.remainingAmount).toLocaleString()}
            </span>
          </div>

          <div className='mt-3'>
            <p className='mb-1'><strong>From:</strong> {new Date(pkg.packageStartDate).toLocaleDateString('en-GB')}</p>
            <p className='mb-0'><strong>To:</strong> {new Date(pkg.packageExpiryDate).toLocaleDateString('en-GB')}</p>
          </div>
        </div>
      </div>
    ))}
</div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default Payments;
