import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowRoundForward, IoMdClose } from "react-icons/io";
import { FiShoppingCart, FiSearch, FiMenu } from "react-icons/fi";
import { PiMagicWandFill } from "react-icons/pi";
import Dropdown from './Dropdown';
import { UserAuthContext } from '../context/UserAuthContext';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Spinner from './Spinner';
import axios from 'axios';

export default function  Navbar({logo}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const { userData, isAuthenticated, loading, Logout} = useContext(UserAuthContext);
  const { CartCount } = useContext(CartContext);
  const [categories, setCategories] = useState([]);
   const [q, setQ] = useState('')
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

   useEffect(() => {
      NavCategories();
    },[]);

    const NavCategories = async () => {
      try {
      const response = await axios.get(`${BASE_URL}/home-categories/`);
      setCategories(response.data);
      }
      catch (error) {
        alert('An error occured')
      }
    }

    const handleSubmit = e => {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    
  }
  return (
    
    <>
      {/* Desktop Navbar */}
      <div className="hidden sm:flex flex-col mb-5">
        <div className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 text-gray-800 h-20 flex items-center justify-evenly px-4 sm:px-6 shadow-sm">
          {/* Logo */}
          <div className="flex flex-col items-center group cursor-pointer ml-10">
            <img src="logo2.png" alt="" className='h-30 w-48' />

          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSubmit} className="flex sm:w-full sm:max-w-xl items-center">
            <div className="relative w-full transition-all duration-300">
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full h-11 px-5 bg-white text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="Search for products..."
              />
              <button
                type="submit"
                className="absolute right-0 h-11 px-5 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-all duration-300"
              >
                <FiSearch className="size-5" />
              </button>
            </div>
          </form>

          {/* Desktop Icons */}
          <div className="flex items-center space-x-6 w-72">
            <Link to="/imagen" className="bg-gradient-to-r from-purple-600 via-purple-600 to-pink-400 text-white px-5 py-1.5 rounded-lg inline-flex items-center justify-center whitespace-nowrap">Try AI <PiMagicWandFill size={20} className='ml-1' /></Link>
            <Link to="/cart" className="relative group">
              <FiShoppingCart className="size-6 text-purple-600 hover:text-purple-500 transition-colors duration-300" />
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {CartCount}
              </div>
            </Link>
            {isAuthenticated ? (
              <Dropdown userData={userData} Logout={Logout} />
            ) : (
            <Link to="/user/login" className="relative group">
                <button className="px-4 py-1.5 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2">
                  <span>Login</span>
                  <IoIosArrowRoundForward className="size-5" />
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Categories for Desktop */}
        <div className="text-gray-800 flex items-center justify-center overflow-x-auto px-4 space-x-4 ">
          {categories.map((category) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={category.id}
              className="whitespace-nowrap px-4 pt-4 rounded-md text-sm font-semibold hover:text-purple-600 transition-all duration-300"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="sm:hidden">
        {/* Top Navbar */}
        <div className="bg-gray-150 text-gray-800 shadow-sm flex justify-between items-center px-4 py-3">
          {/* Mobile Menu Button */}
          <button
            className="text-gray-800 hover:text-purple-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu className="size-6" />
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center group cursor-pointer">
              <img src={logo} alt="" className='h-16 w-30' />
          </div>
          

          {/* Mobile Cart Button */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="size-6 text-purple-800 hover:text-purple-500" />
            <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </div>
          </Link>
        </div>

        {/* Mobile Search Bar */}
        <div className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 px-4 py-3 shadow-md">
          <form className="flex items-center bg-gray-50 rounded-md w-full">
            <input
              type="text"
              className="flex-grow h-10 px-5 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
              placeholder="Search for products..."
            />
            <button
              type="submit"
              className="h-10 px-4 bg-purple-600 text-white flex items-center justify-center rounded-tr-md rounded-br-md"
            >
              <FiSearch />
            </button>
          </form>
        </div>

        {/* Categories for Mobile */}
        <div className="bg-gray-150 text-gray-800 flex overflow-x-auto py-3 px-4 space-x-4 shadow-sm">
          {categories.map((category) => (
            <Link
              to={`/category/${category.name}`}
              key={category.id}
              className="whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-medium hover:bg-purple-600/20 hover:text-purple-700 transition-all duration-300"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex">
          <div className="w-64 bg-white h-full shadow-lg p-4">
             {/* Logo */}
      <div className="flex flex-col group mb-6 mr-28">
         <img src={logo} alt="" className='h-30 w-48' />
      </div>

      {/* Close Button */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="absolute top-5 md:right-2/3 right-28 text-gray-800 hover:text-gray-200"
      >
        <IoMdClose className="size-10" />
      </button>

      {/* Login Button */}
      <div className="mb-6 flex">
        <Link to="/user/login">
          <button className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2">
            <span>Login</span>
            <IoIosArrowRoundForward className="size-5" />
          </button>
        </Link>
      </div>
            <ul className="mt-7 space-y-5">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex justify-between"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

