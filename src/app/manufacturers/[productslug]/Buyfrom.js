import React, { useState, useEffect } from 'react';

const Buyfrom = ({ product, sellerId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [countryCode] = useState('+91');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [buyerId, setBuyerId] = useState(null);

  useEffect(() => {
    const savedPhone = localStorage.getItem('buyerPhone');
    if (savedPhone) {
      setPhone(savedPhone);
      setStep(2);
    }
  }, []);


  const toggleModal = () => setIsOpen(!isOpen);

  const handleNext = async () => {
    if (phone.trim() === '' || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    if (!fullname || !email) {
      alert('Please fill in all the fields');
      return;
    }

    try {
      localStorage.setItem('buyerPhone', phone);

      const res = await fetch('/api/buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname,
          email,
          mobileNumber: phone,
          countryCode,
          productname: product.name,
          quantity,
          unit: product.unit,
          orderValue: product.price,
          currency: 'INR',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Error saving buyer');
        return;
      }

      const data = await res.json();
      if (data.buyer && data.buyer._id) {
        setBuyerId(data.buyer._id);
        setStep(2);
      } else {
        alert('Buyer ID not found');
        return;
      }
    } catch (error) {
      alert('Server error while saving buyer');
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!buyerId) {
    alert('Buyer ID is missing');
    return;
  }

  const orderData = {
    productname: product.name,
    quantity,
    unit: product.unit,
    orderValue: product.price,
    currency: 'INR',
    buyer: buyerId,
    requirementFrequency: 'One-time',
    sellerId: sellerId._id,
    productId: product._id,
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
      console.warn('No JSON response:', jsonErr);
    }

    if (res.ok) {
      alert('Order submitted successfully!');
      setIsOpen(false);
    } else {
      console.error('Error response:', data);
      alert(data?.error || 'Something went wrong');
    }
  } catch (err) {
    console.error('API Error:', err);
    alert('Server error');
  }
};


  return (
    <>
      <button onClick={toggleModal} className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2">
        <span>🛒</span> Purchase Product
      </button>

      {isOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal} className="p-4 rounded shadow-lg bg-white relative max-w-md mx-auto mt-24">
            <button onClick={toggleModal} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold">
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-3">Confirm Purchase</h2>

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
                <div className="mt-3">
                  <label className="block mb-2 text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    min="1"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full mt-4">
                  Submit Order
                </button>
              </form>
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
