import React from "react";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import {useState, useEffect} from 'react';
import axios from 'axios';

export default function Product() {
  const [products, setProducts] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

   useEffect(() => {
      TopProducts();
    },[]);

    const TopProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/top-products/`);
        setProducts(response.data);
        
      } 
      catch (error) {
        alert('An error occured')
      }
    }

  return (
    <>
      {/* Decorative Separator */}
      <div className="relative mt-24">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="flex items-center space-x-4 bg-white px-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-600 to-indigo-600"></div>
          </div>
        </div>
      </div>

      <div className="text-center mb-8 p-5 sm:p-10 mt-5">
        <h2 className="mt-2 mb-4 text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 drop-shadow-sm">
          Our Top Products
        </h2>
      </div>

      <div className="relative">
        {/* Top Wave Separator */}
        <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
          <svg
            className="w-full h-16"
            viewBox="0 0 1440 54"
            preserveAspectRatio="none"
          >
            <path
              fill="rgb(238 242 255)" // Matches from-indigo-50
              d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
            />
          </svg>
        </div>

        <div className="bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-8 py-16 pb-20">
          <section className="py-10 px-2 sm:px-4 bg-transparent backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 sm:px-4 max-w-screen-xl mx-auto">
              {products.map((product) => (
                <div
                  key={product._id.$oid}
                  className="bg-white w-58 rounded-lg shadow overflow-hidden transform transition duration-300"
                >
                  <Link to={`/product-detail/${encodeURIComponent(product.name)}`} >
                  <div className="absolute top-2 left-2 z-10 bg-purple-800 text-purple-100 text-xs font-semibold px-2 py-1 rounded">
                    Featured
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-52 md:object-contain"
                  />
                  </Link>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-sm flex items-center">
                        <AiFillStar className="text-yellow-400 mr-1" />
                        <span className="text-yellow-900 font-medium">
                          {product.rating}
                        </span>
                        <span className="ml-2 text-purple-600 font-semibold text-xs bg-purple-50 rounded-xl p-1">
                          ({product.review}) Reviews
                        </span>
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                        ${product.price}{" "}
                        {Number(product.discount) > 0 && (
                            <span className="text-purple-600 text-sm ml-3">${product.discount} OFF</span>
                          )}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-3">
                    <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-full hover:from-purple-700 hover:to-purple-800">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full rotate-180">
          <svg
            className="w-full h-16"
            viewBox="0 0 1440 54"
            preserveAspectRatio="none"
          >
            <path
              fill="rgb(253 242 248)" // Matches to-pink-50
              d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
