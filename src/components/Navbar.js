// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-2xl p-4 rounded-b-2xl relative z-50">
      <div className="flex items-center justify-between">
        {/* 🍕 Title on the left */}
        <Link to="/" className="text-white font-extrabold text-2xl tracking-wide drop-shadow-xl">
          🍕 PizzaMania
        </Link>

        {/* Navigation Links on the right (visible on all screen sizes) */}
        <div className="flex items-center gap-4">
          <Link
            to="/about"
            className="text-white font-medium hover:text-yellow-200 transition duration-300 ease-in-out hover:scale-105"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-white font-medium hover:text-yellow-200 transition duration-300 ease-in-out hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;