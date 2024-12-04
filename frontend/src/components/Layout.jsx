import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isDropDown, setIsDropDown] = useState(false);
  const toggleSidebar = () => {
    setIsOpenSidebar((prev) => !prev);
  };
  const toggleDropDown = () =>{
    setIsDropDown((prev) => !prev);
  };
  return (
    <>
      <div className="h-screen flex w-full bg-gray-400">
        <Sidebar isOpenSidebar={isOpenSidebar} toggleSidebar={toggleSidebar} toggleDropDown={toggleDropDown} />
        <div className="flex-1 flex flex-col">
          <Navbar toggleSidebar={toggleSidebar}/>
        </div>
      </div>
    </>
  );
}
