// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-2xl p-4 flex items-center justify-between rounded-b-2xl relative">
      {/* Centered Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-white font-extrabold text-2xl tracking-wide drop-shadow-xl">
          🍕 PizzaZone
        </h1>
      </div>

      {/* Empty div for left spacing */}
      <div className="w-24" />

      {/* Right-aligned Links */}
      <div className="flex gap-4">
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
    </nav>
  );
}

export default Navbar;
