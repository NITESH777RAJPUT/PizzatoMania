import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Configuration for each status step, making it easy to manage and update
const STATUS_CONFIG = {
  'Order Placed': { index: 0, text: 'Order Placed', icon: '📝' },
  'Preparing': { index: 1, text: 'In the Kitchen', icon: '👨‍🍳' },
  'Out for Delivery': { index: 2, text: 'On The Way', icon: '🛵' },
  'Delivered': { index: 3, text: 'Delivered!', icon: '✅' },
};

// API constants for better code management
const API_BASE_URL = 'https://pizzamania-psh4.onrender.com/api/orders';
const POLLING_INTERVAL = 30000; // 30 seconds

/**
 * A reusable component for showing a loading spinner.
 */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-8 h-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
  </div>
);

/**
 * A reusable component for displaying error messages.
 */
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="text-center p-6 bg-red-50 rounded-lg">
    <p className="text-red-600 font-semibold">Oops! Something went wrong.</p>
    <p className="text-red-500 text-sm mt-1">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

/**
 * A component to display the rating given by the user.
 */
const DisplayRating = ({ rating }) => (
  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in">
    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Rating</h3>
    <div className="flex justify-center gap-1 text-3xl mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}>
          ★
        </span>
      ))}
    </div>
  </div>
);

/**
 * Feedback component with an interactive star rating system.
 */
const FeedbackSection = ({ orderId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (selectedRating) => {
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/feedback/${orderId}`, { rating: selectedRating });
      onFeedbackSubmitted(selectedRating); // Pass the rating up to the parent
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">How was your experience?</h3>
      <p className="text-gray-500 dark:text-gray-300 mt-1 mb-4">Your feedback helps us improve.</p>
      <div
        className="flex justify-center gap-2 text-4xl"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`transition-transform duration-200 hover:scale-125 ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            onMouseEnter={() => setHoverRating(star)}
            onClick={() => {
              setRating(star);
              submitFeedback(star);
            }}
            disabled={isSubmitting}
            aria-label={`Rate ${star} star`}
          >
            <span className={star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}>
              ★
            </span>
          </button>
        ))}
      </div>
      {isSubmitting && <p className="text-sm text-indigo-500 mt-3">Submitting your feedback...</p>}
    </div>
  );
};

/**
 * Utility function to format time elapsed.
 */
const formatTimeElapsed = (timestamp) => {
  if (!timestamp) return '';
  const deliveredTime = new Date(timestamp).getTime();
  const now = Date.now();
  const seconds = Math.floor((now - deliveredTime) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

/**
 * The main LiveTracker component with a refreshed and professional look.
 */
const LiveTracker = ({ order }) => {
  const [status, setStatus] = useState(order?.status || null);
  const [deliveryProgress, setDeliveryProgress] = useState(order?.deliveryProgress || 0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!order?.feedback);
  const [submittedRating, setSubmittedRating] = useState(order?.feedback?.rating || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveredAt, setDeliveredAt] = useState(order?.deliveredAt || null); // New state for delivered timestamp
  const [timeSinceDelivery, setTimeSinceDelivery] = useState(''); // New state for formatted time

  const currentStepIndex = status ? STATUS_CONFIG[status]?.index : -1;

  const fetchLatestStatus = useCallback(async () => {
    if (!order?.order_id) {
        setIsLoading(false);
        return;
    }
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/status/${order.order_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(res.data.status);
      setDeliveryProgress(res.data.deliveryProgress || 0);
      setFeedbackSubmitted(!!res.data.feedback);
      if (res.data.feedback) {
        setSubmittedRating(res.data.feedback.rating);
      }
      if (res.data.status === 'Delivered' && res.data.deliveredAt) {
        setDeliveredAt(res.data.deliveredAt); // Set the delivered timestamp
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order status.');
      console.error('Error fetching live status:', err);
    } finally {
      setIsLoading(false);
    }
  }, [order?.order_id]);

  useEffect(() => {
    fetchLatestStatus();
    const interval = setInterval(fetchLatestStatus, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLatestStatus]);

  // Effect to update time since delivery
  useEffect(() => {
    let timerInterval;
    if (status === 'Delivered' && deliveredAt) {
      timerInterval = setInterval(() => {
        setTimeSinceDelivery(formatTimeElapsed(deliveredAt));
      }, 1000); // Update every second
    } else {
      setTimeSinceDelivery(''); // Clear if not delivered
    }
    return () => clearInterval(timerInterval);
  }, [status, deliveredAt]);


  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchLatestStatus} />;
  }

  if (!order) {
    return null;
  }
  
  // If delivered, show rating or feedback form inside the main component
  if (status === 'Delivered') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Order Delivered! 🎉</h2>
        {deliveredAt && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
            {timeSinceDelivery ? `Delivered ${timeSinceDelivery}` : 'Delivered recently.'}
          </p>
        )}
        {feedbackSubmitted && submittedRating ? (
          <DisplayRating rating={submittedRating} />
        ) : (
          <FeedbackSection
            orderId={order.order_id}
            onFeedbackSubmitted={(rating) => {
              setFeedbackSubmitted(true);
              setSubmittedRating(rating);
            }}
          />
        )}
      </div>
    );
  }

  // Show the tracker for any other status
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Tracker</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.order_id}</p>
      </div>

      <div className="relative flex flex-col gap-8">
        {Object.keys(STATUS_CONFIG).map((key, index) => {
          const step = STATUS_CONFIG[key];
          const isActive = index <= currentStepIndex;
          return (
            <div key={step.index} className="flex items-start">
              {index < Object.keys(STATUS_CONFIG).length - 1 && (
                <div className={`absolute left-5 top-1 h-full w-0.5 ${index < currentStepIndex ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              )}
              <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${isActive ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-500`}>
                <span className="text-xl">{step.icon}</span>
              </div>
              <div className="ml-4">
                <h4 className={`font-semibold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} transition-colors duration-500`}>
                  {step.text}
                </h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {status === key ? 'Current Status' : (isActive ? 'Completed' : 'Pending')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {status === 'Out for Delivery' && (
        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Delivery Progress</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-teal-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${deliveryProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-right text-gray-600 dark:text-gray-400 mt-1">{deliveryProgress}% on the way</p>
        </div>
      )}
    </div>
  );
};

export default LiveTracker;