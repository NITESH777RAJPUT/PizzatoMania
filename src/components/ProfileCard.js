import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileCard = ({ name: initialName, photo: initialPhoto, email, onUpdate, theme }) => {
  const [name, setName] = useState(initialName || '');
  const [photo, setPhoto] = useState(initialPhoto || '');
  const [preview, setPreview] = useState(initialPhoto || '');

  useEffect(() => {
    setName(initialName || '');
    setPhoto(initialPhoto || '');
    setPreview(initialPhoto || '');
  }, [initialName, initialPhoto]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await axios.post('https://pizzamania-psh4.onrender.com/api/upload/photo', formData);
      setPhoto(res.data.url);
      setPreview(res.data.url);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Photo upload failed');
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`https://pizzamania-0igb.onrender.com/api/profile/${email}`, {
        name,
        photo
      });
      alert('Profile updated successfully!');
      if (onUpdate) {
        onUpdate(res.data);  // pass updated profile back to parent
      }
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Update failed');
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md w-full max-w-md mx-auto mb-6 transition-all duration-300
      ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      
      <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-teal-400' : 'text-red-600'}`}>👤 Your Profile</h2>
      
      <div className="flex items-center gap-4 mb-4">
        <img
          src={preview || '/images/default-user.png'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-teal-400"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
      </div>
      
      <div className="mb-4">
        <label className={`block font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Name:</label>
        <input
          type="text"
          value={name}
          className={`w-full p-2 rounded border-2 transition-all duration-300 
            ${theme === 'dark'
              ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
              : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}`}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
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
