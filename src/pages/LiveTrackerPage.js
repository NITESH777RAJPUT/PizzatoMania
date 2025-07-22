import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LiveTracker from '../components/LiveTracker';

const LiveTrackerPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [theme, ] = useState('light');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://pizzamania-psh4.onrender.com/api/orders/status/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order: ", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      {order ? (
        <>
          <LiveTracker order={order} theme={theme} />
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-8 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            ⬅️ Back to Home
          </button>
        </>
      ) : (
        <p className="text-gray-700 dark:text-gray-200">Loading order tracker...</p>
      )}
    </div>
  );
};

export default LiveTrackerPage;
