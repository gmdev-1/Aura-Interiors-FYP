import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { BiSidebar } from "react-icons/bi";
import { FiShoppingCart, FiFilePlus, FiUser, FiChevronDown, FiChevronUp, FiBox, FiLayers  } from "react-icons/fi";

export default function Sidebar({isOpenSidebar, toggleSidebar, toggleDropDown}) {
  return (
    <>
      <div className={` fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-300 transform transition-transform duration-300 ease-in-out ${
          isOpenSidebar ? '-translate-x-full' : ' translate-x-0' }`}>
        <div className="p-6 flex justify-between">
          <img
            className="size-8"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
            <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-800">
              <BiSidebar  className="size-6 text-gray-300"/>
            </button>
        </div>
        <ul className="space-y-4 mt-16 px-4 transition-all duration-300">
          <li>
            <Link to="/admin/dashboard" className="flex px-4 py-2 hover:bg-gray-700 rounded">
              <RxDashboard className="size-5 mb-1 mr-3"/>
              Dashboard
            </Link>
          </li>
          <li>
            <a href="#" onClick={toggleDropDown} className="flex px-4 py-2 hover:bg-gray-700 rounded">
              <FiShoppingCart className="size-5 mb-1 mr-3"/>
              Ecommerce
              {toggleDropDown ? <FiChevronDown className="flex mt-1 ml-12"/>: <FiChevronUp /> }
            </a>
          </li>
          {toggleDropDown && (
            <ul className={`mt-2 space-y-2 px-4 transition-all duration-300 ${toggleDropDown ? "block" : "hidden" }`}>
            <li>
              <a href="#" className="flex px-4 py-2 hover:bg-gray-700 rounded">
              <FiBox  className="size-5 mb-1 mr-3"/>
                Product
              </a>
            </li>
            <li>
              <a href="#" className="flex px-4 py-2 hover:bg-gray-700 rounded">
              <FiLayers  className="size-5 mb-1 mr-3"/>
                Category
              </a>
            </li>
            </ul>
          )}
          <li>
            <a href="#" className="flex px-4 py-2 hover:bg-gray-700 rounded">
            <FiFilePlus  className="size-5 mb-1 mr-3"/>
              Orders
            </a>
          </li>
          <li>
            <a href="#" className="flex px-4 py-2 hover:bg-gray-700 rounded">
            <FiUser  className="size-5 mb-1 mr-3"/>
              Users
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
