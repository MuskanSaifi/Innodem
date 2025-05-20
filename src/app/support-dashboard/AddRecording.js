'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AddRecording = ({ supportPersonId }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchMessage, setSearchMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (supportPersonId) {
      fetchRecordings();
    }
  }, [supportPersonId]);

  const fetchRecordings = async () => {
    try {
      const res = await fetch(`/api/recordings?supportPersonId=${supportPersonId}`);
      if (!res.ok) throw new Error('Failed to fetch recordings');
      const data = await res.json();
      setRecordings(data.files || []);
    } catch (error) {
      toast.error('Failed to fetch recordings');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file || !supportPersonId) {
      return toast.error('Please select a file and support person.');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('supportPersonId', supportPersonId);
      formData.append('message', message);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || 'File uploaded successfully');
        setFile(null);
        setMessage('');
        fetchRecordings();
      } else {
        toast.error(result.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordingId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This recording will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/recordings?id=${recordingId}&supportPersonId=${supportPersonId}`, {
          method: 'DELETE',
        });

        const response = await res.json();
        if (response.success) {
          toast.success(response.message || 'Recording deleted successfully');
          fetchRecordings();
        } else {
          toast.error(response.message || 'Failed to delete recording');
        }
      } catch (error) {
        toast.error('Error deleting recording');
      }
    }
  };

  const filteredRecordings = recordings.filter((rec) => {
    const msgMatch = rec.message?.toLowerCase().includes(searchMessage.toLowerCase());
    const tagMatch = selectedTag ? rec.tag === selectedTag : true;
    const dateMatch = selectedDate
      ? new Date(rec.uploadTime).toDateString() === new Date(selectedDate).toDateString()
      : true;
    return msgMatch && tagMatch && dateMatch;
  });

  const getTagStyle = (tag) => {
    switch (tag) {
      case 'genuine':
        return 'bg-green-100 text-green-800 border border-green-400';
      case 'fake':
        return 'bg-red-100 text-red-800 border border-red-400';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  if (!supportPersonId) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 font-semibold">Please select a support person first.</p>
      </div>
    );
  }

  return (
  <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-xl mt-6 border border-gray-200">
  <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Audio Manager</h1>
  <div className="flex flex-col lg:flex-row gap-6">
    {/* LEFT COLUMN */}
    <div className="w-full lg:w-1/3 space-y-6">
      {/* Upload Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Upload Recording</h2>
        <input
          type="file"
          accept=".mp3, .mpeg, .mpg, audio/*"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded p-2"
        />

        <textarea
          placeholder="Enter a short message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 h-24"
        />

        <button
          onClick={uploadFile}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          {loading ? 'Uploading...' : 'Upload Recording'}
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>

        <input
          type="text"
          placeholder="Search by message"
          value={searchMessage}
          onChange={(e) => setSearchMessage(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">All Tags</option>
          <option value="genuine">Genuine</option>
          <option value="fake">Fake</option>
          <option value="other">Other</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={() => {
            setSearchMessage('');
            setSelectedTag('');
            setSelectedDate('');
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded w-full"
        >
          Reset Filters
        </button>
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="w-full lg:w-2/3">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Uploaded Recordings</h2>

      {filteredRecordings.length === 0 ? (
        <p className="text-gray-500 italic">No recordings found.</p>
      ) : (
        <div className="space-y-6">
          {filteredRecordings.map((rec, i) => (
            <div
              key={rec._id || i}
              className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
            >
              <audio controls src={rec.url} className="w-full mb-3" />

              <div className="text-sm text-gray-800 mb-2 space-y-1">
                <div><strong>Message:</strong> {rec.message || 'No message'}</div>
                <div>
                  <strong>Type:</strong>{' '}
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getTagStyle(rec.tag || 'other')}`}>
                    {rec.tag || 'other'}
                  </span>
                </div>
                <div><strong>Date:</strong> {new Date(rec.uploadTime).toLocaleDateString()}</div>
              </div>

              <button
                onClick={() => handleDelete(rec._id)}
                className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default AddRecording;
