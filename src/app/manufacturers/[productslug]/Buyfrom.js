import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'; // Import SweetAlert2

const Buyfrom = ({ product, sellerId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [countryCode] = useState('+91'); // Assuming India
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [buyerId, setBuyerId] = useState(null);
  const [isLoadingBuyer, setIsLoadingBuyer] = useState(false);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const initializeBuyer = async () => {
      setIsLoadingBuyer(true);
      const currentProductName = product?.name || 'Unknown Product';

      let buyerDataToSend = {};
      let initialStep = 1;

      // Prioritize logged-in user data
      if (user && user._id) {
        buyerDataToSend = {
          fullname: user.fullname || '',
          email: user.email || '',
          mobileNumber: user.mobileNumber || '',
          countryCode: user.countryCode || '+91',
          productname: currentProductName,
        };
        // If user is logged in, we assume we have their full details, so we can proceed to step 2 immediately
        initialStep = 2; 
      } else {
        // Fallback to local storage for guests
        const savedPhone = localStorage.getItem('buyerPhone');
        const savedFullname = localStorage.getItem('buyerFullname');
        const savedEmail = localStorage.getItem('buyerEmail');

        if (savedPhone && savedFullname && savedEmail) {
          buyerDataToSend = {
            fullname: savedFullname,
            email: savedEmail,
            mobileNumber: savedPhone,
            countryCode, // Assuming default +91 for guests from local storage
            productname: currentProductName,
          };
          initialStep = 2; // If guest data found, proceed to step 2
        } else {
          // No user data, no guest data, start from step 1
          initialStep = 1;
        }
      }

      // If we have any data to send (either logged-in or saved guest data)
      if (Object.keys(buyerDataToSend).length > 0) {
        setPhone(buyerDataToSend.mobileNumber);
        setFullname(buyerDataToSend.fullname);
        setEmail(buyerDataToSend.email);
        setStep(initialStep); // Set the step based on whether data was found

        try {
          const res = await fetch('/api/buyer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buyerDataToSend),
          });

          const data = await res.json();

          if (res.ok && data.buyer && data.buyer._id) {
            setBuyerId(data.buyer._id);
            // Even if logged in, we update fields just in case they were empty or different
            setFullname(data.buyer.fullname || '');
            setEmail(data.buyer.email || '');
            setPhone(data.buyer.mobileNumber || '');
            setStep(2); // Always move to step 2 if buyer ID is successfully obtained/created
            console.log('Buyer initialized/updated successfully:', data.message);
          } else {
            console.warn('Failed to initialize/authenticate buyer:', data.error || 'Unknown error');
            // If fetching/creating buyer fails, revert to step 1 and clear local storage (if it was used)
            setStep(1);
            setBuyerId(null);
            if (!user?._id) { // Only clear local storage if it was a guest flow
              localStorage.removeItem('buyerPhone');
              localStorage.removeItem('buyerFullname');
              localStorage.removeItem('buyerEmail');
            }
          }
        } catch (error) {
          console.error('Error during buyer initialization:', error);
          setStep(1);
          setBuyerId(null);
          if (!user?._id) {
            localStorage.removeItem('buyerPhone');
            localStorage.removeItem('buyerFullname');
            localStorage.removeItem('buyerEmail');
          }
        }
      } else {
        setStep(1); // No user or saved guest data, start from step 1
        setBuyerId(null);
      }
      setIsLoadingBuyer(false);
    };

    if (isOpen) {
      initializeBuyer();
    }
  }, [isOpen, user, product?.name]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (isOpen && !buyerId) { 
      setStep(1);
      setPhone('');
      setFullname('');
      setEmail('');
      setBuyerId(null);
    }
  };

  const handleNext = async () => {
    if (phone.trim() === '' || phone.length < 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please enter a valid 10-digit phone number.',
      });
      return;
    }

    if (!fullname.trim() || !email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in your full name and email.',
      });
      return;
    }

    try {
      localStorage.setItem('buyerPhone', phone);
      localStorage.setItem('buyerFullname', fullname);
      localStorage.setItem('buyerEmail', email);

      const res = await fetch('/api/buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname,
          email,
          mobileNumber: phone,
          countryCode,
          productname: product?.name || 'Unknown Product',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error creating/retrieving buyer:', data.error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Error saving buyer information. Please try again.',
        });
        return;
      }

      if (data.buyer && data.buyer._id) {
        setBuyerId(data.buyer._id);
        setStep(2);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to obtain buyer ID from server. Please try again.',
        });
      }
    } catch (error) {
      console.error('Network or server error during buyer registration:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Server error during buyer registration. Please try again.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      product: product._id,
      quantity,
      unit: product.unit,
      approxOrderValue: {
        amount: product.tradeShopping?.slabPricing?.[0]?.price || product.price,
        currency: 'INR',
      },
      buyer: buyerId,
      requirementFrequency: 'one-time',
      seller: sellerId,
    };

    try {
      const res = await fetch('/api/purchaserequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.warn('No JSON response or empty response from /api/purchaserequest:', jsonErr);
      }

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Order Submitted!',
          text: 'Your order has been submitted successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        setIsOpen(false);
      } else {
        console.error('Error response from /api/purchaserequest:', data);
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: data?.error || 'Something went wrong submitting your order.',
        });
      }
    } catch (err) {
      console.error('API Error during order submission:', err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Server error during order submission. Please try again.',
      });
    }
  };

  return (
    <>
      <button onClick={toggleModal} className=" bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold py-2 px-3 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2">
        <span>🛒</span> Purchase Product
      </button>

      {isOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal} className="p-4 rounded shadow-lg bg-white relative max-w-md mx-auto mt-24">
            <button onClick={toggleModal} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold">
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-3">Confirm Purchase</h2>

            {isLoadingBuyer ? (
              <p className="text-center py-4">Loading your details...</p>
            ) : (
              <>
                {step === 1 && (
                  <>
                    <label className="block mb-2 text-gray-700">Full Name</label>
                    <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Your full name" className="w-full border border-gray-300 rounded px-3 py-2 mb-3" />
                    <label className="block mb-2 text-gray-700">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full border border-gray-300 rounded px-3 py-2 mb-3" />
                    <label className="block mb-2 text-gray-700">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />
                    <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full">
                      Next
                    </button>
                  </>
                )}

         {step === 2 && (
<form onSubmit={handleSubmit}>
<h3 className="font-semibold text-lg">Product: {product.name}</h3>
<div>
 <label className="block text-gray-700 mb-3">Quantity</label>
<input
 type="number"
value={quantity === 0 || quantity === '' ? '' : String(quantity)}
onChange={(e) => {
const val = e.target.value;
if (val === '') {
 setQuantity(''); // Set to empty string if input is cleared
 } else {
 const parsedVal = parseInt(val, 10);
 if (!isNaN(parsedVal)) {
 setQuantity(parsedVal); // Only update if it's a valid number
 } }
}}
min="1"
 className="w-full border border-gray-300 rounded px-3 py-2"
 />
</div>
 <button type="submit" className="bg-blue-600 mt-3 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full">
Submit Order </button>
</form>
)}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  
  modal: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '25px',
    marginTop: '5%',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
  },
};

export default Buyfrom;