import React from 'react'
import { Link } from "react-router-dom";
import { UserAuthContext } from '../../Store/context/UserAuthContext';
import { useContext } from 'react';
import Spinner from '../../Store/components/Spinner';
import Dropdown from '../../Store/components/Dropdown';


export default function Nav() {
  const { userData, isAuthenticated, loading, Logout} = useContext(UserAuthContext);
  return (
    <>
      <nav className="w-full px-6 m-1 h-16 flex items-center justify-between shadow-md bg-white">
      <div className="text-xl font-bold text-gray-800">
         <img src="https://res.cloudinary.com/dq9ucjymr/image/upload/v1747186449/logo2_jpzebf.png" alt="" className='h-30 w-48' />
      </div>
      {isAuthenticated ? (
          loading ? <Spinner /> :
          <Dropdown userData={userData} Logout={Logout} />
        ) : (
          <Link
            to="/imagen/design/generate"
            className="bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700 transition-colors duration-300">
            Get Started
        </Link>
        )}
    </nav>
    </>
  )
}
