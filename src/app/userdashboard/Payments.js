import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Payments = () => {
  const [paymentDetail, setPaymentDetail] = useState(null);

  useEffect(() => {
    getPayment();
  }, []);

  const getPayment = async () => {
    try {
      const token = localStorage.getItem('token'); // Or however you store it
      const response = await axios.get(`/api/userprofile/profile/userprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentDetail(response.data.user);
    } catch (error) {
      console.log(`Something went wrong: ${error}`);
    }
  };

  return (
    <>
   <div className='payment-content'>
  <div className='container mt-5 mb-5'>
    <div className='shadow-lg p-4 rounded-4 border-0 bg-white'>
      <h2 className="title">All <span>Payments</span></h2>
      {/* 🧾 Current Package */}
      {paymentDetail && paymentDetail.userPackage ? (
        <>
          <h4 className='fw-semibold text-success mb-4'>
            Package: {paymentDetail.userPackage.packageName}
          </h4>

          <div className='row g-3'>
            <div className='col-md-4'>
              <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                <h6 className='text-muted'>Total Amount</h6>
                <h4 className='text-dark'>₹{paymentDetail.userPackage.totalAmount}</h4>
              </div>
            </div>

            <div className='col-md-4'>
              <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                <h6 className='text-muted'>Paid Amount</h6>
                <h4 className='text-success'>₹{paymentDetail.userPackage.paidAmount}</h4>
              </div>
            </div>

            <div className='col-md-4'>
              <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                <h6 className='text-muted'>Remaining Amount</h6>
                <h4 className='text-danger'>₹{paymentDetail.userPackage.remainingAmount}</h4>
              </div>
            </div>

            <div className='col-md-6'>
              <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                <h6 className='text-muted'>Start Date</h6>
                <h5>{new Date(paymentDetail.userPackage.packageStartDate).toLocaleDateString()}</h5>
              </div>
            </div>

            <div className='col-md-6'>
              <div className='p-3 border rounded-4 bg-light text-center shadow-sm'>
                <h6 className='text-muted'>Expiry Date</h6>
                <h5>{new Date(paymentDetail.userPackage.packageExpiryDate).toLocaleDateString()}</h5>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className='text-danger'>No Payments available</p>
      )}

      {/* 📜 Previous Packages */}
      {paymentDetail?.userPackageHistory?.length > 0 && (
        <div className='mt-5'>
          <h4 className='text-primary mb-3'>🧾 Previous Packages:</h4>
          <div className='row g-4'>
            {paymentDetail.userPackageHistory.map((pkg, index) => (
              <div className='col-md-6' key={index}>
                <div className='p-3 border rounded-4 bg-light shadow-sm'>
                  <h6 className='fw-bold text-secondary'>{pkg.packageName}</h6>
                  <p>Total: ₹{pkg.totalAmount}</p>
                  <p>Paid: ₹{pkg.paidAmount}</p>
                  <p>From: {new Date(pkg.packageStartDate).toLocaleDateString()}</p>
                  <p>To: {new Date(pkg.packageExpiryDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</div>

    </>
  );
};

export default Payments;
