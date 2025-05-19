import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    HomeCategories();
  },[]);

  const HomeCategories = async () => {
    try {
    const response = await axios.get(`${BASE_URL}/home-categories/`);
    setCategories(response.data);
    }
    catch (error) {
      toast.error('An error occured')
    }
  }

  return (
    <div className="bg-gray-50 pb-16">
      {/* Section Header */}
      <div className="text-center py-12">
        <h2 className="mt-3 text-4xl font-extrabold text-purple-600 sm:text-5xl">
          Shop by Category
        </h2>
      </div>

      {/* Masonry Grid Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          <Link to='/shop'>
          {categories.map((category) => (
            <div
              key={category.id}
              className="group block mb-6 break-inside-avoid rounded-lg overflow-hidden shadow-lg transform transition hover:shadow-2xl"
            >
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                <div className="absolute inset-0 bg-black opacity-40 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  <p className="mt-1 text-sm">{category.name}</p>
                </div>
              </div>
            </div>
          ))}
          </Link>
        </div>
      </div>
    </div>
  );
}
