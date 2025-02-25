import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Cart() {
  // Sample cart data – replace with your dynamic data.
  const cartItems = [
    {
      id: '1',
      name: 'Rose Petals Divine',
      description: 'A captivating fragrance with hints of rose and musk.',
      image: 'https://res.cloudinary.com/dctgk7mh7/image/upload/v1738952932/products/dk2b30wa26yhngwtcmrg.jpg',
      price: 120.0,
      quantity: 1,
      material: 'Glass',
      color: 'Red',
      discount: '10%',
      size: 'Medium',
      category: 'Fragrance',
    },
    {
      id: '2',
      name: 'Musk Rose Cooper',
      description: 'An alluring scent that perfectly balances musk and rose.',
      image: 'https://res.cloudinary.com/dctgk7mh7/image/upload/v1738952932/products/dk2b30wa26yhngwtcmrg.jpg',
      price: 120.0,
      quantity: 1,
      material: 'Metal',
      color: 'Blue',
      discount: '15%',
      size: 'Large',
      category: 'Perfume',
    },
    {
      id: '3',
      name: 'Dusk Dark Hue',
      description: 'A bold fragrance for those who dare.',
      image: 'https://res.cloudinary.com/dctgk7mh7/image/upload/v1738952932/products/dk2b30wa26yhngwtcmrg.jpg',
      price: 120.0,
      quantity: 1,
      material: 'Plastic',
      color: 'Black',
      discount: '5%',
      size: 'Small',
      category: 'Cologne',
    },
  ];

  // Calculate totals (sample calculation)
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 20.0;
  const total = subTotal + shipping;

  return (
    <>
      <Navbar />
      {/* Gradient background for the whole page */}
      <section className="py-4 px-4 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Flex container for the two white boxes */}
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Shopping Cart Box */}
            <div className="bg-white rounded-lg shadow p-8 flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Shopping Cart
              </h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start border-b border-gray-300 pb-4"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-1/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full aspect-square object-cover rounded-md shadow-md"
                      />
                    </div>
                    {/* Product Details */}
                    <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Material: {item.material}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Discount: {item.discount}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Category: {item.category}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    {/* Price Column */}
                    <div className="w-full sm:w-24 text-right sm:ml-4 flex flex-col items-end mt-4 sm:mt-0">
                      <span className="text-xl font-bold text-indigo-600">
                        ${item.price.toFixed(2)}
                      </span>
                      <button className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout / Order Summary Box */}
            <div className="bg-white rounded-lg shadow p-6 mt-8 lg:mt-0 w-full sm:w-80 self-start">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-base text-gray-700">Subtotal</span>
                  <span className="text-base text-gray-700">
                    ${subTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-700">Shipping</span>
                  <span className="text-base text-gray-700">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between font-semibold text-lg text-gray-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button className="w-full mt-6 py-2 px-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-full hover:from-purple-700 hover:to-purple-800">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
