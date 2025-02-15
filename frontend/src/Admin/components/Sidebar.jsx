import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { BiSidebar, BiCarousel } from "react-icons/bi";
import { FiFilePlus, FiUser, FiBox, FiLayers, FiLogOut  } from "react-icons/fi";

export default function Sidebar({isOpenSidebar, toggleSidebar, toggleDropDown}) {
  return (
    <>
      <div className={` fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-300 transform transition-transform duration-300 ease-in-out ${
          isOpenSidebar ? '-translate-x-full' : ' translate-x-0' }`}>
        <div className="p-6 flex justify-between">
        <div className="flex flex-col items-center group cursor-pointer">
            <span className="font-cinzel text-2xl md:text-3xl font-bold tracking-wider text-purple-600">
              AURA
            </span>
            <span className="font-playfair text-sm md:text-base tracking-[0.3em] text-gray-600">
              INTERIORS
            </span>
            <div className="h-0.5 w-0 bg-purple-600 group-hover:w-full transition-all duration-300"/>
          </div>
            <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-800">
              <BiSidebar  className="size-6 text-gray-300"/>
            </button>
        </div>
        <ul className="space-y-4 mt-8 px-4 transition-all duration-300">
          <li>
            <Link to="/admin/dashboard" className="flex px-4 py-2 hover:bg-gray-700 rounded">
              <RxDashboard className="size-5 mb-1 mr-3"/>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/products" className="flex px-4 py-2 hover:bg-gray-700 rounded">
              <FiBox className="size-5 mb-1 mr-3"/>
              Product
            </Link>
          </li>
            <li>
              <Link to="/admin/dashboard/categories" className="flex px-4 py-2 hover:bg-gray-700 rounded">
              <FiLayers  className="size-5 mb-1 mr-3"/>
                 Category
              </Link>
            </li>
        
          <li>
            <Link to="/admin/dashboard/carousal" className="flex px-4 py-2 hover:bg-gray-700 rounded">
            <BiCarousel  className="size-5 mb-1 mr-3"/>
              Carousal/Banner
            </Link>
          </li>
          <li>
            <a href="#" className="flex px-4 py-2 hover:bg-gray-700 rounded">
            <FiFilePlus  className="size-5 mb-1 mr-3"/>
              Orders
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
