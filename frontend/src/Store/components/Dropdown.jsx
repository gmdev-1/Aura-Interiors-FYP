import React, { useState, useRef, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Dropdown ({userData, Logout}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="dropdown relative inline-flex rtl:[--placement:bottom-end] bg-white text-black px-1 py-0.5 border-purple-600 border-2 rounded-full"
      ref={dropdownRef}
    >
      <button
        id="dropdown-avatar"
        type="button"
        className="dropdown-toggle btn btn-outline cursor-pointer btn-primary flex items-center gap-0 rounded-full"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Dropdown"
        onClick={toggleDropdown}
      >
        <div className="w-8 h-8 bg-purple-600 rounded-full mr-1 flex items-center justify-center">
            <FiUser className="text-white" size={18} />
        </div>
        {userData.name}
        <span
          className={`icon-[tabler--chevron-down] size-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <ul
        className={`dropdown-menu absolute right-0 mt-10 min-w-56 bg-white border rounded-md shadow-lg z-10 transition-opacity duration-200 ${
          isOpen ? "opacity-100 visible translate-x-8" : "opacity-0 invisible translate-x-0"
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="dropdown-avatar"
      >
        <li className="dropdown-header gap-3 px-1 py-3 border-b flex items-center">
          <div className="ml-3">
            <h6 className="text-base font-semibold text-gray-900">{userData.name}</h6>
            <small className="text-sm font-medium text-gray-500">{userData.email}</small>
          </div>
        </li>
        <li className="text-black hover:bg-gray-100 cursor-pointer">
          <Link
            className="dropdown-item block px-2 py-2 ml-2"
            to="/order/order-history"
          >
            Orders
          </Link>
        </li>
        <li onClick={Logout} className="text-red-500 hover:bg-red-50 cursor-pointer">
          <a
            className="dropdown-item block px-2 py-2 ml-2 mb-1"
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};