'use client';
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddClientPayment = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    packageName: '',
    totalAmount: '',
    paidAmount: '',
    remainingAmount: '',
    packageStartDate: '',
    packageExpiryDate: '',
    orderId: '',
    transactionId: '',
    paymentMethod: '',
    payerEmail: '',
    payerMobile: '',
    paymentResponse: '',
    supportPerson: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/support-admins/add-user-payment', {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount),
        remainingAmount: Number(formData.remainingAmount),
        paymentResponse: { note: 'Manual entry from support form' }
      });
      toast.success('User and Payment saved successfully!');
      setFormData({
        fullname: '',
        email: '',
        mobileNumber: '',
        companyName: '',
        packageName: '',
        totalAmount: '',
        paidAmount: '',
        remainingAmount: '',
        packageStartDate: '',
        packageExpiryDate: '',
        orderId: '',
        transactionId: '',
        paymentMethod: '',
        payerEmail: '',
        payerMobile: '',
        paymentResponse: '',
        supportPerson: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-r from-gray-100 via-white to-gray-100 flex items-center justify-center py-12 px-4">
  <Toaster />
  <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-10">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Add Client & Payment</h2>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* === Client Info === */}
      <div className="col-span-full">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Client Info</h3>
        <hr className="mb-4" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Full Name *</label>
        <input name="fullname" placeholder="Full Name" className="input-style" value={formData.fullname} onChange={handleChange} required />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Email</label>
        <input name="email" placeholder="Email" className="input-style" value={formData.email} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Mobile Number *</label>
        <input name="mobileNumber" placeholder="Mobile Number" className="input-style" value={formData.mobileNumber} onChange={handleChange} required />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Company Name</label>
        <input name="companyName" placeholder="Company Name" className="input-style" value={formData.companyName} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Support Person</label>
        <input name="supportPerson" placeholder="Support Person" className="input-style" value={formData.supportPerson} onChange={handleChange} />
      </div>

      {/* === Package Details === */}
      <div className="col-span-full pt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Package Details</h3>
        <hr className="mb-4" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Package Name *</label>
        <input name="packageName" placeholder="Package Name" className="input-style" value={formData.packageName} onChange={handleChange} required />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Total Amount</label>
        <input type="number" name="totalAmount" placeholder="Total Amount" className="input-style" value={formData.totalAmount} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Paid Amount</label>
        <input type="number" name="paidAmount" placeholder="Paid Amount" className="input-style" value={formData.paidAmount} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Remaining Amount</label>
        <input type="number" name="remainingAmount" placeholder="Remaining Amount" className="input-style" value={formData.remainingAmount} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Start Date</label>
        <input type="date" name="packageStartDate" className="input-style" value={formData.packageStartDate} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Expiry Date</label>
        <input type="date" name="packageExpiryDate" className="input-style" value={formData.packageExpiryDate} onChange={handleChange} />
      </div>

      {/* === Payment Info === */}
      <div className="col-span-full pt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Payment Info</h3>
        <hr className="mb-4" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Order ID *</label>
        <input name="orderId" placeholder="Order ID" className="input-style" value={formData.orderId} onChange={handleChange} required />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Transaction ID</label>
        <input name="transactionId" placeholder="Transaction ID" className="input-style" value={formData.transactionId} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Payment Method</label>
        <input name="paymentMethod" placeholder="Payment Method" className="input-style" value={formData.paymentMethod} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Payer Email</label>
        <input name="payerEmail" placeholder="Payer Email" className="input-style" value={formData.payerEmail} onChange={handleChange} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Payer Mobile</label>
        <input name="payerMobile" placeholder="Payer Mobile" className="input-style" value={formData.payerMobile} onChange={handleChange} />
      </div>

      {/* Submit Button */}
      <div className="col-span-full text-center pt-6">
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300"
        >
          Save Client & Payment
        </button>
      </div>
    </form>
  </div>
</div>


  );
};

export default AddClientPayment;
