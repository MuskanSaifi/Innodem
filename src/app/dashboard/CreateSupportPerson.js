import React, { useEffect } from 'react'
import { useState } from "react";
import toast from 'react-hot-toast';
import Select from 'react-select';
import Swal from 'sweetalert2';


const CreateSupportPerson = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", number:"" });
  const [message, setMessage] = useState("");
  const [stateupdate, setStateupdate] = useState(false);
  const [supportMembers, setSupportMembers] = useState([]);
  const [allClients, setAllClients] = useState([]); // instead of undefined
  const [selectedClients, setSelectedClients] = useState({}); // key: member._id, value: [user ids]
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/adminprofile/supportmembers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Support person created successfully!");
        setStateupdate(prev => !prev); // toggles value on each change
        setFormData({ name: "", email: "", password: "", number:"" }); // reset form
      } else {
        setMessage(`❌ Error: ${data.error || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      setMessage("❌ Internal error, try again.");
    }
  };


 useEffect(() => {
    const fetchSupportMembers = async () => {
      try {
        const res = await fetch('/api/adminprofile/supportmembers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.success) {
          setSupportMembers(data.members);
  
          // Build selectedClients object with pre-filled values
          const selected = {};
          data.members.forEach(member => {
            selected[member._id] = member.clients.map(client => ({
              value: client._id,
              label: client.fullname || client.name || client.email, // fallback
            }));
          });
          setSelectedClients(selected);
        }
      } catch (err) {
        console.error('Error fetching support members:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSupportMembers();
  }, [stateupdate]);
  
 useEffect(() => {
      const fetchAllClients = async () => {
        try {
          const res = await fetch('/api/adminprofile/supportmembers/clients');
          const data = await res.json();
          if (data.success) {
            setAllClients(data.users); 
          }
        } catch (error) {
          console.error('Error fetching clients:', error);
        }
      };
    
      fetchAllClients();
    }, []);
    
  const handleClientChange = (selectedOptions, memberId) => {
      setSelectedClients(prev => ({
        ...prev,
        [memberId]: selectedOptions
      }));
    };
    
const handleClientUpdate = async (memberId) => {
  const result = await Swal.fire({
    title: 'Save changes?',
    text: "Do you want to assign the selected clients?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, save it!',
  });

  if (result.isConfirmed) {
    const selected = selectedClients[memberId] || [];
    try {
      const res = await fetch(`/api/adminprofile/supportmembers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supportPersonId: memberId,
          clientIds: selected.map(opt => opt.value),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Clients assigned successfully');
        setStateupdate(prev => !prev);
      } else {
        toast.error(data.message || 'Failed to assign clients');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Internal server error');
    }
  }
};

    
  
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch('/api/adminprofile/supportmembers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        setStateupdate(prev => !prev);
        toast.success('Successfully Deleted');
      } else {
        toast.error('Delete failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Internal server error');
    }
  }
};

  
    
return (
<>
<div className="flex flex-col lg:flex-row gap-6 p-6">

  {/* Left: Form */}
  <div className="w-full lg:w-1/3">
    <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg">
      <h4 className="text-xl font-semibold text-blue-700 mb-4">Create Support Person</h4>
      
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">Phone Number</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        ➕ Create
      </button>

      {message && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">{message}</div>
      )}
    </form>
  </div>

  {/* Right: Table */}
  <div className="w-full lg:w-2/3">
    <h2 className="text-2xl font-bold mb-4 text-blue-700">📋 Assign Clients To Support Members</h2>

    {loading ? (
      <p className="text-gray-500">Loading...</p>
    ) : supportMembers.length === 0 ? (
      <p className="text-gray-500">No support members found.</p>
    ) : (
      <div className="overflow-x-auto rounded-xl shadow-lg border border-blue-200 bg-white">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-blue-100 text-blue-800 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 border-b">#</th>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Email</th>
              {/* <th className="px-6 py-3 border-b">Created At</th> */}
              <th className="px-6 py-3 border-b">Assign Client</th>
              <th className="px-6 py-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
          {supportMembers.map((member, index) => (
  <tr key={member._id} className="hover:bg-blue-50 transition">
    <td className="px-6 py-3 border-b font-medium text-gray-700">{index + 1}</td>
    <td className="px-6 py-3 border-b text-gray-800">{member.name}</td>
    <td className="px-6 py-3 border-b text-blue-600">{member.email}</td>
    {/* <td className="px-6 py-3 border-b text-blue-600">
  {formatDateTime(member.createdAt)}
</td> */}
<td className="px-6 py-3 border-b text-blue-900">
<Select
  isMulti
  value={selectedClients[member._id] || []}
  onChange={(selectedOptions) => handleClientChange(selectedOptions, member._id)}
  options={
    allClients?.map(client => ({
      value: client._id,
      label: client.fullname,
    })) || []
  }
/>
</td>

    <td className="px-6 py-3 border-b text-blue-600">
    <button
  onClick={() => handleDelete(member._id)}
  className="bg-red-500 hover:bg-red-600 w-100 text-white font-semibold py-1.5 px-4 rounded-md shadow-sm transition duration-200"
>
  Delete
</button>
<button
    onClick={() => handleClientUpdate(member._id)}
    className="bg-blue-500 hover:bg-blue-600 w-100 text-white font-semibold py-1.5 px-4 rounded-md shadow-sm transition duration-200"
  >
    Save
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


    </>
  )
}

export default CreateSupportPerson