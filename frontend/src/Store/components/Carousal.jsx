import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiArrowRightWideFill, RiArrowLeftWideFill } from "react-icons/ri";
import axios from 'axios';

export default function Carousal() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [carousals, setCarousals] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    fetchCarousals();
  },[]);

  const fetchCarousals = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/home-carousals/`);
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
                <h2 className="text-5xl font-bold mb-4 opacity-90">Living Room Essentials</h2>
                <p className="text-xl mb-6 opacity-80">Create your perfect living space</p>
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

      {/* Dots Navigation
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 
              ${currentIndex === index 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div> */}
    </div>
    </>
  )
}
