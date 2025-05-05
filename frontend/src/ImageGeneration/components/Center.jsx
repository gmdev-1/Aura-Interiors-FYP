import React from 'react'
import { Link } from "react-router-dom";

export default function Center() {
    const dummyImages = [
        "1.jpg",
        "2.jpg",
        "3.jpg",
        "4.jpg",
        "5.jpg",
        "6.jpg",
      ];
  return (
    <>
      <div className="min-h-screen bg-purple-50 px-4 py-10">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5">
          Transform Spaces with AI
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to <span className='text-purple-600 font-medium'>Aura Interiors</span> - your AI-powered platform for interior design generation, virtual staging and space transformation.
          We help you visualize room concepts effortlessly.
        </p>
        <Link
          to="/imagen/design/generate"
          className="mt-8 inline-block bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700 transition-colors duration-300">
          Get Started
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {dummyImages.map((src, idx) => (
          <div key={idx} className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <img
              src={src}
              alt={`Generated room ${idx + 1}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
