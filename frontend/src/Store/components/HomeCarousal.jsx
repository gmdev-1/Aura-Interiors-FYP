import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RiArrowRightWideFill, RiArrowLeftWideFill } from "react-icons/ri";
import axios from 'axios';

export default function HomeCarousal({ category }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [carousals, setCarousals] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    fetchCarousals();
  },[category]);

  const fetchCarousals = async () => {
    try {
      let endpoint = "";
      if (category && category.trim() !== ""){
        endpoint = `${BASE_URL}/carousals/?category=${encodeURIComponent(category)}`; 
      }
      else{
        endpoint = `${BASE_URL}/home-carousals/`;
      }
      const response = await axios.get(endpoint);
      
      setCarousals(response.data);
      
    }
   catch (error) {
      alert('An error occured');
    }
  }

  const updateCarousel = (index) => {
    setCurrentIndex((index + carousals.length) % carousals.length);
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carousals.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carousals.length, isHovered]);

  return (
    <>
      <div 
      className="relative w-full h-[70vh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carousals.map((carousal, index) => (
            <div key={index} className="min-w-full h-full relative group">
              <img 
                src={carousal.image} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-contain transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-transparent" /> 
              <div className="absolute bg-gradient-to-t from-black/50 via-black/20 bottom-0 left-0 right-0 p-12 text-white transform translate-y-0 transition-transform duration-500">
                <h2 className="text-5xl font-bold mb-10 opacity-90"> Aura Interiors {carousal.category}</h2>
                <Link to='/shop' className="px-6 py-3 bg-white text-black font-semibold rounded-full 
                  hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-100">
                  View Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => updateCarousel(currentIndex - 1)}
        className="absolute left-6 top-1/3 -translate-y-1/2 bg-gray-500/50 hover:bg-white/30 text-white 
        rounded-full p-3 backdrop-blur-sm transition-all duration-300 opacity-100 group-hover:opacity-100"
      >
        <RiArrowLeftWideFill className="text-2xl" />
      </button>
      <button
        onClick={() => updateCarousel(currentIndex + 1)}
        className="absolute right-6 top-1/3 -translate-y-1/2 bg-gray-500/50 hover:bg-white/30 text-white 
        rounded-full p-3 backdrop-blur-sm transition-all duration-300 opacity-100 group-hover:opacity-100"
      >
        <RiArrowRightWideFill className="text-2xl" />
      </button>

      
    </div>
    </>
  )
}
