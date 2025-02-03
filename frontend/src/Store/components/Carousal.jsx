import React from 'react'
import { useState, useEffect } from 'react';
import { RiArrowRightWideFill, RiArrowLeftWideFill } from "react-icons/ri";

export default function Carousal() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      title: "Modern Kitchen Designs",
      description: "Transform your kitchen with our latest collection",
      btnText: "Explore Now"
    },
    {
      src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      title: "Elegant Wall Decor",
      description: "Discover unique wall pieces for your home",
      btnText: "Shop Decor"
    },
    {
      src: "https://images.unsplash.com/photo-1572048572872-2394404cf1f3",
      title: "Living Room Essentials",
      description: "Create your perfect living space",
      btnText: "View Collection"
    },
  ];

  const updateCarousel = (index) => {
    setCurrentIndex((index + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [slides.length, isHovered]);

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
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative group">
              <img 
                src={slide.src} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12 text-white transform translate-y-0 transition-transform duration-500">
                <h2 className="text-5xl font-bold mb-4 opacity-90">{slide.title}</h2>
                <p className="text-xl mb-6 opacity-80">{slide.description}</p>
                <button className="px-6 py-3 bg-white text-black font-semibold rounded-full 
                  hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                  {slide.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => updateCarousel(currentIndex - 1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white 
        rounded-full p-4 backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <RiArrowLeftWideFill className="text-4xl" />
      </button>
      <button
        onClick={() => updateCarousel(currentIndex + 1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white 
        rounded-full p-4 backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <RiArrowRightWideFill className="text-4xl" />
      </button>

      {/* Dots Navigation */}
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
      </div>
    </div>
    </>
  )
}
