import React from 'react';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useParams, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';
import Recommender from '../components/Recommender';

export default function ProductDetail() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const { name } = useParams();
  const { AddtoCart } = useContext(CartContext);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    fetchProductDetail();
  }, [name, BASE_URL]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try{
      const response = await axios.get(`${BASE_URL}/product-detail/${encodeURIComponent(name)}/`);
      setProduct(response.data[0]);
      
    }
    catch(error){
      alert('network error try again.');
      
    }
    finally{
      setLoading(false);
    }
  }

  const handleAddToCart = async (productId) => {
    try{
      await AddtoCart(productId, 1)
    }
    catch(error){
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="font-sans bg-gray-50 min-h-screen py-8 px-4">
        <div className="container mx-auto mt-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Product Image */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative w-80 h-80 rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
              {(product.is_featured === 'true' || product.is_featured === true) &&
                <div className="absolute top-2 left-2 z-10 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                   {(product.is_featured === 'true' || product.is_featured === true) && 'Featured'}
                </div>}
                <img
                  src={product.image}
                  alt={product.name}
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
                      {product.name}
                    </h2>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(5)].map((_, index) => (
                      <AiFillStar
                        key={index}
                        className="w-5 h-5 text-yellow-400" 
                        />
                    ))}
                    <span className="text-sm font-normal bg-purple-100 rounded-xl px-2 py-0.5 text-purple-600"><span className='text-gray-800 font-medium'>{product.rating} | {product.review} reviews</span></span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-4 mb-6">
                    <p className="text-3xl font-bold text-gray-800">${product.price}</p>
                    {(product.discount && Number(product.discount) > 0) &&
                    (<p className="text-gray-500 text-md font-medium">
                      <strike>${product.discount}</strike> <span className="ml-1">OFF</span>
                    </p>)}
                  </div>

                  {/* Size Selection */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Size</h3>
                    <div className="flex gap-4">
                        {product.size}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mb-8 ">
                    <button onClick={() => handleAddToCart(product.id)}
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
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Right Column: Additional Product Info */}
                <div className="bg-gray-50 mr-1 mt-16 p-6 rounded-lg h-80">
                  <ul className="text-gray-600 space-y-3">
                    <li>
                      <span>Color</span> <span className="font-bold text-lg">{product.color}</span>
                    </li>
                    <li>
                    <span>Material</span> <span className="font-bold text-lg">{product.material}</span>
                    </li>
                    <li>
                    <span>Category</span> <span className="font-bold text-lg">{product.category}</span>
                    </li>
                  </ul>
                  <div className="mt-5">
                    {(product.quantity) > 5 ? (
                      <span className=" text-purple-800 text-lg font-semibold px-1 py-1 rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span>Only {product.quantity} left</span>
                    )}
                      
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Recommender productName={product.name} />
      <Footer />
    </>
  );
}
