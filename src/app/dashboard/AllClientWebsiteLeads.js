import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const AllClientWebsiteLeads = () => {
  const [groupedData, setGroupedData] = useState({});
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    clientdata();
  }, []);

  const clientdata = async () => {
    try {
      const result = await axios.get("api/clientwebsitedatapost");
      const grouped = result.data.reduce((acc, curr) => {
        if (!acc[curr.websitename]) {
          acc[curr.websitename] = [];
        }
        acc[curr.websitename].push(curr);
        return acc;
      }, {});
      setGroupedData(grouped);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (website) => {
    setSelectedWebsite(website);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedWebsite(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Client Website Leads</h1>

      {/* Website boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.keys(groupedData).map((website) => (
          <div
            key={website}
            onClick={() => openModal(website)}
            className="cursor-pointer bg-white border border-gray-300 p-6 rounded-xl shadow hover:shadow-md transition text-center"
          >
            <h2 className="text-lg font-semibold text-indigo-600">{website}</h2>
          </div>
        ))}
      </div>

  {isModalOpen && selectedWebsite && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-4 sm:p-6 relative">
      <button
        onClick={closeModal}
        className="absolute top-4 right-5 text-gray-500 hover:text-red-600 text-2xl"
      >
        &times;
      </button>

   <h2 className="text-2xl font-bold text-indigo-700 text-center mb-5">
  Leads from{" "}
  <Link
    href={`https://${selectedWebsite}`}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline text-blue-600"
  >
    {selectedWebsite}
  </Link>
</h2>


<div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
  {groupedData[selectedWebsite].map((lead) => (
    <div
      key={lead._id}
      className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
    >
      {lead.name && (
        <p className="text-lg text-gray-800 mb-1">
          <span className="font-semibold">Name:</span> {lead.name}
        </p>
      )}

      {lead.email && (
        <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
          <span className="text-red-500">
            <i className="fas fa-envelope"></i>
          </span>
          <span className="font-medium">Email:</span>
          <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
        </p>
      )}

      {lead.number && (
        <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
          <span className="text-green-600">
            <i className="fas fa-phone-alt"></i>
          </span>
          <span className="font-medium">Phone:</span>
          <a href={`tel:${lead.number}`} className="hover:underline">{lead.number}</a>
        </p>
      )}

      {lead.companyName && (
        <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
          <span className="text-blue-600">
            <i className="fas fa-building"></i>
          </span>
          <span className="font-medium">Company:</span> {lead.companyName}
        </p>
      )}

      {lead.address && (
        <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
          <span className="text-yellow-600">
            <i className="fas fa-map-marker-alt"></i>
          </span>
          <span className="font-medium">Address:</span> {lead.address}
        </p>
      )}

      {lead.requirement && (
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="text-purple-600">
            <i className="fas fa-tasks"></i>
          </span>
          <span className="font-medium">Requirement:</span> {lead.requirement}
        </p>
      )}
    </div>
  ))}
</div>



      
    </div>
  </div>
)}

    </div>
  );
};

export default AllClientWebsiteLeads;
