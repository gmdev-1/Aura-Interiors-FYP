import React from 'react'
import { useState } from 'react';
import { useLocation } from 'react-router';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Analytics from '../components/Analytics';

export default function Dashboard({children}) {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isDropDown, setIsDropDown] = useState(false);
  const location = useLocation();
  const showAnalytics = location.pathname === "/admin/dashboard/";

  const toggleSidebar = () => {
    setIsOpenSidebar((prev) => !prev);
  };
  const toggleDropDown = () =>{
    setIsDropDown((prev) => !prev);
  };
  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="w-full">
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        <div className="flex flex-1">
          <div className="w-64">
            <Sidebar
              isOpenSidebar={isOpenSidebar}
              toggleSidebar={toggleSidebar}
              toggleDropDown={toggleDropDown}
            />
          </div>
          <div className="flex-1">
          { showAnalytics && <Analytics /> }
          <div className="p-4">{children}</div>
        </div>
        </div>
      </div>
    </>
  )
}
