import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function ProductView() {
  return (
    <>
      <Navbar />
      <div className="font-sans p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Single Product Image */}
            <div className="lg:sticky top-4">
                <div className="overflow-hidden rounded-lg flex justify-center shadow-md w-80 aspect-square">
                    <img
                    src="https://readymadeui.com/images/product6.webp"
                    alt="Product"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>



            {/* Right Column: Product Details */}
            <div className="flex flex-col">
              {/* Title & Subtitle */}
              <h2 className="text-2xl font-bold text-gray-800">
                Adjective Attire | T-shirt
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Well-Versed Commerce
              </p>

              {/* Ratings */}
              <div className="flex items-center space-x-1 mt-3">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 fill-${
                      index < 4 ? 'blue-600' : '[#CED5D8]'
                    }`}
                    viewBox="0 0 14 13"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 ml-2">4.0 / 5 (253 ratings)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-4 mt-4">
                <p className="text-3xl font-bold text-gray-800">$30</p>
                <p className="text-gray-400 text-sm">
                  <strike>$42</strike> <span className="ml-1">Tax included</span>
                </p>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800">Choose a Size</h3>
                <div className="flex flex-wrap gap-4 mt-3">
                  {["SM", "MD", "LG", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className="w-10 h-10 border border-gray-300 hover:border-gray-800 text-sm font-semibold text-gray-800 rounded-full flex items-center justify-center"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="flex-1 px-4 py-3 border border-gray-800 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-md"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-3 border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md"
                >
                  Buy now
                </button>
              </div>

              {/* Product Description */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800">Product Description</h3>
                <p className="text-sm text-gray-500 mt-3">
                  Elevate your casual style with our premium men's t-shirt. Crafted for comfort and designed with a modern fit, this versatile shirt is an essential addition to your wardrobe. The soft, breathable fabric ensures all-day comfort.
                </p>
                <ul className="list-disc pl-5 mt-3 text-sm text-gray-500 space-y-1">
                  <li>Versatile design for everyday wear</li>
                  <li>Available in multiple sizes</li>
                  <li>Machine washable for easy care</li>
                  <li>Modern fit for a sleek look</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
