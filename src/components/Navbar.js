// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-2xl p-4 rounded-b-2xl relative z-50">
      {/* 📱 Mobile View */}
      <div className="block md:hidden text-center">
        <h1 className="text-white font-extrabold text-2xl tracking-wide drop-shadow-xl">
          PizzaMania
        </h1>
        <div className="absolute top-4 right-4 text-right">
          <Link
            to="/about"
            className="block text-white font-medium hover:text-yellow-200 transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block text-white font-medium hover:text-yellow-200 transition duration-300 mt-1"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* 💻 Desktop View */}
      <div className="hidden md:flex items-center justify-between">
        <h1 className="text-white font-extrabold text-2xl tracking-wide drop-shadow-xl">
          PizzaMania
        </h1>
        <div className="flex gap-4">
          <Link
            to="/about"
            className="text-white font-medium hover:text-yellow-200 transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-white font-medium hover:text-yellow-200 transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
