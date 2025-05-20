'use client';
import React, { useEffect, useState } from 'react';

const AllRecordings = () => {
  const [supportPeople, setSupportPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupportPeople = async () => {
      try {
        const response = await fetch('/api/adminprofile/recordings');
        const result = await response.json();
        if (result.success) {
          setSupportPeople(result.data);
        }
      } catch (err) {
        console.error('Error fetching support people:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportPeople();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10 text-lg font-medium text-gray-700 animate-pulse">
        Loading recordings...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-12">
        All Recordings
      </h2>

      {supportPeople.length === 0 ? (
        <p className="text-gray-400 italic text-center text-lg">No recordings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportPeople.map((person, index) => (
            <div
              key={index}
              className="relative group bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl p-6"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl"></div>

              <p className="text-xl font-semibold text-gray-800">{person.name}</p>
              <p className="text-sm text-gray-500 mb-4">{person.email}</p>

              <p className="text-md font-medium text-purple-600 mb-2">Recording(s):</p>

       <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
  {person.recordingurl?.length > 0 ? (
    person.recordingurl.map((recording, i) => (
      <div key={i} className="space-y-1">
        <audio
          controls
          src={recording.url}
          className="w-full border border-purple-300 rounded-md"
        />
        <p className="text-xs text-gray-500">
          Uploaded on:{' '}
          {new Date(recording.uploadTime).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      </div>
    ))
  ) : (
    <p className="text-gray-400 italic text-sm">No recordings available</p>
  )}
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRecordings;
