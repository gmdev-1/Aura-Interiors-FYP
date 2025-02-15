import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowRoundForward, IoMdClose } from "react-icons/io";
import { FiShoppingCart, FiSearch, FiMenu, FiChevronDown, FiChevronRight, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const categories = [
    { id: 1, title: "Bed Room", subcategories: ['Beds', 'Wardrobes', 'Mattresses', 'Side Tables'] },
    { id: 2, title: "Living Room", subcategories: ['Sofas', 'Coffee Tables', 'TV Units', 'Seating'] },
    { id: 3, title: "Kitchen", subcategories: ['Cabinets', 'Islands', 'Storage', 'Dining Sets'] },
    { id: 4, title: "Office", subcategories: ['Desks', 'Chairs', 'Storage', 'Accessories'] },
    { id: 5, title: "Dining Room", subcategories: ['Dining Tables', 'Chairs', 'Storage'] },
  ];

  const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          setIsLoggedIn(true);
          try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(window.atob(base64));
    
            // Validate the payload structure
            if (payload && payload.name) {
              setUserData(payload);
            } else {
              console.error("Invalid token payload structure.");
              setUserData(null);
            }
          } catch (error) {
            console.error("Error parsing access token:", error);
            setUserData(null);
          }
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      };
      
    
      checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const accessToken = localStorage.getItem('accessToken');
            
            if (refreshToken && accessToken) {
                await axios.post('/auth/logout/', {
                    refresh_token: refreshToken
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            // Clear tokens and state
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
              
              setIsLoggedIn(false);
            if (setIsProfileOpen) {
                setIsProfileOpen(false);
            }
            setUserData(null);
            
            setTimeout(() => {
            navigate('/');
          }, 5000);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage and redirect even if the API call fails
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            if (setIsProfileOpen) {
                setIsProfileOpen(false);
            }
            setUserData(null);
            navigate('/');
        }
    };

  return (
    
    <>
      {/* Desktop Navbar */}
      <div className="hidden sm:flex flex-col mb-5">
        <div className="bg-gradient-to-t from-purple-200 to-purple-500 text-gray-800 h-20 flex items-center justify-between px-4 sm:px-6 shadow-lg">
          {/* Logo */}
          <div className="flex flex-col items-center group cursor-pointer ml-10">
            <span className="font-cinzel text-2xl md:text-3xl font-bold tracking-wider text-purple-600">
              AURA
            </span>
            <span className="font-playfair text-sm md:text-base tracking-[0.3em] text-gray-600">
              INTERIORS
            </span>
            <div className="h-0.5 w-0 bg-purple-600 group-hover:w-full transition-all duration-300" />
          </div>

          {/* Desktop Search */}
          <form className="flex sm:w-full sm:max-w-md items-center">
            <div className="relative w-full transition-all duration-300">
              <input
                type="text"
                className="w-full h-11 px-5 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
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
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative group">
              <FiShoppingCart className="size-6 text-gray-800 hover:text-purple-500 transition-colors duration-300" />
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </div>
            </Link>
            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative group flex items-center space-x-2"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 transition-all duration-300">
                    <FiUser className="size-5" />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-gray-800 font-medium">
                          {userData?.name || "User"}
                        </p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <FiLogOut className="size-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="relative group">
                <button className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2">
                  <span>Login</span>
                  <IoIosArrowRoundForward className="size-5" />
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Categories for Desktop */}
        <div className="text-gray-800 flex overflow-x-auto py-3 px-4 space-x-4 shadow-lg">
          {categories.map((cat) => (
            <Link
              to={`/category/${cat.title}`}
              key={cat.id}
              className="whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="sm:hidden">
        {/* Top Navbar */}
        <div className="bg-gray-150 text-gray-800 shadow-lg flex justify-between items-center px-4 py-3">
          {/* Mobile Menu Button */}
          <button
            className="text-gray-800 hover:text-purple-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu className="size-6" />
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center group cursor-pointer">
            <span className="font-cinzel text-lg font-bold tracking-wider text-purple-600">
              AURA
            </span>
            <span className="font-playfair text-sm tracking-[0.2em] text-gray-600">
              INTERIORS
            </span>
          </div>
          

          {/* Mobile Cart Button */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="size-6 text-gray-800 hover:text-purple-500" />
            <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </div>
          </Link>
        </div>

        {/* Mobile Search Bar */}
        <div className="bg-white px-4 py-3 shadow-md">
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
        <div className="bg-gray-150 text-gray-800 flex overflow-x-auto py-3 px-4 space-x-4 shadow-md">
          {categories.map((cat) => (
            <Link
              to={`/category/${cat.title}`}
              key={cat.id}
              className="whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-medium hover:bg-purple-600/20 hover:text-purple-700 transition-all duration-300"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex">
          <div className="w-64 bg-white h-full shadow-lg p-4">
             {/* Logo */}
      <div className="flex flex-col group mb-6">
        <span className="font-cinzel ml-1 text-lg font-bold tracking-wider text-purple-600">
          AURA
        </span>
        <span className="font-playfair text-sm tracking-[0.2em] text-gray-600">
          INTERIORS
        </span>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="absolute top-5 right-16 text-gray-800 hover:text-red-500"
      >
        <IoMdClose className="size-7" />
      </button>

      {/* Login Button */}
      <div className="mb-6 flex">
        <Link to="/auth/login">
          <button className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2">
            <span>Login</span>
            <IoIosArrowRoundForward className="size-5" />
          </button>
        </Link>
      </div>
            <ul className="mt-7 space-y-5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => toggleCategory(cat.title)}
                    className="w-full flex justify-between"
                  >
                    {cat.title}
                    {openCategory === cat.title ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </button>
                  {openCategory === cat.title && (
                    <ul className="pl-4 mt-2 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <li key={sub}>
                          <Link
                            to={`/category/${cat.title}/${sub}`}
                            className="text-gray-600 hover:text-purple-600"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
