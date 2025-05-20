'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from "sweetalert2";


const AddRecording = ({ supportPersonId }) => {
  const [file, setFile] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supportPersonId) {
      fetchRecordings();
    }
  }, [supportPersonId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchRecordings = async () => {
    try {
      const res = await fetch(`/api/recordings?supportPersonId=${supportPersonId}`);
      if (!res.ok) throw new Error('Failed to fetch recordings');
      const data = await res.json();
      setRecordings(data.files || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch recordings');
    }
  };

  const uploadFile = async () => {
    if (!file || !supportPersonId) {
      return toast.error('Missing file or support person ID');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('supportPersonId', supportPersonId);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || 'File uploaded successfully');
        setFile(null);
        fetchRecordings();
      } else {
        toast.error(result.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (recordingId) => {
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
      const res = await fetch(
        `/api/recordings?id=${recordingId}&supportPersonId=${supportPersonId}`,
        {
          method: 'DELETE',
        }
      );

      const response = await res.json();
      if (response.success) {
        toast.success(response.message || 'Recording deleted successfully');
        fetchRecordings();
      } else {
        toast.error(response.message || 'Failed to delete recording');
      }
    } catch (error) {
      toast.error('Error deleting recording');
      console.error(error);
    }
  }
};


  // 🛡️ Return message if supportPersonId is not set
  if (!supportPersonId) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 font-semibold">Please select a support person first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl mt-3">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Upload Recording</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <input
          type="file"
          accept=".mp3, .mpeg, .mpg, audio/*"
          onChange={handleFileChange}
          className="w-full sm:w-auto border border-gray-300 rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 file:rounded hover:file:bg-blue-100"
        />

        <button
          onClick={uploadFile}
          disabled={loading || !file || !supportPersonId}
          className={`px-6 py-2 rounded font-medium transition duration-200 ${
            loading || !file || !supportPersonId
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Uploaded Recordings</h2>

      {recordings.length === 0 ? (
        <p className="text-gray-500 italic">No recordings found.</p>
      ) : (
        <div className="space-y-6">
        {recordings.map((rec, i) => {
  const audioSrc = typeof rec === 'string' ? rec : rec.url || '';
  const recName = rec.name || `Recording ${i + 1}`;
  const recId = typeof rec === 'string' ? rec : rec._id;

  return (
    <div
      key={recId || i}
      className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
    >
      <audio controls src={audioSrc} className="w-full mb-3" />

      <div className="flex justify-between items-center">
        <p className="text-sm font-medium truncate max-w-[75%]">
          Name: <span className="text-gray-700">{recName}</span>
        </p>

        {recId && (
          <button
            onClick={() => handleDelete(recId)}
            className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded flex-shrink-0"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
})}

        </div>
      )}
    </div>
  );
};

export default AddRecording;
