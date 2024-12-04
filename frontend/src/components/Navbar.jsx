import React from "react";
import { Link } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiSidebar } from "react-icons/bi";
import { FiShoppingCart, FiSearch } from "react-icons/fi";

export default function Navbar({toggleSidebar}) {
  return (
    <>
      <div className="bg-gray-800 text-gray-200 h-16 flex items-center justify-between px-6">
          <button onClick={toggleSidebar} className="block mr-4">
           {toggleSidebar && (<BiSidebar className="size-6 text-gray-300" />)}
          </button>
        <img
          className="size-8"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
        <form className="sm:mx-auto sm:w-full sm:max-w-sm" action="">

          <input
            type="text"
            className=" inline-block w-1/3 h-9 px-5 py-2 bg-gray-50 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            placeholder="Search..."
            />
          <button type="submit" className="bg-fuchsia-900 p-2.5 rounded-lg"><FiSearch /></button>
        </form>
        <div className="flex justify-end w-52">
            <Link to="/auth/signin" className="flex text-gray-200 items-center">
            <FaRegCircleUser className="size-6"/>
                <button className="ml-1">Sign in</button>
              </Link>
        </div>
      </div>
    </>
  );
}
