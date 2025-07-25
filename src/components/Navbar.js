// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // hamburger icons

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-2xl p-4 flex items-center justify-between rounded-b-2xl relative z-50">
      {/* 🍕 Centered Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-white font-extrabold text-2xl tracking-wide drop-shadow-xl">
          🍕 PizzaMania
        </h1>
      </div>

      {/* Hamburger Menu - visible only on small screens */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 ml-auto">
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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-4 mt-2 bg-white rounded shadow-lg z-50 py-2 px-4 md:hidden">
          <Link
            to="/about"
            onClick={toggleMenu}
            className="block text-red-600 font-semibold py-1 hover:underline"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className="block text-red-600 font-semibold py-1 hover:underline"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
