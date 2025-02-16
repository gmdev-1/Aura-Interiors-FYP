import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function ProductView() {
  return (
    <>
      <Navbar />
      <div className="font-sans bg-gray-50 min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Product Image */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative w-80 h-80 rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
                {/* Featured Tag on Top of Image */}
                <div className="absolute top-2 left-2 z-10 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                  Featured
                </div>
                <img
                  src="https://res.cloudinary.com/dctgk7mh7/image/upload/v1738952932/products/dk2b30wa26yhngwtcmrg.jpg"
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 hover:opacity-30 transition duration-300" />
              </div>
            </div>

            {/* Right side: Product Details */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Main Product Details */}
                <div>
                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                      Adjective Attire | T-shirt
                    </h2>
                    <p className="text-md text-gray-500 mt-1">
                      Well-Versed Commerce
                    </p>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className="w-5 h-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.07 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
                      </svg>
                    ))}
                    <span className="text-sm font-normal bg-purple-100 rounded-xl px-2 py-0.5 text-purple-600"><span className='text-gray-800 font-medium'>4.2 | 253 ratings</span></span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-4 mb-6">
                    <p className="text-3xl font-bold text-gray-800">$30</p>
                    <p className="text-gray-500 text-sm">
                      <strike>$42</strike> <span className="ml-1">Tax incl.</span>
                    </p>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Size</h3>
                    <div className="flex gap-4">
                      {["SM"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className="w-12 h-12 border border-gray-300 hover:border-gray-700 text-md font-semibold text-gray-800 rounded-full flex items-center justify-center transition-colors duration-300"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mb-8 ">
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-full hover:from-purple-700 hover:to-purple-800"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Product Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Product Description</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Elevate your casual style with our premium men's t-shirt. Crafted for comfort and designed with a modern fit, this versatile shirt is an essential addition to your wardrobe. The soft, breathable fabric ensures all-day comfort.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mt-4 space-y-1">
                      <li>Versatile design for everyday wear</li>
                      <li>Available in multiple sizes</li>
                      <li>Machine washable for easy care</li>
                      <li>Modern fit for a sleek look</li>
                    </ul>
                  </div>
                </div>

                {/* Right Column: Additional Product Info */}
                <div className="bg-gray-50 mr-1 mt-16 p-6 rounded-lg h-80">
                  <ul className="text-gray-600 space-y-3">
                    <li>
                      <span className="font-bold text-lg">Color</span> Black
                    </li>
                    <li>
                      <span className="font-bold text-lg">Material</span> Cotton
                    </li>
                    <li>
                      <span className="font-bold text-lg">Category</span> T-shirt
                    </li>
                  </ul>
                  <div className="mt-5">
                    <span className=" text-purple-800 text-lg font-semibold px-1 py-1 rounded-full">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
