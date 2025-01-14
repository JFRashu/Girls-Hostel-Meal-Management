import React, { useState, useEffect } from 'react';

// Import the JSON file directly
import noticesData from './demoJsons/notices.json';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Since we're importing the JSON directly, we can use it immediately
      setNotices(noticesData);
      setLoading(false);
    } catch (error) {
      setError('Failed to load notices');
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-semibold mb-3">Notice Board</h2>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading notices...</div>
        ) : notices.length > 0 ? (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-colors"
            >
              <h3 className="font-medium text-lg text-blue-700">
                {notice.title}
              </h3>
              <p className="text-gray-700">{notice.details}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No notices available.
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;