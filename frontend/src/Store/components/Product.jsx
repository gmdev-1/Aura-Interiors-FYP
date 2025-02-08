import React from 'react'
import { AiFillStar } from "react-icons/ai";
import { Link } from 'react-router-dom';

export default function Product() {
    const products = [
        {
          id: 1,
          name: "Abstract-Canvas-Wall-Art",
          description: "Beautiful abstract canvas painting to enhance your living room.",
          price: 49.99,
          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
          reviews: 4.7,
          quantity: 12,
        },
        {
          id: 2,
          name: "Rustic-Dining-Table-Set",
          description: "A charming rustic dining table with four matching chairs.",
          price: 259.99,
          image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
          reviews: 4.5,
          quantity: 8,
        },
        {
          id: 3,
          name: "Stainless-Steel-Cookware-Set",
          description: "Durable and elegant cookware set perfect for daily cooking.",
          price: 99.99,
          image: "https://images.unsplash.com/photo-1572048572872-2394404cf1f3",
          reviews: 4.8,
          quantity: 10,
        },
        {
          id: 4,
          name: "Modern-Ceramic-Vase",
          description: "Minimalist ceramic vase ideal for fresh or artificial flowers.",
          price: 29.99,
          image: "https://res.cloudinary.com/dctgk7mh7/image/upload/v1738955606/products/ie34sqkoikxx8xjr4l5k.png",
          reviews: 4.6,
          quantity: 6,
        },
        {
          id: 5,
          name: "Fluffy-Area-Rug",
          description: "A soft and cozy area rug to add warmth to any room.",
          price: 59.99,
          image: "https://media.istockphoto.com/id/1190447864/photo/apple-iphone-11-pro-gray-smartphone.jpg?s=612x612&w=0&k=20&c=zETLJeguLoTEFBNKPl1vjPY1lvPW1uM6GPpyiMSvsC0=",
          reviews: 4.4,
          quantity: 15,
        },
        {
          id: 6,
          name: "Contemporary-Wall-Clock",
          description: "Elegant and modern wall clock to match any interior style.",
          price: 39.99,
          image: "https://res.cloudinary.com/dctgk7mh7/image/upload/v1738952932/products/dk2b30wa26yhngwtcmrg.jpg",
          reviews: 4.9,
          quantity: 7,
        },
        {
          id: 7,
          name: "Contemporary-Wall-Clock",
          description: "Elegant and modern wall clock to match any interior style.",
          price: 39.99,
          image: "https://res.cloudinary.com/dctgk7mh7/image/upload/v1738955146/products/ktojjjvidpazp5pcprpj.png",
          reviews: 4.9,
          quantity: 7,
        },
      ];
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

      <div className="text-center mb-8 p-10 mt-5">
        <h2 className="mt-2 mb-4 text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 drop-shadow-sm">
            Our Products
        </h2>
        
      </div>

      <div className="relative">
        {/* Top Wave Separator */}
        <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
          <svg className="w-full h-16" viewBox="0 0 1440 54" preserveAspectRatio="none">
            <path
              fill="rgb(238 242 255)" // Matches from-indigo-50
              d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
            />
          </svg>
        </div>

        <div className="bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-8 py-16 pb-20">
          <section className="py-10 px-4 bg-transparent backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-4 max-w-screen-xl mx-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <Link to={`/product/${product.name}`}>
                    <div className="h-48 overflow-hidden group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>



                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                        {product.name.replace(/-/g, ' ')}
                      </h3>
                      <div className="mt-2">
                        <span className="text-sm flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <AiFillStar
                              key={index}
                              className={`${
                                index < Math.floor(product.reviews)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              } mr-1`} 
                            />
                          ))}
                          <span className='text-yellow-900'>{product.reviews}</span>
                          <span className="ml-2 text-gray-600">({product.quantity})</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{product.description}</p>
                      <div className="mt-4">
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="px-5 py-3 flex justify-between items-center">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-full hover:from-purple-700 hover:to-purple-800">
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
          <svg className="w-full h-16" viewBox="0 0 1440 54" preserveAspectRatio="none">
            <path
              fill="rgb(253 242 248)" // Matches to-pink-50
              d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
            />
          </svg>
        </div>
      </div>
    </>
  )
}
