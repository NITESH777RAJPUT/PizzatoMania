import React, { useEffect, useState } from 'react';
import axios from 'axios';

const backendURL = process.env.REACT_APP_BACKEND_URL || 'https://pizzamania-0igb.onrender.com';

const ProfileCard = ({ name: initialName, photo: initialPhoto, email, onUpdate, theme }) => {
  const [name, setName] = useState(initialName || '');
  const [photo, setPhoto] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    setName(initialName || '');
    setPhoto(initialPhoto || '');

    // ✅ If photo exists, show preview image
    if (initialPhoto) {
      setPreview(`${backendURL}/uploads/${initialPhoto}`);
    } else {
      setPreview(''); // Clear preview so fallback letter works
    }
  }, [initialName, initialPhoto]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await axios.post(`${backendURL}/api/upload/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedPhoto = res.data.filename || res.data.url;
      setPhoto(uploadedPhoto);
      setPreview(`${backendURL}/uploads/${uploadedPhoto}`);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Photo upload failed');
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${backendURL}/api/profile/${email}`, {
        name,
        photo,
      });
      alert('Profile updated successfully!');
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Update failed');
    }
  };

  const renderAvatar = () => {
    if (preview && preview.trim() !== '') {
      return (
        <img
          src={preview}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-teal-400"
        />
      );
    } else {
      return (
        <div className="w-20 h-20 rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl font-bold">
          {name?.trim()?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      );
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md w-full max-w-md mx-auto mb-6 transition-all duration-300
      ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>

      <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-teal-400' : 'text-red-600'}`}>👤 Your Profile</h2>

      <div className="flex items-center gap-4 mb-4">
        {renderAvatar()}
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
      </div>

      <div className="mb-4">
        <label className={`block font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className={`w-full p-2 rounded border-2 transition-all duration-300 
            ${theme === 'dark'
              ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
              : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}`}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfileCard;
