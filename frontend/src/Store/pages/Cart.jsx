import React, { useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { RiDeleteBin6Fill  } from "react-icons/ri";
import ReactGA from "react-ga4";

export default function Cart() {
   const { cart, ListCart, UpdateCart, DeleteCart } = useContext(CartContext);

      useEffect(() => {
           ListCart();

            ReactGA.event('begin_checkout', {
    currency: 'USD',
    value: cart.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
    items: cart.map(item => ({
      item_id: item.id,
      item_name: item.product_name,
      quantity: item.quantity,
      price: item.price - item.discount,
    })),
  });
       },[]);

   const handleDeleteCart = async (cartId) => {
    try{
      await DeleteCart(cartId);
      ListCart();
    }
    catch(error){
      console.log(error);
    }
   }

   const handleIncrease = async (cartItemId, cartItemQuantity) => {
    if (cartItemQuantity >= 10){
      return;
    }
    try{
      await UpdateCart(cartItemId, cartItemQuantity + 1);
      ListCart();
    }
    catch(error){
      console.log(error);
    }
   }
   const handleDecrease = async (cartItemId, cartItemQuantity) => {
    try{
      if (cartItemQuantity > 1){
        await UpdateCart(cartItemId, cartItemQuantity - 1);
        ListCart();
      }
    }
    catch(error){
      console.log(error);
    }
   }

  const subTotal = cart.reduce(
    (sum, cart) => sum + (cart.price - cart.discount) * cart.quantity,
    0
  );
  const shipping = 0;
  const total = subTotal + shipping;

  return (
    <>
      <Navbar />
      <section className="py-4 px-4 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="bg-white rounded-lg shadow p-8 flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Shopping Cart
              </h2>
              <div className="space-y-6">
                {cart && cart.length > 0 ? (
                 cart.map((cart) => (
                  <div
                    key={cart.id}
                    className="flex flex-col sm:flex-row items-start border-b border-gray-300 pb-4">
                    <div className="w-full sm:w-1/5">
                      <img
                        src={cart.image}
                        alt={cart.name}
                        className="w-full aspect-square object-cover rounded-md shadow-md"
                      />
                    </div>
                    <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {cart.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {cart.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Material: {cart.material}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Color: {cart.color}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Discount: {cart.discount}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {cart.size}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {cart.quantity}
                      </p>
                    </div>
                    <div>
                      <span onClick={() => handleDecrease(cart.id, cart.quantity)} className='text-3xl mr-1 cursor-pointer'>-</span>
                        <span className='py-1 px-6 border-2 border-purple-600 rounded-full'>{cart.quantity}</span>
                      <span onClick={() => handleIncrease(cart.id, cart.quantity)} className='text-2xl ml-1 cursor-pointer'>+</span>

                    </div>
                    <div className="w-full sm:w-24 text-right sm:ml-4 flex flex-col items-end mt-4 sm:mt-0">
                      <span className="text-xl font-bold text-purple-600">
                        ${cart.price}
                      </span>
                      <button onClick={() => handleDeleteCart(cart.id)} className="mt-2 px-2 py-2 hover:bg-red-100 text-gray-800 text-sm rounded-full">
                        <RiDeleteBin6Fill color='red'  size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No products in your cart.
                </div>
              )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-8 lg:mt-0 w-full sm:w-80 self-start">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-base text-gray-700">Subtotal</span>
                  <span className="text-base text-gray-700">
                    {cart && `$${subTotal.toFixed(2)}`}
                  </span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between font-semibold text-lg text-gray-800">
                  <span>Total</span>
                  <span>{cart && `$${total.toFixed(2)}`}</span>
                </div>
                <Link to="/order">
                <button className="w-full mt-6 py-2 px-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-full hover:from-purple-700 hover:to-purple-800">
                  Checkout
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
