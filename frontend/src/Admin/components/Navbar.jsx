import React from 'react';
import { Link } from "react-router-dom";
import { BiSidebar } from "react-icons/bi";
import { IoIosArrowRoundForward } from "react-icons/io";
import {FiSearch } from "react-icons/fi";
import Dropdown from './Dropdown';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';


export default function Navbar({toggleSidebar}) {
  const { userData, isAuthenticated, loading, Logout} = useContext(AuthContext);
  
  return (
    <>
       <div className="bg-gray-800 text-gray-200 h-16 flex items-center justify-between px-6">
          <button onClick={toggleSidebar} className="block mr-4">
           {toggleSidebar && (<BiSidebar className="size-6 text-gray-300" />)}
          </button>
          <div className="flex flex-col items-center group cursor-pointer">
            <span className="font-cinzel text-2xl md:text-3xl font-bold tracking-wider text-purple-600">
              AURA
            </span>
            <span className="font-playfair text-sm md:text-base tracking-[0.3em] text-gray-600">
              INTERIORS
            </span>
            <div className="h-0.5 w-0 bg-purple-600 group-hover:w-full transition-all duration-300"/>
          </div>
         <form className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center bg-gray-50 rounded-md overflow-hidden">
            <input
              type="text"
              className="flex-grow h-10 px-5 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
              placeholder="Search..."
            />
            <button
              type="submit"
              className="h-10 px-4 bg-purple-600 text-white flex items-center justify-center">
              <FiSearch />
            </button>
          </form>

        <div className="flex justify-end w-52">
          {isAuthenticated ? (
            <Dropdown Logout={Logout} userData={userData}/>
          ) : (
            <Link to="/admin/login" className="flex text-white bg-purple-700 hover:bg-purple-800 items-center px-2 py-1 rounded-md">
                <button className="ml-1">Login</button>
                <IoIosArrowRoundForward className="size-6"/>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
