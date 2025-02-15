import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function Cart() {
  // Sample cart data – replace with your dynamic data.
  const cartItems = [
    {
      id: '1',
      name: 'Rose Petals Divine',
      description: 'A captivating fragrance with hints of rose and musk.',
      image: 'https://readymadeui.com/images/product6.webp',
      price: 120.0,
      quantity: 1,
    },
    {
      id: '2',
      name: 'Musk Rose Cooper',
      description: 'An alluring scent that perfectly balances musk and rose.',
      image: 'https://readymadeui.com/images/product6.webp',
      price: 120.0,
      quantity: 1,
    },
    {
      id: '3',
      name: 'Dusk Dark Hue',
      description: 'A bold fragrance for those who dare.',
      image: 'https://readymadeui.com/images/product6.webp',
      price: 120.0,
      quantity: 1,
    },
  ];

  // Calculate totals (sample calculation)
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 20.0;
  const total = subTotal + shipping;

  return (
    <>
      <Navbar />
      <section className="py-8 px-4 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Items Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center border-b border-gray-300 pb-4"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-1/4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full aspect-square object-cover rounded-md shadow-md"
                    />
                  </div>
                  {/* Product Details */}
                  <div className="flex-1 sm:ml-4 mt-4 sm:mt-0">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-xl font-bold text-indigo-600">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600 ml-4">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  {/* Remove Button */}
                  <div className="mt-4 sm:mt-0">
                    <button className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Order Summary Section */}
          <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-base text-gray-700">Subtotal</span>
                <span className="text-base text-gray-700">${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base text-gray-700">Shipping</span>
                <span className="text-base text-gray-700">${shipping.toFixed(2)}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between font-semibold text-lg text-gray-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
