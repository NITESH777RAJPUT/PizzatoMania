// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // hamburger icons

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-2xl p-4 rounded-b-2xl relative z-50">
      <div className="flex items-center justify-between">
        {/* 🍕 Title Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-white font-extrabold text-2xl tracking-wide drop-shadow-xl">
            🍕 PizzaMania
          </h1>
        </div>

        {/* Hamburger Menu Button - Mobile Only */}
        <div className="md:hidden z-50">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 ml-auto">
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

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-white rounded-xl shadow-lg py-3 px-5 space-y-2">
          <Link
            to="/about"
            onClick={toggleMenu}
            className="block text-red-600 font-semibold hover:underline"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className="block text-red-600 font-semibold hover:underline"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
