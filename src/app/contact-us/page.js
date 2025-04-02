import React from 'react';
import { FaBuilding, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';


const Page = () => {
  return (
    <section>
<h1 className='text-3xl font-bold mb-2 text-center mt-5 bg-gray-100 p-2'>Contact Us</h1>
        <div className='container m-5'>
            <div className='row bg-gray-100 p-5'>
            <div className='col-md-6'>
            <h2 className="text-2xl font-bold mb-2">
                        To make requests for further information, <span className="text-blue-600">contact us</span> via our social channels.
                    </h2>
                    <p className="text-gray-600 text-sm">
                        We just need a couple of hours! No more than 2 working days since receiving your issue ticket.
                    </p>
                    <h2 className="text-2xl font-bold mt-3">
                        <span className="text-black-600">Branch Office</span>
                    </h2>
                    <p className="d-flex align-items-center mt-2"><FaBuilding className="me-2" /> <strong>Dial Export Mart</strong></p>
          <p className="d-flex align-items-center mt-2"><FaMapMarkerAlt className="me-2" /> 30 N Gould St #3414, Sheridan, Wyoming - 82801, USA</p>
          <p className="d-flex align-items-center mt-2"><FaPhone className="me-2" /> +1(570)-676-1540</p>
      

            </div>
            <div className='col-md-6'>
                <div className="flex justify-center items-center">
                <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl flex">
                    <div className="flex-1">
                    <form className="space-y-4">
                        <input type="text" placeholder="Name *" required className="w-full p-2 border rounded-md" />
                        <input type="email" placeholder="Email *" required className="w-full p-2 border rounded-md" />
                        <input type="text" placeholder="Subject *" required className="w-full p-2 border rounded-md" />
                        <textarea placeholder="Please describe what you need." required className="w-full p-2 border rounded-md"></textarea>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Send message
                        </button>
                    </form>
                    </div>
                </div>
                </div>  
            </div>
            </div>
        </div>
    </section>
  );
};

export default Page;